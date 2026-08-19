/**
 * ETAPA 1 — COLETA. Onda 2: implementada.
 *
 * Baixa o lote, confere o hash, descompacta, confere o layout contra
 * `fontes.layouts` e carrega em `jazida.snapshots`, na partição da fonte.
 *
 * IDEMPOTÊNCIA (exigência da ordem): rodar a mesma coleta duas vezes não
 * duplica. A trava é `UNIQUE (source_id, hash)` em `jazida.coletas`, e o hash é
 * derivado do conteúdo dos arquivos — lote repetido é reconhecido antes de
 * qualquer linha entrar.
 *
 * INTEIREZA: `jazida.coletas` é append-only, então não há "marcar como pronta".
 * O fechamento é uma linha nova em `jazida.coletas_fechamento`, e só coleta
 * fechada com `ok` aparece em `jazida.coletas_completas` — a única porta pela
 * qual o diff enxerga lote. Carga que morre no meio fica registrada como
 * tentativa e nunca vira notícia.
 *
 * Canon: MODELO-FARO-V2.md §11 · ORDEM ONDA 2 §2
 */

import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { execFileSync, spawn } from 'node:child_process'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import type { Readable } from 'node:stream'

import { baixar, ErroDeColeta } from '../infra/baixa.ts'
import { copiar, escapar, linhas as consultar, sql, valor } from '../infra/pg.ts'
import { fonte, type Conjunto, type Fonte } from '../fontes/index.ts'
import { conferirMembro, lerRfb, LayoutDivergente, type Layout } from '../parser/rfb.ts'
import { registrarSaude, registrarUsoDaCasa } from '../saude/index.ts'
import type { ResultadoEtapa } from '../index.ts'

export type OpcoesColeta = {
  readonly sourceId: string
  /** Referência do lote: `2026-08` para a RFB. */
  readonly referencia: string
  /** Onde guardar os arquivos baixados. */
  readonly trabalho: string
  /** Limita quais conjuntos coletar. Ausente = todos os declarados. */
  readonly conjuntos?: readonly string[]
  /** Limita quais arquivos por conjunto — para amostra e para teste. */
  readonly arquivos?: readonly string[]
}

export type ResultadoColeta = {
  readonly coletaId: string
  readonly sourceId: string
  readonly referencia: string
  readonly linhas: number
  readonly bytesBaixados: number
  readonly duracaoMs: number
  /** true quando o lote já estava na jazida e nada foi recarregado. */
  readonly jaEstava: boolean
}

const COLUNAS_SNAPSHOT = [
  'coleta_id',
  'source_id',
  'conjunto',
  'chave_natural',
  'collected_at',
  'reference_date',
  'hash',
  'payload',
] as const

/** Lê o layout DECLARADO no banco. O código não guarda cópia própria dele. */
export function layoutDoBanco(sourceId: string, c: Conjunto): Layout {
  const r = consultar(
    `SELECT array_to_string(colunas, ','), padrao_arquivo FROM fontes.layouts
      WHERE source_id = ${escapar(sourceId)} AND conjunto = ${escapar(c.nome)}
        AND vigente ORDER BY versao DESC LIMIT 1`,
  )
  const cols = r[0]?.[0]
  if (cols === undefined || cols === '') {
    throw new ErroDeColeta(
      `sem layout vigente para ${sourceId}/${c.nome} em fontes.layouts. ` +
        `Ingerir sem layout declarado é confiar na sorte.`,
    )
  }
  return {
    conjunto: c.nome,
    colunas: cols.split(','),
    indicesDaChave: c.indicesDaChave,
    colunasIngeridas: c.colunasIngeridas,
    padraoArquivo: r[0]?.[1] ?? '',
  }
}

/** Nome do membro de um zip de um arquivo só, como a RFB entrega. */
function membroDoZip(caminho: string): string {
  return execFileSync('unzip', ['-Z1', caminho], { encoding: 'utf8' }).trim().split('\n')[0] ?? ''
}

/** Descompacta pelo `unzip` do sistema, em stream — o membro sai por stdout. */
function abrirZip(caminho: string): Readable {
  const p = spawn('unzip', ['-p', caminho], { stdio: ['ignore', 'pipe', 'inherit'] })
  return p.stdout
}

function abrir(caminho: string): Readable {
  return caminho.endsWith('.zip') ? abrirZip(caminho) : createReadStream(caminho)
}

/**
 * O hash do LOTE: sha256 dos sha256 de cada arquivo, ordenados. Estável, não
 * depende da ordem em que os arquivos chegaram e não exige reler 7 GB.
 */
function hashDoLote(hashesDeArquivo: readonly string[]): string {
  const h = createHash('sha256')
  for (const x of [...hashesDeArquivo].sort()) h.update(x)
  return h.digest('hex')
}

function abrirColeta(
  sourceId: string,
  quando: string,
  referencia: string,
  hash: string,
): string {
  const id = valor(
    `INSERT INTO jazida.coletas (source_id, collected_at, reference_date, source_version, hash)
     VALUES (${escapar(sourceId)}, ${escapar(quando)}::timestamptz,
             ${escapar(`${referencia}-01`)}::date, ${escapar(referencia)}, ${escapar(hash)})
     RETURNING id::text`,
  )
  if (id === null) throw new ErroDeColeta('não consegui abrir a coleta')
  return id
}

function fechar(coletaId: string, ok: boolean, linhas: number, duracaoMs: number, erro: string | null): void {
  sql(
    `INSERT INTO jazida.coletas_fechamento (coleta_id, ok, linhas, duracao_ms, erro)
     VALUES (${escapar(coletaId)}::uuid, ${String(ok)}, ${String(linhas)},
             ${String(Math.round(duracaoMs))},
             ${erro === null ? 'NULL' : escapar(erro.slice(0, 4000))})`,
  )
}

/**
 * O caminho único de fracasso de uma coleta.
 *
 * A coleta NÃO morre por deleção — a jazida é append-only, e tentativa que se
 * apaga é tentativa que ninguém audita. Ela morre por FECHAMENTO COM ERRO, e
 * nunca aparece em `jazida.coletas_completas`.
 */
function abortar(
  coletaId: string,
  sourceId: string,
  linhasCarregadas: number,
  duracaoMs: number,
  e: unknown,
): never {
  fechar(coletaId, false, linhasCarregadas, duracaoMs, String(e))

  if (e instanceof LayoutDivergente) {
    // Layout mudou: a fonte não está morta, está diferente. `degradada` é o
    // estado honesto — e o Watch já sabe o que fazer com ele.
    sql(
      `UPDATE fontes.source_registry SET status = 'degradada', atualizado_em = now()
        WHERE source_id = ${escapar(sourceId)}`,
    )
  }
  registrarSaude(sourceId, 'degradada', String(e))
  throw e
}

/** Já existe lote com este conteúdo? Devolve a coleta fechada com ok, se houver. */
function loteJaCarregado(sourceId: string, hash: string): { id: string; linhas: number } | null {
  const r = consultar(
    `SELECT id::text, linhas::text FROM jazida.coletas_completas
      WHERE source_id = ${escapar(sourceId)} AND hash = ${escapar(hash)}`,
  )
  const linha = r[0]
  if (linha === undefined) return null
  return { id: linha[0] ?? '', linhas: Number(linha[1] ?? '0') }
}

/** Carrega um conjunto inteiro para dentro da coleta aberta. */
async function carregarConjunto(
  coletaId: string,
  sourceId: string,
  c: Conjunto,
  caminho: string,
  quando: string,
  referencia: string,
): Promise<number> {
  const layout = layoutDoBanco(sourceId, c)
  // Confere o NOME do membro antes de ler um byte. Empresas e Simples têm 7
  // colunas cada: carregar um no lugar do outro passaria pela checagem de
  // colunas e entraria trocado na jazida.
  if (caminho.endsWith('.zip')) conferirMembro(membroDoZip(caminho), layout)
  const copia = copiar('jazida.snapshots', [...COLUNAS_SNAPSHOT])
  let n = 0
  try {
    for await (const reg of lerRfb(abrir(caminho), layout)) {
      const coube = copia.linha([
        coletaId,
        sourceId,
        c.nome,
        reg.chaveNatural,
        quando,
        `${referencia}-01`,
        reg.hash,
        JSON.stringify(reg.payload),
      ])
      n++
      if (!coube) await copia.dreno()
    }
  } catch (e) {
    copia.cancelar()
    throw e
  }
  await copia.fim()
  return n
}

export async function executarColeta(o: OpcoesColeta): Promise<ResultadoColeta> {
  const inicio = Date.now()
  const f: Fonte = fonte(o.sourceId)

  const status = valor(
    `SELECT status FROM fontes.source_registry WHERE source_id = ${escapar(o.sourceId)}`,
  )
  if (status === null) throw new ErroDeColeta(`fonte ${o.sourceId} não está no registry`)
  if (status === 'indisponivel') {
    throw new ErroDeColeta(
      `fonte ${o.sourceId} está \`indisponivel\` no registry. Coletar de fonte declarada ` +
        `indisponível produziria dado sem procedência — e a ficha carregaria a mentira adiante.`,
    )
  }

  mkdirSync(o.trabalho, { recursive: true })

  const conjuntos = f.conjuntos.filter(
    (c) => o.conjuntos === undefined || o.conjuntos.includes(c.nome),
  )
  if (conjuntos.length === 0) throw new ErroDeColeta(`nenhum conjunto a coletar em ${o.sourceId}`)

  // ── 1. BAIXAR E CONFERIR ──────────────────────────────────────────────────
  type Baixado = { conjunto: Conjunto; caminho: string; sha256: string; bytes: number }
  const baixados: Baixado[] = []
  let bytesBaixados = 0

  for (const c of conjuntos) {
    const alvos = c.arquivos.filter((a) => o.arquivos === undefined || o.arquivos.includes(a))
    for (const arquivo of alvos) {
      const url = `${f.base}${f.diretorioDoLote(o.referencia)}/${arquivo}`
      const destino = join(o.trabalho, `${o.referencia}-${arquivo}`)
      const r = await baixar({
        url,
        destino,
        ...(f.usuario === undefined ? {} : { usuario: f.usuario }),
      })
      bytesBaixados += r.bytes
      baixados.push({ conjunto: c, caminho: destino, sha256: r.sha256, bytes: r.bytes })
    }
  }

  // ── 2. LOTE JÁ CONHECIDO? ─────────────────────────────────────────────────
  const hash = hashDoLote(baixados.map((b) => b.sha256))
  const jaTem = loteJaCarregado(o.sourceId, hash)
  if (jaTem !== null) {
    return {
      coletaId: jaTem.id,
      sourceId: o.sourceId,
      referencia: o.referencia,
      linhas: jaTem.linhas,
      bytesBaixados,
      duracaoMs: Date.now() - inicio,
      jaEstava: true,
    }
  }

  // ── 3. CARREGAR ───────────────────────────────────────────────────────────
  const quando = new Date().toISOString()
  const coletaId = abrirColeta(o.sourceId, quando, o.referencia, hash)

  let total = 0
  try {
    for (const b of baixados) {
      total += await carregarConjunto(
        coletaId,
        o.sourceId,
        b.conjunto,
        b.caminho,
        quando,
        o.referencia,
      )
    }
  } catch (e) {
    abortar(coletaId, o.sourceId, total, Date.now() - inicio, e)
  }

  const duracaoMs = Date.now() - inicio
  fechar(coletaId, true, total, duracaoMs, null)

  sql(
    `UPDATE fontes.source_registry
        SET ultima_coleta_em = ${escapar(quando)}::timestamptz,
            status = 'viva', atualizado_em = now()
      WHERE source_id = ${escapar(o.sourceId)}`,
  )
  registrarSaude(o.sourceId, 'viva', null, duracaoMs)
  registrarUsoDaCasa(o.sourceId, coletaId, [
    ['linhas_processadas', total],
    ['ms_computacao', duracaoMs],
    ['bytes_armazenados', bytesBaixados],
    ['chamada_fonte', baixados.length],
  ])

  return {
    coletaId,
    sourceId: o.sourceId,
    referencia: o.referencia,
    linhas: total,
    bytesBaixados,
    duracaoMs,
    jaEstava: false,
  }
}

/**
 * Carga a partir de arquivo JÁ em disco, sem rede.
 *
 * Existe para a prova com amostra real: os dois lotes de julho e agosto foram
 * baixados uma vez e o diff roda contra eles quantas vezes for preciso, sem
 * bater na Receita a cada execução. Mesmo parser, mesmo layout, mesmo caminho
 * de escrita — muda só de onde vêm os bytes.
 */
export async function carregarArquivoLocal(p: {
  readonly sourceId: string
  readonly conjunto: Conjunto
  readonly caminho: string
  readonly referencia: string
  readonly quando: string
}): Promise<ResultadoColeta> {
  const inicio = Date.now()
  if (!existsSync(p.caminho)) throw new ErroDeColeta(`arquivo não existe: ${p.caminho}`)

  // O hash do lote local inclui o tamanho: dois arquivos diferentes não colidem,
  // e o mesmo arquivo recarregado é reconhecido — a idempotência vale aqui também.
  const hash = createHash('sha256')
    .update(`local:${p.conjunto.nome}:${p.caminho}:${String(statSync(p.caminho).size)}`)
    .digest('hex')

  const jaTem = loteJaCarregado(p.sourceId, hash)
  if (jaTem !== null) {
    return {
      coletaId: jaTem.id,
      sourceId: p.sourceId,
      referencia: p.referencia,
      linhas: jaTem.linhas,
      bytesBaixados: 0,
      duracaoMs: Date.now() - inicio,
      jaEstava: true,
    }
  }

  const coletaId = abrirColeta(p.sourceId, p.quando, p.referencia, hash)
  let total = 0
  try {
    total = await carregarConjunto(
      coletaId,
      p.sourceId,
      p.conjunto,
      p.caminho,
      p.quando,
      p.referencia,
    )
  } catch (e) {
    // 🔴 MESMO caminho de falha do coletor de rede. Ter dois jeitos de fracassar
    // é ter um deles que ninguém testa — foi o que o teste de integração pegou:
    // a carga local falhava sem rebaixar a fonte.
    abortar(coletaId, p.sourceId, total, Date.now() - inicio, e)
  }
  const duracaoMs = Date.now() - inicio
  fechar(coletaId, true, total, duracaoMs, null)
  registrarUsoDaCasa(p.sourceId, coletaId, [
    ['linhas_processadas', total],
    ['ms_computacao', duracaoMs],
  ])

  return {
    coletaId,
    sourceId: p.sourceId,
    referencia: p.referencia,
    linhas: total,
    bytesBaixados: 0,
    duracaoMs,
    jaEstava: false,
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */

export const coletar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'coleta',
      onda: 2,
      implementada: true,
      descricao:
        'Baixa o lote bruto da fonte e grava snapshot em jazida.snapshots, sempre com ' +
        'collected_at, reference_date, source_version e hash.',
      exige: [
        'psql no PATH e PGDATABASE apontando para o banco com as migrations aplicadas',
        'unzip no PATH',
        'fonte no registry com status diferente de indisponivel',
        'layout vigente em fontes.layouts para cada conjunto',
      ],
    }
  },

  executar: executarColeta,
}
