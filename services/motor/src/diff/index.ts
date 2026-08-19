import { EtapaNaoImplementada, type ResultadoEtapa } from '../index.js'

/**
 * Compara o hash de cada chave_natural entre a coleta atual e a anterior. Onde muda, nasce um evento — a unidade de valor do FARO.
 */
export const diferenciar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'diff',
      onda: 2,
      implementada: false,
      descricao: 'Compara o hash de cada chave_natural entre a coleta atual e a anterior. Onde muda, nasce um evento — a unidade de valor do FARO.',
      exige: ['ao menos duas coletas da mesma fonte', 'tipo de evento cadastrado em eventos.tipos'],
    }
  },

  executar(): never {
    throw new EtapaNaoImplementada('diff', 2)
  },
}
