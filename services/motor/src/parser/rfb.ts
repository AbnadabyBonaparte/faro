/**
 * PARSER DO LAYOUT OFICIAL DA RFB.
 *
 * 🔴 A LEI DESTE ARQUIVO: **layout divergente PARA a coleta.**
 *
 * Achado do Banco de Evolução: parser que "se vira" com layout novo entrega
 * dado errado com cara de dado certo. Se a RFB acrescentar uma coluna, o parser
 * complacente desloca todos os campos em um — e o CNAE de uma empresa vira o
 * CEP de outra, com o mesmo ar de fato aferido. Aqui isso derruba a coleta, a
 * fonte cai para `degradada` e o erro é declarado.
 *
 * O layout esperado NÃO mora aqui: mora em `fontes.layouts`, no banco, com a
 * data em que foi conferido contra bytes reais. Este módulo confere contra ele.
 */

import { createHash } from 'node:crypto'
import { lerCsv } from './csv.ts'
import type { Readable } from 'node:stream'

export class LayoutDivergente extends Error {
  // Campos explícitos, não parameter properties: `node --experimental-strip-types`
  // só REMOVE tipos, não gera código, e parameter property exigiria geração.
  readonly conjunto: string
  readonly esperado: number
  readonly obtido: number
  readonly linha: number
  readonly amostra: string

  constructor(
    conjunto: string,
    esperado: number,
    obtido: number,
    linha: number,
    amostra: string,
  ) {
    super(
      `layout de "${conjunto}" divergiu: esperadas ${String(esperado)} colunas, ` +
        `vieram ${String(obtido)} na linha ${String(linha)}. ` +
        `A coleta PARA — parser que adivinha entrega dado errado com cara de certo. ` +
        `Amostra: ${amostra}`,
    )
    this.name = 'LayoutDivergente'
    this.conjunto = conjunto
    this.esperado = esperado
    this.obtido = obtido
    this.linha = linha
    this.amostra = amostra
  }
}

export type Layout = {
  readonly conjunto: string
  readonly colunas: readonly string[]
  readonly indicesDaChave: readonly number[]
  readonly colunasIngeridas: readonly string[]
  /** SUBSTRING que identifica o membro dentro do zip. Ver `conferirMembro`. */
  readonly padraoArquivo: string
}

/**
 * Confere que o arquivo dentro do zip é o que se espera.
 *
 * É SUBSTRING, não sufixo — descoberta contra bytes reais: os três conjuntos da
 * RFB não seguem o mesmo padrão de nome.
 *
 *   empresas          K3241.K03200Y1.D60711.EMPRECSV
 *   estabelecimentos  K3241.K03200Y1.D60711.ESTABELE
 *   simples           F.K03200$W.SIMPLES.CSV.D60808   ← identificador no MEIO
 *
 * Sem esta checagem, baixar Empresas e carregar como se fosse Simples daria
 * erro de contagem de colunas — mas dois conjuntos com o mesmo número de
 * colunas (empresas e simples têm 7) passariam batido, e o cadastro inteiro
 * entraria trocado.
 */
export function conferirMembro(nomeDoMembro: string, layout: Layout): void {
  if (!nomeDoMembro.includes(layout.padraoArquivo)) {
    throw new LayoutDivergente(
      layout.conjunto,
      0,
      0,
      0,
      `membro "${nomeDoMembro}" não contém "${layout.padraoArquivo}"`,
    )
  }
}

export type Registro = {
  readonly chaveNatural: string
  readonly payload: Readonly<Record<string, string>>
  readonly hash: string
}

/**
 * O hash é do PAYLOAD INGERIDO, não da linha crua.
 *
 * Consequência declarada (Regra de Pedro, movimento 3): mudança numa coluna que
 * não ingerimos — um telefone, um complemento de endereço — não muda o hash e
 * não vira evento. Isso é decisão, não descuido: o FARO promete eventos que
 * movem tese, e "mudou o telefone" não move nenhuma. Se um dia mover, a coluna
 * entra em `colunasIngeridas` e passa a contar.
 */
function hashDoPayload(payload: Record<string, string>, colunas: readonly string[]): string {
  const h = createHash('sha256')
  for (const c of colunas) {
    h.update(c)
    h.update('=')
    h.update(payload[c] ?? '')
    h.update(';')
  }
  return h.digest('hex')
}

export type ResultadoParse = {
  readonly linhas: number
  readonly bytesPayload: number
}

/**
 * Lê o CSV e entrega registro por registro. Confere o número de colunas em
 * TODA linha — não só na primeira: layout que muda no meio do arquivo existe,
 * e conferir só a amostra é conferir a sorte.
 */
export async function* lerRfb(
  entrada: Readable,
  layout: Layout,
): AsyncGenerator<Registro, void, void> {
  let n = 0
  for await (const campos of lerCsv(entrada)) {
    n++
    // Linha vazia no fim do arquivo não é divergência de layout.
    if (campos.length === 1 && campos[0] === '') continue

    if (campos.length !== layout.colunas.length) {
      throw new LayoutDivergente(
        layout.conjunto,
        layout.colunas.length,
        campos.length,
        n,
        campos.slice(0, 4).join(' | ').slice(0, 200),
      )
    }

    const payload: Record<string, string> = {}
    for (const nome of layout.colunasIngeridas) {
      const i = layout.colunas.indexOf(nome)
      if (i < 0) {
        throw new Error(
          `coluna ingerida "${nome}" não existe no layout de "${layout.conjunto}"`,
        )
      }
      payload[nome] = campos[i] ?? ''
    }

    const chaveNatural = layout.indicesDaChave.map((i) => campos[i] ?? '').join('')
    if (chaveNatural === '') {
      throw new Error(
        `linha ${String(n)} de "${layout.conjunto}" sem chave natural — ` +
          `registro sem chave não tem como ser diferenciado na coleta seguinte`,
      )
    }

    yield {
      chaveNatural,
      payload,
      hash: hashDoPayload(payload, layout.colunasIngeridas),
    }
  }
}
