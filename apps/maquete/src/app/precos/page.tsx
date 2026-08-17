import { Painel, PainelHead } from '@/components/ui'

const PLANOS = [
  {
    nome: 'FARO Solo',
    valor: 'R$ 297',
    escopo: [
      '3 teses',
      'Fila limitada de fichas',
      'Watch básico',
      'Exportação CSV',
    ],
  },
  {
    nome: 'FARO Pro',
    valor: 'R$ 697',
    escopo: [
      '10 teses',
      'Watch contínuo',
      'Evidence Graph completo',
      'Relatórios por tese',
    ],
    destaque: true,
  },
  {
    nome: 'FARO Escritório',
    valor: 'R$ 1.497',
    escopo: [
      'Multiusuário',
      'Teses avançadas',
      'Curadoria assistida',
      'Prioridade de atendimento',
    ],
  },
]

export default function Page() {
  return (
    <div className="space-y-6">
      {/* ── AVISO ANTES DE QUALQUER NÚMERO ─────────────────────────────── */}
      <div className="rounded-[var(--radius-instrument)] border border-fresh-warn bg-fresh-warn/10 p-4">
        <p className="text-[10px] font-semibold tracking-widest text-fresh-warn uppercase">
          Proposta de fundação — não é tabela de preços
        </p>
        <div className="mt-2 space-y-2 text-xs leading-relaxed text-text">
          <p>
            Os valores desta página são{' '}
            <strong>hipótese de trabalho</strong>, registrada para poder ser
            testada e derrubada. Nenhum deles é preço vigente, porque{' '}
            <strong>não existe produto para vender</strong>: não há motor, não há
            coleta, não há assinatura, não há checkout.
          </p>
          <p>
            Nenhum preço vira verdade antes de um{' '}
            <strong>piloto pago de 30 dias</strong> com um design partner. O
            preço só se valida junto com o custo real de produzir uma ficha — e
            esse custo é desconhecido enquanto o motor não roda.
          </p>
        </div>
      </div>

      <header className="space-y-2">
        <h1 className="text-xl font-bold text-text">
          Preços — hipótese de fundação
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          A estrutura pretendida é{' '}
          <strong className="text-text">assinatura + capacidade + consumo</strong>
          . O custo de gerar uma oportunidade varia com a quantidade de fontes e
          o processamento envolvido, então travar a economia só em &ldquo;número
          de fichas&rdquo; seria errado.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANOS.map((p) => (
          <div
            key={p.nome}
            className={
              p.destaque
                ? 'rounded-[var(--radius-instrument)] border border-signal bg-surface p-4'
                : 'rounded-[var(--radius-instrument)] border border-border bg-surface p-4'
            }
          >
            <p className="text-sm font-semibold text-text">{p.nome}</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="num text-2xl font-bold text-text">{p.valor}</span>
              <span className="num text-[11px] text-text-muted">/mês</span>
            </div>
            <p className="num mt-0.5 text-[10px] tracking-widest text-fresh-warn uppercase">
              hipótese
            </p>

            <ul className="mt-3 space-y-1 border-t border-border pt-3">
              {p.escopo.map((e) => (
                <li
                  key={e}
                  className="flex items-start gap-1.5 text-[11px] leading-relaxed text-text-secondary"
                >
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal-dim"
                    aria-hidden
                  />
                  {e}
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-border pt-3">
              <p className="text-[11px] leading-relaxed text-text-muted">
                Sem checkout. Sem contratação. Sem lista de espera. Não há o que
                assinar.
              </p>
            </div>
          </div>
        ))}
      </div>

      <Painel>
        <PainelHead titulo="Condições que fazem parte da hipótese" />
        <ul className="divide-y divide-border">
          {[
            {
              t: 'Compromisso trimestral na assinatura fundadora',
              d: 'O plano de entrada, sozinho, atrai quem consome a base e cancela. Quem fecha contrato de recuperação tributária ganha por êxito — o valor do FARO seria o ROI dele, não o preço de uma lista. O compromisso alinha o assinante ao monitoramento contínuo, não ao primeiro download.',
            },
            {
              t: 'Créditos de investigação',
              d: 'Para caçadas pesadas, acima do consumo do plano. Uma oportunidade custa mais ou menos conforme fontes e processamento envolvidos.',
            },
            {
              t: 'Desconto de fundador declarado — nunca gratuidade',
              d: 'O objetivo do primeiro contrato é provar disposição de pagamento, não colecionar interesse. Plano gratuito mediria curiosidade.',
            },
            {
              t: 'Piloto pago de 30 dias antes de qualquer tabela',
              d: 'Escopo definido, uma tese, acompanhamento próximo, indicadores combinados. É o piloto que decide se estes números sobrevivem.',
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

      <Painel>
        <PainelHead titulo="O que precisa ser provado antes de cobrar" />
        <ol className="divide-y divide-border">
          {[
            'Que o comprador paga mensalmente por oportunidade qualificada.',
            'Que a tese produz valor novo depois do primeiro lote — e não esvazia.',
            'Que o custo por ficha permite margem nestes patamares.',
          ].map((x, i) => (
            <li key={x} className="flex items-start gap-3 px-4 py-3">
              <span className="num w-4 shrink-0 text-xs text-text-muted">
                {i + 1}
              </span>
              <p className="text-xs leading-relaxed text-text-secondary">{x}</p>
            </li>
          ))}
        </ol>
        <div className="border-t border-border bg-surface-2 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-text-secondary">
            Nenhuma das três está provada hoje. É por isso que esta página existe
            como proposta e não como oferta.
          </p>
        </div>
      </Painel>
    </div>
  )
}
