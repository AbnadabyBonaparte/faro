import { EtapaNaoImplementada, type ResultadoEtapa } from '../index.js'

/**
 * Monta a cadeia de evidencia, o adjacente, o por-que-nao e a acao PREPARADA. Publica a ficha no tenant.
 */
export const publicar = {
  descrever(): ResultadoEtapa {
    return {
      etapa: 'publica',
      onda: 4,
      implementada: false,
      descricao: 'Monta a cadeia de evidencia, o adjacente, o por-que-nao e a acao PREPARADA. Publica a ficha no tenant.',
      exige: ['score derivado', 'Regra de Pedro cumprida nos 4 movimentos', 'acao nasce preparada, nunca executada'],
    }
  },

  executar(): never {
    throw new EtapaNaoImplementada('publica', 4)
  },
}
