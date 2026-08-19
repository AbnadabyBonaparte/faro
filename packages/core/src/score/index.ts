/**
 * SCORE — decomposto e explicável. Canon: MODELO-FARO-V2.md §4.
 *
 * 🔴 LEI DE FUNDAÇÃO: **o total é DERIVADO, nunca digitado.**
 *
 * Não existe, em lugar nenhum deste pacote, uma função que aceite um total como
 * entrada. Quem quiser um score precisa entregar as seis dimensões — e o total
 * cai fora do cálculo. É a Lei 4 do canon virando impossibilidade técnica em vez
 * de recomendação.
 */

import type { NumeroSelado } from '../evidencia/index.js'

export const DIMENSOES = [
  'fitEstrutural',
  'evidenciaTese',
  'recencia',
  'qualidadeFontes',
  'intensidadeSinal',
  'confiancaInferencia',
] as const

export type Dimensao = (typeof DIMENSOES)[number]

/** Cada dimensão é 0..100. */
export type Dimensoes = Readonly<Record<Dimensao, number>>

/** Pesos versionados: a ficha guarda qual conjunto de pesos a gerou. */
export type Pesos = Readonly<Record<Dimensao, number>>

export const PESOS_V1: Pesos = {
  fitEstrutural: 0.25,
  evidenciaTese: 0.2,
  recencia: 0.15,
  qualidadeFontes: 0.15,
  intensidadeSinal: 0.15,
  confiancaInferencia: 0.1,
}

export const ROTULOS: Readonly<Record<Dimensao, string>> = {
  fitEstrutural: 'Fit estrutural',
  evidenciaTese: 'Evidência da tese',
  recencia: 'Recência',
  qualidadeFontes: 'Qualidade das fontes',
  intensidadeSinal: 'Intensidade do sinal',
  confiancaInferencia: 'Confiança da inferência',
}

export class ScoreInvalido extends Error {}

/** A parcela de uma dimensão no total — o que a tela exibe linha a linha. */
export type Parcela = {
  readonly dimensao: Dimensao
  readonly valor: number
  readonly peso: number
  readonly contribuicao: number
}

export type ScoreDecomposto = {
  readonly total: number
  readonly parcelas: readonly Parcela[]
  readonly versaoPesos: string
}

function validar(d: Dimensoes): void {
  for (const k of DIMENSOES) {
    const v = d[k]
    if (!Number.isFinite(v) || v < 0 || v > 100) {
      throw new ScoreInvalido(`dimensão ${k} fora de 0..100: ${String(v)}`)
    }
  }
}

/**
 * A ÚNICA porta de entrada para um score. Não há sobrecarga que aceite total.
 */
export function calcularScore(
  dimensoes: Dimensoes,
  pesos: Pesos = PESOS_V1,
  versaoPesos = 'v1',
): ScoreDecomposto {
  validar(dimensoes)
  const parcelas = DIMENSOES.map<Parcela>((dimensao) => {
    const valor = dimensoes[dimensao]
    const peso = pesos[dimensao]
    return { dimensao, valor, peso, contribuicao: valor * peso }
  })
  const total = Math.round(parcelas.reduce((acc, p) => acc + p.contribuicao, 0))
  return { total, parcelas, versaoPesos }
}

/**
 * Reprova um score cujo total não bate com as parcelas.
 * Usado pela guarda de CI "score derivado" — se alguém contornar o cálculo e
 * gravar um total à mão, isto pega.
 */
export function totalConfere(s: ScoreDecomposto): boolean {
  const esperado = Math.round(s.parcelas.reduce((acc, p) => acc + p.contribuicao, 0))
  return esperado === s.total
}

export function faixa(total: number): string {
  if (total >= 85) return 'Alta aderência'
  if (total >= 70) return 'Aderência média'
  if (total >= 55) return 'Aderência baixa'
  return 'Aderência marginal'
}

/* ─────────────────────────────────────────────────────────────────────────
   EV LÍQUIDO — o número-mestre da ficha. Canon §4.1.
   O bruto é componente subordinado; sozinho ele é um passivo.
   ───────────────────────────────────────────────────────────────────────── */

export type ComponentesEV = {
  /** Oportunidade bruta. Quase sempre `ESTIMATIVA` — o selo viaja junto. */
  readonly bruto: NumeroSelado
  /** 0..1 */
  readonly probElegibilidade: NumeroSelado
  /** 0..1 */
  readonly probHomologacao: NumeroSelado
  /** 0..1 — desconto por tempo até o caixa. */
  readonly ajustePrazoCaixa: NumeroSelado
  readonly custoDocumentacao: NumeroSelado
  readonly honorariosHabilitado: NumeroSelado
}

export type EvLiquido = {
  readonly valor: number | null
  /** O selo do EV é o PIOR selo entre os componentes. Nunca melhor que a pior peça. */
  readonly selo: NumeroSelado['selo']
  readonly componentes: ComponentesEV
  /** Por que é null, quando é null. */
  readonly motivoIndisponivel: string | null
}

const ORDEM_SELO = { MEDIDO: 0, ESTIMATIVA: 1, NAO_VERIFICADO: 2 } as const

export function calcularEvLiquido(c: ComponentesEV): EvLiquido {
  const partes = [
    c.bruto,
    c.probElegibilidade,
    c.probHomologacao,
    c.ajustePrazoCaixa,
    c.custoDocumentacao,
    c.honorariosHabilitado,
  ]

  // O selo do resultado é o pior dos componentes — otimismo não se propaga.
  const selo = partes.reduce<NumeroSelado['selo']>(
    (pior, p) => (ORDEM_SELO[p.selo] > ORDEM_SELO[pior] ? p.selo : pior),
    'MEDIDO',
  )

  const faltando = partes.filter((p) => p.valor === null)
  if (faltando.length > 0) {
    return {
      valor: null,
      selo,
      componentes: c,
      motivoIndisponivel: `${faltando.length} componente(s) sem valor — EV não calculável`,
    }
  }

  const valor =
    c.bruto.valor! *
      c.probElegibilidade.valor! *
      c.probHomologacao.valor! *
      c.ajustePrazoCaixa.valor! -
    c.custoDocumentacao.valor! -
    c.honorariosHabilitado.valor!

  return { valor, selo, componentes: c, motivoIndisponivel: null }
}

/** As cinco camadas do crédito. Canon §4.1 — o mercado vende a 1ª como se fosse a 5ª. */
export const CAMADAS_CREDITO = [
  'POTENCIAL',
  'ELEGIVEL',
  'VALIDADO',
  'RECUPERAVEL',
  'CAIXA',
] as const
export type CamadaCredito = (typeof CAMADAS_CREDITO)[number]
