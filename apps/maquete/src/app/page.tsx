import Link from 'next/link'
import { FONTES } from '@/data/mock'
import { Painel, PainelHead } from '@/components/ui'
import { Faixa } from '@/components/marca/Faixa'
import { CurvaMisterio } from '@/components/marca/CurvaMisterio'
import { FunilCamadas, GLOSAS } from '@/components/marca/FunilCamadas'
import { MedidorScore } from '@/components/marca/MedidorScore'
import { ReguaFreshness } from '@/components/marca/ReguaFreshness'
import {
  LinkTela, RecorteFicha, RecorteFila, RecorteWatch,
} from '@/components/marca/FragmentosProduto'
import { RecorteEsteira } from '@/components/marca/EsteiraCacada'

/*
  A HOME — estrutura tirada da curadoria, não do gosto.
  Cada seção abaixo aponta a linha de `docs/canon/CURADORIA-VISUAL.md` que a
  sustenta. Quem quiser mudar a ordem, muda a curadoria antes.
*/

const ESTADO_FONTE: Record<string, string> = {
  viva: 'text-fresh-ok',
  degradada: 'text-fresh-warn',
  'indisponível': 'text-fresh-old',
}

export default function Page() {
  return (
    <>
      {/* ── HERO · curadoria P1: manchete curta, subtítulo curto, 2 CTAs ──── */}
      <section className="relative overflow-hidden border-b border-border bg-bg">
        {/* A arte é FUNDO: o funil vive na direita, e o véu à esquerda garante
            que a manchete caia sempre sobre breu limpo, em qualquer largura. */}
        <div
          className="pointer-events-none absolute inset-0 hidden bg-cover bg-no-repeat md:block"
          style={{
            backgroundImage: 'url(/brand/rodada-2/hero-home-2400x1000.svg)',
            backgroundPosition: 'right center',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-50 md:hidden"
          style={{ backgroundImage: 'url(/brand/rodada-2/hero-home-mobile-820x760.svg)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-transparent md:to-bg/0 md:via-bg/70"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <h1 className="max-w-xl text-3xl leading-[1.15] font-bold text-text sm:text-5xl">
            Não procure clientes.{' '}
            <span className="text-signal">Ensine o FARO a encontrá-los.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
            Você descreve o padrão que procura. O FARO vigia as fontes públicas,
            detecta o que mudou e entrega a ficha — com a fonte, a data e o
            motivo em cada linha.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/precos"
              className="rounded-[var(--radius-instrument)] bg-signal px-5 py-2.5 text-sm font-semibold text-signal-fg transition-opacity hover:opacity-90"
            >
              Começar pela Caçada
            </Link>
            <Link
              href="/fila/OP-1041"
              className="rounded-[var(--radius-instrument)] border border-border-strong px-5 py-2.5 text-sm text-text transition-colors hover:border-signal hover:text-signal"
            >
              Ver uma ficha por dentro
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCEDÊNCIA · curadoria P2 ──────────────────────────────────────
          As referências põem mural de logos de cliente colado no hero. O FARO
          está em stealth e não tem cliente — mural vazio seria fraude. A moeda
          de prova que a casa TEM é a procedência da fonte. Ver curadoria §3,
          P-CONTRA.                                                          */}
      <Faixa className="bg-surface" miolo="py-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <p className="num text-[10px] tracking-[0.22em] text-text-muted uppercase">
            Fontes que o FARO escuta
          </p>
          {FONTES.slice(0, 5).map((f) => (
            <span key={f.id} className="flex items-baseline gap-2">
              <span className="num text-[11px] text-text-secondary">{f.orgao}</span>
              <span className={`num text-[10px] uppercase ${ESTADO_FONTE[f.status] ?? 'text-text-muted'}`}>
                {f.status}
              </span>
            </span>
          ))}
          <LinkTela href="/fontes">Registro completo</LinkTela>
        </div>
      </Faixa>

      {/* ── COMO FUNCIONA · o gráfico vivo (ordem §2.1) ─────────────────── */}
      <Faixa className="bg-bg" miolo="py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <p className="num text-[10px] tracking-[0.22em] text-signal uppercase">
              Como funciona
            </p>
            <h2 className="mt-3 text-xl leading-snug font-bold text-text sm:text-2xl">
              Cinco camadas separam o cadastro do que vale uma ligação.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              O gráfico ao lado não é ilustração: cada traço cinza é um registro
              que não passou da camada. O traço jade é o que passou. É assim que
              o FARO chega a uma ficha — descartando, com critério declarado, em
              cada degrau.
            </p>
            <dl className="mt-6 space-y-3 border-l border-border pl-4">
              {GLOSAS.map((g) => (
                <div key={g.nome}>
                  <dt className="num text-[10px] tracking-[0.18em] text-signal uppercase">
                    {g.nome}
                  </dt>
                  <dd className="text-xs leading-relaxed text-text-secondary">{g.glosa}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[var(--radius-instrument)] border border-border bg-surface/40 p-4">
            <FunilCamadas />
          </div>
        </div>
      </Faixa>

      {/* ── O PRODUTO · curadoria P3 e P4 ────────────────────────────────── */}
      <Faixa className="bg-surface" miolo="py-14">
        <p className="num text-[10px] tracking-[0.22em] text-signal uppercase">
          O produto
        </p>
        <h2 className="mt-3 max-w-2xl text-xl leading-snug font-bold text-text sm:text-2xl">
          Não é uma lista exportada. É uma ficha que se defende sozinha.
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="space-y-3">
            <RecorteFicha />
            <p className="text-xs leading-relaxed text-text-secondary">
              O score é a soma das dimensões visíveis. Não existe número
              atribuído sem decomposição — nem aqui, nem no produto.
            </p>
            <LinkTela href="/fila/OP-1041">Abrir a ficha inteira</LinkTela>
          </div>
          <div className="space-y-3">
            <RecorteFila />
            <p className="text-xs leading-relaxed text-text-secondary">
              A fila ordena por aderência à tese, não por tamanho da empresa.
              Cada linha carrega grau de evidência e frescor.
            </p>
            <LinkTela href="/fila">Ver a fila</LinkTela>
          </div>
          <div className="space-y-3">
            <RecorteWatch />
            <p className="text-xs leading-relaxed text-text-secondary">
              O Watch é o que mudou nas fontes e bateu numa tese viva. A unidade
              de valor é a mudança — nunca o cadastro parado.
            </p>
            <LinkTela href="/watch">Ver o Watch</LinkTela>
          </div>
        </div>
      </Faixa>

      {/* ── A COZINHA ABERTA · a Lei do Tempo de Cozinha na superfície ─────
          MODELO-DE-NEGOCIO.md §D.5. A janela aparece ANTES de decidir e
          reaparece no Aceite — métrica que informa e some do acordo é métrica
          que ninguém pode cobrar depois.                                    */}
      <Faixa className="bg-bg" miolo="py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="num text-[10px] tracking-[0.22em] text-signal uppercase">
              A cozinha é aberta
            </p>
            <h2 className="mt-3 text-xl leading-snug font-bold text-text sm:text-2xl">
              Entrega entre 5 e 10 dias úteis.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              O prazo respira com o volume de dados minerados no território da
              sua tese. Enquanto a caçada corre, você acompanha cada etapa com a
              hora em que ela aconteceu.
            </p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-text-secondary">
              A varredura é máquina e termina em minutos — isso é fácil de
              dizer. O que leva dias é a{' '}
              <strong className="text-text">revisão humana</strong>: alguém lê
              cada candidato, confere se a evidência sustenta a inferência e mata
              o que não presta. É esse tempo que você está comprando.
            </p>
            <p className="mt-4 max-w-md border-l border-signal-dim pl-3 text-xs leading-relaxed text-text-secondary">
              <strong className="text-text">Alertas não esperam.</strong> Watch e
              Eco saem no lote seguinte à detecção. Investigação amadurece;
              notícia corre.
            </p>
          </div>
          <RecorteEsteira />
        </div>
      </Faixa>

      {/* ── OS INSTRUMENTOS · curadoria P10, gráfico desenhado em código ─── */}
      <Faixa className="bg-bg" miolo="py-14">
        <p className="num text-[10px] tracking-[0.22em] text-signal uppercase">
          Os instrumentos
        </p>
        <h2 className="mt-3 max-w-2xl text-xl leading-snug font-bold text-text sm:text-2xl">
          Três leituras que o FARO mostra e quase ninguém mostra.
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Painel>
            <PainelHead titulo="Score decomposto" />
            <div className="p-4">
              <MedidorScore />
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                Seis dimensões, cada uma com peso declarado. O total é derivado
                delas — nunca digitado.
              </p>
            </div>
          </Painel>
          <Painel>
            <PainelHead titulo="Frescor" meta="a mesma linha envelhecendo" />
            <div className="p-4">
              <ReguaFreshness />
              <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                Verde não quer dizer "bom": quer dizer coletado agora. Vermelho
                não condena a empresa — condena a idade do dado.
              </p>
            </div>
          </Painel>
          <Painel className="lg:col-span-2">
            <PainelHead titulo="O que ainda falta saber" meta="e não vai a zero" />
            <div className="p-4">
              <CurvaMisterio />
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-text-secondary">
                A faixa de cima é a parte honesta do produto. O FARO organiza
                evidência para priorizar investigação: ele não afirma
                elegibilidade, não garante crédito e não substitui o
                profissional habilitado.
              </p>
            </div>
          </Painel>
        </div>
      </Faixa>


      {/* ── FECHO · curadoria P8: uma frase, UM CTA ──────────────────────── */}
      <Faixa className="border-b-0 bg-bg" miolo="py-16">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-xl leading-snug font-bold text-text sm:text-2xl">
            O sinal está vivo. A pergunta é se alguém está escutando.
          </p>
          <Link
            href="/precos"
            className="shrink-0 rounded-[var(--radius-instrument)] bg-signal px-6 py-3 text-sm font-semibold text-signal-fg transition-opacity hover:opacity-90"
          >
            Começar pela Caçada
          </Link>
        </div>
      </Faixa>
    </>
  )
}
