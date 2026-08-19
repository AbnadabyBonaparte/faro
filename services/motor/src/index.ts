/**
 * @faro/motor — o batch de madrugada.
 *
 * 🔴 ONDA 1: TUDO AQUI É STUB DECLARADO. Nenhuma etapa executa.
 *
 * Isto não é preguiça: é a lei do canon §11 (varredura em LOTE, nunca em tempo
 * real) desenhada como pipeline antes de qualquer linha rodar. Cada etapa
 * declara o que fará, o que exige para funcionar e em qual Onda nasce.
 *
 * Canon: MODELO-FARO-V2.md §11 · ORDEM ONDA 1 §1.1
 */

import { coletar } from './coleta/index.js'
import { diferenciar } from './diff/index.js'
import { cacar } from './caca/index.js'
import { pontuar } from './score/index.js'
import { publicar } from './publica/index.js'

export class EtapaNaoImplementada extends Error {
  constructor(
    readonly etapa: string,
    readonly onda: number,
  ) {
    super(`etapa "${etapa}" nasce na Onda ${onda} — não implementada na Onda 1`)
    this.name = 'EtapaNaoImplementada'
  }
}

/** A ordem canônica do batch. Cada passo consome o anterior. */
export const PIPELINE = ['coleta', 'diff', 'caca', 'score', 'publica'] as const
export type Etapa = (typeof PIPELINE)[number]

export type ResultadoEtapa = {
  readonly etapa: Etapa
  readonly onda: number
  readonly implementada: boolean
  readonly descricao: string
  readonly exige: readonly string[]
}

/** Descreve o pipeline sem executá-lo. É o que a Onda 1 entrega. */
export function descreverPipeline(): readonly ResultadoEtapa[] {
  return [coletar, diferenciar, cacar, pontuar, publicar].map((e) => e.descrever())
}

export { coletar, diferenciar, cacar, pontuar, publicar }
