import type { Metadata } from 'next'
import { Painel, PainelHead } from '@/components/ui'
import {
  ENTREGAS,
  EVIDENCIAS,
  FICHA,
  MERCADO,
  OFERTA,
  PARCELAS,
  PRAZOS,
  RAZOES_CONTRA,
} from '@/data/fundador'

/*
  PÁGINA FORA DO MAPA.

  · `robots: noindex, nofollow` aqui, somando ao noindex que o layout já aplica
    ao site inteiro enquanto o FARO segue em stealth.
  · Fora de sitemap: esta maquete não tem `sitemap.ts` nem `robots.ts`, então
    não há mapa de onde sair. Se algum dia existir, esta rota fica de fora.
  · Não linkada: nenhuma entrada em `Nav.tsx`, nenhum link de nenhuma página.
    Chega-se aqui digitando o endereço.
*/
export const metadata: Metadata = {
  title: 'Operador Fundador — FARO™',
  robots: { index: false, follow: false, nocache: true },
}

const TOTAL = PARCELAS.reduce((s, p) => s + p.valor * p.peso, 0)

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      {/* ── a · ABERTURA ──────────────────────────────────────────────── */}
      <header className="space-y-4">
        <p className="num text-[10px] tracking-widest text-signal uppercase">
          Leitura conjunta · página não listada
        </p>
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-text">
          Paulo, isto foi construído com a tua encomenda em mente.
        </h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Não vou descrever aqui o que você me pediu — isso a gente lê junto,
          ao vivo, com a tela na frente. Esta página existe para você ver o que
          o motor já faz antes da conversa, e chegar nela sabendo o que está
          comprando.
        </p>
      </header>

      {/* ── b · O QUE O SISTEMA JÁ FEZ ───────────────────────────────── */}
      <Painel>
        <PainelHead titulo="O que o sistema já fez" meta="19–20 de agosto de 2026" />
        <div className="space-y-4 px-4 py-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            Não é protótipo de tela. O motor rodou contra os lotes de julho e
            agosto de 2026 da Receita Federal, e o que está abaixo saiu do
            registro dessa corrida.
          </p>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { n: '~73,6 mi', r: 'estabelecimentos na base pública nacional' },
              { n: '600 mil', r: 'varridos nesta corrida' },
              { n: '13 min', r: 'de varredura de estoque' },
              { n: '2', r: 'fichas publicadas' },
            ].map((k) => (
              <div
                key={k.r}
                className="rounded-[var(--radius-instrument)] border border-border bg-surface-2 p-3"
              >
                <dt className="num text-lg font-bold text-text">{k.n}</dt>
                <dd className="mt-1 text-[11px] leading-snug text-text-secondary">
                  {k.r}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-xs leading-relaxed text-text-secondary">
            <strong className="text-text">
              O motor também sabe recusar o próprio trabalho.
            </strong>{' '}
            A Receita reembaralha quais empresas caem em qual arquivo a cada
            lote. Quem compara dois pedaços sem perceber isso entrega{' '}
            <span className="num text-text">4,26 milhões</span> de
            &ldquo;empresa nova&rdquo; que não nasceram —{' '}
            <span className="num">10,5%</span> de sobreposição real entre um mês
            e outro. Por isso existe um freio: ele conta o movimento antes de
            gravar e, se passar do limite da fonte, para e não grava nada. Nesta
            corrida ele parou <span className="num text-text">duas vezes</span>,
            e estava certo nas duas.
          </p>
          <p className="text-[11px] leading-relaxed text-text-muted">
            Esse número de 4,26 milhões é a medição do estrago evitado no
            desenho — não uma recusa que aconteceu. O freio existe para que essa
            corrida nunca chegue a rodar.
          </p>
        </div>
      </Painel>

      {/* ── b.2 · A FICHA ────────────────────────────────────────────── */}
      <Painel>
        <PainelHead
          titulo="Uma ficha real desta corrida"
          meta="identificação retirada"
        />
        <div className="space-y-5 px-4 py-4">
          <p className="text-xs leading-relaxed text-text-secondary">
            Esta ficha saiu da caçada que a ALSHAM rodou{' '}
            <strong className="text-text">para si mesma</strong> — usamos o
            produto em casa antes de vender. Score, dimensões, evidências e
            razões contra são os valores gravados no banco. Retiramos o CNPJ e a
            razão social: o que interessa aqui é a forma da entrega.
          </p>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-border pb-4">
            <span className="num text-4xl leading-none font-bold text-signal">
              {FICHA.score}
            </span>
            <span className="num text-sm text-text-muted">/100</span>
            <span className="num rounded-[var(--radius-instrument)] border border-border-strong bg-surface-2 px-2 py-1 text-xs font-bold text-text">
              grade {FICHA.grade}
            </span>
            <span className="text-[11px] text-text-secondary">
              frescor: {FICHA.frescor}
            </span>
            <span className="num text-[11px] text-text-muted">
              {FICHA.identificacao}
            </span>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              O que disparou
            </p>
            <p className="text-sm text-text">{FICHA.gatilho}</p>
            <p className="num mt-1 text-[11px] text-text-secondary">
              detectado no {FICHA.detectadoEm}
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              Como o {FICHA.score} foi formado
            </p>
            <p className="mb-3 text-[11px] leading-relaxed text-text-secondary">
              O total não é atribuído por ninguém: é a soma ponderada das seis
              dimensões abaixo. Some e confira —{' '}
              <span className="num text-text">{TOTAL.toFixed(1)}</span>.
            </p>
            <ul className="space-y-2.5">
              {PARCELAS.map((p) => (
                <li key={p.dimensao} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-24 shrink-0 text-[11px] leading-snug text-text-secondary sm:w-40">
                      {p.rotulo}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <span
                        className="block h-full bg-signal-dim"
                        style={{ width: `${p.valor}%` }}
                      />
                    </span>
                    <span className="num w-10 shrink-0 text-right text-[11px] text-text">
                      {p.valor.toFixed(1)}
                    </span>
                    <span className="num w-11 shrink-0 text-right text-[10px] text-text-muted">
                      ×{p.peso.toFixed(2)}
                    </span>
                  </div>
                  <p className="pl-0 text-[11px] leading-relaxed text-text-muted sm:pl-42">
                    {p.porQue}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              Cada linha com a fonte e a data
            </p>
            <ul className="divide-y divide-border rounded-[var(--radius-instrument)] border border-border">
              {EVIDENCIAS.map((e) => (
                <li key={e.texto} className="flex items-start gap-2.5 px-3 py-2.5">
                  <span
                    className={
                      e.camada === 'SINAL'
                        ? 'num shrink-0 rounded-[var(--radius-instrument)] border border-signal px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-signal'
                        : 'num shrink-0 rounded-[var(--radius-instrument)] border border-border-strong px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-text'
                    }
                  >
                    {e.camada}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text">
                      {e.texto}
                      {e.atendido ? null : (
                        <span className="text-fresh-warn"> · não atendido</span>
                      )}
                    </p>
                    <p className="num text-[10px] leading-relaxed text-text-secondary">
                      {e.fonte} · {e.referenteA}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-instrument)] border border-fresh-warn/40 bg-surface-2 p-3">
            <p className="mb-2 text-[10px] font-semibold tracking-widest text-fresh-warn uppercase">
              Por que não perseguir — vem junto, sempre
            </p>
            <ul className="space-y-1.5">
              {RAZOES_CONTRA.map((r) => (
                <li key={r} className="text-[11px] leading-relaxed text-text-secondary">
                  — {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-instrument)] border border-border p-3">
            <p className="mb-1 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              Valor esperado: {FICHA.ev}
            </p>
            <p className="text-[11px] leading-relaxed text-text-secondary">
              {FICHA.evPorQue}
            </p>
          </div>
        </div>
      </Painel>

      {/* ── c · O QUE VOCÊ RECEBE ────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo={OFERTA.rotulo} meta="o que entra" />
        <div className="space-y-4 px-4 py-4">
          <ul className="space-y-3">
            {ENTREGAS.map((e) => (
              <li key={e.item} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm text-text">{e.item}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">
                  {e.nota}
                </p>
              </li>
            ))}
          </ul>

          <div className="grid gap-2 sm:grid-cols-2">
            {PRAZOS.map((p) => (
              <div
                key={p.o}
                className="rounded-[var(--radius-instrument)] border border-border bg-surface-2 px-3 py-2"
              >
                <p className="text-[11px] text-text-secondary">{p.o}</p>
                <p className="num text-sm text-text">{p.quando}</p>
              </div>
            ))}
          </div>

          <p className="border-l-2 border-border-strong pl-3 text-[11px] leading-relaxed text-text-secondary">
            O que está prometido acima é <strong className="text-text">trabalho</strong>:
            varredura, ficha, censo, alerta, e o prazo de cada um. Nada aqui
            promete reunião marcada, proposta aceita ou contrato fechado — isso
            depende de quem liga, e o FARO não mede nem garante.
          </p>
        </div>
      </Painel>

      {/* ── d · MERCADO ──────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="O que o mercado cobra por perto disso" />
        <div className="space-y-4 px-4 py-4">
          <ul className="space-y-2.5">
            {MERCADO.map((m) => (
              <li
                key={m.categoria}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border pb-2.5 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-xs text-text">{m.categoria}</p>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="num text-[10px] text-text-muted underline decoration-dotted underline-offset-2 hover:text-signal"
                  >
                    {m.fonte}
                  </a>
                </div>
                <span
                  className={
                    m.publicaPreco
                      ? 'num shrink-0 text-xs text-text'
                      : 'num shrink-0 text-xs text-text-muted'
                  }
                >
                  {m.faixa}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-xs leading-relaxed text-text-secondary">
            <strong className="text-text">
              Esses estudos entregam uma foto; o FARO monitora o filme.
            </strong>{' '}
            A pesquisa responde como o mercado estava no dia em que foi feita. O
            motor volta a olhar a cada lote e avisa quando alguma coisa muda.
          </p>

          <p className="text-[11px] leading-relaxed text-text-muted">
            Nota honesta, porque ela importa mais que a tabela: escopos variam
            muito, e a comparação acima é de{' '}
            <strong className="text-text-secondary">natureza</strong>, não de
            item por item. Três dos quatro fornecedores citados não publicam
            preço — conferimos as páginas deles em 20/08/2026 e todas pedem
            contato para orçar. Isso não é crítica a eles: é como o mercado
            funciona. Vale só notar que o preço do FARO está escrito aqui
            embaixo, sem reunião no meio.
          </p>
        </div>
      </Painel>

      {/* ── e · A OFERTA ─────────────────────────────────────────────── */}
      <Painel className="border-signal/40">
        <PainelHead titulo="A oferta" meta={`vagas: ${OFERTA.vagas}`} />
        <div className="space-y-4 px-4 py-5">
          <div>
            <p className="text-[11px] tracking-wide text-text-secondary uppercase">
              {OFERTA.chamadaValor}
            </p>
            <p className="num mt-1 text-4xl leading-none font-bold text-text">
              {OFERTA.valor}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-text-secondary">
            {OFERTA.condicao}
          </p>

          <a
            href={OFERTA.ctaUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="block w-full rounded-[var(--radius-instrument)] bg-signal px-4 py-3 text-center text-sm font-semibold text-signal-fg transition-opacity hover:opacity-90"
          >
            {OFERTA.cta}
          </a>

          <p className="text-center text-[11px] text-text-muted">
            Sem formulário e sem pagamento nesta página. O botão abre uma
            conversa.
          </p>
        </div>
      </Painel>

      {/* ── f · RODAPÉ ───────────────────────────────────────────────────
          O escudo padrão (o aviso de que o FARO não afirma elegibilidade nem
          substitui profissional habilitado) já é servido pelo rodapé do layout,
          em toda página. Repetir aqui não reforça — cansa, e texto de proteção
          que cansa é texto que ninguém lê. O que fica é só o que é próprio
          desta página: a moldura da corrida. */}
      <footer className="border-t border-border pt-5">
        <p className="text-[11px] leading-relaxed text-text-secondary">
          Os números desta página vêm de uma corrida real sobre amostra local;
          a cobertura integral da base está em expansão.
        </p>
      </footer>
    </div>
  )
}
