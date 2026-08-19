import { HeroPagina } from '@/components/marca/Faixa'
import { Painel, PainelHead } from '@/components/ui'

/* ── A ESCADA v2 ───────────────────────────────────────────────────────────
   Canon: MODELO-DE-NEGOCIO.md §D.0, martelo do dono 19/08/2026.
   A escada de entrada: Caçada avulsa na porta, assinatura para quem volta. */

const CACADA = {
  nome: 'FARO Caçada',
  valor: 'R$ 997',
  unidade: 'avulso',
  selo: 'A porta — todo cliente começa aqui',
  escopo: [
    '1 tese parametrizada',
    'Os 3 melhores alvos, ranqueados',
    'Ficha completa: EV líquido, fonte e data por linha, "por que não perseguir"',
    'Eco de 30 dias — 1 alerta se um evento novo bater na tese',
    'Abate 100% no 1º mês do Pro, se assinar em 30 dias',
  ],
}

const DEGRAUS = [
  {
    nome: 'FARO Pro',
    valor: 'R$ 1.997',
    unidade: '/mês',
    escopo: [
      '3 teses vivas',
      '7 fichas novas por mês',
      'Watch contínuo',
      'Exportação CSV',
    ],
  },
  {
    nome: 'FARO Escritório',
    valor: 'R$ 3.997',
    unidade: '/mês',
    escopo: [
      '7 teses vivas',
      '15 fichas por mês',
      'Multiusuário',
      'Curadoria assistida',
      'Prioridade de atendimento',
    ],
  },
  {
    nome: 'Operador Profissional',
    valor: 'sob proposta',
    unidade: 'ESTIMATIVA: R$ 8–15k/mês',
    escopo: [
      'Volume e profundidade sob desenho',
      'Contrato próprio',
      'Nunca indexado a êxito',
    ],
  },
]

/* A régua descendente é o argumento da escada — então ela aparece na tela,
   não se deduz. Canon §D.0, lei 1. */
const REGUA = [
  { degrau: 'Caçada', preco: 'R$ 997', fichas: '3', porFicha: 'R$ 332' },
  { degrau: 'Pro', preco: 'R$ 1.997', fichas: '7', porFicha: 'R$ 285' },
  { degrau: 'Escritório', preco: 'R$ 3.997', fichas: '15', porFicha: 'R$ 266' },
  {
    degrau: 'Ficha extra',
    preco: 'R$ 349',
    fichas: '1',
    porFicha: 'R$ 349',
    extra: true,
  },
]

const RITUAL = [
  {
    n: '1',
    t: 'A presa em língua de gente',
    d: 'Campo livre: o cliente escreve o que procura como falaria com um sócio. Nada de formulário de trinta campos — formulário longo faz desistir ou mentir.',
  },
  {
    n: '2',
    t: 'O Espelho do Refinador',
    d: 'A tese é traduzida em parâmetros e exibida em duas colunas: "o que tu pediste" × "o que dá para caçar COM PROVA". Todo proxy sai declarado como proxy, antes do pagamento. Refino é grátis e ilimitado.',
  },
  {
    n: '3',
    t: 'O Censo Prévio',
    d: 'O território é contado ANTES de cobrar e exibido só em faixa. Território magro: o sistema recusa a venda e sugere alargar a tese. É aqui que o reembolso se evita — na contagem, não no jurídico.',
  },
  {
    n: '4',
    t: 'O Aceite da Caçada',
    d: 'Tese final por extenso, o que será entregue, e o que NÃO é (não é parecer; não garante conversão). Checkbox, botão "Aprovo esta caçada" — e só então pagamento e execução. O aceite grava quem, quando e qual versão da tese, em trilha imutável.',
  },
]

export default function Page() {
  return (
    <>
    <HeroPagina
      selo="A ESCADA"
      titulo="Não vendemos volume. Vendemos pontaria."
      chamada="Todo cliente começa pela Caçada. A assinatura é para quem quer o FARO acordado o ano inteiro, não para quem quer uma lista."
      fundo="/brand/rodada-2/banner-precos-2400x760.svg"
    />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Todo cliente entra pela <strong className="text-text">Caçada</strong>:
          avulsa, sem assinatura, sem risco de mensalidade. Quem volta, sobe. A
          estrutura é{' '}
          <strong className="text-text">
            assinatura + capacidade + consumo
          </strong>
          , porque o custo de gerar uma oportunidade varia com as fontes e o
          processamento envolvidos.
        </p>
      </header>

      {/* ── A PORTA ───────────────────────────────────────────────────────── */}
      <div className="rounded-[var(--radius-instrument)] border border-signal bg-surface p-5">
        <p className="text-[10px] font-semibold tracking-widest text-signal uppercase">
          {CACADA.selo}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-text">
            {CACADA.nome}
          </span>
          <span className="num text-3xl font-bold text-text">
            {CACADA.valor}
          </span>
          <span className="num text-[11px] text-text-muted">
            {CACADA.unidade}
          </span>
        </div>
        <ul className="mt-4 grid gap-1.5 border-t border-border pt-3 sm:grid-cols-2">
          {CACADA.escopo.map((e) => (
            <li
              key={e}
              className="flex items-start gap-1.5 text-[11px] leading-relaxed text-text-secondary"
            >
              <span
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal"
                aria-hidden
              />
              {e}
            </li>
          ))}
        </ul>
      </div>

      {/* ── OS DEGRAUS ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {DEGRAUS.map((p) => (
          <div
            key={p.nome}
            className="rounded-[var(--radius-instrument)] border border-border bg-surface p-4"
          >
            <p className="text-sm font-semibold text-text">{p.nome}</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="num text-2xl font-bold text-text">{p.valor}</span>
            </div>
            <p className="num text-[11px] text-text-muted">{p.unidade}</p>

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

          </div>
        ))}
      </div>

      {/* ── A RÉGUA ───────────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="A régua — o R$ por ficha cai conforme se sobe" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] tracking-widest text-text-muted uppercase">
                <th className="px-4 py-2 font-semibold">Degrau</th>
                <th className="px-4 py-2 text-right font-semibold">Preço</th>
                <th className="px-4 py-2 text-right font-semibold">Fichas</th>
                <th className="px-4 py-2 text-right font-semibold">
                  R$ por ficha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {REGUA.map((r) => (
                <tr key={r.degrau}>
                  <td className="px-4 py-2 text-text">{r.degrau}</td>
                  <td className="num px-4 py-2 text-right text-text-secondary">
                    {r.preco}
                  </td>
                  <td className="num px-4 py-2 text-right text-text-secondary">
                    {r.fichas}
                  </td>
                  <td
                    className={
                      r.extra
                        ? 'num px-4 py-2 text-right font-semibold text-fresh-warn'
                        : 'num px-4 py-2 text-right font-semibold text-signal'
                    }
                  >
                    {r.porFicha}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border bg-surface-2 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-text-secondary">
            A ficha extra é sempre mais cara que a ficha de plano. Sem isso a
            escada não empurra: se a avulsa saísse mais barata, o cliente
            racional ficaria embaixo para sempre, comprando no varejo.
          </p>
        </div>
      </Painel>

      {/* ── COMO SE COMPRA ────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead
          titulo="Como se compra"
          meta="ritual do aceite — ilustração, sem formulário"
        />
        <ol className="divide-y divide-border">
          {RITUAL.map((x) => (
            <li key={x.n} className="flex items-start gap-3 px-4 py-3">
              <span className="num mt-0.5 w-5 shrink-0 text-xs text-signal">
                {x.n}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text">{x.t}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                  {x.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Painel>

      {/* ── AS TRÊS LEIS ──────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="As três leis da escada" />
        <ul className="divide-y divide-border">
          {[
            {
              t: 'Régua descendente',
              d: 'O R$ por ficha cai subindo (332 → 285 → 266) e a ficha extra custa mais que a de plano. É o que faz subir valer a pena.',
            },
            {
              t: 'Cada degrau dobra',
              d: '997 → 1.997 → 3.997. Degrau que dobra é degrau que se decide. Degrau de 20% em 20% vira negociação, e negociação consome o tempo que deveria ir para o produto.',
            },
            {
              t: 'Escassez é o produto',
              d: 'Não vendemos volume, vendemos pontaria. Quem recebe 200 alvos persegue 3 e conclui que 197 eram lixo. Quem recebe 3 alvos ranqueados persegue os 3 — e volta. A franquia baixa é a entrega, não uma limitação disfarçada de plano.',
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

      {/* ── CONDIÇÕES ─────────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="Condições da proposta" />
        <ul className="divide-y divide-border">
          {[
            {
              t: 'Compromisso trimestral na assinatura fundadora',
              d: 'O plano de entrada, sozinho, atrai quem consome a base e cancela. Quem fecha contrato de recuperação tributária ganha por êxito — o valor do FARO seria o ROI dele, não o preço de uma lista. O compromisso alinha o assinante ao monitoramento contínuo, não ao primeiro download.',
            },
            {
              t: 'Créditos de investigação — a ficha extra a R$ 349',
              d: 'Para caçadas pesadas, acima da franquia do plano. Uma oportunidade custa mais ou menos conforme fontes e processamento envolvidos.',
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

      {/* ── O QUE PRECISA SER PROVADO ─────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="O que precisa ser provado antes de cobrar" />
        <ol className="divide-y divide-border">
          {[
            'Que o comprador paga R$ 997 por três alvos ranqueados — e não pede trinta.',
            'Que a tese produz valor novo depois do primeiro lote, e não esvazia.',
            'Que o custo por ficha permite margem nestes patamares. Hoje esse custo é desconhecido: os volumes de 3, 7 e 15 foram escolhidos para a régua descer, não medidos contra o custo real de produzir uma ficha.',
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
    </>
  )
}
