/**
 * ACESSO AO BANCO — via `psql`, de propósito.
 *
 * Mesma decisão do runner de guardas (tools/src/guards.ts): zero dependência de
 * runtime, e o SQL continua sendo a fonte de verdade. Aqui há um motivo extra e
 * mais forte: a carga da jazida são dezenas de milhões de linhas por coleta, e
 * `COPY FROM STDIN` é a via mais rápida que o Postgres oferece. Nenhum driver
 * npm bate COPY, e vários nem o expõem direito.
 *
 * Contrapartida declarada (Regra de Pedro, movimento 3): isto exige `psql` no
 * PATH. Em Supabase gerenciado o motor roda num worker nosso, então a imagem é
 * nossa — mas se um dia o motor virar Edge Function, este arquivo cai junto.
 */

import { execFileSync, spawn } from 'node:child_process'

export class ErroDeBanco extends Error {}

const BASE = ['-v', 'ON_ERROR_STOP=1', '-X', '-q'] as const

function banco(db?: string): string {
  return db ?? process.env['PGDATABASE'] ?? 'faro'
}

/** Executa SQL e devolve a saída crua. */
export function sql(consulta: string, db?: string): string {
  try {
    return execFileSync('psql', [...BASE, '-d', banco(db), '-c', consulta], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 1024 * 1024 * 64,
    })
  } catch (e) {
    const err = e as { stderr?: string; message?: string }
    throw new ErroDeBanco(err.stderr?.trim() || err.message || String(e))
  }
}

const SEP = String.fromCharCode(0x1f) // unit separator: não aparece em dado da RFB

/** Consulta em modo tuples-only. Uma linha por registro, campos já separados. */
export function linhas(consulta: string, db?: string): string[][] {
  try {
    const saida = execFileSync(
      'psql',
      [...BASE, '-t', '-A', '-F', SEP, '-d', banco(db), '-c', consulta],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1024 * 1024 * 64 },
    )
    return saida
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => l.split(SEP))
  } catch (e) {
    const err = e as { stderr?: string; message?: string }
    throw new ErroDeBanco(err.stderr?.trim() || err.message || String(e))
  }
}

/** Um único valor. `null` quando a consulta não traz linha ou traz vazio. */
export function valor(consulta: string, db?: string): string | null {
  const r = linhas(consulta, db)
  const v = r[0]?.[0]
  return v === undefined || v === '' ? null : v
}

export function escapar(v: string): string {
  return `'${v.replace(/'/g, "''")}'`
}

const BARRA = String.fromCharCode(92)
const TAB = String.fromCharCode(9)
const LF = String.fromCharCode(10)
const CR = String.fromCharCode(13)

function escaparCampoCopy(c: string | null): string {
  if (c === null) return BARRA + 'N'
  return c
    .split(BARRA)
    .join(BARRA + BARRA)
    .split(LF)
    .join(BARRA + 'n')
    .split(CR)
    .join(BARRA + 'r')
    .split(TAB)
    .join(BARRA + 't')
}

export type Copiador = {
  /** Devolve false quando o buffer encheu — aí o chamador precisa de `dreno()`. */
  linha: (campos: readonly (string | null)[]) => boolean
  /** Espera o buffer esvaziar. Sem isto, lote de 60M de linhas estoura a RAM. */
  dreno: () => Promise<void>
  fim: () => Promise<void>
  cancelar: () => void
}

/**
 * Abre um `COPY ... FROM STDIN` e devolve um escritor.
 *
 * Erro no meio do COPY derruba a carga inteira — que é exatamente o que se
 * quer. Meia coleta carregada é PIOR que coleta nenhuma: o diff seguinte leria
 * as linhas que faltaram como `saiu_da_fonte` e o assinante receberia milhares
 * de eventos falsos com aparência de notícia.
 */
export function copiar(destino: string, colunas: readonly string[], db?: string): Copiador {
  const comando = `COPY ${destino} (${colunas.join(', ')}) FROM STDIN`
  const p = spawn('psql', [...BASE, '-d', banco(db), '-c', comando], {
    stdio: ['pipe', 'inherit', 'pipe'],
  })

  let erro = ''
  p.stderr.on('data', (d: Buffer) => {
    erro += d.toString()
  })

  return {
    linha(campos) {
      return p.stdin.write(campos.map(escaparCampoCopy).join(TAB) + LF)
    },
    dreno() {
      return new Promise<void>((resolve) => p.stdin.once('drain', resolve))
    },
    fim() {
      return new Promise<void>((resolve, reject) => {
        p.on('close', (code) => {
          if (code === 0) resolve()
          else reject(new ErroDeBanco(`COPY para ${destino} falhou (${String(code)}): ${erro.trim()}`))
        })
        p.stdin.end()
      })
    },
    cancelar() {
      p.stdin.destroy()
      p.kill()
    },
  }
}
