import { Painel, PainelHead, SeloFicticio, SeloFreshness } from '@/components/ui'
import { FONTES } from '@/data/mock'

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-text">Registro de fontes</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          O FARO não é uma base de dados — é uma camada de inteligência sobre
          bases públicas. Toda fonte tem ficha própria, e{' '}
          <strong className="text-text">
            toda fonte é provada viva antes de ser prometida
          </strong>
          .
        </p>
      </header>

      <Painel>
        <PainelHead titulo="Fontes cadastradas" acao={<SeloFicticio />} />
        <ul className="divide-y divide-border">
          {FONTES.map((f) => (
            <li key={f.id} className="space-y-2 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="num text-[11px] text-text-muted">{f.id}</span>
                <h3 className="text-sm font-semibold text-text">{f.nome}</h3>
                <span
                  className="num rounded-[var(--radius-instrument)] border border-border-strong px-1.5 py-0.5 text-[10px] text-text"
                  title="Nível de evidência: E1 oficial · E2 institucional · E3 sinal externo"
                >
                  {f.nivel}
                </span>
                <span
                  className={
                    f.status === 'viva'
                      ? 'num text-[10px] tracking-widest text-signal uppercase'
                      : 'num text-[10px] tracking-widest text-fresh-stale uppercase'
                  }
                >
                  {f.status}
                </span>
              </div>

              <dl className="grid gap-x-4 gap-y-1 text-[11px] sm:grid-cols-2">
                {[
                  ['Órgão', f.orgao],
                  ['Periodicidade', f.periodicidade],
                  ['Última coleta', f.ultimaColeta],
                  ['Licença', f.licenca],
                  ['Cobertura', f.cobertura],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-1.5">
                    <dt className="shrink-0 text-text-muted">{k}:</dt>
                    <dd className="num text-text-secondary">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="border-l-2 border-border-strong pl-2 text-[11px] leading-relaxed text-text-secondary">
                <span className="text-text-muted">fallback declarado: </span>
                {f.fallback}
              </p>
            </li>
          ))}
        </ul>
      </Painel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Painel>
          <PainelHead titulo="Níveis de evidência" />
          <ul className="divide-y divide-border">
            {[
              {
                n: 'E1',
                t: 'Fonte oficial',
                d: 'Órgão público, autarquia, agência reguladora, portal oficial.',
              },
              {
                n: 'E2',
                t: 'Institucional / derivada',
                d: 'Associação setorial, ranking, base secundária, documento institucional.',
              },
              {
                n: 'E3',
                t: 'Sinal externo',
                d: 'Notícia, site corporativo, vaga aberta, comunicação pública.',
              },
            ].map((x) => (
              <li key={x.n} className="flex items-start gap-3 px-4 py-3">
                <span className="num w-6 shrink-0 rounded-[var(--radius-instrument)] border border-border-strong text-center text-[11px] text-text">
                  {x.n}
                </span>
                <div>
                  <p className="text-xs font-semibold text-text">{x.t}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">
                    {x.d}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-4 py-3">
            <p className="text-[11px] leading-relaxed text-text-secondary">
              A composição dos níveis das evidências de uma ficha produz o{' '}
              <strong className="text-text">Evidence Grade A–D</strong>. O grade
              usa peso e tipografia, nunca cor: evidência não é placar.
            </p>
          </div>
        </Painel>

        <Painel>
          <PainelHead titulo="Freshness" meta="o sinal está vivo?" />
          <ul className="divide-y divide-border">
            {[
              { f: 'ok' as const, d: 'Dado recém-coletado. O sinal está vivo.' },
              { f: 'warn' as const, d: 'Ainda operacional. O sinal está esfriando.' },
              {
                f: 'stale' as const,
                d: 'Exige atenção antes de abordar. O sinal está apagando.',
              },
              {
                f: 'old' as const,
                d: 'Não abordar sem revalidar.',
              },
            ].map((x) => (
              <li key={x.f} className="flex items-center gap-3 px-4 py-3">
                <SeloFreshness freshness={x.f} />
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  {x.d}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-4 py-3">
            <p className="text-[11px] leading-relaxed text-text-secondary">
              O verde de &ldquo;atual&rdquo; é a própria cor de sinal da marca —
              por decisão de design, não por descuido. A cor de marca significa{' '}
              <strong className="text-text">o sinal está vivo</strong>, e é
              exatamente isso que o Freshness mede.
            </p>
          </div>
        </Painel>
      </div>

      <Painel>
        <PainelHead titulo="Sobre este registro" />
        <div className="space-y-2 p-4">
          <p className="text-xs leading-relaxed text-text-secondary">
            Os órgãos listados são fontes <strong className="text-text">previstas
            no modelo</strong> — nenhuma foi integrada, nenhuma foi coletada. As
            datas de coleta, o status e a cobertura acima são fictícios e servem
            para mostrar o formato da ficha de fonte.
          </p>
          <p className="text-xs leading-relaxed text-text-secondary">
            Quando o motor existir, este painel é também o painel de saúde: fonte
            que muda de formato quebra pipeline, e a única defesa honesta é
            declarar a limitação em vez de apresentar inferência como fato.
          </p>
        </div>
      </Painel>
    </div>
  )
}
