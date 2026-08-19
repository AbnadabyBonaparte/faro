/**
 * LEITOR DE CSV POSICIONAL — a máquina de estados, não o `split(';')`.
 *
 * A RFB entrega tudo entre aspas duplas com `;` de delimitador e sem cabeçalho.
 * `linha.split(';')` funcionaria em 99,99% das linhas e produziria lixo
 * silencioso naquela em que um `;` mora dentro de um campo (razão social,
 * complemento de endereço). Lixo silencioso em 0,01% de 60 milhões são 6 mil
 * fichas erradas por lote — e nenhuma delas se anuncia.
 *
 * Streaming: o arquivo de Estabelecimentos tem 1,08 GB descompactado. Ler para
 * a memória não é opção.
 */

import type { Readable } from 'node:stream'

const ASPA = 34 // "
const CR = 13
const LF = 10

export type OpcoesCsv = {
  /** Padrão `;`, como a RFB entrega. */
  readonly delimitador?: string
  /** Padrão `latin1`: a RFB publica em ISO-8859-1, não em UTF-8. */
  readonly encoding?: BufferEncoding
}

/**
 * Percorre o stream devolvendo uma linha por vez, já dividida em campos.
 * Aspas duplicadas (`""`) viram uma aspa, como manda o RFC 4180.
 */
export async function* lerCsv(
  entrada: Readable,
  o: OpcoesCsv = {},
): AsyncGenerator<string[], void, void> {
  const delim = (o.delimitador ?? ';').charCodeAt(0)
  const encoding = o.encoding ?? 'latin1'

  let campos: string[] = []
  let atual: number[] = []
  let dentroDeAspas = false
  let aspaPendente = false

  const fecharCampo = (): void => {
    campos.push(Buffer.from(atual).toString(encoding))
    atual = []
  }

  for await (const pedaco of entrada as AsyncIterable<Buffer>) {
    for (let i = 0; i < pedaco.length; i++) {
      const b = pedaco[i] as number

      if (aspaPendente) {
        aspaPendente = false
        if (b === ASPA) {
          // "" dentro de campo entre aspas: é uma aspa literal.
          atual.push(ASPA)
          continue
        }
        dentroDeAspas = false
        // segue para o tratamento normal do byte atual
      }

      if (dentroDeAspas) {
        if (b === ASPA) aspaPendente = true
        else atual.push(b)
        continue
      }

      if (b === ASPA && atual.length === 0) {
        dentroDeAspas = true
        continue
      }
      if (b === delim) {
        fecharCampo()
        continue
      }
      if (b === LF) {
        fecharCampo()
        yield campos
        campos = []
        continue
      }
      if (b === CR) continue
      atual.push(b)
    }
  }

  // Última linha sem quebra no fim do arquivo.
  if (atual.length > 0 || campos.length > 0) {
    fecharCampo()
    yield campos
  }
}
