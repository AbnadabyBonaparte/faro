/**
 * ETAPA 2 — DIFF. Onda 2: implementada.
 *
 * Este módulo **não compara nada**. Quem compara é `eventos.diferenciar`, no
 * banco (migration 0011). Aqui só se escolhe o par de coletas, se mede e se
 * registra o custo.
 *
 * A escolha é deliberada e vale repetir: com a regra em SQL existe UMA
 * implementação. Se o TypeScript tivesse a sua cópia, um dia as duas
 * discordariam — e quem descobriria a discordância seria o assinante, olhando
 * uma ficha que o painel não confirma.
 *
 * Canon: MODELO-FARO-V2.md §2 · ORDEM ONDA 2 §3
 */

import { escapar, linhas as consultar, valor } from '../infra/pg.ts'
import { registrarUsoDaCasa } from '../saude/index.ts'
import type { ResultadoEtapa } from '../index.ts'

export type ContagemPorTipo = Readonly<Record<string, number>>

export type ResultadoDiff = {
  readonly coletaAtual: string
  readonly coletaAnterior: string | null
  /** true quando a coleta é a primeira da fonte: linha de base, zero eventos. */
  readonly linhaDeBase: boolean
  readonly eventos: ContagemPorTipo
  readonly total: number
  readonly duracaoMs: number
}

export class ErroDeDiff extends Error {}

/** A coleta completa mais recente de uma fonte. */
export function ultimaColeta(sourceId: string): string | null {
  return valor(
    `SELECT id::text FROM jazida.coletas_completas
      WHERE source_id = ${escapar(sourceId)}
      ORDER BY collected_at DESC LIMIT 1`,
  )
}

/**
 * Roda o diff de uma coleta contra a anterior da mesma fonte.
 *
 * Sem `coletaAnterior`, a função do banco escolhe a imediatamente mais velha.
 * Sendo a primeira, devolve `linhaDeBase` e **não pare evento nenhum** — sem
 * essa regra o dia 1 entregaria dezenas de milhões de "novidades" que são só o
 * cadastro inteiro sendo visto pela primeira vez.
 */
export function executarDiff(p: {
  readonly coletaAtual: string
  readonly coletaAnterior?: string
}): ResultadoDiff {
  const inicio = Date.now()

  const anterior = p.coletaAnterior === undefined ? 'NULL' : `${escapar(p.coletaAnterior)}::uuid`

  const r = consultar(
    `SELECT tipo, quantidade::text
       FROM eventos.diferenciar(${escapar(p.coletaAtual)}::uuid, ${anterior})`,
  )

  const linhaDeBase = r.length === 1 && r[0]?.[0] === 'linha_de_base'
  const eventos: Record<string, number> = {}
  if (!linhaDeBase) {
    for (const linha of r) {
      const tipo = linha[0]
      if (tipo !== undefined && tipo !== '') eventos[tipo] = Number(linha[1] ?? '0')
    }
  }

  const total = Object.values(eventos).reduce((a, b) => a + b, 0)
  const duracaoMs = Date.now() - inicio

  const usada = valor(
    `SELECT coleta_anterior_id::text FROM eventos.eventos
      WHERE coleta_atual_id = ${escapar(p.coletaAtual)}::uuid LIMIT 1`,
  )

  const sourceId = valor(
    `SELECT source_id FROM jazida.coletas_completas WHERE id = ${escapar(p.coletaAtual)}::uuid`,
  )
  if (sourceId !== null) {
    registrarUsoDaCasa(sourceId, p.coletaAtual, [['ms_computacao', duracaoMs]])
  }

  return {
    coletaAtual: p.coletaAtual,
    coletaAnterior: p.coletaAnterior ?? usada,
    linhaDeBase,
    eventos,
    total,
    duracaoMs,
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */

export const diferenciar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'diff',
      onda: 2,
      implementada: true,
      descricao:
        'Compara o hash de cada chave_natural entre a coleta atual e a anterior. ' +
        'Onde muda, nasce um evento — a unidade de valor do FARO.',
      exige: [
        'ao menos duas coletas COMPLETAS da mesma fonte',
        'tipo de evento cadastrado em eventos.tipos',
        'regra cadastrada em eventos.regras_diff ou eventos.regras_presenca',
      ],
    }
  },

  executar: executarDiff,
}
