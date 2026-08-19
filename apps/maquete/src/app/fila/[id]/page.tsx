import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BadgeGrade,
  CaixaLimite,
  LinhaAfirmacao,
  Painel,
  PainelHead,
  ScoreDecomposto,
  SeloFreshness,
  TagCamada,
} from '@/components/ui'
import { OPORTUNIDADES, fonte, oportunidade, tese } from '@/data/mock'

export function generateStaticParams() {
  return OPORTUNIDADES.map((o) => ({ id: o.id }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const o = oportunidade(id)
  if (!o) notFound()

  const t = tese(o.teseId)

  // Fontes efetivamente citadas nesta ficha — sem repetição.
  const fontesCitadas = [...new Set(o.afirmacoes.map((a) => a.fonteId))].map(fonte)

  const dados = o.afirmacoes.filter((a) => a.camada === 'DADO')
  const sinais = o.afirmacoes.filter((a) => a.camada === 'SINAL')

  /**
   * Evidence Graph montado como texto. Canon §6.1.
   * Construído em JS e renderizado como uma única string — interleavar
   * expressões dentro de <pre> embaralha o espaçamento significativo.
   */
  const ramo = (itens: string[][]) =>
    itens.flatMap(([texto, procedencia], i) => {
      const ultimo = i === itens.length - 1
      const linhas = [`│   ${ultimo ? '└──' : '├──'} ${texto}`]
      if (procedencia) {
        linhas.push(`│   ${ultimo ? '   ' : '│  '}    ↳ ${procedencia}`)
      }
      return linhas
    })

  const grafo = [
    `EMPRESA · ${o.razaoSocial}`,
    '│',
    '├── PERFIL',
    `│   ├── CNAE ..... ${o.cnae}`,
    `│   ├── porte .... ${o.porte}  (proxy declarado, não receita medida)`,
    `│   └── local .... ${o.municipio}/${o.uf}`,
    '│',
    '├── DADO',
    ...ramo(
      dados.map((a) => [
        a.texto,
        `${a.fonteId} · coletado ${a.coletadoEm} · ref ${a.referenteA}`,
      ]),
    ),
    '│',
    '├── SINAIS',
    ...(sinais.length === 0
      ? ['│   └── (nenhum sinal observado nesta cadeia)']
      : ramo(
          sinais.map((a) => [
            a.texto,
            `${a.fonteId} · coletado ${a.coletadoEm} · ref ${a.referenteA}`,
          ]),
        )),
    '│',
    '├── FONTES',
    ...ramo(
      fontesCitadas.map((f) => [
        `${f.id} · ${f.orgao} · nível ${f.nivel} · status ${f.status}`,
        '',
      ]),
    ),
    '│',
    '├── TESE',
    `│   └── ${t.id} — ${t.nome}`,
    '│',
    '└── CONCLUSÃO',
    '    ├── FARO Score decomposto (ver painel acima)',
    `    ├── Evidence Grade ${o.grade}`,
    `    ├── Freshness ${o.freshness}`,
    '    └── Sinais compatíveis para investigação',
    '        (não é parecer tributário · não afirma elegibilidade)',
  ].join('\n')

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link
        href="/fila"
        className="inline-block text-[11px] text-text-secondary transition-colors hover:text-signal"
      >
        ← voltar para a fila
      </Link>

      {/* ── IDENTIFICAÇÃO ────────────────────────────────────────────── */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="num text-[11px] text-text-muted">{o.id}</span>
          <BadgeGrade grade={o.grade} />
          <SeloFreshness freshness={o.freshness} />
        </div>
        <h1 className="text-xl leading-snug font-bold text-text">
          {o.razaoSocial}
        </h1>
        <p className="num text-xs text-text-secondary">
          CNPJ {o.cnpj} · {o.cnae} · porte {o.porte} · {o.municipio}/{o.uf}
        </p>
      </header>

      {/* ── AS SEIS PERGUNTAS ────────────────────────────────────────── */}
      <Painel>
        <PainelHead
          titulo="Resumo da ficha"
          meta="a ficha responde em menos de dois minutos"
        />
        <dl className="divide-y divide-border">
          {[
            { p: 'Quem é a empresa', r: `${o.razaoSocial} · ${o.cnae} · ${o.municipio}/${o.uf}` },
            {
              p: 'Qual sinal foi observado',
              r: `${o.eventoGatilho} — detectado em ${o.detectadoEm}`,
            },
            {
              p: 'Por que combina com a tese',
              r: `${o.criteriosAtendidos} de ${o.criteriosTotais} critérios de "${t.nome}", com ${o.evidenciasIndependentes} evidências independentes`,
            },
            {
              p: 'Qual fonte sustenta cada afirmação',
              r: `${fontesCitadas.map((f) => `${f.id} (${f.orgao})`).join(' · ')} — declaradas linha por linha abaixo`,
            },
            { p: 'Qual é o limite da inferência', r: o.limiteInferencia },
            { p: 'Qual ação tomar agora', r: o.proximaAcao },
          ].map((x) => (
            <div key={x.p} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
              <dt className="text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                {x.p}
              </dt>
              <dd className="text-xs leading-relaxed text-text-secondary">
                {x.r}
              </dd>
            </div>
          ))}
        </dl>
      </Painel>

      {/* ── SCORE ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Painel>
          <PainelHead titulo="FARO Score" meta="decomposto e ponderado" />
          <div className="p-4">
            <ScoreDecomposto
              dimensoes={o.dimensoes}
              criteriosAtendidos={o.criteriosAtendidos}
              criteriosTotais={o.criteriosTotais}
              evidenciasIndependentes={o.evidenciasIndependentes}
              sinaisRecentes={o.sinaisRecentes}
            />
          </div>
        </Painel>

        <Painel>
          <PainelHead titulo="Limite de inferência" meta="campo obrigatório" />
          <div className="space-y-3 p-4">
            <CaixaLimite texto={o.limiteInferencia} />
            <p className="text-[11px] leading-relaxed text-text-muted">
              Este campo existe porque proxy não vira fato. O que é dado
              observado, o que é proxy e o que depende de validação humana ficam
              separados — na ficha, não no rodapé.
            </p>
          </div>
        </Painel>
      </div>

      {/* ── EVIDENCE GRAPH ───────────────────────────────────────────── */}
      <Painel>
        <PainelHead
          titulo="Evidence Graph"
          meta="empresa → dados → sinais → fontes → tese → conclusão"
        />
        <div className="overflow-x-auto p-4">
          <pre className="num min-w-max text-[11px] leading-relaxed text-text-secondary">
            {grafo}
          </pre>
        </div>
      </Painel>

      {/* ── AFIRMAÇÕES LINHA POR LINHA ───────────────────────────────── */}
      <Painel>
        <PainelHead
          titulo="Cadeia de afirmações"
          meta="fonte · data de coleta · data de referência · transformação · limite"
        />
        <div className="border-b border-border bg-surface-2 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] tracking-widest text-text-muted uppercase">
              camadas
            </span>
            <TagCamada camada="DADO" />
            <span className="text-text-muted">→</span>
            <TagCamada camada="SINAL" />
            <span className="text-text-muted">→</span>
            <TagCamada camada="INFERÊNCIA" />
            <span className="text-text-muted">→</span>
            <TagCamada camada="TESE" />
            <span className="text-text-muted">→</span>
            <TagCamada camada="OPORTUNIDADE" />
          </div>
          <p className="mt-1.5 text-[11px] text-text-secondary">
            Dado observado e hipótese não podem parecer a mesma coisa na tela. O
            rótulo de camada é obrigatório em cada afirmação.
          </p>
        </div>
        <ul>
          {o.afirmacoes.map((a, i) => (
            <LinhaAfirmacao key={`${a.camada}-${i}`} a={a} />
          ))}
        </ul>
      </Painel>

      {/* ── FONTES DESTA FICHA ───────────────────────────────────────── */}
      <Painel>
        <PainelHead titulo="Fontes citadas nesta ficha" />
        <ul className="divide-y divide-border">
          {fontesCitadas.map((f) => (
            <li key={f.id} className="px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="num text-[11px] text-text-muted">{f.id}</span>
                <span className="text-xs font-semibold text-text">{f.nome}</span>
                <span className="num text-[11px] text-text-secondary">
                  {f.orgao} · {f.nivel}
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
              <p className="num mt-0.5 text-[11px] text-text-secondary">
                periodicidade {f.periodicidade} · última coleta {f.ultimaColeta}{' '}
                · cobertura: {f.cobertura}
              </p>
              {f.status !== 'viva' ? (
                <p className="mt-1 text-[11px] leading-relaxed text-fresh-stale">
                  fallback aplicado: {f.fallback}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-3">
          <Link
            href="/fontes"
            className="text-[11px] text-text-secondary transition-colors hover:text-signal"
          >
            ver o registro completo de fontes →
          </Link>
        </div>
      </Painel>
    </div>
  )
}
