import { Painel, PainelHead, SeloFicticio, SeloFreshness } from '@/components/ui'
import { EVENTOS, TESES, fonte, tese } from '@/data/mock'

export default function Page() {
  const novos = EVENTOS.filter((e) => e.novo).length

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-text">Watch</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          A unidade de valor do FARO é o{' '}
          <strong className="text-text">evento</strong>, não a empresa. Uma lista
          se consome; uma mudança de estado continua acontecendo. É isso — e não
          uma trava de plano — que justifica a assinatura.
        </p>
      </header>

      <Painel>
        <PainelHead
          titulo="O que o Watch monitora"
          acao={<SeloFicticio />}
        />
        <div className="grid gap-0 sm:grid-cols-4">
          {[
            { t: 'Tese', d: 'Avise quando aparecer empresa que cumpra minha tese' },
            { t: 'Empresa', d: 'Avise quando esta empresa mudar de estado' },
            { t: 'Mercado', d: 'Avise sobre movimento num recorte de setor ou região' },
            { t: 'Evento', d: 'Avise sobre um tipo específico de mudança' },
          ].map((x) => (
            <div
              key={x.t}
              className="border-b border-border p-3 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
            >
              <p className="text-xs font-semibold text-signal">{x.t}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </Painel>

      <Painel>
        <PainelHead
          titulo="Feed de eventos"
          meta={`${novos} novos · ${EVENTOS.length} na janela`}
        />
        <ul>
          {EVENTOS.map((e) => {
            const f = fonte(e.fonteId)
            const t = tese(e.teseId)
            return (
              <li
                key={e.id}
                className="border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="num text-[11px] text-text-muted">
                        {e.id}
                      </span>
                      <span className="rounded-[var(--radius-instrument)] border border-signal px-1.5 py-0.5 text-[10px] tracking-wide text-signal">
                        {e.tipo}
                      </span>
                      {e.novo ? (
                        <span className="num text-[10px] tracking-widest text-signal uppercase">
                          novo
                        </span>
                      ) : null}
                      <SeloFreshness freshness={e.freshness} />
                    </div>

                    <p className="text-xs font-semibold text-text">
                      {e.empresa}
                    </p>
                    <p className="text-xs leading-relaxed text-text-secondary">
                      {e.descricao}
                    </p>
                    <p className="num text-[11px] text-text-secondary">
                      <span className="text-text-muted">cnpj</span> {e.cnpj} ·{' '}
                      <span className="text-text-muted">fonte</span> {e.fonteId}{' '}
                      ({f.orgao}, {f.nivel}) ·{' '}
                      <span className="text-text-muted">detectado</span>{' '}
                      {e.detectadoEm} ·{' '}
                      <span className="text-text-muted">referente a</span>{' '}
                      {e.referenteA}
                    </p>
                  </div>

                  <span className="num shrink-0 text-[11px] text-text-muted">
                    {t.id}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </Painel>

      <Painel>
        <PainelHead titulo="Monitores ativos" acao={<SeloFicticio />} />
        <ul className="divide-y divide-border">
          {TESES.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs text-text">
                  <span className="num text-text-muted">{t.id} </span>
                  {t.nome}
                </p>
                <p className="num mt-0.5 text-[11px] text-text-muted">
                  monitorando {t.sinaisExigidos.length}{' '}
                  {t.sinaisExigidos.length === 1
                    ? 'tipo de sinal'
                    : 'tipos de sinal'}
                </p>
              </div>
              <span
                className={
                  t.ativa
                    ? 'num text-[10px] tracking-widest text-signal uppercase'
                    : 'num text-[10px] tracking-widest text-text-muted uppercase'
                }
              >
                {t.ativa ? 'vigiando' : 'pausado'}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border bg-surface-2 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-text-secondary">
            Nenhum monitor roda de verdade. Não há varredura, não há coleta, não
            há notificação — o feed acima é ilustrativo e existe para mostrar o
            formato do evento quando o motor existir.
          </p>
        </div>
      </Painel>
    </div>
  )
}
