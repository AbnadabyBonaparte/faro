/**
 * EVENTO — a unidade de valor do FARO. Canon: MODELO-FARO-V2.md §2.
 *
 * "Encontrei uma MUDANÇA", não "encontrei uma empresa". Um evento nasce do diff
 * entre duas coletas da mesma fonte — nunca de uma leitura só.
 */

/**
 * 🔴 ANTI-VIÉS: o tipo de evento é DADO, não enum.
 *
 * Enum de tipos de evento amarra o produto aos eventos que o primeiro cliente
 * precisou. Uma tabela de tipos deixa o próximo nicho entrar sem migration.
 * As constantes abaixo são a SEMENTE do catálogo, não a lista fechada dele.
 */
export const TIPOS_EVENTO_SEMENTE = [
  'entrou_em_cadastro',
  'saiu_de_cadastro',
  'mudou_regime',
  'nova_filial',
  'mudou_porte',
  'mudou_faixa_empregados',
  'contrato_publico',
  'mudou_atividade',
  'norma_alterada',
] as const

export type Evento = {
  readonly id: string
  /** Chave estrangeira para o catálogo de tipos — string, não enum. */
  readonly tipo: string
  /** Nulo em evento de infraestrutura (ex.: fonte degradada, norma alterada). */
  readonly cnpj: string | null
  readonly sourceId: string
  /** As duas coletas que o diff comparou. É a prova de que houve mudança. */
  readonly coletaAnteriorId: string | null
  readonly coletaAtualId: string
  readonly detectadoEm: string
  readonly referenteA: string
  readonly antes: unknown
  readonly depois: unknown
}
