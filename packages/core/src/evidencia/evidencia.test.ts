import { test } from 'node:test'
import assert from 'node:assert/strict'
import { derivarGrade, ehFato, type Aferido } from './index.ts'

test('grade deriva da composição dos níveis', () => {
  assert.equal(derivarGrade(['E1', 'E1', 'E2']), 'A')
  assert.equal(derivarGrade(['E1', 'E2']), 'B')
  assert.equal(derivarGrade(['E1']), 'C')
  assert.equal(derivarGrade(['E2', 'E2']), 'C')
  assert.equal(derivarGrade(['E3', 'E3', 'E3']), 'D', 'E3 sozinho nunca passa de D')
})

test('proxy não se lê como fato sem desambiguar', () => {
  const proxy: Aferido<number> = {
    especie: 'PROXY', valor: null,
    baseDoProxy: 'capital social', limite: 'capital não é receita',
  }
  assert.equal(ehFato(proxy), false)
  const fato: Aferido<number> = { especie: 'FATO', valor: 42 }
  assert.equal(ehFato(fato), true)
})
