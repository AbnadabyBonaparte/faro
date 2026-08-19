/**
 * ETAPAS 4 e 5 — SCORE e PUBLICAÇÃO. Onda 3: implementadas.
 *
 * As duas moram juntas porque são um gesto só: publicar uma ficha É calcular o
 * score dela. Separar produziria uma janela em que existe ficha sem score — e
 * ficha sem score é ficha que alguém pode ler como "ainda não avaliada" quando
 * na verdade é "avaliada e o número não chegou".
 *
 * Quem monta é `fichas.publicar`, no banco. Este módulo escolhe os candidatos e
 * conta o resultado.
 *
 * 🔴 O que este código **não faz**: escrever `score_total`. Ele nem tem como —
 * o trigger da Onda 1 recusa. O total cai das parcelas, sempre.
 *
 * Canon: MODELO-FARO-V2.md §4, §4.1, §4.2 · REGRA-DE-PEDRO.md · ORDEM ONDA 3 §3
 */

import { escapar, linhas as consultar, sql, valor } from '../infra/pg.ts'
import type { ResultadoEtapa } from '../index.ts'

export class ErroDePublicacao extends Error {}

export type ResultadoPublicacao = {
  readonly cacadaId: string
  readonly elegiveis: number
  readonly publicadas: number
  readonly recusadas: number
  readonly duracaoMs: number
  /** Distribuição do score das fichas publicadas — o retrato sem CNPJ. */
  readonly scoreMin: number | null
  readonly scoreMax: number | null
  readonly scoreMediana: number | null
}

/**
 * Publica as fichas de uma caçada.
 *
 * Só candidatos COM evento são elegíveis — e isso não é filtro deste código: é
 * recusa do banco. O filtro aqui existe para não pedir ao banco o que se sabe
 * que ele vai negar, e o teste prova que a negação existe mesmo assim.
 */
export function executarPublicacao(p: {
  readonly cacadaId: string
  /** Teto de fichas por rodada. Escassez é o produto — ver MODELO-DE-NEGOCIO §D.0. */
  readonly limite?: number
}): ResultadoPublicacao {
  const inicio = Date.now()

  const limite = p.limite ?? 0
  const candidatos = consultar(
    `SELECT id::text FROM fichas.candidatos
      WHERE cacada_id = ${escapar(p.cacadaId)}::uuid AND evento_id IS NOT NULL
      ORDER BY cnpj${limite > 0 ? ` LIMIT ${String(limite)}` : ''}`,
  )

  let publicadas = 0
  let recusadas = 0
  for (const [id] of candidatos) {
    if (id === undefined) continue
    try {
      sql(`SELECT fichas.publicar(${escapar(id)}::uuid)`)
      publicadas++
    } catch {
      // Recusa é resultado, não acidente: o banco tem o direito de dizer não,
      // e a contagem de recusas entra no relatório.
      recusadas++
    }
  }

  const dist = consultar(
    `SELECT min(score_total)::text, max(score_total)::text,
            percentile_disc(0.5) WITHIN GROUP (ORDER BY score_total)::text
       FROM fichas.fichas f
       JOIN fichas.candidatos c ON c.evento_id = f.evento_id AND c.cnpj = f.cnpj
      WHERE c.cacada_id = ${escapar(p.cacadaId)}::uuid`,
  )
  const d = dist[0]
  const num = (x: string | undefined): number | null =>
    x === undefined || x === '' ? null : Number(x)

  return {
    cacadaId: p.cacadaId,
    elegiveis: candidatos.length,
    publicadas,
    recusadas,
    duracaoMs: Date.now() - inicio,
    scoreMin: num(d?.[0]),
    scoreMax: num(d?.[1]),
    scoreMediana: num(d?.[2]),
  }
}

/** Publica UMA ficha. Existe para o teste e para a inspeção manual. */
export function publicarCandidato(candidatoId: string): string {
  const id = valor(`SELECT fichas.publicar(${escapar(candidatoId)}::uuid)::text`)
  if (id === null) throw new ErroDePublicacao('a publicação não devolveu id')
  return id
}

/* ─────────────────────────────────────────────────────────────────────────── */

export const pontuar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'score',
      onda: 3,
      implementada: true,
      descricao:
        'Calcula as 6 dimensoes e grava as PARCELAS. O total cai por trigger — ' +
        'o motor nao digita total.',
      exige: [
        'candidato com criterios casados',
        'pesos da versao da tese em teses.pesos',
        'cada dimensao grava a propria justificativa',
      ],
    }
  },
  executar: executarPublicacao,
}

export const publicar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'publica',
      onda: 3,
      implementada: true,
      descricao:
        'Monta a cadeia de evidencia, o adjacente, o por-que-nao e a acao PREPARADA. ' +
        'Publica a ficha no tenant.',
      exige: [
        'candidato COM evento — sem evento o banco recusa',
        'parametros de EV na versao da tese',
        'Regra de Pedro cumprida nos 4 movimentos',
        'acao nasce preparada, nunca executada',
      ],
    }
  },
  executar: executarPublicacao,
}
