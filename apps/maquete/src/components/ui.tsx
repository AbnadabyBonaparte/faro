import { cn } from '@/lib/cn'
import {
  type Afirmacao,
  type Camada,
  type Freshness,
  type Grade,
  type ScoreDimensoes,
  PESOS,
  ROTULOS_DIMENSAO,
  calcularScore,
  faixaScore,
  fonte,
} from '@/data/mock'

/* ── Painel: a superfície de instrumento. Borda antes de sombra. ─────────── */

export function Painel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-instrument)] border border-border bg-surface',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function PainelHead({
  titulo,
  meta,
  acao,
}: {
  titulo: string
  meta?: string
  acao?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-3">
      <h2 className="text-sm font-semibold tracking-wide text-text uppercase">
        {titulo}
      </h2>
      {meta ? (
        <p className="num text-[11px] text-text-secondary">{meta}</p>
      ) : null}
      {acao}
    </header>
  )
}

/* ── Rótulo de camada: a Lei das Camadas tem que ser VISÍVEL. Canon §3. ──── */

const ESTILO_CAMADA: Record<Camada, string> = {
  DADO: 'border-border-strong text-text',
  SINAL: 'border-signal text-signal',
  'INFERÊNCIA': 'border-fresh-warn text-fresh-warn',
  TESE: 'border-border-strong text-text-secondary',
  OPORTUNIDADE: 'border-signal bg-signal text-signal-fg',
}

export function TagCamada({ camada }: { camada: Camada }) {
  return (
    <span
      className={cn(
        'num inline-block shrink-0 rounded-[var(--radius-instrument)] border px-1.5 py-0.5 text-[10px] font-semibold tracking-widest',
        ESTILO_CAMADA[camada],
      )}
    >
      {camada}
    </span>
  )
}

/* ── Evidence Grade: peso e tipografia, NUNCA cor. Canon §6.2 ────────────── */

export function BadgeGrade({ grade }: { grade: Grade }) {
  return (
    <span
      className="num inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-instrument)] border border-border-strong bg-surface-2 text-xs font-bold text-text"
      title={`Evidence Grade ${grade} — composição dos níveis E1/E2/E3 das evidências`}
    >
      {grade}
    </span>
  )
}

/* ── Freshness: o sinal está vivo? Canon §7.2 ────────────────────────────── */

const FRESH: Record<Freshness, { cor: string; rotulo: string }> = {
  ok: { cor: 'bg-fresh-ok', rotulo: 'Atual' },
  warn: { cor: 'bg-fresh-warn', rotulo: 'Recente' },
  stale: { cor: 'bg-fresh-stale', rotulo: 'Desatualizando' },
  old: { cor: 'bg-fresh-old', rotulo: 'Fonte antiga' },
}

export function SeloFreshness({
  freshness,
  comRotulo = true,
}: {
  freshness: Freshness
  comRotulo?: boolean
}) {
  const f = FRESH[freshness]
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn('h-2 w-2 shrink-0 rounded-full', f.cor)}
        aria-hidden
      />
      {comRotulo ? (
        <span className="text-[11px] text-text-secondary">{f.rotulo}</span>
      ) : (
        <span className="sr-only">{f.rotulo}</span>
      )}
    </span>
  )
}

/* ── Score decomposto. Canon §4: nunca "a IA deu 87". ────────────────────── */

export function ScoreDecomposto({
  dimensoes,
  criteriosAtendidos,
  criteriosTotais,
  evidenciasIndependentes,
  sinaisRecentes,
}: {
  dimensoes: ScoreDimensoes
  criteriosAtendidos: number
  criteriosTotais: number
  evidenciasIndependentes: number
  sinaisRecentes: number
}) {
  const total = calcularScore(dimensoes)
  const chaves = Object.keys(PESOS) as (keyof ScoreDimensoes)[]

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-3">
        <span className="num text-3xl leading-none font-bold text-signal">
          {total}
        </span>
        <span className="num text-sm text-text-muted">/100</span>
        <span className="text-xs text-text-secondary">{faixaScore(total)}</span>
      </div>

      <p className="text-xs leading-relaxed text-text-secondary">
        <span className="num text-text">{total}</span> porque cumpriu{' '}
        <span className="num text-text">
          {criteriosAtendidos} de {criteriosTotais}
        </span>{' '}
        critérios, tem{' '}
        <span className="num text-text">{evidenciasIndependentes}</span>{' '}
        evidências independentes e{' '}
        <span className="num text-text">{sinaisRecentes}</span>{' '}
        {sinaisRecentes === 1 ? 'sinal recente' : 'sinais recentes'}. O total é a
        soma ponderada das dimensões abaixo — não um número atribuído.
      </p>

      <ul className="space-y-1.5">
        {chaves.map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span className="w-40 shrink-0 text-[11px] text-text-secondary">
              {ROTULOS_DIMENSAO[k]}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <span
                className="block h-full bg-signal-dim"
                style={{ width: `${dimensoes[k]}%` }}
              />
            </span>
            <span className="num w-8 shrink-0 text-right text-[11px] text-text">
              {dimensoes[k]}
            </span>
            <span className="num w-10 shrink-0 text-right text-[10px] text-text-muted">
              ×{PESOS[k].toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Linha de afirmação: fonte e data ANDAM COM a afirmação. Canon §3. ───── */

export function LinhaAfirmacao({ a }: { a: Afirmacao }) {
  const f = fonte(a.fonteId)
  return (
    <li className="border-b border-border px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-2.5">
        <TagCamada camada={a.camada} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm leading-relaxed text-text">{a.texto}</p>

          <p className="num text-[11px] leading-relaxed text-text-secondary">
            <span className="text-text-muted">fonte</span> {a.fonteId} ·{' '}
            {f.orgao} <span className="text-text-muted">({f.nivel})</span>
            {' · '}
            <span className="text-text-muted">coletado</span> {a.coletadoEm}
            {' · '}
            <span className="text-text-muted">referente a</span> {a.referenteA}
          </p>

          <p className="text-[11px] leading-relaxed text-text-secondary">
            <span className="text-text-muted">transformação: </span>
            {a.transformacao}
          </p>

          <p className="border-l-2 border-fresh-warn pl-2 text-[11px] leading-relaxed text-text-secondary">
            <span className="font-semibold text-fresh-warn">
              limite de inferência:{' '}
            </span>
            {a.limiteInferencia}
          </p>
        </div>
      </div>
    </li>
  )
}

/* ── Caixa de limite de inferência (nível da ficha) ──────────────────────── */

export function CaixaLimite({ texto }: { texto: string }) {
  return (
    <div className="rounded-[var(--radius-instrument)] border border-fresh-warn/40 bg-surface-2 p-3">
      <p className="mb-1 text-[10px] font-semibold tracking-widest text-fresh-warn uppercase">
        Limite de inferência
      </p>
      <p className="text-xs leading-relaxed text-text-secondary">{texto}</p>
    </div>
  )
}

/* ── Rótulo de dado fictício. Usado em toda superfície com número. ───────── */

export function SeloFicticio({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'num rounded-[var(--radius-instrument)] border border-border-strong px-1.5 py-0.5 text-[9px] tracking-widest text-text-muted uppercase',
        className,
      )}
    >
      fictício
    </span>
  )
}
