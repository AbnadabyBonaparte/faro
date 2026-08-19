import { n } from '@/lib/aleatorio'

/**
 * O MISTÉRIO ENCOLHENDO.
 *
 * A área sombreada é o que ainda não se sabe sobre um alvo. Ela não vai a zero
 * — e o gráfico é honesto sobre isso: o FARO organiza evidência para priorizar
 * investigação, não emite parecer. A linha jade é o que já está provado; a
 * faixa acima dela é o que sobra para o profissional habilitado.
 */

const L = 620
const A = 200
const M = { e: 150, d: 16, c: 16, b: 42 }
const PASSOS = ['DADO', 'SINAL', 'INFERÊNCIA', 'TESE', 'FICHA'] as const

export function CurvaMisterio() {
  const x = (i: number) => M.e + ((L - M.e - M.d) * i) / (PASSOS.length - 1)
  // o que se sabe cresce e desacelera; nunca chega ao topo
  const y = (i: number) => {
    const f = [0.08, 0.34, 0.55, 0.68, 0.74][i] ?? 0
    return A - M.b - (A - M.b - M.c) * f
  }

  const linha = PASSOS.map((_, i) => `${i === 0 ? 'M' : 'L'}${n(x(i))} ${n(y(i))}`).join('')
  const area = `${linha}L${n(x(PASSOS.length - 1))} ${M.c}L${n(x(0))} ${M.c}Z`

  return (
    <svg
      viewBox={`0 0 ${L} ${A}`}
      className="block w-full"
      role="img"
      aria-label="A área do que ainda não se sabe encolhe a cada camada, mas nunca chega a zero: o que sobra é trabalho do profissional habilitado."
    >
      <path d={area} className="fill-fresh-warn/10" />
      <path d={`M${n(M.e)} ${M.c}H${n(L - M.d)}`} className="stroke-border" strokeWidth={1} strokeDasharray="3 5" />
      <text x={L - M.d} y={M.c - 4} textAnchor="end" className="fill-text-muted font-mono text-[10px] tracking-[0.14em]">
        CERTEZA QUE O FARO NÃO PROMETE
      </text>
      <path d={linha} fill="none" className="stroke-signal" strokeWidth={1.5} />
      {PASSOS.map((p, i) => (
        <g key={p}>
          <circle cx={x(i)} cy={y(i)} r={3} className="fill-signal" />
          <text
            x={x(i)} y={A - 22} textAnchor={i === 0 ? 'start' : i === PASSOS.length - 1 ? 'end' : 'middle'}
            className="fill-text-muted font-mono text-[10px] tracking-[0.14em]"
          >
            {p}
          </text>
        </g>
      ))}
      <text x={0} y={M.c + 10} className="fill-text-muted font-mono text-[10px] tracking-[0.14em]">
        O QUE FALTA SABER
      </text>
      <text x={0} y={A - M.b + 4} className="fill-signal font-mono text-[10px] tracking-[0.14em]">
        O QUE JÁ ESTÁ PROVADO
      </text>
    </svg>
  )
}
