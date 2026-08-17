import Link from 'next/link'
import { Painel, PainelHead } from '@/components/ui'

const TELAS = [
  {
    href: '/teses',
    n: '1',
    titulo: 'Teses',
    desc: 'Criar e listar teses paramétricas. Mostra a Lei das Camadas em ação: o assinante define o padrão, não recebe uma lista.',
  },
  {
    href: '/fila',
    n: '2',
    titulo: 'Fila de oportunidades',
    desc: 'Fichas com score decomposto visível, Evidence Grade, Freshness e os três botões do Tribunal Magro.',
  },
  {
    href: '/fila/OP-1041',
    n: '3',
    titulo: 'Ficha aberta',
    desc: 'O Evidence Graph: empresa → dados → sinais → fontes → tese → conclusão. Fonte e data em cada linha, limite de inferência declarado.',
  },
  {
    href: '/watch',
    n: '4',
    titulo: 'Watch',
    desc: 'Feed de eventos ligados a teses. A unidade de valor é a mudança — não a empresa.',
  },
  {
    href: '/painel',
    n: '5',
    titulo: 'Painel da tese',
    desc: 'Funil de fichas → aprovadas → abordadas → reuniões → propostas.',
  },
]

export default function Page() {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h1 className="max-w-3xl text-2xl leading-snug font-bold text-text sm:text-3xl">
          Não procure clientes.{' '}
          <span className="text-signal">Ensine o FARO a encontrá-los.</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          O FARO é desenhado para transformar teses comerciais em inteligência
          acionável: cruzar fontes públicas, detectar sinais, reunir evidências,
          calcular aderência e apresentar as empresas que merecem ser abordadas —
          com o porquê, a fonte e o momento.
        </p>
      </section>

      <Painel>
        <PainelHead titulo="Estado real deste protótipo" />
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="space-y-2 border-b border-border p-4 sm:border-r sm:border-b-0">
            <p className="text-[10px] font-semibold tracking-widest text-signal uppercase">
              O que existe hoje
            </p>
            <ul className="space-y-1 text-xs leading-relaxed text-text-secondary">
              <li>· O canon do produto (modelo v2 consolidado)</li>
              <li>· Os três pareceres da Junta e o quadro de vereditos</li>
              <li>· A identidade visual documentada</li>
              <li>· Esta maquete de interface, com dados fictícios</li>
            </ul>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-[10px] font-semibold tracking-widest text-fresh-old uppercase">
              O que NÃO existe hoje
            </p>
            <ul className="space-y-1 text-xs leading-relaxed text-text-secondary">
              <li>· Motor de caça — nenhuma varredura roda</li>
              <li>· Coleta de fonte — nada foi coletado de lugar algum</li>
              <li>· Banco de dados, score real, cobrança, checkout</li>
              <li>· Qualquer integração ou chamada externa</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border bg-surface-2 px-4 py-3">
          <p className="text-xs leading-relaxed text-text-secondary">
            O motor só nasce com um <strong className="text-text">design
            partner pagante</strong>. Isso é decisão registrada, não atraso: a
            ordem da casa é validar antes de erguer.
          </p>
        </div>
      </Painel>

      <Painel>
        <PainelHead titulo="As cinco telas" meta="dados ilustrativos" />
        <ul>
          {TELAS.map((t) => (
            <li key={t.href} className="border-b border-border last:border-b-0">
              <Link
                href={t.href}
                className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="num mt-0.5 w-5 shrink-0 text-xs text-text-muted">
                  {t.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text group-hover:text-signal">
                    {t.titulo}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
                    {t.desc}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Painel>

      <Painel>
        <PainelHead titulo="As leis que a interface é obrigada a carregar" />
        <div className="divide-y divide-border">
          {[
            {
              t: 'Lei das Camadas',
              d: 'DADO → SINAL → INFERÊNCIA → TESE → OPORTUNIDADE. Cada uma aparece rotulada na tela. Dado observado nunca se parece com hipótese.',
            },
            {
              t: 'Fonte e data andam com a afirmação',
              d: 'Nenhuma linha existe sem fonte, data de coleta, data de referência e regra de transformação — na própria linha, nunca em rodapé.',
            },
            {
              t: 'Score explicável',
              d: 'O total é a soma ponderada de dimensões visíveis. Nunca um número atribuído sem decomposição.',
            },
            {
              t: 'Proxy nunca vira fato',
              d: 'Faturamento que não é público aparece como proxy declarado. Número inventado é proibido.',
            },
            {
              t: 'Linguagem de investigação',
              d: '"Sinais compatíveis para investigação" — nunca "elegível", "crédito garantido" ou "direito a R$ X".',
            },
          ].map((l) => (
            <div key={l.t} className="px-4 py-3">
              <p className="text-xs font-semibold text-text">{l.t}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                {l.d}
              </p>
            </div>
          ))}
        </div>
      </Painel>
    </div>
  )
}
