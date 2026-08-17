import { Painel, PainelHead, SeloFicticio } from '@/components/ui'
import { TESES, funil } from '@/data/mock'

const ETAPAS = [
  { chave: 'fichasPublicadas', rotulo: 'Fichas publicadas' },
  { chave: 'aprovadas', rotulo: 'Aprovadas' },
  { chave: 'abordadas', rotulo: 'Abordadas' },
  { chave: 'reunioes', rotulo: 'Reuniões' },
  { chave: 'propostas', rotulo: 'Propostas' },
] as const

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-text">Painel da tese</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          O funil por tese é o que prova valor ao assinante e o que ensina o
          motor: descobrir quais sinais viram reunião é diferente de descobrir
          quais empresas batem no filtro.
        </p>
      </header>

      {TESES.map((t) => {
        const f = funil(t.id)
        const base = f.fichasPublicadas
        return (
          <Painel key={t.id}>
            <PainelHead
              titulo={t.nome}
              meta={`${t.id} · ${t.ativa ? 'ativa' : 'pausada'}`}
              acao={<SeloFicticio />}
            />

            {base === 0 ? (
              <div className="p-4">
                <p className="text-xs text-text-secondary">
                  Nenhuma ficha publicada nesta tese.
                </p>
                <p className="num mt-1 text-[11px] text-text-muted">
                  estado vazio · 0 é 0, não se preenche com número inventado
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {ETAPAS.map((e) => {
                  const v = f[e.chave]
                  const pct = Math.round((v / base) * 100)
                  return (
                    <div key={e.chave} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-[11px] text-text-secondary">
                        {e.rotulo}
                      </span>
                      <span className="h-3 flex-1 overflow-hidden rounded-[var(--radius-instrument)] bg-surface-2">
                        <span
                          className="block h-full bg-signal-dim"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="num w-8 shrink-0 text-right text-xs text-text">
                        {v}
                      </span>
                      <span className="num w-10 shrink-0 text-right text-[11px] text-text-muted">
                        {pct}%
                      </span>
                    </div>
                  )
                })}

                <div className="grid gap-3 border-t border-border pt-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] tracking-widest text-text-muted uppercase">
                      Taxa de aprovação
                    </p>
                    <p className="num text-sm text-text">
                      {Math.round((f.aprovadas / base) * 100)}%
                    </p>
                    <p className="text-[10px] text-text-muted">
                      aprovadas ÷ publicadas
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest text-text-muted uppercase">
                      Taxa de ação
                    </p>
                    <p className="num text-sm text-text">
                      {f.aprovadas > 0
                        ? `${Math.round((f.abordadas / f.aprovadas) * 100)}%`
                        : '—'}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      abordadas ÷ aprovadas · evita uso passivo
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest text-text-muted uppercase">
                      Custo por ficha
                    </p>
                    <p className="num text-sm text-text-muted">
                      não disponível
                    </p>
                    <p className="text-[10px] text-text-muted">
                      exige ledger de uso · sem motor, sem custo real
                    </p>
                  </div>
                </div>

                {/* Receita: dado do assinante, não medição do FARO. */}
                <div className="rounded-[var(--radius-instrument)] border border-border bg-surface-2 p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                      Receita influenciada
                    </p>
                    <p className="num text-sm text-text-muted">
                      {f.receitaInformadaPeloAssinante === 0
                        ? 'não informada'
                        : f.receitaInformadaPeloAssinante.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                    Este número é <strong className="text-text">informado
                    pelo assinante</strong> — o FARO não o mede e não o estima.
                    Enquanto ninguém informa, fica &ldquo;não informada&rdquo;: o
                    produto não preenche o vazio com estimativa.
                  </p>
                </div>
              </div>
            )}
          </Painel>
        )
      })}

      <Painel>
        <PainelHead titulo="O que este painel deliberadamente não faz" />
        <ul className="divide-y divide-border">
          {[
            {
              t: 'Não é pipeline nem CRM',
              d: 'Sem Kanban, sem estágio de negociação, sem gestão de contato. O assinante usa o CRM dele; o FARO exporta CSV.',
            },
            {
              t: 'Não estima ROI',
              d: 'Enquanto o assinante não informa resultado, o campo fica vazio. Estimativa apresentada como medição é o pecado que o produto promete não cometer.',
            },
            {
              t: 'Não mostra custo por ficha',
              d: 'Custo real exige ledger de uso rodando. Sem motor, não há custo — e número inventado aqui contaminaria a decisão de preço.',
            },
          ].map((x) => (
            <li key={x.t} className="px-4 py-3">
              <p className="text-xs font-semibold text-text">{x.t}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                {x.d}
              </p>
            </li>
          ))}
        </ul>
      </Painel>
    </div>
  )
}
