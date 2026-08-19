/**
 * SAÚDE DA FONTE E LEDGER DA CASA.
 *
 * Duas coisas que só existem se forem escritas na hora, porque depois ninguém
 * reconstrói:
 *
 *  1. `fontes.saude_coleta` — a fonte esteve viva, quando, e quanto demorou.
 *     Sem isto, "a fonte está viva" é lembrança, não registro.
 *
 *  2. `uso.ledger` — o que a coleta custou. Coleta de fonte pública é custo da
 *     CASA (rateado entre todos os assinantes, não vendido a um), então entra
 *     com `tenant_id` nulo. Ver 0010: NULL ali significa exatamente isso, e a
 *     policy garante que assinante nenhum enxerga.
 *
 * Canon: MODELO-FARO-V2.md §7.2 · ORDEM ONDA 2 §4
 */

import { escapar, sql, valor } from '../infra/pg.ts'

export type StatusFonte = 'viva' | 'degradada' | 'indisponivel'

export type Metrica =
  | 'linhas_processadas'
  | 'ms_computacao'
  | 'bytes_armazenados'
  | 'chamada_fonte'

/**
 * Grava a observação de saúde e, quando a coleta atrasou em relação à
 * frequência PROMETIDA, grava o atraso junto.
 *
 * O atraso não é decorativo: é o gatilho do evento `coleta_atrasada` e o motivo
 * pelo qual toda ficha derivada da fonte passa a exibir Freshness degradado.
 * Frequência prometida sem medição de atraso é promessa sem cobrança.
 */
export function registrarSaude(
  sourceId: string,
  status: StatusFonte,
  erro: string | null,
  latenciaMs?: number,
): void {
  const campos: string[] = [
    escapar(sourceId),
    escapar(status),
    erro === null ? 'NULL' : escapar(erro.slice(0, 4000)),
    latenciaMs === undefined ? 'NULL' : String(Math.round(latenciaMs)),
  ]
  sql(
    `INSERT INTO fontes.saude_coleta (source_id, status_observado, erro, latencia_ms, atraso)
     SELECT ${campos[0]}, ${campos[1]}, ${campos[2]}, ${campos[3]},
            CASE
              WHEN r.frequencia_prometida IS NULL OR r.ultima_coleta_em IS NULL THEN NULL
              WHEN now() - r.ultima_coleta_em > r.frequencia_prometida
                THEN (now() - r.ultima_coleta_em) - r.frequencia_prometida
              ELSE NULL
            END
       FROM fontes.source_registry r
      WHERE r.source_id = ${campos[0]}`,
  )
}

/** Um atraso pendente, se houver — o Watch lê isto para abrir o evento. */
export function atrasoDaFonte(sourceId: string): string | null {
  return valor(
    `SELECT (now() - ultima_coleta_em - frequencia_prometida)::text
       FROM fontes.source_registry
      WHERE source_id = ${escapar(sourceId)}
        AND frequencia_prometida IS NOT NULL
        AND ultima_coleta_em IS NOT NULL
        AND now() - ultima_coleta_em > frequencia_prometida`,
  )
}

/**
 * Custo da casa: sem tenant, com fonte e coleta declaradas.
 *
 * 🔴 `custo_centavos` fica NULL de propósito. Ainda não medimos o custo em
 * dinheiro desta infraestrutura, e a coluna diz, no próprio COMMENT, que NULL
 * é NÃO MEDIDO e nunca zero. Escrever 0 aqui seria inventar um número — Lei 7.
 */
export function registrarUsoDaCasa(
  sourceId: string,
  coletaId: string | null,
  medidas: readonly (readonly [Metrica, number])[],
): void {
  if (medidas.length === 0) return
  const linhas = medidas
    .map(
      ([m, q]) =>
        `(NULL, ${escapar(sourceId)}, ${coletaId === null ? 'NULL' : `${escapar(coletaId)}::uuid`},` +
        ` ${escapar(m)}, ${String(q)}, NULL)`,
    )
    .join(',\n       ')
  sql(
    `INSERT INTO uso.ledger (tenant_id, source_id, coleta_id, metrica, quantidade, custo_centavos)
     VALUES ${linhas}`,
  )
}
