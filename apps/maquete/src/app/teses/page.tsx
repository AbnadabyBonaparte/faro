import Link from 'next/link'
import { FormTese } from '@/components/FormTese'
import { Painel, PainelHead, SeloFicticio } from '@/components/ui'
import { TESES, funil } from '@/data/mock'

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-text">Teses</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Uma tese é uma hipótese operacional, não um filtro salvo. O assinante
          descreve o padrão de empresa que vale dinheiro para ele; o FARO
          procura evidências desse padrão todos os dias.
        </p>
      </header>

      <Painel>
        <PainelHead
          titulo="Teses cadastradas"
          acao={<SeloFicticio />}
        />
        <ul>
          {TESES.map((t) => {
            const f = funil(t.id)
            return (
              <li key={t.id} className="border-b border-border last:border-b-0">
                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="num text-[11px] text-text-muted">
                          {t.id}
                        </span>
                        <h3 className="text-sm font-semibold text-text">
                          {t.nome}
                        </h3>
                        <span
                          className={
                            t.ativa
                              ? 'num rounded-[var(--radius-instrument)] border border-signal px-1.5 py-0.5 text-[9px] tracking-widest text-signal uppercase'
                              : 'num rounded-[var(--radius-instrument)] border border-border-strong px-1.5 py-0.5 text-[9px] tracking-widest text-text-muted uppercase'
                          }
                        >
                          {t.ativa ? 'ativa' : 'pausada'}
                        </span>
                      </div>
                      <p className="num text-[11px] text-text-muted">
                        criada em {t.criadaEm} · {t.fichasNoMes} fichas no mês
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href="/fila"
                        className="rounded-[var(--radius-instrument)] border border-border px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-signal hover:text-signal"
                      >
                        Ver fila
                      </Link>
                      <Link
                        href="/painel"
                        className="rounded-[var(--radius-instrument)] border border-border px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-signal hover:text-signal"
                      >
                        Painel
                      </Link>
                    </div>
                  </div>

                  <p className="max-w-3xl text-xs leading-relaxed text-text-secondary">
                    {t.hipotese}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                        Parâmetros
                      </p>
                      <ul className="space-y-0.5">
                        {t.parametros.map((p) => (
                          <li key={p.rotulo} className="text-[11px] text-text-secondary">
                            <span className="text-text-muted">{p.rotulo}: </span>
                            {p.valor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                        Sinais exigidos
                      </p>
                      <ul className="space-y-0.5">
                        {t.sinaisExigidos.map((s) => (
                          <li
                            key={s}
                            className="flex items-center gap-1.5 text-[11px] text-text-secondary"
                          >
                            <span
                              className="h-1 w-1 shrink-0 rounded-full bg-signal"
                              aria-hidden
                            />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="num flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-2 text-[11px] text-text-secondary">
                    <span>
                      <span className="text-text-muted">fichas </span>
                      {f.fichasPublicadas}
                    </span>
                    <span>
                      <span className="text-text-muted">aprovadas </span>
                      {f.aprovadas}
                    </span>
                    <span>
                      <span className="text-text-muted">abordadas </span>
                      {f.abordadas}
                    </span>
                    <span>
                      <span className="text-text-muted">reuniões </span>
                      {f.reunioes}
                    </span>
                    <span>
                      <span className="text-text-muted">propostas </span>
                      {f.propostas}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Painel>

      <FormTese />
    </div>
  )
}
