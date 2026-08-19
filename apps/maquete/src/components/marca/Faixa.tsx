import { cn } from '@/lib/cn'

/**
 * Faixa de largura total com miolo centralizado.
 *
 * O `main` do layout deixou de ser um container justamente para isto: seções
 * de site de verdade sangram de ponta a ponta e centralizam só o conteúdo.
 * Sem isso, todo hero fica preso numa caixa de 72rem com respiro de 1rem —
 * que é exatamente a cara de protótipo que a Rodada 2 veio tirar.
 */
export function Faixa({
  children,
  className,
  miolo,
  fundo,
}: {
  children: React.ReactNode
  className?: string
  miolo?: string
  fundo?: string
}) {
  return (
    <section
      className={cn('relative border-b border-border', className)}
      style={
        fundo === undefined
          ? undefined
          : {
              backgroundImage: `url(${fundo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
            }
      }
    >
      <div className={cn('mx-auto max-w-6xl px-4 py-10', miolo)}>{children}</div>
    </section>
  )
}

/**
 * Hero das páginas internas: uma manchete curta, uma linha de contexto, e a
 * placa da direção C atrás. Curadoria P1 — hero é manchete, não parede de texto.
 */
export function HeroPagina({
  titulo,
  chamada,
  fundo,
  selo,
}: {
  titulo: string
  chamada: string
  fundo: string
  selo?: string
}) {
  return (
    <Faixa fundo={fundo} miolo="relative py-12" className="overflow-hidden bg-bg">
      {/* Véu: a arte é fundo, e manchete tem que cair sobre breu limpo. Sem
          isso o rótulo da placa disputa espaço com o texto em telas estreitas. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/30"
        aria-hidden
      />
      {selo !== undefined && (
        <p className="num relative mb-3 text-[10px] tracking-[0.24em] text-signal uppercase">
          {selo}
        </p>
      )}
      <h1 className="relative max-w-2xl text-2xl leading-tight font-bold text-text sm:text-3xl">
        {titulo}
      </h1>
      <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
        {chamada}
      </p>
    </Faixa>
  )
}
