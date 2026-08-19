import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Nav } from '@/components/Nav'

/* O cartão de compartilhamento (`opengraph-image.png`) e o ícone (`icon.svg`,
   `apple-icon.png`) são detectados por convenção de arquivo do App Router.
   Ambos saem do gerador da marca — ver docs/canon/GALERIA-VISUAL.md.

   `metadataBase` vem do ambiente: o FARO segue em stealth e não tem domínio
   público selado. Sem env, cai em localhost — nunca num domínio inventado. */
const BASE = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'

const TITULO = 'FARO™ — Inteligência Contínua de Oportunidades'
const DESCRICAO =
  'Você descreve o padrão que procura. O FARO vigia as fontes públicas, ' +
  'detecta o que mudou e entrega a ficha — com a fonte, a data e o motivo em cada linha.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: TITULO,
  description: DESCRICAO,
  // 🔴 stealth: o reveal ainda não aconteceu. Nada de indexação.
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'FARO',
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: { card: 'summary_large_image', title: TITULO, description: DESCRICAO },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-bg text-text">

        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-2 px-4 py-4">
            <div className="flex items-baseline gap-3">
              <Link
                href="/"
                className="text-xl font-bold tracking-[0.2em] text-text"
              >
                FARO
                <span className="text-signal">·</span>
              </Link>
              <p className="text-[11px] text-text-secondary">
                Inteligência Contínua de Oportunidades
              </p>
            </div>
            <Link
              href="/precos"
              className="rounded-[var(--radius-instrument)] border border-border-strong px-3 py-1.5 text-xs text-text transition-colors hover:border-signal hover:text-signal"
            >
              Começar pela Caçada
            </Link>
          </div>
        </header>

        <Nav />

        <main>{children}</main>

        <footer className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-6">
            <p className="text-[11px] leading-relaxed text-text-secondary">
              O FARO organiza evidências para priorizar investigação comercial.
              Não afirma elegibilidade, não garante crédito, não emite parecer
              tributário e não substitui o profissional habilitado.
            </p>
            <p className="num text-[10px] tracking-widest text-text-muted uppercase">
              ALSHAM Global Commerce · motor ALSHAM
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
