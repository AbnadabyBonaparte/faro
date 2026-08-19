import { JanelaProduto } from './JanelaProduto'

/**
 * A ESTEIRA DA CAÇADA — o balcão da cozinha aberta.
 *
 * Quem pagou espera de 5 a 10 dias úteis. Esta é a tela que ele abre no meio da
 * espera para ver que o sistema não parou.
 *
 * Spec completa: `docs/canon/ESTEIRA-DA-CACADA.md`. As três leis que este
 * recorte já obedece, para não ensinar o vício errado à onda do app:
 *
 *  1. **Etapas, nunca porcentagem.** Porcentagem no meio de uma varredura é
 *     chute exibido com casa decimal — mentira com cara de precisão.
 *  2. **Número só quando é contagem fechada.** "2,1 M registros" aparece na
 *     etapa concluída; a etapa em curso não exibe número nenhum.
 *  3. **Zero animação.** Nada de barra andando com o relógio nem spinner sobre
 *     etapa parada. O estado atual é marcado por anel, não por movimento.
 */

type Etapa = {
  readonly nome: string
  readonly estado: 'concluida' | 'em-curso' | 'pendente'
  readonly hora?: string
  readonly detalhe?: string
}

const ETAPAS: readonly Etapa[] = [
  { nome: 'Aceite registrado', estado: 'concluida', hora: '14:02', detalhe: 'tese v1 · trilha imutável' },
  { nome: 'Varredura do território', estado: 'concluida', hora: '14:09', detalhe: '2,1 M registros varridos' },
  { nome: 'Candidatos em análise', estado: 'concluida', hora: '14:11', detalhe: '38 candidatos com evento' },
  { nome: 'Em revisão humana', estado: 'em-curso', hora: 'desde 09:30', detalhe: 'um analista lê cada candidato' },
  { nome: 'Entrega', estado: 'pendente', detalhe: 'dentro da janela de 5 a 10 dias úteis' },
]

const PONTO: Record<Etapa['estado'], string> = {
  concluida: 'border-signal bg-signal',
  'em-curso': 'border-signal bg-bg',
  pendente: 'border-border-strong bg-bg',
}

export function EsteiraCacada() {
  return (
    <ol className="px-4 py-3">
      {ETAPAS.map((e, i) => {
        const ultima = i === ETAPAS.length - 1
        const apagada = e.estado === 'pendente'
        return (
          <li key={e.nome} className="relative flex gap-3 pb-4 last:pb-0">
            {!ultima && (
              <span
                className="absolute top-4 bottom-0 left-[5px] w-px bg-border"
                aria-hidden
              />
            )}
            <span
              className={`relative mt-1 size-[11px] shrink-0 rounded-full border ${PONTO[e.estado]}`}
              aria-hidden
            >
              {e.estado === 'em-curso' && (
                <span className="absolute inset-[2px] rounded-full bg-signal" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className={`text-xs ${apagada ? 'text-text-muted' : 'text-text'}`}>
                  {e.nome}
                </span>
                {e.hora !== undefined && (
                  <span className="num text-[10px] text-text-secondary">{e.hora}</span>
                )}
                {e.estado === 'em-curso' && (
                  <span className="num text-[9px] tracking-widest text-signal uppercase">
                    etapa atual
                  </span>
                )}
              </div>
              {e.detalhe !== undefined && (
                <p className={`text-[11px] leading-relaxed ${apagada ? 'text-text-muted' : 'text-text-secondary'}`}>
                  {e.detalhe}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function RecorteEsteira() {
  return (
    <JanelaProduto rotulo="Esteira da Caçada" meta="CAC-0007">
      <EsteiraCacada />
    </JanelaProduto>
  )
}
