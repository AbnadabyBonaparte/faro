/**
 * TESTES DO LEITOR DE CSV.
 *
 * Todos usam bytes fabricados: rodam no CI sem rede e sem os 7,7 GB da RFB.
 * A prova contra dados reais é outra, e está no relatório da Onda 2 — as duas
 * são necessárias, e nenhuma substitui a outra.
 */

import { strict as assert } from 'node:assert'
import test from 'node:test'
import { Readable } from 'node:stream'

import { lerCsv } from './csv.ts'
import { conferirMembro, lerRfb, LayoutDivergente, type Layout } from './rfb.ts'

function stream(texto: string, encoding: BufferEncoding = 'latin1'): Readable {
  return Readable.from([Buffer.from(texto, encoding)])
}

async function todas(r: Readable): Promise<string[][]> {
  const saida: string[][] = []
  for await (const linha of lerCsv(r)) saida.push(linha)
  return saida
}

test('lê o formato real da RFB: tudo entre aspas, ; de delimitador', async () => {
  const linhas = await todas(
    stream('"00000000";"BANCO DO BRASIL SA";"2038";"10";"120000000000,00";"05";""\n'),
  )
  assert.equal(linhas.length, 1)
  assert.deepEqual(linhas[0], [
    '00000000',
    'BANCO DO BRASIL SA',
    '2038',
    '10',
    '120000000000,00',
    '05',
    '',
  ])
})

test('ponto-e-vírgula DENTRO do campo não vira coluna nova', async () => {
  // É por isso que existe uma máquina de estados em vez de split(';').
  // Em 60 milhões de linhas, o caso raro acontece milhares de vezes.
  const linhas = await todas(stream('"12345678";"ALFA; BETA E CIA LTDA";"01"\n'))
  assert.deepEqual(linhas[0], ['12345678', 'ALFA; BETA E CIA LTDA', '01'])
})

test('aspa dupla escapada vira uma aspa só', async () => {
  const linhas = await todas(stream('"12345678";"BAR DO ""ZE"" LTDA"\n'))
  assert.deepEqual(linhas[0], ['12345678', 'BAR DO "ZE" LTDA'])
})

test('latin1 é decodificado como latin1, não como UTF-8', async () => {
  // A RFB publica em ISO-8859-1. Ler como UTF-8 produziria "CONSTRU��O".
  const linhas = await todas(stream('"12345678";"CONSTRUÇÃO E COMÉRCIO"\n'))
  assert.equal(linhas[0]?.[1], 'CONSTRUÇÃO E COMÉRCIO')
})

test('CRLF não deixa carriage return colado no último campo', async () => {
  const linhas = await todas(stream('"a";"b"\r\n"c";"d"\r\n'))
  assert.deepEqual(linhas, [
    ['a', 'b'],
    ['c', 'd'],
  ])
})

test('última linha sem quebra no fim do arquivo não se perde', async () => {
  const linhas = await todas(stream('"a";"b"\n"c";"d"'))
  assert.equal(linhas.length, 2)
  assert.deepEqual(linhas[1], ['c', 'd'])
})

test('linha partida entre dois pedaços do stream continua uma linha só', async () => {
  // O arquivo chega em blocos de 64 KB; a fronteira cai no meio de um campo o
  // tempo todo. Se o leitor perdesse o estado aqui, o erro seria raro e mudo.
  const r = Readable.from([
    Buffer.from('"1234', 'latin1'),
    Buffer.from('5678";"RAZAO SO', 'latin1'),
    Buffer.from('CIAL"\n', 'latin1'),
  ])
  assert.deepEqual(await todas(r), [['12345678', 'RAZAO SOCIAL']])
})

/* ────────────────────────────────────────────────────────────────────────── */

const LAYOUT_EMPRESAS: Layout = {
  conjunto: 'empresas',
  colunas: [
    'cnpj_basico',
    'razao_social',
    'natureza_juridica',
    'qualificacao_responsavel',
    'capital_social',
    'porte',
    'ente_federativo_responsavel',
  ],
  indicesDaChave: [0],
  colunasIngeridas: ['cnpj_basico', 'razao_social', 'natureza_juridica', 'porte'],
  padraoArquivo: 'EMPRECSV',
}

async function registros(texto: string, layout = LAYOUT_EMPRESAS) {
  const saida = []
  for await (const r of lerRfb(stream(texto), layout)) saida.push(r)
  return saida
}

test('parser monta chave natural e payload só com o que é ingerido', async () => {
  const [r] = await registros('"00000000";"BANCO DO BRASIL SA";"2038";"10";"120000,00";"05";""\n')
  assert.equal(r?.chaveNatural, '00000000')
  assert.deepEqual(r?.payload, {
    cnpj_basico: '00000000',
    razao_social: 'BANCO DO BRASIL SA',
    natureza_juridica: '2038',
    porte: '05',
  })
  // capital_social não entra: nenhuma tese do MVP o usa, e são bytes em 60M de linhas.
  assert.equal('capital_social' in (r?.payload ?? {}), false)
})

test('coluna a mais PARA a coleta em vez de deslocar os campos', async () => {
  // Este é o defeito que o parser complacente cometeria em silêncio: com uma
  // coluna nova, o porte de uma empresa passaria a ser lido da coluna anterior.
  await assert.rejects(
    () => registros('"00000000";"X";"2038";"10";"1,00";"05";"";"COLUNA NOVA"\n'),
    LayoutDivergente,
  )
})

test('coluna a menos também para', async () => {
  await assert.rejects(() => registros('"00000000";"X";"2038"\n'), LayoutDivergente)
})

test('layout é conferido em TODA linha, não só na primeira', async () => {
  // Layout que muda no meio do arquivo existe. Conferir só a amostra é
  // conferir a sorte.
  const bom = '"00000000";"X";"2038";"10";"1,00";"05";""\n'
  const ruim = '"00000001";"Y";"2038";"10";"1,00";"05";"";"A MAIS"\n'
  await assert.rejects(() => registros(bom + bom + ruim), LayoutDivergente)
})

test('o hash muda quando muda campo ingerido', async () => {
  const [a] = await registros('"00000000";"X";"2038";"10";"1,00";"05";""\n')
  const [b] = await registros('"00000000";"X";"2038";"10";"1,00";"03";""\n')
  assert.notEqual(a?.hash, b?.hash)
})

test('o hash NÃO muda quando muda campo não-ingerido — e isso é decisão declarada', async () => {
  // Consequência assumida: mudança em coluna que não ingerimos não vira evento.
  // O FARO promete evento que move tese; capital social declarado não move
  // nenhuma das teses do MVP. Se um dia mover, a coluna entra em
  // colunasIngeridas e passa a contar.
  const [a] = await registros('"00000000";"X";"2038";"10";"1,00";"05";""\n')
  const [b] = await registros('"00000000";"X";"2038";"10";"999,00";"05";""\n')
  assert.equal(a?.hash, b?.hash)
})

test('registro sem chave natural para a coleta', async () => {
  await assert.rejects(() => registros('"";"X";"2038";"10";"1,00";"05";""\n'), /sem chave natural/)
})

test('chave natural composta concatena na ordem declarada', async () => {
  const layout: Layout = {
    conjunto: 'estabelecimentos',
    colunas: ['cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'situacao_cadastral'],
    indicesDaChave: [0, 1, 2],
    colunasIngeridas: ['cnpj_basico', 'situacao_cadastral'],
    padraoArquivo: 'ESTABELE',
  }
  const [r] = await registros('"07396865";"0001";"68";"08"\n', layout)
  assert.equal(r?.chaveNatural, '07396865000168')
})

test('o padrão do membro é SUBSTRING, não sufixo — o Simples exige isso', () => {
  // Achado contra bytes reais: o membro do zip do Simples é
  // `F.K03200$W.SIMPLES.CSV.D60808` — o identificador fica no MEIO do nome.
  const simples: Layout = { ...LAYOUT_EMPRESAS, conjunto: 'simples', padraoArquivo: 'SIMPLES.CSV' }
  conferirMembro('F.K03200$W.SIMPLES.CSV.D60808', simples)
  conferirMembro('K3241.K03200Y1.D60711.EMPRECSV', LAYOUT_EMPRESAS)
})

test('carregar o conjunto errado é recusado pelo nome do membro', () => {
  // Empresas e Simples têm 7 colunas cada: a checagem de colunas NÃO pegaria a
  // troca, e o cadastro inteiro entraria trocado na jazida.
  const simples: Layout = { ...LAYOUT_EMPRESAS, conjunto: 'simples', padraoArquivo: 'SIMPLES.CSV' }
  assert.throws(() => conferirMembro('K3241.K03200Y1.D60711.EMPRECSV', simples), LayoutDivergente)
})
