/**
 * EVIDÊNCIA — a Lei das Camadas em tipos.
 *
 * Canon: MODELO-FARO-V2.md §3 (Lei das Camadas), §5 (Confidence Policy),
 * §6 (Evidence Graph e Grade), §7.2 (Freshness).
 *
 * Princípio de fundação: **nenhuma afirmação existe sem procedência.** Aqui isso
 * não é disciplina de quem escreve — é o tipo que não compila sem os campos.
 */

/** A cadeia canônica. Uma afirmação sabe em qual degrau está. */
export const CAMADAS = ['DADO', 'SINAL', 'INFERENCIA', 'TESE', 'OPORTUNIDADE'] as const
export type Camada = (typeof CAMADAS)[number]

/** Nível de evidência da FONTE. Canon §6.2. */
export const NIVEIS_EVIDENCIA = ['E1', 'E2', 'E3'] as const
export type NivelEvidencia = (typeof NIVEIS_EVIDENCIA)[number]

/** Grade consolidado da OPORTUNIDADE, derivado da composição dos níveis. */
export const GRADES = ['A', 'B', 'C', 'D'] as const
export type Grade = (typeof GRADES)[number]

/** O sinal está vivo? Canon §7.2. */
export const FRESHNESS = ['ok', 'warn', 'stale', 'old'] as const
export type Freshness = (typeof FRESHNESS)[number]

/**
 * 🔴 CONFIDENCE POLICY NO TIPO — canon §5.
 *
 * Um valor é FATO (veio observado da fonte) ou PROXY (foi derivado/inferido).
 * Os dois nunca compartilham o mesmo campo: quem consome é obrigado a
 * desambiguar antes de renderizar. Proxy que vira fato por descuido é
 * impossível aqui — o compilador não deixa ler `.valor` sem checar a `especie`.
 */
export type ValorObservado<T> = {
  readonly especie: 'FATO'
  readonly valor: T
}

export type ValorProxy<T> = {
  readonly especie: 'PROXY'
  /** O proxy pode não ter valor nenhum — "não disponível" é resposta legítima. */
  readonly valor: T | null
  /** Por que este proxy é aceitável e o que ele NÃO prova. Obrigatório. */
  readonly baseDoProxy: string
  readonly limite: string
}

export type Aferido<T> = ValorObservado<T> | ValorProxy<T>

export function ehFato<T>(v: Aferido<T>): v is ValorObservado<T> {
  return v.especie === 'FATO'
}

/**
 * Selo de confiabilidade de um número que veio de parecer, não de medição.
 * Lei 7b do AGENTS.md: o selo viaja com o número.
 */
export const SELOS = ['MEDIDO', 'ESTIMATIVA', 'NAO_VERIFICADO'] as const
export type Selo = (typeof SELOS)[number]

export type NumeroSelado = {
  readonly valor: number | null
  readonly selo: Selo
  /** Quem produziu. Um `ESTIMATIVA` órfão é inauditável. */
  readonly origem: string
}

/**
 * Um nó da cadeia de evidência. **Todo campo abaixo é obrigatório** —
 * é o que torna a ficha auditável em vez de confiável.
 */
export type NoEvidencia = {
  readonly camada: Camada
  readonly texto: string
  /** Referência estável ao source_registry. */
  readonly sourceId: string
  readonly coletadoEm: string
  /** A data a que o dado se refere — quase nunca é a data da coleta. */
  readonly referenteA: string
  /** Como se saiu do bruto até esta afirmação. */
  readonly regraDeTransformacao: string
  /** 0..1 — quanto o salto lógico depende de proxy ou validação humana. */
  readonly confianca: number
  /** O que esta afirmação NÃO prova. Obrigatório, inclusive na camada DADO. */
  readonly limiteDeInferencia: string
}

/** A cadeia inteira de uma oportunidade. Canon §6.1. */
export type CadeiaDeEvidencia = readonly NoEvidencia[]

/**
 * Grade derivado da composição dos níveis das fontes citadas.
 * Regra: quanto mais E1 independentes, melhor; E3 sozinho nunca passa de D.
 */
export function derivarGrade(niveis: readonly NivelEvidencia[]): Grade {
  const e1 = niveis.filter((n) => n === 'E1').length
  const e2 = niveis.filter((n) => n === 'E2').length
  if (e1 >= 2) return 'A'
  if (e1 === 1 && e2 >= 1) return 'B'
  if (e1 === 1 || e2 >= 2) return 'C'
  return 'D'
}
