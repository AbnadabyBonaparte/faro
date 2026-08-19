/**
 * TESTE DE INTEGRAÇÃO DA CAÇA — contra Postgres de verdade.
 *
 * O que se prova aqui não existe sem banco: que a tese caça pelos critérios que
 * estão em DADO, que candidato sem evento não vira ficha, que o total do score
 * cai das parcelas, e que a ficha nasce esperando o humano.
 *
 * Bytes FABRICADOS, com CNPJs inválidos — a regra da casa desde a maquete. A
 * prova contra dado real da RFB é outra, e está no relatório da Onda 3.
 *
 * Cria e destrói o próprio banco: nenhuma outra guarda herda sujeira.
 */

import { strict as assert } from 'node:assert'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test, { after, before } from 'node:test'

import { carregarArquivoLocal } from '../coleta/index.ts'
import { executarDiff } from '../diff/index.ts'
import { executarCaca, versaoAtivaDaTese } from './index.ts'
import { executarPublicacao, publicarCandidato } from '../publica/index.ts'
import { escapar, linhas, sql, valor } from '../infra/pg.ts'
import { RFB_CNPJ } from '../fontes/index.ts'

const AQUI = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS = resolve(AQUI, '..', '..', '..', '..', 'packages', 'db', 'migrations')
const DB = 'faro_caca_integracao'
let pasta = ''

const EMPRESAS = RFB_CNPJ.conjuntos.find((c) => c.nome === 'empresas')
const ESTAB = RFB_CNPJ.conjuntos.find((c) => c.nome === 'estabelecimentos')
assert.ok(EMPRESAS && ESTAB)

/** 7 campos, formato exato da RFB. CNPJ básico inválido de propósito. */
function linhaEmpresa(basico: string, razao: string, porte: string): string {
  return `"${basico}";"${razao}";"2062";"49";"1000,00";"${porte}";""\n`
}

/** 30 campos. Só os que a tese lê variam. */
function linhaEstab(
  basico: string,
  cnae: string,
  uf: string,
  situacao: string,
): string {
  const c = Array.from({ length: 30 }, () => '')
  c[0] = basico
  c[1] = '0001'
  c[2] = '00'
  c[3] = '1'
  c[5] = situacao
  c[6] = '20200101'
  c[10] = '20100101'
  c[11] = cnae
  c[19] = uf
  c[20] = '9999'
  return c.map((x) => `"${x}"`).join(';') + '\n'
}

before(() => {
  execFileSync('psql', ['-X', '-q', '-d', 'postgres', '-c', `DROP DATABASE IF EXISTS ${DB}`])
  execFileSync('psql', ['-X', '-q', '-d', 'postgres', '-c', `CREATE DATABASE ${DB}`])
  for (const m of readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort()) {
    execFileSync('psql', ['-v', 'ON_ERROR_STOP=1', '-X', '-q', '-d', DB, '-f', join(MIGRATIONS, m)])
  }
  process.env['PGDATABASE'] = DB
  pasta = mkdtempSync(join(tmpdir(), 'faro-caca-'))
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

let teseV = ''
let cacadaIncremental = ''

test('a T-04 v0 nasce ativa, com certidão e pesos que somam 1', () => {
  const v = versaoAtivaDaTese('T-04')
  assert.ok(v, 'T-04 tem que ter versão ativa')
  teseV = v

  assert.equal(
    valor(`SELECT nao_derivou_de_tenant_cliente::text FROM teses.proveniencia
            WHERE tese_id = (SELECT tese_id FROM teses.versoes WHERE id = ${escapar(v)}::uuid)`),
    'true',
  )
  // Score cuja soma dos pesos não fecha em 1 não é média ponderada.
  assert.equal(valor(`SELECT teses.pesos_somam_um(${escapar(v)}::uuid)::text`), 'true')
})

test('preparando a base: duas coletas de empresas e uma de estabelecimentos', async () => {
  // ALFA: indústria em MT, porte 05, MUDA de porte entre julho e agosto → evento
  // BETA: mesma coisa mas NÃO muda → candidato sem evento
  // GAMA: comércio (CNAE 47) em MT → não casa com a tese
  // DELTA: indústria em SP → fora do território
  const julho =
    linhaEmpresa('11111111', 'ALFA INDUSTRIA LTDA', '03') +
    linhaEmpresa('22222222', 'BETA INDUSTRIA LTDA', '05') +
    linhaEmpresa('33333333', 'GAMA COMERCIO LTDA', '05') +
    linhaEmpresa('44444444', 'DELTA INDUSTRIA LTDA', '05')
  const agosto =
    linhaEmpresa('11111111', 'ALFA INDUSTRIA LTDA', '05') + // 03 → 05: evento
    linhaEmpresa('22222222', 'BETA INDUSTRIA LTDA', '05') +
    linhaEmpresa('33333333', 'GAMA COMERCIO LTDA', '05') +
    linhaEmpresa('44444444', 'DELTA INDUSTRIA LTDA', '05')

  await carregarArquivoLocal({
    sourceId: 'RFB-CNPJ', conjunto: EMPRESAS, caminho: arquivo('emp07.csv', julho),
    referencia: '2026-07', quando: '2026-07-11T03:00:00Z',
  })
  await carregarArquivoLocal({
    sourceId: 'RFB-CNPJ', conjunto: EMPRESAS, caminho: arquivo('emp08.csv', agosto),
    referencia: '2026-08', quando: '2026-08-08T03:00:00Z',
  })

  const estab =
    linhaEstab('11111111', '1091101', 'MT', '02') +
    linhaEstab('22222222', '2599399', 'MT', '02') +
    linhaEstab('33333333', '4711302', 'MT', '02') +
    linhaEstab('44444444', '1091101', 'SP', '02')
  await carregarArquivoLocal({
    sourceId: 'RFB-CNPJ', conjunto: ESTAB, caminho: arquivo('est08.csv', estab),
    referencia: '2026-08', quando: '2026-08-08T03:00:00Z',
  })

  const atual = valor(
    `SELECT id::text FROM jazida.coletas_completas
      WHERE reference_date = '2026-08-01' AND id IN
        (SELECT coleta_id FROM jazida.snapshots WHERE conjunto = 'empresas')
      LIMIT 1`,
  )
  assert.ok(atual)
  const d = executarDiff({ coletaAtual: atual })
  assert.deepEqual(d.eventos, { porte_alterado: 1 }, 'só ALFA mudou de porte')
})

test('varredura inicial: acha o território, e NENHUM candidato tem evento', () => {
  const r = executarCaca({ teseVersaoId: teseV, modo: 'inicial' })
  // A T-04 v1.1 é NACIONAL: ALFA e BETA (MT) mais DELTA (SP), todas indústria
  // ativa com porte 05. GAMA fica fora por ser comércio — critério ainda corta.
  assert.equal(r.candidatos, 3)
  assert.equal(r.comEvento, 0, 'varredura inicial não olha evento — é perfil, não notícia')
})

test('o território virou PESO: MT/GO pontua mais, SP continua elegível', () => {
  // Esta é a diferença entre a v0 e a v1.1, e ela precisa aparecer no número.
  // Critério corta; bonificador ordena.
  const bonus = linhas(
    `SELECT c.cnpj, (x ->> 'casou')
       FROM fichas.candidatos c
       JOIN fichas.cacadas ca ON ca.id = c.cacada_id,
            LATERAL jsonb_array_elements(c.criterios_casados) x
      WHERE ca.modo = 'inicial' AND x ->> 'especie' = 'BONIFICADOR'
      ORDER BY c.cnpj`,
  )
  assert.equal(bonus.length, 3, 'todo candidato carrega o bonificador, tendo casado ou não')
  const mapa = Object.fromEntries(bonus.map((b) => [b[0], b[1]]))
  assert.equal(mapa['11111111000100'], 'true', 'ALFA é MT')
  assert.equal(mapa['22222222000100'], 'true', 'BETA é MT')
  assert.equal(mapa['44444444000100'], 'false', 'DELTA é SP — elegível, mas sem o bônus')

  // E o bônus tem que virar PONTO, senão é enfeite.
  const cands = linhas(
    `SELECT c.id::text FROM fichas.candidatos c
       JOIN fichas.cacadas ca ON ca.id = c.cacada_id
      WHERE ca.modo = 'inicial' ORDER BY c.cnpj`,
  )
  const fit = (id: string): number =>
    Number(
      valor(
        `SELECT valor::text FROM fichas.dimensoes_do_candidato(${escapar(id)}::uuid)
          WHERE dimensao = 'fitEstrutural'`,
      ),
    )
  const alfa = fit(cands[0]?.[0] ?? '')
  const delta = fit(cands[2]?.[0] ?? '')
  assert.ok(alfa > delta, `MT (${alfa}) tem que pontuar mais que SP (${delta})`)
  // Teto de 20 pontos: preferência comercial ordena a fila, não decide quem entra.
  assert.equal(Math.round(alfa - delta), 20)
})

test('candidato da varredura inicial NÃO vira ficha — o banco recusa', () => {
  const semEvento = valor(
    `SELECT c.id::text FROM fichas.candidatos c
       JOIN fichas.cacadas ca ON ca.id = c.cacada_id
      WHERE ca.modo = 'inicial' AND c.evento_id IS NULL LIMIT 1`,
  )
  assert.ok(semEvento)
  // Esta é a fronteira entre o FARO e uma lista de empresas que batem num filtro.
  assert.throws(() => publicarCandidato(semEvento), /LISTA/)
  assert.equal(valor('SELECT count(*) FROM fichas.fichas'), '0')
})

test('caçada incremental: só quem tem evento entra', () => {
  const r = executarCaca({ teseVersaoId: teseV, modo: 'incremental' })
  cacadaIncremental = r.cacadaId
  assert.equal(r.candidatos, 1, 'só ALFA: indústria em MT, porte 05, E com evento')
  assert.equal(r.comEvento, 1)

  const c = linhas(
    `SELECT cnpj, razao_social FROM fichas.candidatos
      WHERE cacada_id = ${escapar(cacadaIncremental)}::uuid`,
  )
  assert.equal(c[0]?.[0], '11111111000100')
  assert.equal(c[0]?.[1], 'ALFA INDUSTRIA LTDA')
})

test('tese que não está ativa não caça', () => {
  const outra = valor(
    `INSERT INTO teses.teses (tenant_id, codigo)
     SELECT tenant_id, 'T-ESTUDO' FROM teses.versoes WHERE id = ${escapar(teseV)}::uuid
     RETURNING id::text`,
  )
  const versaoEstudo = valor(
    `INSERT INTO teses.versoes (tese_id, tenant_id, versao, nome, hipotese, estado)
     SELECT ${escapar(outra ?? '')}::uuid, tenant_id, 1, 'em estudo', 'h', 'estudo'
       FROM teses.versoes WHERE id = ${escapar(teseV)}::uuid RETURNING id::text`,
  )
  assert.ok(versaoEstudo)
  // Tese em estudo que caçasse entregaria ficha de hipótese não assumida.
  assert.throws(() => executarCaca({ teseVersaoId: versaoEstudo }), /nao caça/)
})

test('a ficha nasce com score derivado, EV selado e os 4 movimentos', () => {
  const r = executarPublicacao({ cacadaId: cacadaIncremental })
  assert.equal(r.publicadas, 1)
  assert.equal(r.recusadas, 0)

  const f = linhas(
    `SELECT score_total::text, ev_liquido::text, ev_liquido_selo, grade, freshness,
            acao_estado, (acao_autorizada_por IS NULL)::text, porte_proxy
       FROM fichas.fichas`,
  )[0]
  assert.ok(f)

  // 1 · O total bate com a soma das parcelas — e ninguém o digitou.
  const soma = valor(
    'SELECT round(sum(contribuicao))::text FROM fichas.score_parcelas',
  )
  assert.equal(f[0], soma, 'o total tem que ser a soma das parcelas')

  // 2 · Seis dimensões, cada uma com justificativa escrita.
  assert.equal(valor('SELECT count(*) FROM fichas.score_parcelas'), '6')
  assert.equal(
    valor('SELECT count(*) FROM fichas.score_parcelas WHERE justificativa IS NULL'),
    '0',
    'dimensão sem justificativa é decomposição de fachada',
  )

  // 3 · O EV carrega o PIOR selo dos componentes.
  assert.equal(f[2], 'ESTIMATIVA')
  assert.ok(Number(f[1]) !== 0)

  // 4 · Porte entrou como PROXY, na coluna de proxy — nunca na de fato.
  assert.equal(f[7], '05')
  assert.equal(valor('SELECT count(*) FROM fichas.fichas WHERE porte_observado IS NOT NULL'), '0')

  // 5 · Movimento 4: a ficha espera o humano.
  assert.equal(f[5], 'preparada')
  assert.equal(f[6], 'true')
})

test('a ficha argumenta contra si mesma e declara a lacuna da CCEE', () => {
  const contra = linhas('SELECT codigo FROM fichas.por_que_nao_perseguir ORDER BY codigo')
  assert.ok(contra.length >= 3, 'ficha que não argumenta contra si é bug de caráter')
  assert.ok(contra.some((c) => c[0] === 'sinal_isolado'))
  assert.ok(contra.some((c) => c[0] === 'documentacao_provavelmente_ausente'))

  // A ausência entra na CADEIA, não some dela.
  const lacuna = valor(
    `SELECT texto FROM fichas.evidencia WHERE source_id = 'CCEE-CL'`,
  )
  assert.ok(lacuna?.includes('NAO OBSERVADO'))
  assert.equal(
    valor(`SELECT confianca::text FROM fichas.evidencia WHERE source_id = 'CCEE-CL'`),
    '0.0',
  )
})

test('com uma fonte fora do ar, a ficha NÃO alcança grade A', () => {
  // Grade A com fonte caída seria o produto mentindo sobre a própria evidência.
  assert.equal(valor(`SELECT count(*) FROM fichas.fichas WHERE grade = 'A'`), '0')
  assert.equal(
    valor(`SELECT status FROM fontes.source_registry WHERE source_id = 'CCEE-CL'`),
    'indisponivel',
  )
})

test('o total do score continua indigitável, mesmo agora', () => {
  const ficha = valor('SELECT id::text FROM fichas.fichas LIMIT 1')
  assert.throws(
    () => sql(`UPDATE fichas.fichas SET score_total = 99 WHERE id = ${escapar(ficha ?? '')}::uuid`),
    /DERIVADO/,
  )
})

test('o ledger registrou a ficha publicada e o tempo de caçada', () => {
  assert.equal(
    valor(`SELECT count(*) FROM uso.ledger WHERE metrica = 'ficha_publicada'`),
    '1',
  )
  assert.ok(
    Number(valor(`SELECT count(*) FROM uso.ledger WHERE metrica = 'ms_computacao'`)) >= 1,
    'sem tempo medido não há custo por ficha, e sem custo por ficha o preço é fé',
  )
})
