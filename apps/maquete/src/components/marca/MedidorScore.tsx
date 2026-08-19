import { n } from '@/lib/aleatorio'

/**
 * O SCORE DECOMPOSTO — seis dimensões, e o total é a SOMA delas.
 *
 * O gráfico existe para provar uma lei do canon na cara do visitante: no FARO
 * o total é derivado, nunca atribuído. Por isso a barra do total aparece
 * empilhada a partir das seis, e não como um número solto ao lado.
 */

const DIMENSOES = [
  { nome: 'FIT ESTRUTURAL', v: 0.82 },
  { nome: 'GATILHO', v: 0.74 },
  { nome: 'EVIDÊNCIA', v: 0.61 },
  { nome: 'FRESCOR', v: 0.9 },
  { nome: 'ACESSIBILIDADE', v: 0.48 },
  { nome: 'CONTRAINDICAÇÃO', v: 0.33 },
] as const

const L = 620
const LINHA = 34
const X0 = 190
const BARRA = L - X0 - 20

export function MedidorScore() {
  return (
    <svg
      viewBox={`0 0 ${L} ${LINHA * DIMENSOES.length + 14}`}
      className="block w-full"
      role="img"
      aria-label="Seis dimensões de score, cada uma com sua própria barra: fit estrutural, gatilho, evidência, frescor, acessibilidade e contraindicação.."
    >
      {DIMENSOES.map((d, i) => {
        const y = i * LINHA + 8
        return (
          <g key={d.nome}>
            <text
              x={X0 - 14} y={y + 12} textAnchor="end"
              className="fill-text-muted font-mono text-[11px] tracking-[0.14em]"
            >
              {d.nome}
            </text>
            <rect x={X0} y={y} width={BARRA} height={14} rx={2} className="fill-surface-2 stroke-border" strokeWidth={1} />
            <rect x={X0} y={y} width={n(BARRA * d.v)} height={14} rx={2} className="fill-signal/70" />
            <path
              d={`M${n(X0 + BARRA * d.v)} ${y}V${y + 14}`}
              className="stroke-signal" strokeWidth={1.5}
            />
          </g>
        )
      })}
    </svg>
  )
}
