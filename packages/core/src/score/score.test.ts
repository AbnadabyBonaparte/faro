import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  calcularScore,
  calcularEvLiquido,
  totalConfere,
  ScoreInvalido,
  PESOS_V1,
  DIMENSOES,
  type Dimensoes,
} from './index.ts'

const D: Dimensoes = {
  fitEstrutural: 94,
  evidenciaTese: 88,
  recencia: 92,
  qualidadeFontes: 96,
  intensidadeSinal: 85,
  confiancaInferencia: 74,
}

test('o total é derivado das parcelas, não digitado', () => {
  const s = calcularScore(D)
  const somaManual = DIMENSOES.reduce((a, k) => a + D[k] * PESOS_V1[k], 0)
  assert.equal(s.total, Math.round(somaManual))
  assert.ok(totalConfere(s))
  assert.equal(s.parcelas.length, 6)
})

test('total injetado na entrada é ignorado — a Lei 4 não tem porta dos fundos', () => {
  // Contra-prova da Lei 4: mesmo que alguém enfie um `total` no objeto de
  // entrada, ele não é lido. O resultado continua vindo só das 6 dimensões.
  const envenenado = { ...D, total: 999, score: 999 } as unknown as Dimensoes
  const s = calcularScore(envenenado)
  assert.equal(s.total, calcularScore(D).total)
  assert.notEqual(s.total, 999)
  // E o objeto devolvido só expõe as 6 dimensões conhecidas.
  assert.deepEqual(
    s.parcelas.map((p) => p.dimensao).sort(),
    [...DIMENSOES].sort(),
  )
})

test('dimensão fora de 0..100 é reprovada', () => {
  assert.throws(() => calcularScore({ ...D, recencia: 140 }), ScoreInvalido)
  assert.throws(() => calcularScore({ ...D, recencia: -1 }), ScoreInvalido)
})

test('total adulterado é detectado por totalConfere', () => {
  const s = calcularScore(D)
  const adulterado = { ...s, total: 99 }
  assert.equal(totalConfere(adulterado), false)
})

test('EV líquido herda o PIOR selo dos componentes', () => {
  const n = (valor: number, selo: 'MEDIDO' | 'ESTIMATIVA' | 'NAO_VERIFICADO') => ({
    valor,
    selo,
    origem: 'teste',
  })
  const ev = calcularEvLiquido({
    bruto: n(1_000_000, 'ESTIMATIVA'),
    probElegibilidade: n(0.6, 'MEDIDO'),
    probHomologacao: n(0.7, 'MEDIDO'),
    ajustePrazoCaixa: n(0.9, 'MEDIDO'),
    custoDocumentacao: n(10_000, 'MEDIDO'),
    honorariosHabilitado: n(50_000, 'MEDIDO'),
  })
  assert.equal(ev.selo, 'ESTIMATIVA', 'otimismo não se propaga')
  assert.equal(ev.valor, 1_000_000 * 0.6 * 0.7 * 0.9 - 10_000 - 50_000)
})

test('EV sem componente é null com motivo, nunca zero silencioso', () => {
  const n = (valor: number | null) => ({ valor, selo: 'ESTIMATIVA' as const, origem: 't' })
  const ev = calcularEvLiquido({
    bruto: n(null),
    probElegibilidade: n(0.6),
    probHomologacao: n(0.7),
    ajustePrazoCaixa: n(0.9),
    custoDocumentacao: n(0),
    honorariosHabilitado: n(0),
  })
  assert.equal(ev.valor, null)
  assert.match(ev.motivoIndisponivel ?? '', /não calculável/)
})
