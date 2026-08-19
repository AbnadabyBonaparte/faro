/**
 * ETAPA 3 — CAÇA. Onda 3: implementada.
 *
 * Como no diff da Onda 2, este módulo **não decide nada**: quem cruza tese com
 * base é `fichas.cacar`, no banco. Aqui se escolhe a tese, se mede e se conta.
 *
 * 🔴 A LEI QUE ESTA ETAPA CARREGA: **candidato não é ficha.**
 *
 * O modo `inicial` varre o perfil contra a base e produz candidatos — úteis
 * para dimensionar território, inúteis como entrega. O modo `incremental` exige
 * evento, e é dele que sai ficha. A diferença não é de configuração: é a
 * fronteira entre o FARO e uma lista de empresas que batem num filtro.
 *
 * Canon: MODELO-FARO-V2.md §2, §11 · ORDEM ONDA 3 §2
 */

import { escapar, linhas as consultar, valor } from '../infra/pg.ts'
import type { ResultadoEtapa } from '../index.ts'

export type ModoCacada = 'inicial' | 'incremental'

export type ResultadoCacada = {
  readonly cacadaId: string
  readonly modo: ModoCacada
  readonly teseVersaoId: string
  readonly candidatos: number
  /** Quantos candidatos têm evento — ou seja, quantos podem virar ficha. */
  readonly comEvento: number
  readonly duracaoMs: number
}

export class ErroDeCaca extends Error {}

/**
 * A versão de catálogo de uma tese, pelo código.
 *
 * 🔴 `ativa` GANHA DE `segmentada`, sempre — e só depois desempata pela versão
 * mais alta. O teste de integração pegou este defeito no minuto em que a T-04
 * ganhou uma versão 2 `segmentada` de demonstração: a busca "versão mais alta
 * que caça" passou a devolver a versão de DEMONSTRAÇÃO no lugar da comercial.
 *
 * Em produção isso teria trocado a tese que se vende pela tese que existe só
 * para exercitar o motor — sem erro, sem aviso, com a ficha saindo bonita.
 */
export function versaoAtivaDaTese(codigo: string): string | null {
  return valor(
    `SELECT v.id::text FROM teses.versoes v
       JOIN teses.teses t ON t.id = v.tese_id
      WHERE t.codigo = ${escapar(codigo)} AND v.estado IN ('ativa','segmentada')
      ORDER BY (v.estado = 'ativa') DESC, v.versao DESC LIMIT 1`,
  )
}

export function executarCaca(p: {
  readonly teseVersaoId: string
  readonly modo?: ModoCacada
}): ResultadoCacada {
  const modo: ModoCacada = p.modo ?? 'incremental'

  const cacadaId = valor(
    `SELECT fichas.cacar(${escapar(p.teseVersaoId)}::uuid, ${escapar(modo)})::text`,
  )
  if (cacadaId === null) throw new ErroDeCaca('a caçada não devolveu id')

  const r = consultar(
    `SELECT candidatos::text, duracao_ms::text,
            (SELECT count(*)::text FROM fichas.candidatos c
              WHERE c.cacada_id = ${escapar(cacadaId)}::uuid AND c.evento_id IS NOT NULL)
       FROM fichas.cacadas WHERE id = ${escapar(cacadaId)}::uuid`,
  )
  const l = r[0]

  return {
    cacadaId,
    modo,
    teseVersaoId: p.teseVersaoId,
    candidatos: Number(l?.[0] ?? '0'),
    duracaoMs: Number(l?.[1] ?? '0'),
    comEvento: Number(l?.[2] ?? '0'),
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */

export const cacar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'caca',
      onda: 3,
      implementada: true,
      descricao:
        'Roda as teses ativas contra os eventos novos e decide quais viram ficha. ' +
        'Lote de madrugada, nunca tempo real.',
      exige: [
        'coleta completa do conjunto alvo da tese',
        'tese em estado ativa ou segmentada',
        'certidao de proveniencia se for tese da casa',
        'evento — no modo incremental, candidato sem evento nao existe',
      ],
    }
  },

  executar: executarCaca,
}
