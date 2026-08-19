'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import {
  BadgeGrade,
  CaixaLimite,
  Painel,
  PainelHead,
  ScoreDecomposto,
  SeloFreshness,
} from '@/components/ui'
import {
  MOTIVOS_APROVACAO,
  MOTIVOS_DESCARTE,
  OPORTUNIDADES,
  type Julgamento,
  type Oportunidade,
  calcularScore,
  tese,
} from '@/data/mock'

type Registro = { julgamento: Julgamento; motivo: string | null }

const BOTOES: { valor: Exclude<Julgamento, null>; rotulo: string }[] = [
  { valor: 'aprovada', rotulo: 'Aprovar' },
  { valor: 'descartada', rotulo: 'Descartar' },
  { valor: 'monitorar', rotulo: 'Monitorar' },
]

function motivosPara(j: Julgamento): readonly string[] {
  if (j === 'descartada') return MOTIVOS_DESCARTE
  if (j === 'aprovada') return MOTIVOS_APROVACAO
  return ['Sinal isolado, aguardar corroboração', 'Fonte degradada', 'Fora de timing']
}

export function Fila() {
  const [registros, setRegistros] = useState<Record<string, Registro>>(() =>
    Object.fromEntries(
      OPORTUNIDADES.map((o) => [
        o.id,
        { julgamento: o.julgamento, motivo: null } as Registro,
      ]),
    ),
  )

  const ordenadas = useMemo(
    () =>
      [...OPORTUNIDADES].sort(
        (a, b) => calcularScore(b.dimensoes) - calcularScore(a.dimensoes),
      ),
    [],
  )

  const julgadas = Object.values(registros).filter((r) => r.julgamento).length

  function julgar(id: string, j: Exclude<Julgamento, null>) {
    setRegistros((r) => ({
      ...r,
      [id]:
        r[id]?.julgamento === j
          ? { julgamento: null, motivo: null }
          : { julgamento: j, motivo: null },
    }))
  }

  function definirMotivo(id: string, motivo: string) {
    setRegistros((r) => ({ ...r, [id]: { ...r[id], motivo } }))
  }

  return (
    <div className="space-y-4">
      <Painel>
        <PainelHead
          titulo="Tribunal magro"
          meta={`${julgadas} de ${OPORTUNIDADES.length} fichas julgadas nesta sessão`}
        />
        <div className="space-y-2 p-4">
          <p className="text-xs leading-relaxed text-text-secondary">
            Três botões e um motivo. Sem Kanban, sem estágio de negociação, sem
            CRM — o assinante já tem o dele, e a exportação em CSV resolve. O que
            o FARO precisa capturar é o{' '}
            <strong className="text-text">julgamento</strong>: é ele que
            recalibra a tese, e é o único ativo que um concorrente não copia
            junto com a fonte pública.
          </p>
        </div>
      </Painel>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="num text-[11px] text-text-muted">
          ordenado por score decomposto · maior primeiro
        </p>
      </div>

      {ordenadas.map((o) => (
        <Ficha
          key={o.id}
          o={o}
          registro={registros[o.id]}
          onJulgar={julgar}
          onMotivo={definirMotivo}
        />
      ))}
    </div>
  )
}

function Ficha({
  o,
  registro,
  onJulgar,
  onMotivo,
}: {
  o: Oportunidade
  registro: Registro | undefined
  onJulgar: (id: string, j: Exclude<Julgamento, null>) => void
  onMotivo: (id: string, motivo: string) => void
}) {
  const t = tese(o.teseId)
  const j = registro?.julgamento ?? null

  return (
    <Painel>
      <div className="space-y-4 p-4">
        {/* ── CABEÇALHO ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="num text-[11px] text-text-muted">{o.id}</span>
              <BadgeGrade grade={o.grade} />
              <SeloFreshness freshness={o.freshness} />
            </div>
            <h3 className="text-sm leading-snug font-semibold text-text">
              <Link
                href={`/fila/${o.id}`}
                className="transition-colors hover:text-signal"
              >
                {o.razaoSocial}
              </Link>
            </h3>
            <p className="num text-[11px] text-text-secondary">
              CNPJ {o.cnpj} · {o.cnae} · porte {o.porte} · {o.municipio}/{o.uf}
            </p>
          </div>

          <Link
            href={`/fila/${o.id}`}
            className="shrink-0 rounded-[var(--radius-instrument)] border border-border px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-signal hover:text-signal"
          >
            Abrir ficha
          </Link>
        </div>

        {/* ── EVENTO GATILHO ─────────────────────────────────────────── */}
        <div className="rounded-[var(--radius-instrument)] border border-border bg-surface-2 px-3 py-2">
          <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
            Evento que gerou a ficha
          </p>
          <p className="mt-0.5 text-xs text-text">{o.eventoGatilho}</p>
          <p className="num mt-0.5 text-[11px] text-text-secondary">
            detectado em {o.detectadoEm} · tese {t.id} — {t.nome}
          </p>
        </div>

        {/* ── SCORE + LIMITE ────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ScoreDecomposto
            dimensoes={o.dimensoes}
            criteriosAtendidos={o.criteriosAtendidos}
            criteriosTotais={o.criteriosTotais}
            evidenciasIndependentes={o.evidenciasIndependentes}
            sinaisRecentes={o.sinaisRecentes}
          />
          <div className="space-y-3">
            <CaixaLimite texto={o.limiteInferencia} />
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                Próxima ação
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                {o.proximaAcao}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRIBUNAL ─────────────────────────────────────────────────── */}
      <div className="border-t border-border bg-surface-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {BOTOES.map((b) => (
            <button
              key={b.valor}
              type="button"
              aria-pressed={j === b.valor}
              onClick={() => onJulgar(o.id, b.valor)}
              className={cn(
                'rounded-[var(--radius-instrument)] border px-3 py-1.5 text-xs transition-colors',
                j === b.valor
                  ? 'border-signal bg-signal font-semibold text-signal-fg'
                  : 'border-border text-text-secondary hover:border-border-strong hover:text-text',
              )}
            >
              {b.rotulo}
            </button>
          ))}

          {j ? (
            <label className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-text-muted">motivo</span>
              <select
                value={registro?.motivo ?? ''}
                onChange={(e) => onMotivo(o.id, e.target.value)}
                className="rounded-[var(--radius-instrument)] border border-border bg-bg px-2 py-1 text-[11px] text-text focus:border-signal focus:outline-none"
              >
                <option value="">selecione…</option>
                {motivosPara(j).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>

        {j ? (
          <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
            {registro?.motivo ? (
              <>
                Julgamento registrado nesta aba:{' '}
                <span className="text-signal">{j}</span> ·{' '}
                <span className="text-text">{registro.motivo}</span>. Com motor,
                este par alimentaria o recálculo dos pesos da tese.
              </>
            ) : (
              <span className="text-fresh-warn">
                Escolha o motivo. Julgamento sem motivo não ensina nada à tese —
                é o motivo estruturado que carrega a informação.
              </span>
            )}
          </p>
        ) : null}
      </div>
    </Painel>
  )
}
