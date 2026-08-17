'use client'

import { useState } from 'react'
import { Painel, PainelHead, TagCamada } from '@/components/ui'
import { cn } from '@/lib/cn'

const CNAES = [
  'Indústria de transformação',
  'Comércio atacadista',
  'Transporte e logística',
  'Serviços de engenharia',
]

const PORTES = ['Demais (não ME/EPP)', 'EPP', 'Microempresa', 'Qualquer porte']

const UFS = ['GO', 'MG', 'SP', 'DF', 'MT', 'BA']

const SINAIS = [
  'Consumidor livre de energia',
  'Saída do Simples nos últimos 24 meses',
  'Nova filial registrada',
  'Mudança de faixa de porte',
  'Aumento de faixa de empregados',
  'Contrato público ganho',
]

export function FormTese() {
  const [nome, setNome] = useState('')
  const [cnae, setCnae] = useState(CNAES[0])
  const [porte, setPorte] = useState(PORTES[0])
  const [naoSimples, setNaoSimples] = useState(true)
  const [ufs, setUfs] = useState<string[]>(['GO'])
  const [sinais, setSinais] = useState<string[]>([SINAIS[0]])

  function alternar(lista: string[], v: string) {
    return lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]
  }

  return (
    <Painel>
      <PainelHead
        titulo="Nova tese"
        meta="formulário paramétrico · protótipo, não salva"
      />

      <div className="grid gap-0 lg:grid-cols-2">
        {/* ── PARÂMETROS ─────────────────────────────────────────────── */}
        <div className="space-y-4 border-b border-border p-4 lg:border-r lg:border-b-0">
          <div className="space-y-1.5">
            <label
              htmlFor="tese-nome"
              className="block text-[10px] font-semibold tracking-widest text-text-secondary uppercase"
            >
              Nome da tese
            </label>
            <input
              id="tese-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="ex.: Lucro Real com consumo livre de energia"
              className="w-full rounded-[var(--radius-instrument)] border border-border bg-bg px-2.5 py-2 text-sm text-text placeholder:text-text-muted focus:border-signal focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="tese-cnae"
                className="block text-[10px] font-semibold tracking-widest text-text-secondary uppercase"
              >
                Grupo de CNAE
              </label>
              <select
                id="tese-cnae"
                value={cnae}
                onChange={(e) => setCnae(e.target.value)}
                className="w-full rounded-[var(--radius-instrument)] border border-border bg-bg px-2.5 py-2 text-sm text-text focus:border-signal focus:outline-none"
              >
                {CNAES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="tese-porte"
                className="block text-[10px] font-semibold tracking-widest text-text-secondary uppercase"
              >
                Porte declarado
              </label>
              <select
                id="tese-porte"
                value={porte}
                onChange={(e) => setPorte(e.target.value)}
                className="w-full rounded-[var(--radius-instrument)] border border-border bg-bg px-2.5 py-2 text-sm text-text focus:border-signal focus:outline-none"
              >
                {PORTES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="space-y-1.5">
            <legend className="text-[10px] font-semibold tracking-widest text-text-secondary uppercase">
              UF
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {UFS.map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={ufs.includes(u)}
                  onClick={() => setUfs(alternar(ufs, u))}
                  className={cn(
                    'num rounded-[var(--radius-instrument)] border px-2 py-1 text-xs transition-colors',
                    ufs.includes(u)
                      ? 'border-signal bg-signal text-signal-fg'
                      : 'border-border text-text-secondary hover:border-border-strong hover:text-text',
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={naoSimples}
              onChange={(e) => setNaoSimples(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--color-signal)]"
            />
            <span className="text-xs text-text">
              Apenas não optantes do Simples Nacional
            </span>
          </label>

          <fieldset className="space-y-1.5">
            <legend className="text-[10px] font-semibold tracking-widest text-text-secondary uppercase">
              Sinais exigidos
            </legend>
            <div className="space-y-1">
              {SINAIS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={sinais.includes(s)}
                  onClick={() => setSinais(alternar(sinais, s))}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-[var(--radius-instrument)] border px-2 py-1.5 text-left text-xs transition-colors',
                    sinais.includes(s)
                      ? 'border-signal text-signal'
                      : 'border-border text-text-secondary hover:border-border-strong hover:text-text',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full',
                      sinais.includes(s) ? 'bg-signal' : 'bg-border-strong',
                    )}
                    aria-hidden
                  />
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2 border-t border-border pt-3">
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-[var(--radius-instrument)] border border-border bg-surface-2 px-3 py-2 text-xs text-text-muted"
            >
              Salvar tese — indisponível no protótipo
            </button>
            <p className="text-[11px] leading-relaxed text-text-muted">
              Não há backend. Nada é salvo, nada é enviado, nenhuma varredura é
              disparada. O formulário existe para mostrar que a tese é{' '}
              <strong className="text-text-secondary">paramétrica</strong> — o
              assinante monta a hipótese sozinho, sem consultoria e sem SQL
              manual.
            </p>
          </div>
        </div>

        {/* ── LEITURA EM CAMADAS ─────────────────────────────────────── */}
        <div className="space-y-3 p-4">
          <p className="text-[10px] font-semibold tracking-widest text-text-secondary uppercase">
            Como o FARO leria esta tese
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <TagCamada camada="DADO" />
              <p className="text-xs leading-relaxed text-text-secondary">
                Filtra o universo por{' '}
                <span className="text-text">{cnae.toLowerCase()}</span>, porte{' '}
                <span className="text-text">{porte.toLowerCase()}</span>
                {ufs.length > 0 ? (
                  <>
                    {' '}
                    e UF{' '}
                    <span className="num text-text">
                      {ufs.join(' · ') || '—'}
                    </span>
                  </>
                ) : (
                  <span className="text-fresh-warn"> · nenhuma UF marcada</span>
                )}
                {naoSimples ? ', restrito a não optantes do Simples' : ''}. Tudo
                aqui é dado observado na fonte.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <TagCamada camada="SINAL" />
              <p className="text-xs leading-relaxed text-text-secondary">
                {sinais.length === 0 ? (
                  <span className="text-fresh-warn">
                    Nenhum sinal exigido. Sem sinal, a tese vira filtro de lista
                    — e lista qualquer um vende.
                  </span>
                ) : (
                  <>
                    Procura mudança de estado em:{' '}
                    <span className="text-text">
                      {sinais.join(' · ').toLowerCase()}
                    </span>
                    . Sinal é derivado da comparação entre duas coletas, não lido
                    direto.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <TagCamada camada="INFERÊNCIA" />
              <p className="text-xs leading-relaxed text-text-secondary">
                Cruza dados e sinais e produz uma{' '}
                <strong className="text-text">hipótese</strong> de aderência —
                declarada como hipótese, com confiança medida e limite de
                inferência escrito.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <TagCamada camada="TESE" />
              <p className="text-xs leading-relaxed text-text-secondary">
                {nome.trim() ? (
                  <span className="text-text">{nome.trim()}</span>
                ) : (
                  <span className="text-text-muted">
                    (a tese ainda não tem nome)
                  </span>
                )}{' '}
                — a lógica comercial é do assinante. O FARO não escolhe a tese;
                ele a executa e recalibra com o julgamento.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <TagCamada camada="OPORTUNIDADE" />
              <p className="text-xs leading-relaxed text-text-secondary">
                Só existe quando os critérios mínimos são atingidos. A ficha diz{' '}
                <strong className="text-text">
                  &ldquo;sinais compatíveis para investigação&rdquo;
                </strong>{' '}
                — nunca &ldquo;empresa elegível&rdquo; nem &ldquo;crédito
                garantido&rdquo;.
              </p>
            </div>
          </div>

          <div className="rounded-[var(--radius-instrument)] border border-border bg-surface-2 p-3">
            <p className="text-[11px] leading-relaxed text-text-secondary">
              A varredura seria em <strong className="text-text">lote, de
              madrugada</strong>, depositando fichas já pontuadas. O assinante lê
              ficha pronta em milissegundos — nunca espera o motor pensar.
            </p>
          </div>
        </div>
      </div>
    </Painel>
  )
}
