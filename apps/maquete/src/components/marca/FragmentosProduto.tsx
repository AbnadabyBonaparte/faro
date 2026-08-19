import Link from 'next/link'
import { EVENTOS, OPORTUNIDADES, calcularScore, fonte } from '@/data/mock'
import { BadgeGrade, ScoreDecomposto, SeloFreshness, TagCamada } from '@/components/ui'
import { JanelaProduto } from './JanelaProduto'

/**
 * OS RECORTES DE PRODUTO.
 *
 * Curadoria P3/P4: as referências de elite mostram o produto como UI, recortada
 * e estilizada — não como captura crua nem como ilustração conceitual
 * (`CURADORIA-VISUAL.md` §1.1 Linear, §1.2 Vanta).
 *
 * 🔴 Estes recortes montam com os MESMOS componentes das telas reais
 * (`ScoreDecomposto`, `BadgeGrade`, `SeloFreshness`, `TagCamada`) e com os
 * MESMOS dados fictícios. Não existe uma versão "de marketing" mais bonita que
 * o produto: se a tela mudar, o recorte muda junto. Foi de propósito — captura
 * embelezada à parte é o começo da mentira de vitrine.
 */

const OP = OPORTUNIDADES[0]!

export function RecorteFicha() {
  return (
    <JanelaProduto rotulo="Ficha aberta" meta={OP.id}>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <TagCamada camada="OPORTUNIDADE" />
          <BadgeGrade grade={OP.grade} />
          <SeloFreshness freshness={OP.freshness} />
        </div>
        <div>
          <p className="truncate text-sm font-semibold text-text">{OP.razaoSocial}</p>
          <p className="num mt-0.5 text-[11px] text-text-muted">
            {OP.cnpj} · {OP.municipio}/{OP.uf}
          </p>
        </div>
        <ScoreDecomposto
          dimensoes={OP.dimensoes}
          criteriosAtendidos={OP.criteriosAtendidos}
          criteriosTotais={OP.criteriosTotais}
          evidenciasIndependentes={OP.evidenciasIndependentes}
          sinaisRecentes={OP.sinaisRecentes}
        />
      </div>
    </JanelaProduto>
  )
}

export function RecorteFila() {
  return (
    <JanelaProduto rotulo="Fila de oportunidades" meta="ordenada por score">
      <ul className="divide-y divide-border">
        {OPORTUNIDADES.slice(0, 4).map((o) => (
          <li key={o.id} className="flex items-center gap-3 px-3 py-2.5">
            <span className="num w-14 shrink-0 text-[11px] text-text-muted">{o.id}</span>
            <span className="min-w-0 flex-1 truncate text-xs text-text">{o.razaoSocial}</span>
            <SeloFreshness freshness={o.freshness} comRotulo={false} />
            <BadgeGrade grade={o.grade} />
            <span className="num w-9 shrink-0 text-right text-sm font-bold text-signal">
              {calcularScore(o.dimensoes)}
            </span>
          </li>
        ))}
      </ul>
    </JanelaProduto>
  )
}

export function RecorteWatch() {
  return (
    <JanelaProduto rotulo="Watch" meta="o que mudou">
      <ul className="divide-y divide-border">
        {EVENTOS.slice(0, 4).map((e) => {
          const f = fonte(e.fonteId)
          return (
            <li key={e.id} className="space-y-1 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <TagCamada camada="SINAL" />
                <span className="min-w-0 flex-1 truncate text-xs text-text">{e.tipo}</span>
                <SeloFreshness freshness={e.freshness} comRotulo={false} />
              </div>
              <p className="truncate text-[11px] text-text-secondary">{e.descricao}</p>
              <p className="num text-[10px] text-text-muted">
                {e.fonteId} · {f?.orgao ?? 'fonte'} · coletado {e.detectadoEm}
              </p>
            </li>
          )
        })}
      </ul>
    </JanelaProduto>
  )
}

export function LinkTela({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="num inline-flex items-center gap-1.5 text-[11px] tracking-widest text-signal uppercase hover:underline"
    >
      {children} <span aria-hidden>→</span>
    </Link>
  )
}
