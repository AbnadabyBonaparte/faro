import { test } from 'node:test'
import assert from 'node:assert/strict'
import { violacoesDaRegraDePedro, type Ficha } from './index.ts'
import { calcularScore, calcularEvLiquido } from '../score/index.ts'

function fichaBase(over: Partial<Ficha> = {}): Ficha {
  const score = calcularScore({
    fitEstrutural: 80, evidenciaTese: 70, recencia: 60,
    qualidadeFontes: 90, intensidadeSinal: 50, confiancaInferencia: 40,
  })
  const n = (v: number | null) => ({ valor: v, selo: 'ESTIMATIVA' as const, origem: 't' })
  return {
    id: 'OP-1', tenantId: 'T-1', teseId: 'TESE-1', teseVersao: 1, eventoId: 'EV-1',
    razaoSocial: 'EMPRESA FICTICIA LTDA', cnpj: '00.000.001/0001-00',
    porteAferido: { especie: 'PROXY', valor: 'Demais', baseDoProxy: 'capital social', limite: 'não é receita' },
    faturamentoAferido: { especie: 'PROXY', valor: null, baseDoProxy: 'não observável', limite: 'não é público por empresa' },
    cadeia: [{
      camada: 'DADO', texto: 'CNPJ ativo', sourceId: 'SRC-001',
      coletadoEm: '2026-08-14', referenteA: '2026-07-31',
      regraDeTransformacao: 'leitura direta', confianca: 1,
      limiteDeInferencia: 'dado observado',
    }],
    grade: 'B', freshness: 'ok', score,
    ev: calcularEvLiquido({
      bruto: n(1000), probElegibilidade: n(0.5), probHomologacao: n(0.5),
      ajustePrazoCaixa: n(1), custoDocumentacao: n(0), honorariosHabilitado: n(0),
    }),
    adjacentes: [],
    porQueNaoPerseguir: [{ codigo: 'sinal_isolado', texto: 'sinal único, sem corroboração' }],
    acao: { texto: 'investigar', estado: 'preparada', autorizadaPor: null, autorizadaEm: null },
    limiteDeInferencia: 'porte é proxy; faturamento não observável',
    publicadaEm: '2026-08-19',
    ...over,
  }
}

test('ficha completa passa na Regra de Pedro', () => {
  assert.deepEqual(violacoesDaRegraDePedro(fichaBase()), [])
})

test('movimento 3: ficha que não argumenta contra si é reprovada', () => {
  const v = violacoesDaRegraDePedro(fichaBase({ porQueNaoPerseguir: [] }))
  assert.equal(v.length, 1)
  assert.match(v[0]!, /movimento 3/)
})

test('movimento 4: ação executada sem autor é reprovada', () => {
  const v = violacoesDaRegraDePedro(fichaBase({
    acao: { texto: 'x', estado: 'executada', autorizadaPor: null, autorizadaEm: null },
  }))
  assert.match(v[0]!, /movimento 4/)
})

test('movimento 1: cadeia vazia e limite em branco são reprovados', () => {
  const v = violacoesDaRegraDePedro(fichaBase({ cadeia: [], limiteDeInferencia: '  ' }))
  assert.equal(v.length, 2)
})
