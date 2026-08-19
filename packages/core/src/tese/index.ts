/**
 * TESE — a hipótese operacional do assinante. Canon: MODELO-FARO-V2.md §3 (camada
 * TESE), §12; CATALOGO-DE-TESES-DA-CASA.md; LEI-DE-DADOS.md (proveniência).
 */

/** Canon: CATALOGO-DE-TESES-DA-CASA.md — detectar tese MORTA, não só viva. */
export const ESTADOS_TESE = [
  'ativa',
  'estudo',
  'segmentada',
  'contraditada',
  'morta',
] as const
export type EstadoTese = (typeof ESTADOS_TESE)[number]

/** Teses em estado 🔴 ou 🔵 não publicam ficha. Trava, não convenção. */
export function podeCacar(estado: EstadoTese): boolean {
  return estado === 'ativa' || estado === 'segmentada'
}

/**
 * Certidão de proveniência — LEI-DE-DADOS.md camada 3.
 * Sem certidão, uma tese da casa não entra em produção. O ônus é de quem propõe.
 */
export type Proveniencia = {
  readonly origem: 'parecer' | 'fonte_publica' | 'pesquisa_propria' | 'caso_operado'
  readonly referencia: string
  readonly autor: string
  readonly criadaEm: string
  /** Afirmação expressa. A Lei de Dados existe por causa deste campo. */
  readonly naoDerivouDeTenantCliente: true
}

export type ParametroTese = {
  readonly chave: string
  readonly rotulo: string
  readonly valor: string
}

/**
 * Toda edição gera VERSÃO NOVA — a ficha aponta para a versão que a gerou.
 * Sem isso, recalibrar a tese reescreve o passado e o ground truth mente.
 */
export type VersaoTese = {
  readonly teseId: string
  readonly versao: number
  readonly nome: string
  readonly hipotese: string
  readonly parametros: readonly ParametroTese[]
  readonly sinaisExigidos: readonly string[]
  readonly estado: EstadoTese
  readonly criadaEm: string
  /** Só o catálogo da casa exige; tese de assinante é dele e não carrega. */
  readonly proveniencia: Proveniencia | null
}
