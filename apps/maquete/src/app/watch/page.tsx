import { HeroPagina } from '@/components/marca/Faixa'
import { Painel, PainelHead, SeloFreshness } from '@/components/ui'
import { EVENTOS, TESES, fonte, tese } from '@/data/mock'

export default function Page() {
  const novos = EVENTOS.filter((e) => e.novo).length

  return (
    <>
    <HeroPagina
      selo="PASSO 2 · O SINAL"
      titulo="Encontrei uma mudança."
      chamada="O que mudou nas fontes públicas e bateu numa tese viva. A unidade de valor é a mudança — nunca o cadastro parado."
      fundo="/brand/rodada-2/fundo-watch-1920x360.svg"
    />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">

      <Painel>
        <PainelHead
          titulo="O que o Watch monitora"
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
        <PainelHead titulo="Monitores ativos" />
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
      </Painel>
    </div>
    </>
  )
}
