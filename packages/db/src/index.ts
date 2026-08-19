/**
 * @faro/db — as migrations e o contrato do schema.
 *
 * O SQL é a fonte de verdade. Este módulo só enumera, ordena e descreve — para
 * que o runner de guardas, o CI e o futuro `supabase db push` apliquem a MESMA
 * lista, na MESMA ordem, sem ninguém manter um índice paralelo à mão.
 *
 * Lição do Banco de Evolução: "todo projeto com banco precisa de baseline
 * versionado do schema — sem baseline, o repositório mente sobre o banco".
 * Aqui o repositório é o baseline desde a primeira migration.
 */

import { readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))

/** Pasta das migrations. Funciona a partir de `src` (dev) ou `dist` (build). */
export const DIRETORIO_MIGRATIONS = resolve(AQUI, '..', 'migrations')

export type Migration = {
  /** Prefixo numérico: define a ordem e nunca se repete. */
  readonly ordem: number
  readonly arquivo: string
  readonly caminho: string
  readonly assunto: string
}

/**
 * Uma preocupação por arquivo. A ordem é o prefixo — não a data de criação,
 * não a ordem alfabética acidental.
 */
export function listarMigrations(diretorio = DIRETORIO_MIGRATIONS): readonly Migration[] {
  const arquivos = readdirSync(diretorio)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  const vistas = new Set<number>()
  return arquivos.map((arquivo) => {
    const m = /^(\d+)_(.+)\.sql$/.exec(arquivo)
    if (!m) throw new Error(`migration fora do padrão NNNN_assunto.sql: ${arquivo}`)
    const ordem = Number(m[1])
    if (vistas.has(ordem)) throw new Error(`ordem duplicada em migrations: ${ordem}`)
    vistas.add(ordem)
    return {
      ordem,
      arquivo,
      caminho: join(diretorio, arquivo),
      assunto: (m[2] ?? '').replace(/_/g, ' '),
    }
  })
}

/** Os schemas do domínio. As guardas de CI enumeram exatamente estes. */
export const SCHEMAS = [
  'core',
  'fontes',
  'jazida',
  'eventos',
  'teses',
  'fichas',
  'tribunal',
  'watch',
  'uso',
] as const
export type Schema = (typeof SCHEMAS)[number]

/**
 * Trilhas append-only: sem UPDATE, sem DELETE. Correção = estorno com motivo.
 * Esta lista é conferida pela guarda 2 — se alguém adicionar uma trilha aqui
 * sem criar o trigger, o CI cai.
 */
export const TRILHAS_APPEND_ONLY = [
  'jazida.coletas',
  'jazida.coletas_fechamento',
  'jazida.snapshots_default',
  'jazida.snapshots_rfb_cnpj',
  'jazida.snapshots_ccee_cl',
  'eventos.eventos',
  'eventos.execucoes_diff',
  'tribunal.julgamentos',
  'uso.ledger',
] as const
