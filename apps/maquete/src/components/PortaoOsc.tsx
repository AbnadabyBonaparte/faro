import { Painel, PainelHead } from '@/components/ui'

/**
 * A tela do portão. Mínima de propósito: um campo e um botão.
 *
 * O erro não diz o que estava errado — nem "chave curta", nem "chave
 * inexistente", nem quantos caracteres faltaram. Mensagem que explica o erro
 * ensina a acertar por tentativa, e este portão não tem limite de tentativa
 * para compensar.
 */
export function PortaoOsc({ errou }: { errou: boolean }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Painel>
        <PainelHead titulo="Página reservada" meta="acesso de fundador" />
        <form
          method="post"
          action="/api/osc/entrar"
          className="space-y-4 px-4 py-5"
        >
          <label htmlFor="chave" className="block">
            <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              Chave de acesso
            </span>
            <input
              id="chave"
              name="chave"
              type="password"
              required
              autoComplete="off"
              autoFocus
              aria-describedby={errou ? 'erro-chave' : undefined}
              className="num mt-2 w-full rounded-[var(--radius-instrument)] border border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-signal focus:outline-none"
              placeholder="••••••••••••"
            />
          </label>

          {errou ? (
            <p
              id="erro-chave"
              role="alert"
              className="border-l-2 border-fresh-old pl-2.5 text-xs leading-relaxed text-text-secondary"
            >
              Chave não confere.
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-[var(--radius-instrument)] bg-signal px-4 py-2.5 text-sm font-semibold text-signal-fg transition-opacity hover:opacity-90"
          >
            Entrar
          </button>

          <p className="text-[11px] leading-relaxed text-text-muted">
            Esta página é aberta por chave, não por conta. Não há cadastro, não
            há senha para recuperar e nada seu é guardado aqui.
          </p>
        </form>
      </Painel>
    </div>
  )
}
