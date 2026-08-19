/**
 * FICHA — a entrega do FARO, no formato da REGRA DE PEDRO.
 *
 * Canon: MODELO-FARO-V2.md §4, §4.1, §4.2; REGRA-DE-PEDRO.md.
 *
 * A Regra de Pedro tem quatro movimentos, e cada um é um campo OBRIGATÓRIO aqui.
 * Uma ficha que não compila é uma ficha que só responderia a pergunta.
 */

import type {
  Aferido,
  CadeiaDeEvidencia,
  Freshness,
  Grade,
} from '../evidencia/index.js'
import type { EvLiquido, ScoreDecomposto } from '../score/index.js'

/** MOVIMENTO 2 da Regra de Pedro — a mexerica na promoção. */
export type Adjacente = {
  readonly tipo: 'evento_vizinho' | 'tese_ao_lado' | 'empresa_do_grupo' | 'prazo_proximo'
  readonly texto: string
  /** O adjacente carrega prova igual ao principal — não é palpite de vendedor. */
  readonly sourceId: string
  readonly coletadoEm: string
  /** Referência ao objeto sugerido, quando houver. */
  readonly alvoId: string | null
}

/** MOVIMENTO 3 — a ficha argumenta contra si mesma. */
export type RazaoParaNaoPerseguir = {
  readonly codigo:
    | 'documentacao_provavelmente_ausente'
    | 'periodo_possivelmente_prescrito'
    | 'precedente_desfavoravel'
    | 'fonte_degradada'
    | 'sinal_isolado'
    | 'porte_incompativel_com_custo'
    | 'capacidade_de_utilizacao_duvidosa'
  readonly texto: string
}

/** MOVIMENTO 4 — o sistema prepara, o humano autoriza. */
export const ESTADOS_ACAO = ['preparada', 'autorizada', 'executada', 'cancelada'] as const
export type EstadoAcao = (typeof ESTADOS_ACAO)[number]

export type AcaoRecomendada = {
  readonly texto: string
  /** Nasce SEMPRE em `preparada`. Nada dispara sozinho. */
  readonly estado: EstadoAcao
  /** Quem disse "pode fechar". Null enquanto ninguém disse. */
  readonly autorizadaPor: string | null
  readonly autorizadaEm: string | null
}

export type Ficha = {
  readonly id: string
  readonly tenantId: string
  /** A VERSÃO da tese que gerou esta ficha — não a tese. Canon: teses versionadas. */
  readonly teseId: string
  readonly teseVersao: number
  /** O evento que disparou. Ficha sem evento é lista, não FARO. */
  readonly eventoId: string

  readonly razaoSocial: string
  readonly cnpj: string

  /** 🔴 Confidence Policy no tipo: porte é PROXY, não fato. Canon §5. */
  readonly porteAferido: Aferido<string>
  readonly faturamentoAferido: Aferido<number>

  /** MOVIMENTO 1 — a prova. */
  readonly cadeia: CadeiaDeEvidencia
  readonly grade: Grade
  readonly freshness: Freshness

  /** Total derivado das parcelas — nunca digitado. */
  readonly score: ScoreDecomposto
  /** O número-mestre. O bruto vive dentro dele, subordinado. */
  readonly ev: EvLiquido

  /** MOVIMENTO 2 — obrigatório. Array vazio é resposta válida; ausência não é. */
  readonly adjacentes: readonly Adjacente[]
  /** MOVIMENTO 3 — obrigatório. */
  readonly porQueNaoPerseguir: readonly RazaoParaNaoPerseguir[]
  /** MOVIMENTO 4 — obrigatório. */
  readonly acao: AcaoRecomendada

  /** Limite de inferência no nível da ficha, além do de cada nó. */
  readonly limiteDeInferencia: string
  readonly publicadaEm: string
}

/* ─────────────────────────────────────────────────────────────────────────
   TRIBUNAL MAGRO — 3 botões e um motivo. Canon §9.
   O motivo é dado de 1ª classe: é o combustível do Thesis Engine.
   ───────────────────────────────────────────────────────────────────────── */

export const JULGAMENTOS = ['aprovada', 'descartada', 'monitorar'] as const
export type Julgamento = (typeof JULGAMENTOS)[number]

export type Julgado = {
  readonly fichaId: string
  readonly julgamento: Julgamento
  /** Chave para o catálogo de motivos — dado, não enum (Anti-Viés). */
  readonly motivoCodigo: string
  readonly motivoTexto: string | null
  readonly julgadoPor: string
  readonly julgadoEm: string
}

/**
 * Guarda de caráter: uma ficha só é publicável se cumprir a Regra de Pedro.
 * Usada pelo motor antes de gravar, e pelos testes.
 */
export function violacoesDaRegraDePedro(f: Ficha): string[] {
  const v: string[] = []
  if (f.cadeia.length === 0) v.push('movimento 1: cadeia de evidência vazia')
  if (!f.limiteDeInferencia.trim()) v.push('movimento 1: limite de inferência em branco')
  if (f.porQueNaoPerseguir.length === 0) {
    v.push('movimento 3: nenhuma razão para não perseguir — a ficha não argumenta contra si')
  }
  if (f.acao.estado !== 'preparada' && f.acao.autorizadaPor === null) {
    v.push('movimento 4: ação saiu de "preparada" sem autor — o humano não autorizou')
  }
  return v
}
