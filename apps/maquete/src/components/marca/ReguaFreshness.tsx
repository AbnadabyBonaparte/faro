/**
 * A RÉGUA DE FRESCOR — a mesma afirmação envelhecendo.
 *
 * A escala funcional do canon não é decoração: verde não quer dizer "bom",
 * quer dizer "coletado agora". Vermelho não quer dizer "ruim", quer dizer
 * "velho demais para agir sem reconferir". O gráfico mostra o tempo passando
 * sobre UMA linha, não quatro linhas diferentes.
 */

const ETAPAS = [
  { rotulo: 'COLETADO HOJE', classe: 'fill-fresh-ok' },
  { rotulo: 'ENVELHECENDO', classe: 'fill-fresh-warn' },
  { rotulo: 'PEDE RECONFERÊNCIA', classe: 'fill-fresh-stale' },
  { rotulo: 'NÃO AGIR SEM RECOLETAR', classe: 'fill-fresh-old' },
] as const

const L = 620
const A = 96
const CAIXA = (L - 24 * 3 - 8) / 4

export function ReguaFreshness() {
  return (
    <svg
      viewBox={`0 0 ${L} ${A}`}
      className="block w-full"
      role="img"
      aria-label="A mesma afirmação em quatro idades: coletada hoje, envelhecendo, pedindo reconferência e velha demais para agir sem recoletar."
    >
      {ETAPAS.map((e, i) => {
        const x = 4 + i * (CAIXA + 24)
        return (
          <g key={e.rotulo}>
            <rect x={x} y={10} width={CAIXA} height={30} rx={2} className="fill-surface stroke-border" strokeWidth={1} />
            <rect x={x} y={10} width={4} height={30} className={e.classe} />
            <rect x={x + 16} y={20} width={CAIXA * 0.6} height={4} rx={2} className="fill-text-muted/50" />
            <rect x={x + 16} y={29} width={CAIXA * 0.38} height={4} rx={2} className="fill-text-muted/30" />
            <text
              x={x} y={62}
              className="fill-text-muted font-mono text-[10px] tracking-[0.12em]"
            >
              {e.rotulo}
            </text>
            {i < ETAPAS.length - 1 && (
              <path
                d={`M${x + CAIXA + 6} 25H${x + CAIXA + 18}`}
                className="stroke-border-strong" strokeWidth={1}
              />
            )}
          </g>
        )
      })}
      <path d={`M4 84H${L - 4}`} className="stroke-border" strokeWidth={1} />
      <text x={4} y={94} className="fill-text-muted font-mono text-[10px] tracking-[0.12em]">
        O TEMPO CORRE PARA A DIREITA
      </text>
    </svg>
  )
}
