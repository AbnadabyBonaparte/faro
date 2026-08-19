import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FARO',
  description: 'Inteligência Contínua de Oportunidades',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background: '#06090c',
          color: '#e4ebee',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {/*
          ANTI-QUANTUM — lei da casa. Enquanto o motor nao roda, toda tela declara.
          Ver docs/canon/IDENTIDADE-VISUAL.md §7.
        */}
        <div
          role="status"
          style={{
            borderBottom: '1px solid rgba(214,169,59,.4)',
            background: 'rgba(214,169,59,.1)',
            color: '#d6a93b',
            padding: '6px 16px',
            textAlign: 'center',
            fontSize: 11,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          ONDA 1 — FUNDAÇÃO · esqueleto sem motor, sem coleta, sem dado real
        </div>
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>{children}</main>
      </body>
    </html>
  )
}
