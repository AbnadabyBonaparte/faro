import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'FARO™ — Protótipo de interface',
  description:
    'Maquete de interface do FARO. Protótipo com dados ilustrativos: nenhum motor, ' +
    'nenhuma coleta, nenhum dado real.',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-bg text-text">
        {/*
          ANTI-QUANTUM — lei da casa.
          Banner permanente, não dismissível, em TODA tela, enquanto o motor não existir.
          Ver docs/canon/IDENTIDADE-VISUAL.md §7.
        */}
        <div
          role="status"
          className="sticky top-0 z-50 border-b border-fresh-warn/40 bg-fresh-warn/10 px-4 py-1.5 text-center backdrop-blur"
        >
          <p className="num text-[11px] tracking-wide text-fresh-warn">
            PROTÓTIPO — dados ilustrativos · nenhuma empresa, número ou coleta
            aqui é real · o motor não existe
          </p>
        </div>

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
            <p className="num text-[10px] tracking-widest text-text-muted uppercase">
              maquete v1 · em construção
            </p>
          </div>
        </header>

        <Nav />

        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

        <footer className="mt-12 border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-6">
            <p className="text-[11px] leading-relaxed text-text-secondary">
              Protótipo de interface. Não há backend, banco de dados, coleta de
              fontes, score real, cobrança ou integração de qualquer espécie.
              Todos os nomes de empresa, CNPJs, números e datas de coleta são
              fictícios e existem apenas para demonstrar o comportamento da
              interface.
            </p>
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
