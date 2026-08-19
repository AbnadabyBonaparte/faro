import { EtapaNaoImplementada, type ResultadoEtapa } from '../index.js'

/**
 * Baixa o lote bruto da fonte e grava snapshot em jazida.snapshots, sempre com collected_at, reference_date, source_version e hash.
 */
export const coletar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'coleta',
      onda: 2,
      implementada: false,
      descricao: 'Baixa o lote bruto da fonte e grava snapshot em jazida.snapshots, sempre com collected_at, reference_date, source_version e hash.',
      exige: ['projeto Supabase provisionado', 'fonte registrada em fontes.source_registry', 'fonte provada viva antes de prometida'],
    }
  },

  executar(): never {
    throw new EtapaNaoImplementada('coleta', 2)
  },
}
