import { cn } from '@/lib/cn'

/**
 * A JANELA DE PRODUTO — a moldura em que a tela do FARO aparece.
 *
 * Curadoria P3 e P4: as referências de elite mostram o produto como UI, e a
 * mostram RECORTADA e estilizada, não como captura crua da tela inteira
 * (`CURADORIA-VISUAL.md` §1.2, Vanta). A moldura é de instrumento: barra fina,
 * rótulo monoespaçado, borda de 1px, canto baixo. Nada de três bolinhas de
 * sistema operacional — isto não é um Mac.
 */
export function JanelaProduto({
  rotulo,
  meta,
  children,
  className,
}: {
  rotulo: string
  meta?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-[3px] border border-border-strong bg-surface',
        'shadow-[0_18px_44px_-24px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      <figcaption className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5">
        <span className="size-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
        <span className="num text-[10px] tracking-[0.18em] text-text-secondary uppercase">
          {rotulo}
        </span>
        {meta !== undefined && (
          <span className="num ml-auto truncate text-[10px] tracking-widest text-text-muted uppercase">
            {meta}
          </span>
        )}
      </figcaption>
      <div className="bg-bg">{children}</div>
    </figure>
  )
}
