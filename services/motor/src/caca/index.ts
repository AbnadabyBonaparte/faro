import { EtapaNaoImplementada, type ResultadoEtapa } from '../index.js'

/**
 * Roda as teses ativas contra os eventos novos e decide quais viram ficha. Lote de madrugada, nunca tempo real.
 */
export const cacar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'caca',
      onda: 3,
      implementada: false,
      descricao: 'Roda as teses ativas contra os eventos novos e decide quais viram ficha. Lote de madrugada, nunca tempo real.',
      exige: ['eventos materializados', 'tese em estado ativa ou segmentada', 'certidao de proveniencia se for tese da casa'],
    }
  },

  executar(): never {
    throw new EtapaNaoImplementada('caca', 3)
  },
}
