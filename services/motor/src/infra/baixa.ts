/**
 * DOWNLOAD RESUMÍVEL COM HASH.
 *
 * O lote mensal da RFB são 7,7 GB em 36 arquivos. Numa rede que cai — e ela cai
 * — um download não-resumível transforma 95% baixados em 0% baixados. Retomar é
 * requisito, não conforto.
 *
 * E o hash não é enfeite de log: sem ele, um arquivo truncado vira um lote em
 * que faltam empresas, e o diff da coleta seguinte declara `saiu_da_fonte` para
 * cada empresa que só faltou no disco. O truncamento silencioso é a forma mais
 * cara de erro que este sistema pode cometer, porque ele SE PARECE COM NOTÍCIA.
 */

import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream, existsSync, statSync } from 'node:fs'
import { get as httpsGet } from 'node:https'
import type { IncomingMessage } from 'node:http'

export class ErroDeColeta extends Error {}

export type ResultadoDownload = {
  readonly caminho: string
  readonly bytes: number
  readonly sha256: string
  /** Quantas retomadas foram necessárias. Vai para o relatório de saúde. */
  readonly retomadas: number
  readonly duracaoMs: number
}

export type OpcoesDownload = {
  readonly url: string
  readonly destino: string
  /** Basic auth — o share público do Nextcloud usa o token como usuário. */
  readonly usuario?: string
  readonly senha?: string
  /** Tamanho esperado, quando a listagem já o informou. Confere ao final. */
  readonly bytesEsperados?: number
  readonly tentativasMax?: number
}

function requisicao(
  url: string,
  cabecalhos: Record<string, string>,
): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const req = httpsGet(url, { headers: cabecalhos }, (res) => {
      const loc = res.headers.location
      if (res.statusCode !== undefined && res.statusCode >= 300 && res.statusCode < 400 && loc) {
        res.resume()
        resolve(requisicao(new URL(loc, url).toString(), cabecalhos))
        return
      }
      resolve(res)
    })
    req.on('error', reject)
    req.setTimeout(120_000, () => req.destroy(new Error('timeout de 120s sem byte novo')))
  })
}

/** sha256 de um arquivo já em disco. */
export function hashDoArquivo(caminho: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256')
    createReadStream(caminho)
      .on('data', (c) => h.update(c))
      .on('error', reject)
      .on('end', () => resolve(h.digest('hex')))
  })
}

/**
 * Baixa `url` para `destino`, retomando de onde parou se o arquivo já existir
 * parcialmente. Ao final calcula o sha256 do arquivo INTEIRO — nunca o hash
 * incremental do que passou pela rede, que mentiria sobre o que ficou no disco.
 */
export async function baixar(o: OpcoesDownload): Promise<ResultadoDownload> {
  const inicio = Date.now()
  const tentativasMax = o.tentativasMax ?? 5
  let retomadas = 0

  const cabecalhosBase: Record<string, string> = {}
  if (o.usuario !== undefined) {
    const cred = Buffer.from(`${o.usuario}:${o.senha ?? ''}`).toString('base64')
    cabecalhosBase['Authorization'] = `Basic ${cred}`
  }

  for (let tentativa = 1; tentativa <= tentativasMax; tentativa++) {
    const jaTem = existsSync(o.destino) ? statSync(o.destino).size : 0

    if (o.bytesEsperados !== undefined && jaTem === o.bytesEsperados) break
    if (o.bytesEsperados !== undefined && jaTem > o.bytesEsperados) {
      throw new ErroDeColeta(
        `${o.destino} tem ${String(jaTem)} bytes, mais que os ${String(o.bytesEsperados)} ` +
          `anunciados pela fonte. Arquivo suspeito — a coleta para em vez de adivinhar.`,
      )
    }

    const cabecalhos = { ...cabecalhosBase }
    if (jaTem > 0) cabecalhos['Range'] = `bytes=${String(jaTem)}-`

    try {
      const res = await requisicao(o.url, cabecalhos)
      const status = res.statusCode ?? 0

      if (jaTem > 0 && status === 200) {
        // O servidor ignorou o Range e vai mandar tudo de novo: recomeça limpo,
        // senão o arquivo fica com o começo duplicado no meio.
        res.resume()
        await new Promise<void>((r) => {
          createWriteStream(o.destino).end(() => r())
        })
        retomadas++
        continue
      }
      if (status !== 200 && status !== 206) {
        res.resume()
        throw new ErroDeColeta(`HTTP ${String(status)} em ${o.url}`)
      }

      await new Promise<void>((resolve, reject) => {
        const saida = createWriteStream(o.destino, { flags: jaTem > 0 ? 'a' : 'w' })
        res.pipe(saida)
        res.on('error', reject)
        saida.on('error', reject)
        saida.on('finish', resolve)
      })

      const agora = statSync(o.destino).size
      if (o.bytesEsperados !== undefined && agora < o.bytesEsperados) {
        retomadas++
        continue // caiu no meio: o laço retoma do ponto novo
      }
      break
    } catch (e) {
      if (tentativa === tentativasMax) {
        throw new ErroDeColeta(
          `${o.url}: ${String(e)} — desisti após ${String(tentativasMax)} tentativas`,
        )
      }
      retomadas++
      // Recuo exponencial: 2s, 4s, 8s, 16s.
      await new Promise((r) => setTimeout(r, 2000 * 2 ** (tentativa - 1)))
    }
  }

  const bytes = statSync(o.destino).size
  if (o.bytesEsperados !== undefined && bytes !== o.bytesEsperados) {
    throw new ErroDeColeta(
      `${o.destino}: ${String(bytes)} bytes, esperados ${String(o.bytesEsperados)}. ` +
        `Arquivo truncado NÃO entra na jazida — entraria como se empresas tivessem sumido.`,
    )
  }

  return {
    caminho: o.destino,
    bytes,
    sha256: await hashDoArquivo(o.destino),
    retomadas,
    duracaoMs: Date.now() - inicio,
  }
}
