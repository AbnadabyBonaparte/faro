import { n, semear } from '@/lib/aleatorio'

/**
 * O FUNIL DAS CAMADAS — o gráfico vivo da home.
 *
 * Não é ilustração de funil: é o funil CONTADO. Cada traço cinza é um registro
 * que não passou da camada; o traço jade é o que passou. Se a densidade mudar,
 * o desenho muda junto, porque o desenho é a contagem.
 *
 * Movimento: o fio jade se desenha UMA vez, devagar, e para. Canon manda
 * "movimento quase zero" (IDENTIDADE-VISUAL §6) — e quem pediu menos
 * movimento no sistema operacional recebe nenhum.
 */

const CAMADAS = [
  { nome: 'DADO', densidade: 130, glosa: 'o cadastro público, cru, como a fonte publicou' },
  { nome: 'SINAL', densidade: 46, glosa: 'o que mudou entre dois lotes — a diferença, não o retrato' },
  { nome: 'INFERÊNCIA', densidade: 17, glosa: 'o que a mudança sugere, com o limite declarado' },
  { nome: 'TESE', densidade: 5, glosa: 'o padrão que o assinante ensinou o FARO a procurar' },
  { nome: 'OPORTUNIDADE', densidade: 0, glosa: 'a ficha: um evento, uma empresa, um porquê' },
] as const

const L = 1000
const VAO = 96
const ALTURA_FAIXA = VAO * 0.68
const A = VAO * CAMADAS.length
const X0 = 168 // no mobile os rótulos somem (a lista de glosas já os nomeia)
const LARG = L - X0 - 24
const EIXO = X0 + LARG * 0.62

export function FunilCamadas() {
  const r = semear(7311)
  const trilha: Array<[number, number]> = []
  const faixas = CAMADAS.map((camada, i) => {
    const y = VAO * i
    const meio = y + ALTURA_FAIXA / 2
    const marcas: Array<{ x: number; h: number; o: number }> = []
    for (let k = 0; k < camada.densidade; k += 1) {
      marcas.push({
        x: X0 + 10 + r() * (LARG - 20),
        h: ALTURA_FAIXA * (0.26 + r() * 0.44),
        o: 0.14 + r() * 0.26,
      })
    }
    const xs = EIXO + (r() - 0.5) * LARG * 0.045
    trilha.push([xs, meio])
    return { camada, y, meio, marcas, xs }
  })

  const entrada = -VAO * 0.24
  const d = [`M${n(trilha[0]![0])} ${n(entrada)}`]
  trilha.forEach(([x, y], i) => {
    const [xa, ya] = i === 0 ? [trilha[0]![0], entrada] : trilha[i - 1]!
    d.push(
      `C${n(xa)} ${n(ya + (y - ya) * 0.55)} ${n(x)} ${n(y - (y - ya) * 0.55)} ${n(x)} ${n(y)}`,
    )
  })
  const [ux, uy] = trilha[trilha.length - 1]!
  d.push(`L${n(ux)} ${n(uy + VAO * 0.34)}`)

  return (
    <svg
      viewBox={`0 -${VAO * 0.3} ${L} ${A + VAO * 0.5}`}
      className="block w-full"
      role="img"
      aria-label="As cinco camadas do FARO: de DADO, a camada mais densa, até OPORTUNIDADE, onde sobra um único registro. Um traço destaca o caminho de um evento descendo as camadas."
    >
      <style>{`
        .fio { stroke-dasharray: 700; stroke-dashoffset: 700; animation: desce 2.6s ease-out 0.3s forwards; }
        .ponto { opacity: 0; animation: acende 0.5s ease-out 2.7s forwards; }
        @keyframes desce { to { stroke-dashoffset: 0 } }
        @keyframes acende { to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .fio { animation: none; stroke-dashoffset: 0 }
          .ponto { animation: none; opacity: 1 }
        }
      `}</style>

      {faixas.map(({ camada, y, meio, marcas, xs }) => (
        <g key={camada.nome}>
          <rect
            x={X0} y={y} width={LARG} height={ALTURA_FAIXA} rx={3}
            className="fill-surface/60 stroke-border" strokeWidth={1}
          />
          <text
            x={X0 - 16} y={meio + 4} textAnchor="end"
            className="fill-text-muted font-mono text-[15px] tracking-[0.18em] max-sm:hidden"
          >
            {camada.nome}
          </text>
          {marcas.map((m, k) => (
            <path
              key={k}
              d={`M${n(m.x)} ${n(meio - m.h / 2)}V${n(meio + m.h / 2)}`}
              className="stroke-text-secondary" strokeWidth={1} opacity={m.o}
            />
          ))}
          <path
            d={`M${n(xs)} ${n(meio - ALTURA_FAIXA * 0.4)}V${n(meio + ALTURA_FAIXA * 0.4)}`}
            className="stroke-signal" strokeWidth={1.5}
          />
        </g>
      ))}

      <path d={d.join('')} fill="none" className="fio stroke-signal/60" strokeWidth={1.5} />
      <circle cx={ux} cy={uy} r={5} className="ponto fill-signal" />
    </svg>
  )
}

export const GLOSAS = CAMADAS.map((c) => ({ nome: c.nome, glosa: c.glosa }))
