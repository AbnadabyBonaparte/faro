/**
 * RUNNER DAS GUARDAS DE FUNDAÇÃO
 *
 * Cria um banco limpo, aplica TODAS as migrations na ordem e roda cada guarda.
 * Qualquer reprovação derruba o processo com código != 0 — o CI cai.
 *
 * Usa `psql` em vez de driver npm de propósito: zero dependência de runtime, e
 * o SQL continua sendo a fonte de verdade. O que o CI roda é o mesmo arquivo
 * que o Supabase vai aplicar.
 *
 * Uso:  node --experimental-strip-types src/guards.ts
 * Env:  PGHOST PGPORT PGUSER PGPASSWORD (padrões locais se ausentes)
 */

import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = resolve(AQUI, '..', '..')
const MIGRATIONS = join(RAIZ, 'packages', 'db', 'migrations')
const GUARDAS = join(RAIZ, 'tools', 'sql')

const DB = process.env['FARO_TEST_DB'] ?? 'faro_guardas'

function psql(args: string[], db?: string): string {
  return execFileSync(
    'psql',
    ['-v', 'ON_ERROR_STOP=1', '-X', '-q', ...(db ? ['-d', db] : []), ...args],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  )
}

function titulo(t: string): void {
  console.log(`\n\x1b[1m${t}\x1b[0m`)
}

let falhou = false

try {
  titulo('▸ preparando banco limpo')
  psql(['-c', `DROP DATABASE IF EXISTS ${DB}`], 'postgres')
  psql(['-c', `CREATE DATABASE ${DB}`], 'postgres')
  console.log(`  banco ${DB} criado`)

  titulo('▸ aplicando migrations')
  const migrations = readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort()
  if (migrations.length === 0) throw new Error('nenhuma migration encontrada')
  for (const m of migrations) {
    psql(['-f', join(MIGRATIONS, m)], DB)
    console.log(`  ✓ ${m}`)
  }

  titulo('▸ rodando guardas')
  const guardas = readdirSync(GUARDAS).filter((f) => f.endsWith('.sql')).sort()
  for (const g of guardas) {
    try {
      const saida = psql(['-f', join(GUARDAS, g)], DB)
      console.log(`\n  \x1b[32m✓ ${g}\x1b[0m`)
      const corpo = saida.trim()
      if (corpo) console.log(corpo.split('\n').map((l) => `    ${l}`).join('\n'))
    } catch (e) {
      falhou = true
      const err = e as { stderr?: string; message?: string }
      console.error(`\n  \x1b[31m✗ ${g} REPROVADA\x1b[0m`)
      console.error((err.stderr ?? err.message ?? '').split('\n').map((l) => `    ${l}`).join('\n'))
    }
  }
} catch (e) {
  falhou = true
  const err = e as { stderr?: string; message?: string }
  console.error('\n\x1b[31mERRO ao preparar o ambiente das guardas\x1b[0m')
  console.error(err.stderr ?? err.message ?? String(e))
}

titulo(falhou ? '\x1b[31m✗ GUARDAS REPROVADAS\x1b[0m' : '\x1b[32m✓ TODAS AS GUARDAS PASSARAM\x1b[0m')
process.exit(falhou ? 1 : 0)
