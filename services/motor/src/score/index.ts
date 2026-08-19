import { EtapaNaoImplementada, type ResultadoEtapa } from '../index.ts'

/**
 * Calcula as 6 dimensoes e grava as PARCELAS. O total cai por trigger — o motor nao digita total.
 */
export const pontuar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'score',
      onda: 3,
      implementada: false,
      descricao: 'Calcula as 6 dimensoes e grava as PARCELAS. O total cai por trigger — o motor nao digita total.',
      exige: ['ficha criada', 'pesos versionados', 'calcularScore de @faro/core'],
    }
  },

  executar(): never {
    throw new EtapaNaoImplementada('score', 3)
  },
}
