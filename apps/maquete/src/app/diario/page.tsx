import type { Metadata } from 'next'
import { Painel, PainelHead } from '@/components/ui'
import {
  CONTRAFACTUAL,
  ETAPAS,
  LEDGER,
  MOLDURA,
  RECUSAS,
} from '@/data/esteira'

export const metadata: Metadata = {
  title: 'Diário de Mineração — FARO™',
  description:
    'O que o motor fez numa corrida real: o tempo de cada etapa, o que o freio ' +
    'recusou e o que a corrida não prova.',
}

/**
 * Tempo em unidade legível — e com a precisão que ele realmente tem.
 *
 * As etapas cronometradas por fora, com relógio de shell, têm granularidade de
 * 1 segundo. Escrever "3,0 s" nelas seria emprestar a precisão das outras.
 * Saem com "~" e sem casa decimal.
 */
function tempo(ms: number, medicao: 'motor' | 'relogio' = 'motor'): string {
  if (medicao === 'relogio') return `~${Math.round(ms / 1000)} s`
  if (ms < 1000) return `${ms} ms`
  if (ms < 90_000) return `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)} s`
  return `${Math.round(ms / 60_000)} min`
}

const MAIOR = Math.max(...ETAPAS.map((e) => e.ms))
const TOTAL = ETAPAS.reduce((s, e) => s + e.ms, 0)

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="num text-[10px] tracking-widest text-signal uppercase">
          Corrida real
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Diário de Mineração
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Todo o resto desta maquete é demonstração declarada. Esta página não:
          cada número abaixo saiu do registro de uso de uma corrida do motor
          contra {MOLDURA.lotes}, em {MOLDURA.quando}.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          O que você vê aqui é <strong className="text-text">processo</strong> —
          quanto tempo cada etapa levou, o que o motor recusou e o que a corrida
          não prova. Nenhum alvo, nenhum CNPJ: quem foi encontrado é entrega de
          assinante, não vitrine.
        </p>
      </header>

      {/* ── A MOLDURA. Vem antes dos números, nunca depois. ─────────────── */}
      <div className="rounded-[var(--radius-instrument)] border border-fresh-warn/40 bg-surface-2 p-4">
        <p className="mb-2 text-[10px] font-semibold tracking-widest text-fresh-warn uppercase">
          A moldura, antes dos números
        </p>
        <p className="text-xs leading-relaxed text-text-secondary">
          A corrida varreu{' '}
          <span className="num text-text">{MOLDURA.varridos}</span>{' '}
          estabelecimentos de um universo de{' '}
          <span className="num text-text">{MOLDURA.universo}</span> — cerca de{' '}
          <span className="num text-text">{MOLDURA.fatia}</span> da base
          nacional. {MOLDURA.porQueParcial}
        </p>
      </div>

      {/* ── 1 · A ESTEIRA ────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="A esteira" meta={`${tempo(TOTAL)} de ponta a ponta`} />
        <div className="px-4 py-3">
          <p className="mb-4 text-xs leading-relaxed text-text-secondary">
            As barras são proporcionais ao tempo real, sem escala corrigida. É
            para a desproporção aparecer: a varredura de estoque levou{' '}
            <span className="num text-text">833×</span> o tempo da comparação
            entre os dois meses.
          </p>

          <ul className="space-y-3">
            {ETAPAS.map((e) => (
              <li key={e.ordem} className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm text-text">
                    <span className="num mr-2 text-text-muted">
                      {String(e.ordem).padStart(2, '0')}
                    </span>
                    {e.rotulo}
                  </span>
                  <span className="num text-[11px] text-text-secondary">
                    {e.volume} ·{' '}
                    <span className="text-text">{tempo(e.ms, e.medicao)}</span>
                    {e.vazao ? ` · ${e.vazao}` : ''}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full bg-signal-dim"
                    style={{ width: `${Math.max(0.4, (e.ms / MAIOR) * 100)}%` }}
                  />
                </div>

                {e.nota ? (
                  <p className="text-[11px] leading-relaxed text-text-secondary">
                    {e.nota}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <p className="mt-5 border-l-2 border-signal-dim pl-3 text-xs leading-relaxed text-text-secondary">
            <strong className="text-text">
              O que custa não é achar a mudança — é varrer o que não mudou.
            </strong>{' '}
            É por isso que o preço da casa é de assinatura e não de consulta
            avulsa: a varredura roda igual, tendo achado alguma coisa ou não.
          </p>
        </div>
      </Painel>

      {/* ── 2 · O FREIO ──────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="O que o motor recusou" meta="2 recusas nesta corrida" />
        <div className="px-4 py-3">
          <p className="mb-4 text-xs leading-relaxed text-text-secondary">
            Antes de gravar qualquer mudança, o motor conta quantas chaves
            apareceram e sumiram entre os dois lotes. Se passar do limite
            declarado da fonte, ele para e não grava nada — porque lote
            incompleto, recorte parcial e mudança de formato produzem exatamente
            a mesma aparência de novidade, e nenhum dos três é notícia.
          </p>

          <ul className="space-y-3">
            {RECUSAS.map((r) => (
              <li
                key={r.causa}
                className="rounded-[var(--radius-instrument)] border border-border bg-surface-2 p-3"
              >
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="num text-sm font-bold text-fresh-stale">
                    {r.chaves}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    chaves em movimento aparente
                  </span>
                  <span className="text-sm text-text">· {r.causa}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  {r.detalhe}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-[var(--radius-instrument)] border border-border p-3">
            <p className="mb-1.5 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              Por que o freio existe
            </p>
            <p className="text-xs leading-relaxed text-text-secondary">
              A Receita reparticiona quais CNPJs caem em qual arquivo a cada
              lote. De{' '}
              <span className="num text-text">
                {CONTRAFACTUAL.chavesPorArquivo}
              </span>{' '}
              chaves de um arquivo, só{' '}
              <span className="num text-text">{CONTRAFACTUAL.sobrepostas}</span>{' '}
              <span className="num">({CONTRAFACTUAL.percentual})</span> estão nos
              dois meses. Um piloto ingênuo, rodando sobre um pedaço da fonte,
              entregaria{' '}
              <span className="num text-text">
                {CONTRAFACTUAL.falsosEventos}
              </span>{' '}
              de &ldquo;empresa nova&rdquo; falsas no primeiro dia.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-text-muted">
              Esse número é a medição do estrago evitado no desenho, não uma
              recusa que aconteceu. O freio nunca foi apresentado a 4,26 milhões
              de nada — ele existe para que essa corrida nunca chegue a rodar.
            </p>
          </div>
        </div>
      </Painel>

      {/* ── 3 · O LEDGER ─────────────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="O registro de uso" meta="o que a casa mede de si" />
        <div className="px-4 py-3">
          <ul className="space-y-2">
            {LEDGER.map((l) => (
              <li
                key={l.metrica}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2 last:border-b-0 last:pb-0"
              >
                <span className="num text-xs text-text-secondary">
                  {l.metrica}
                </span>
                <span className="num text-sm text-text">
                  {l.valor}{' '}
                  <span className="text-[11px] text-text-muted">
                    em {l.lancamentos}{' '}
                    {l.lancamentos === 1 ? 'lançamento' : 'lançamentos'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-text-secondary">
            O registro é gravado pelo próprio motor, em tabela que não aceita
            alteração nem remoção. Serve para a casa saber quanto custou — e para
            o assinante conferir o que foi feito por ele.
          </p>
        </div>
      </Painel>

      {/* ── 4 · O QUE NÃO PROVA ──────────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="O que esta corrida não prova" />
        <ul className="space-y-3 px-4 py-3 text-xs leading-relaxed text-text-secondary">
          <li>
            <strong className="text-text">
              Não prova cobertura nacional.
            </strong>{' '}
            Rodou sobre amostra local, cerca de {MOLDURA.fatia} da base. A
            capacidade de varrer a base inteira está medida e planejada; a
            corrida integral ainda não aconteceu.
          </li>
          <li>
            <strong className="text-text">
              Não prova detecção de empresa recém-aberta.
            </strong>{' '}
            Num pedaço da fonte, &ldquo;empresa nova&rdquo; e &ldquo;empresa que
            mudou de arquivo&rdquo; são indistinguíveis. Só a carga integral
            separa as duas.
          </li>
          <li>
            <strong className="text-text">Não prova resultado comercial.</strong>{' '}
            O motor entrega evidência organizada e o motivo de cada linha. Se
            aquilo vira reunião, proposta ou contrato depende de quem liga — e
            isso o FARO não mede nem promete.
          </li>
        </ul>
      </Painel>
    </div>
  )
}
