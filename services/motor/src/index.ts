/**
 * @faro/motor — o batch de madrugada.
 *
 * Estado por etapa (a própria etapa declara, em `descrever()`):
 *
 *   coleta   · Onda 2 · IMPLEMENTADA
 *   diff     · Onda 2 · IMPLEMENTADA
 *   caca     · Onda 3 · IMPLEMENTADA
 *   score    · Onda 3 · IMPLEMENTADA
 *   publica  · Onda 3 · IMPLEMENTADA
 *
 * O pipeline está inteiro de pé. O que falta não é etapa: é a tela (Onda 4), a
 * infra real e a fonte que a CCEE bloqueou.
 *
 * O pipeline nasceu inteiro na Onda 1 e as etapas foram ficando de pé uma a uma.
 * Isto não é preguiça: é a lei do canon §11 (varredura em LOTE, nunca em tempo
 * real) desenhada antes de qualquer linha rodar, para que nenhuma etapa fosse
 * inventada depois só porque a anterior precisou dela.
 *
 * Canon: MODELO-FARO-V2.md §11 · ORDEM ONDA 1 §1.1 · ORDEM ONDA 2
 */

import { coletar } from './coleta/index.ts'
import { diferenciar } from './diff/index.ts'
import { cacar } from './caca/index.ts'
import { pontuar, publicar } from './publica/index.ts'

/** Erro das etapas que ainda não nasceram. Nunca de coleta nem de diff. */
export class EtapaNaoImplementada extends Error {
  readonly etapa: string
  readonly onda: number

  constructor(etapa: string, onda: number) {
    super(`etapa "${etapa}" nasce na Onda ${onda} — ainda não implementada`)
    this.name = 'EtapaNaoImplementada'
    this.etapa = etapa
    this.onda = onda
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

/** Descreve o pipeline sem executá-lo — inclusive o que ainda não roda. */
export function descreverPipeline(): readonly ResultadoEtapa[] {
  return [coletar, diferenciar, cacar, pontuar, publicar].map((e) => e.descrever())
}

export { coletar, diferenciar, cacar, pontuar, publicar }
export { executarColeta, carregarArquivoLocal, layoutDoBanco } from './coleta/index.ts'
export { executarDiff, ultimaColeta } from './diff/index.ts'
export { executarCaca, versaoAtivaDaTese } from './caca/index.ts'
export { executarPublicacao, publicarCandidato } from './publica/index.ts'
export { registrarSaude, registrarUsoDaCasa, atrasoDaFonte } from './saude/index.ts'
export { lerRfb, LayoutDivergente } from './parser/rfb.ts'
export { lerCsv } from './parser/csv.ts'
export { FONTES, RFB_CNPJ, CCEE_CL, fonte } from './fontes/index.ts'
