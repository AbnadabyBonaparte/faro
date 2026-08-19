/**
 * TESTE DE INTEGRAÇÃO DA COLETA — contra Postgres de verdade.
 *
 * Não é teste de unidade e não deve fingir que é. O que se prova aqui só existe
 * quando há um banco: idempotência, atomicidade do lote, rebaixamento da fonte
 * quando o layout muda, e o ledger da casa sendo escrito sem tenant.
 *
 * Cria e destrói o próprio banco: rodar duas vezes dá o mesmo resultado, e
 * nenhuma outra guarda herda sujeira. (Lição da Onda 2: guarda que suja o banco
 * faz a guarda seguinte reprovar por sujeira alheia.)
 *
 * Os bytes são FABRICADOS. Nenhum teste desta suíte bate na Receita Federal —
 * CI que depende de fonte externa fica vermelho pelo dia ruim de outra pessoa.
 */

import { strict as assert } from 'node:assert'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import test, { after, before } from 'node:test'

import { carregarArquivoLocal } from './index.ts'
import { executarDiff } from '../diff/index.ts'
import { escapar, linhas, sql, valor } from '../infra/pg.ts'
import { RFB_CNPJ } from '../fontes/index.ts'
import { LayoutDivergente } from '../parser/rfb.ts'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = resolve(AQUI, '..', '..', '..', '..')
const MIGRATIONS = join(RAIZ, 'packages', 'db', 'migrations')

const DB = 'faro_motor_integracao'
let pasta = ''

const EMPRESAS = RFB_CNPJ.conjuntos.find((c) => c.nome === 'empresas')
assert.ok(EMPRESAS, 'conjunto empresas tem que existir no descritor da fonte')

/** Uma linha no formato exato da RFB: 7 campos, tudo entre aspas, ; separando. */
function linhaEmpresa(cnpj: string, razao: string, porte: string): string {
  return `"${cnpj}";"${razao}";"2062";"49";"1000,00";"${porte}";""\n`
}

before(() => {
  execFileSync('psql', ['-X', '-q', '-d', 'postgres', '-c', `DROP DATABASE IF EXISTS ${DB}`])
  execFileSync('psql', ['-X', '-q', '-d', 'postgres', '-c', `CREATE DATABASE ${DB}`])
  for (const m of readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort()) {
    execFileSync('psql', ['-v', 'ON_ERROR_STOP=1', '-X', '-q', '-d', DB, '-f', join(MIGRATIONS, m)])
  }
  process.env['PGDATABASE'] = DB
  pasta = mkdtempSync(join(tmpdir(), 'faro-coleta-'))
})

after(() => {
  if (pasta !== '') rmSync(pasta, { recursive: true, force: true })
  delete process.env['PGDATABASE']
  execFileSync('psql', ['-X', '-q', '-d', 'postgres', '-c', `DROP DATABASE IF EXISTS ${DB}`])
})

function arquivo(nome: string, conteudo: string): string {
  const caminho = join(pasta, nome)
  writeFileSync(caminho, Buffer.from(conteudo, 'latin1'))
  return caminho
}

test('carga real: as linhas entram na partição da fonte, não na default', async () => {
  const caminho = arquivo(
    'julho.csv',
    linhaEmpresa('11111111', 'ALFA LTDA', '01') +
      linhaEmpresa('22222222', 'BETA LTDA', '03') +
      linhaEmpresa('33333333', 'GAMA LTDA', '05'),
  )
  const r = await carregarArquivoLocal({
    sourceId: 'RFB-CNPJ',
    conjunto: EMPRESAS,
    caminho,
    referencia: '2026-07',
    quando: '2026-07-11T03:00:00Z',
  })

  assert.equal(r.linhas, 3)
  assert.equal(r.jaEstava, false)
  // Particionamento por fonte é requisito de fundação (0005), não otimização.
  assert.equal(valor('SELECT count(*) FROM jazida.snapshots_rfb_cnpj'), '3')
  assert.equal(valor('SELECT count(*) FROM jazida.snapshots_default'), '0')
})

test('idempotência: a MESMA carga de novo não duplica nada', async () => {
  const caminho = join(pasta, 'julho.csv')
  const antes = valor('SELECT count(*) FROM jazida.snapshots')
  const r = await carregarArquivoLocal({
    sourceId: 'RFB-CNPJ',
    conjunto: EMPRESAS,
    caminho,
    referencia: '2026-07',
    quando: '2026-07-11T03:00:00Z',
  })
  assert.equal(r.jaEstava, true)
  assert.equal(valor('SELECT count(*) FROM jazida.snapshots'), antes)
  assert.equal(valor('SELECT count(*) FROM jazida.coletas'), '1')
})

test('ledger da casa: custo de coleta entra SEM tenant e com a fonte declarada', () => {
  // Coleta de fonte pública é rateada, não vendida. Forçar um tenant aqui
  // obrigaria a inventar um dono para um custo que não tem dono.
  const r = linhas(
    `SELECT metrica, quantidade::text FROM uso.ledger
      WHERE tenant_id IS NULL AND source_id = 'RFB-CNPJ' ORDER BY metrica`,
  )
  const metricas = r.map((l) => l[0])
  assert.ok(metricas.includes('linhas_processadas'))
  assert.ok(metricas.includes('ms_computacao'))
  // NULL é NÃO MEDIDO, nunca zero — custo zero seria afirmação inventada.
  assert.equal(valor('SELECT count(*) FROM uso.ledger WHERE custo_centavos = 0'), '0')
})

test('layout divergente PARA a coleta, rebaixa a fonte e não deixa lote pela metade', async () => {
  const caminho = arquivo(
    'agosto-quebrado.csv',
    linhaEmpresa('11111111', 'ALFA LTDA', '03') +
      // 8 colunas: a RFB acrescentou um campo. O parser complacente leria o
      // porte da coluna errada e ninguém notaria.
      '"22222222";"BETA LTDA";"2062";"49";"1000,00";"03";"";"COLUNA NOVA"\n',
  )

  await assert.rejects(
    () =>
      carregarArquivoLocal({
        sourceId: 'RFB-CNPJ',
        conjunto: EMPRESAS,
        caminho,
        referencia: '2026-08',
        quando: '2026-08-08T03:00:00Z',
      }),
    LayoutDivergente,
  )

  // 1. a fonte foi rebaixada, não continuou dizendo "viva"
  assert.equal(
    valor(`SELECT status FROM fontes.source_registry WHERE source_id = 'RFB-CNPJ'`),
    'degradada',
  )

  // 2. a coleta existe (a jazida é append-only, tentativa não se apaga) mas
  //    está fechada com erro declarado
  const fech = linhas(
    `SELECT f.ok::text, (f.erro IS NOT NULL)::text FROM jazida.coletas_fechamento f
       JOIN jazida.coletas c ON c.id = f.coleta_id
      WHERE c.reference_date = '2026-08-01'`,
  )
  assert.equal(fech[0]?.[0], 'false')
  assert.equal(fech[0]?.[1], 'true', 'coleta que falhou sem dizer por que é ruído')

  // 3. 🔴 e, sobretudo: ela NÃO aparece como lote válido.
  assert.equal(
    valor(`SELECT count(*) FROM jazida.coletas_completas WHERE reference_date = '2026-08-01'`),
    '0',
  )

  // 4. a saúde registrou a queda
  assert.equal(
    valor(
      `SELECT status_observado FROM fontes.saude_coleta
        WHERE source_id = 'RFB-CNPJ' ORDER BY verificado_em DESC LIMIT 1`,
    ),
    'degradada',
  )
})

test('o diff se recusa a rodar contra uma coleta que não fechou', () => {
  const meia = valor(
    `SELECT c.id::text FROM jazida.coletas c
      JOIN jazida.coletas_fechamento f ON f.coleta_id = c.id AND NOT f.ok LIMIT 1`,
  )
  assert.ok(meia)
  // Se rodasse, as linhas que faltaram carregar virariam `saiu_da_fonte`.
  assert.throws(() => executarDiff({ coletaAtual: meia }), /nao foi fechada com ok/)
})

test('fonte degradada volta a coletar; fonte indisponível não', async () => {
  sql(`UPDATE fontes.source_registry SET status = 'viva' WHERE source_id = 'RFB-CNPJ'`)
  const caminho = arquivo(
    'agosto.csv',
    linhaEmpresa('11111111', 'ALFA LTDA', '03') +
      linhaEmpresa('22222222', 'BETA LTDA', '03') +
      linhaEmpresa('44444444', 'DELTA LTDA', '01'),
  )
  const r = await carregarArquivoLocal({
    sourceId: 'RFB-CNPJ',
    conjunto: EMPRESAS,
    caminho,
    referencia: '2026-08',
    quando: '2026-08-08T03:00:00Z',
  })
  assert.equal(r.linhas, 3)
})

test('diff real ponta a ponta: só o porte que mudou vira evento', () => {
  const atual = valor(
    `SELECT id::text FROM jazida.coletas_completas
      WHERE reference_date = '2026-08-01' ORDER BY collected_at DESC LIMIT 1`,
  )
  assert.ok(atual)
  const r = executarDiff({ coletaAtual: atual })

  // ALFA 01 -> 03 é evento. BETA 03 -> 03 não é. DELTA é nova, mas `empresas`
  // não pare evento de presença (senão a mesma empresa seria contada duas
  // vezes, aqui e em estabelecimentos). GAMA sumiu, e pela mesma razão também
  // não pare evento.
  assert.deepEqual(r.eventos, { porte_alterado: 1 })
  assert.equal(r.linhaDeBase, false)

  const e = linhas(
    `SELECT cnpj, antes ->> 'valor', depois ->> 'valor' FROM eventos.eventos`,
  )
  assert.deepEqual(e[0], ['11111111', '01', '03'])
})

test('rodar o diff duas vezes não pare os mesmos eventos de novo', () => {
  // Sem isto, um retry do batch dobraria a notícia na cara do assinante.
  const atual = valor(
    `SELECT id::text FROM jazida.coletas_completas
      WHERE reference_date = '2026-08-01' ORDER BY collected_at DESC LIMIT 1`,
  )
  assert.ok(atual)
  const antes = valor('SELECT count(*) FROM eventos.eventos')
  executarDiff({ coletaAtual: atual })
  assert.equal(
    valor('SELECT count(*) FROM eventos.eventos'),
    antes,
    'o diff duplicou eventos ao rodar de novo',
  )
})

test('a jazida bruta continua invisível para o app', () => {
  // O assinante vê FICHA, nunca dado bruto. Isto é Lei de Dados, não detalhe.
  const g = valor(
    `SELECT count(*) FROM information_schema.role_table_grants
      WHERE table_schema = 'jazida' AND grantee IN ('anon','authenticated')`,
  )
  assert.equal(g, '0')
})

test('coleta de fonte declarada indisponível é recusada', async () => {
  await assert.rejects(
    () =>
      carregarArquivoLocalDeFonteBloqueada(),
    /indispon/,
  )
})

async function carregarArquivoLocalDeFonteBloqueada(): Promise<void> {
  const { executarColeta } = await import('./index.ts')
  await executarColeta({ sourceId: 'CCEE-CL', referencia: '2026-08', trabalho: pasta })
}
