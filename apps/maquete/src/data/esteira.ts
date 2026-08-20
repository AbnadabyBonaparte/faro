/* ============================================================================
   DIÁRIO DE MINERAÇÃO — a corrida real de 19–20/08/2026
   ============================================================================

   🔴 ESTE ARQUIVO É O ÚNICO DA MAQUETE COM NÚMERO REAL.

   Todo o resto de `src/data/` é mock declarado. Aqui não: cada número abaixo
   saiu do ledger (`uso.ledger`) e do log da esteira de uma corrida do motor
   contra os lotes de julho e agosto/2026 da Receita Federal.

   A LEI DESTA PÁGINA: PROCESSO, NUNCA PRESA.
   Nenhum CNPJ, nenhuma razão social, nenhum alvo, nenhum recorte de território.
   Contagem de candidato é métrica de esteira; QUEM são os candidatos é
   entregável de negócio e não mora em repositório público.

   Fonte primária: docs/ondas/CACADA-T-MED.md
   ========================================================================== */

/** Uma etapa da esteira, como o ledger registrou. */
export type Etapa = {
  readonly ordem: number
  readonly rotulo: string
  /** O que entrou. Já formatado — a unidade muda de etapa para etapa. */
  readonly volume: string
  /** Milissegundos medidos. Cru, para a barra poder ser proporcional. */
  readonly ms: number
  /**
   * QUEM CRONOMETROU. `motor` = o proprio motor devolveu `duracaoMs`, precisao
   * de milissegundo. `relogio` = medido por fora com relogio de shell, precisao
   * de 1 segundo. A tela marca as segundas com "~" — precisao emprestada e
   * mentira pequena, e mentira pequena e por onde a grande entra.
   */
  readonly medicao: 'motor' | 'relogio'
  /** Vazão medida, quando a etapa processa linha. */
  readonly vazao?: string
  readonly nota?: string
}

/** A corrida inteira, em ordem cronológica. */
export const ETAPAS: readonly Etapa[] = [
  {
    ordem: 1,
    rotulo: 'Carga · estabelecimentos',
    volume: '600.000 linhas',
    ms: 32_117,
    medicao: 'motor',
    vazao: '18.680 linhas/s',
  },
  {
    ordem: 2,
    rotulo: 'Carga · empresas',
    volume: '590.572 linhas',
    ms: 18_021,
    medicao: 'motor',
    vazao: '32.771 linhas/s',
  },
  {
    ordem: 3,
    rotulo: 'Varredura de estoque',
    volume: '600.000 × 590.572',
    ms: 801_957,
    medicao: 'motor',
    nota:
      'A tese casada contra a base inteira, sem nada ter mudado. É a etapa que ' +
      'custa — e é justamente a que o assinante não vê.',
  },
  {
    ordem: 4,
    rotulo: 'Recorte comparável',
    volume: '33.633 chaves',
    ms: 3_000,
    medicao: 'relogio',
    nota:
      'As chaves presentes nos dois lotes. Sem esse recorte, o diff compararia ' +
      'coisas que não se comparam.',
  },
  {
    ordem: 5,
    rotulo: 'Cargas do recorte',
    volume: '100.416 linhas',
    ms: 7_000,
    medicao: 'relogio',
  },
  {
    ordem: 6,
    rotulo: 'Diferença julho → agosto',
    volume: '33.633 × 33.633',
    ms: 963,
    medicao: 'motor',
    nota: '421 mudanças detectadas: 310 de situação cadastral, 111 de atividade.',
  },
  {
    ordem: 7,
    rotulo: 'Caça por evento',
    volume: '421 mudanças',
    ms: 802,
    medicao: 'motor',
  },
  {
    ordem: 8,
    rotulo: 'Publicação',
    volume: '2 fichas',
    ms: 192,
    medicao: 'motor',
  },
] as const

export type LancamentoLedger = {
  readonly metrica: string
  readonly valor: string
  readonly lancamentos: number
}

/** O ledger, que é o que a casa cobra e o que a casa paga. */
export const LEDGER: readonly LancamentoLedger[] = [
  { metrica: 'linhas_processadas', valor: '1.380.380', lancamentos: 7 },
  { metrica: 'ms_computacao', valor: '865.475', lancamentos: 11 },
  { metrica: 'ficha_publicada', valor: '2', lancamentos: 2 },
] as const

export type Recusa = {
  readonly chaves: string
  readonly causa: string
  readonly detalhe: string
}

/** As duas recusas do freio de churn — o motor dizendo não a si mesmo. */
export const RECUSAS: readonly Recusa[] = [
  {
    chaves: '17.815',
    causa: 'Recorte pela chave errada',
    detalhe:
      'O recorte foi feito só pelo número-base do CNPJ, mas a chave de um ' +
      'estabelecimento tem três partes. Os dois lados ficaram com contagens ' +
      'diferentes, e a diferença pareceu movimento.',
  },
  {
    chaves: '4.311',
    causa: 'Par de lotes errado',
    detalhe:
      'Um defeito do próprio motor — corrigido no mesmo dia — fez a comparação ' +
      'pegar um lote que não era o pretendido.',
  },
] as const

/* ──────────────────────────────────────────────────────────────────────────
   O CONTRAFACTUAL DOS 4,2 MILHÕES

   ⚠️ CUIDADO AO CITAR ESTE NÚMERO. Ele NÃO é "o freio recusou 4,2 milhões de
   falsos eventos" — o freio nunca foi apresentado a 4,2 milhões de nada.

   O que ele é: a medição, sobre os arquivos reais, de quantos falsos
   "estabelecimento novo" um piloto ingênuo com amostra teria despejado no
   primeiro dia. A Receita reparticiona quais CNPJs caem em qual arquivo a cada
   lote: de 4.753.435 chaves, só 497.314 (10,5%) estão nos dois meses. As outras
   4,26 milhões pareceriam nascimentos e não são.

   O freio existe POR CAUSA desse número. Não foi ele que o freio parou.
   Ver docs/ondas/ONDA-2-JAZIDA.md §0.
   ────────────────────────────────────────────────────────────────────────── */
export const CONTRAFACTUAL = {
  falsosEventos: '4,26 milhões',
  chavesPorArquivo: '4.753.435',
  sobrepostas: '497.314',
  percentual: '10,5%',
} as const

/** A moldura. Nenhum número desta página vale sem ela. */
export const MOLDURA = {
  quando: '19–20 de agosto de 2026',
  lotes: 'lotes de julho e agosto de 2026 da Receita Federal',
  varridos: '600.000',
  universo: '~73,6 milhões',
  fatia: '~0,8%',
  porQueParcial:
    'A corrida rodou sobre amostra local: o disco da máquina de trabalho não ' +
    'comportou a fatia inteira. Cobertura integral é trabalho de infraestrutura, ' +
    'não de motor — o motor já roda.',
} as const
