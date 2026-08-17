import { Fila } from '@/components/Fila'

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-text">Fila de oportunidades</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
          Fichas publicadas pelas teses ativas. Cada uma nasce de um{' '}
          <strong className="text-text">evento</strong> — uma mudança de estado —
          e não de uma varredura de lista. Score decomposto, Evidence Grade,
          Freshness e limite de inferência ficam visíveis antes de qualquer
          decisão.
        </p>
      </header>

      <Fila />
    </div>
  )
}
