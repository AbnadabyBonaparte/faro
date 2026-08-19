import { DIMENSOES, CAMADAS, CAMADAS_CREDITO } from '@faro/core'

/**
 * Shell da Onda 1. Nao e tela de produto — e a prova de que o app enxerga o
 * dominio (@faro/core) e de que a fundacao esta de pe.
 *
 * Telas de produto sao Onda 4.
 */
export default function Page() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <header>
        <h1 style={{ fontSize: 22, letterSpacing: '0.2em', margin: 0 }}>
          FARO<span style={{ color: '#2ed3a3' }}>·</span>
        </h1>
        <p style={{ color: '#8a9aa3', fontSize: 13, marginTop: 4 }}>
          Inteligência Contínua de Oportunidades
        </p>
      </header>

      <section
        style={{
          border: '1px solid #1c262c',
          borderRadius: 3,
          padding: 16,
          background: '#0c1216',
        }}
      >
        <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Estado desta onda
        </h2>
        <ul style={{ color: '#8a9aa3', fontSize: 13, lineHeight: 1.7, paddingLeft: 18 }}>
          <li>Domínio tipado em <code>@faro/core</code> — {DIMENSOES.length} dimensões de score</li>
          <li>Lei das Camadas: {CAMADAS.join(' → ')}</li>
          <li>Camadas do crédito: {CAMADAS_CREDITO.join(' → ')}</li>
          <li>Schema v1 com RLS FORCE em 100% das tabelas</li>
        </ul>
        <p style={{ color: '#5a6a73', fontSize: 12, marginBottom: 0 }}>
          Sem motor, sem coleta, sem banco conectado, sem autenticação ligada.
          O que existe aqui é fundação.
        </p>
      </section>
    </div>
  )
}
