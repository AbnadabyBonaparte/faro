/**
 * ============================================================================
 * DADOS FICTÍCIOS — PROTÓTIPO
 * ============================================================================
 *
 * NADA NESTE ARQUIVO É REAL.
 *
 * Nenhuma empresa aqui existe. Os CNPJs são sequenciais e obviamente inválidos
 * (00.000.00X/0001-00), justamente para que não possam ser confundidos com
 * registro verdadeiro. Nenhum dado foi coletado de fonte alguma: não há motor,
 * não há coleta, não há banco.
 *
 * Este arquivo existe para uma coisa só: demonstrar na tela COMO a Lei das
 * Camadas, o score decomposto, o Evidence Grade e o Freshness se comportam
 * quando o motor existir.
 *
 * Os nomes de órgãos públicos nas fontes são reais porque o canon os nomeia
 * como fontes previstas — mas as datas de coleta, os números e as afirmações
 * são inventados para o protótipo.
 *
 * Referência: docs/canon/MODELO-FARO-V2.md §3 (Lei das Camadas), §4 (Score),
 * §6 (Evidence Graph e Grade), §7 (Source Registry e Freshness).
 * ============================================================================
 */

export type Camada = 'DADO' | 'SINAL' | 'INFERÊNCIA' | 'TESE' | 'OPORTUNIDADE'

export type NivelEvidencia = 'E1' | 'E2' | 'E3'

export type Grade = 'A' | 'B' | 'C' | 'D'

export type Freshness = 'ok' | 'warn' | 'stale' | 'old'

export type Julgamento = 'aprovada' | 'descartada' | 'monitorar' | null

/** Uma fonte no Source Registry. Canon §7.1 */
export type Fonte = {
  id: string
  nome: string
  orgao: string
  nivel: NivelEvidencia
  periodicidade: string
  ultimaColeta: string
  licenca: string
  cobertura: string
  status: 'viva' | 'degradada' | 'indisponível'
  fallback: string
}

/**
 * Uma afirmação exibida ao assinante. Canon §3: nenhuma existe sem fonte,
 * data de coleta, data de referência, transformação e limite de inferência.
 */
export type Afirmacao = {
  camada: Camada
  texto: string
  fonteId: string
  coletadoEm: string
  referenteA: string
  transformacao: string
  limiteInferencia: string
}

/** Score decomposto. Canon §4: nunca um número único e misterioso. */
export type ScoreDimensoes = {
  fitEstrutural: number
  evidenciaTese: number
  recencia: number
  qualidadeFontes: number
  intensidadeSinal: number
  confiancaInferencia: number
}

export type Oportunidade = {
  id: string
  razaoSocial: string
  cnpj: string
  cnae: string
  porte: string
  municipio: string
  uf: string
  teseId: string
  eventoGatilho: string
  detectadoEm: string
  dimensoes: ScoreDimensoes
  grade: Grade
  freshness: Freshness
  criteriosAtendidos: number
  criteriosTotais: number
  evidenciasIndependentes: number
  sinaisRecentes: number
  afirmacoes: Afirmacao[]
  limiteInferencia: string
  proximaAcao: string
  julgamento: Julgamento
}

export type Tese = {
  id: string
  nome: string
  hipotese: string
  parametros: { rotulo: string; valor: string }[]
  sinaisExigidos: string[]
  ativa: boolean
  criadaEm: string
  fichasNoMes: number
}

export type EventoWatch = {
  id: string
  tipo: string
  empresa: string
  cnpj: string
  descricao: string
  teseId: string
  fonteId: string
  detectadoEm: string
  referenteA: string
  freshness: Freshness
  novo: boolean
}

export type FunilTese = {
  teseId: string
  fichasPublicadas: number
  aprovadas: number
  abordadas: number
  reunioes: number
  propostas: number
  /** Informado pelo assinante — o FARO NÃO mede isto. Canon §5, Quadro D6. */
  receitaInformadaPeloAssinante: number
}

/* ==========================================================================
   PESOS DO SCORE
   O total NUNCA é digitado. É sempre derivado das dimensões visíveis — é assim
   que a tela cumpre o canon §4 em vez de só falar dele.
   ========================================================================== */

export const PESOS: Record<keyof ScoreDimensoes, number> = {
  fitEstrutural: 0.25,
  evidenciaTese: 0.2,
  recencia: 0.15,
  qualidadeFontes: 0.15,
  intensidadeSinal: 0.15,
  confiancaInferencia: 0.1,
}

export const ROTULOS_DIMENSAO: Record<keyof ScoreDimensoes, string> = {
  fitEstrutural: 'Fit estrutural',
  evidenciaTese: 'Evidência da tese',
  recencia: 'Recência',
  qualidadeFontes: 'Qualidade das fontes',
  intensidadeSinal: 'Intensidade do sinal',
  confiancaInferencia: 'Confiança da inferência',
}

export function calcularScore(d: ScoreDimensoes): number {
  const total = (Object.keys(PESOS) as (keyof ScoreDimensoes)[]).reduce(
    (acc, k) => acc + d[k] * PESOS[k],
    0,
  )
  return Math.round(total)
}

export function faixaScore(score: number): string {
  if (score >= 85) return 'Alta aderência'
  if (score >= 70) return 'Aderência média'
  if (score >= 55) return 'Aderência baixa'
  return 'Aderência marginal'
}

/* ==========================================================================
   SOURCE REGISTRY (fictício)
   ========================================================================== */

export const FONTES: Fonte[] = [
  {
    id: 'SRC-001',
    nome: 'Base de Dados Abertos do CNPJ',
    orgao: 'Receita Federal do Brasil',
    nivel: 'E1',
    periodicidade: 'Mensal',
    ultimaColeta: '14/08/2026',
    licenca: 'Dados abertos',
    cobertura: 'Universo empresarial nacional',
    status: 'viva',
    fallback: 'Manter último lote e marcar Freshness como desatualizando',
  },
  {
    id: 'SRC-002',
    nome: 'Cadastro de agentes e consumo por perfil',
    orgao: 'CCEE',
    nivel: 'E1',
    periodicidade: 'Mensal',
    ultimaColeta: '11/08/2026',
    licenca: 'Dados abertos',
    cobertura: 'Agentes do mercado livre de energia',
    status: 'viva',
    fallback: 'Suspender o sinal de consumo livre e rebaixar o grade da ficha',
  },
  {
    id: 'SRC-003',
    nome: 'Contratos e atas públicas',
    orgao: 'PNCP',
    nivel: 'E1',
    periodicidade: 'Diária',
    ultimaColeta: '16/08/2026',
    licenca: 'Dados abertos',
    cobertura: 'Contratações públicas federais, estaduais e municipais',
    status: 'degradada',
    fallback: 'Declarar limitação na ficha; não inferir porte a partir de contrato',
  },
]

export function fonte(id: string): Fonte {
  const f = FONTES.find((x) => x.id === id)
  if (!f) throw new Error(`Fonte não registrada: ${id}`)
  return f
}

/* ==========================================================================
   TESES (fictícias)
   ========================================================================== */

export const TESES: Tese[] = [
  {
    id: 'TESE-01',
    nome: 'Lucro Real com consumo livre de energia',
    hipotese:
      'Empresas fora do Simples, de porte compatível com apuração pelo Lucro Real, ' +
      'com consumo de energia no mercado livre, apresentam sinais compatíveis com ' +
      'investigação de créditos sobre insumo energético.',
    parametros: [
      { rotulo: 'CNAE', valor: 'Indústria de transformação (seções selecionadas)' },
      { rotulo: 'Porte declarado', valor: 'Demais (não ME/EPP)' },
      { rotulo: 'Regime', valor: 'Não optante do Simples' },
      { rotulo: 'UF', valor: 'GO · MG · SP' },
      { rotulo: 'Capital social', valor: 'Acima do limiar da tese' },
    ],
    sinaisExigidos: [
      'Consumidor livre de energia',
      'Saída do Simples nos últimos 24 meses',
      'Aumento de faixa de empregados',
    ],
    ativa: true,
    criadaEm: '02/08/2026',
    fichasNoMes: 34,
  },
  {
    id: 'TESE-02',
    nome: 'Reenquadramento de porte com nova filial',
    hipotese:
      'Empresas que abriram filial e mudaram de faixa de porte no mesmo trimestre ' +
      'apresentam sinais compatíveis com revisão de planejamento tributário.',
    parametros: [
      { rotulo: 'CNAE', valor: 'Comércio atacadista e indústria' },
      { rotulo: 'Porte declarado', valor: 'Transição EPP → Demais' },
      { rotulo: 'UF', valor: 'Todas' },
      { rotulo: 'Situação cadastral', valor: 'Ativa' },
    ],
    sinaisExigidos: ['Nova filial registrada', 'Mudança de faixa de porte'],
    ativa: true,
    criadaEm: '05/08/2026',
    fichasNoMes: 21,
  },
  {
    id: 'TESE-03',
    nome: 'Fornecedor público com crescimento de estrutura',
    hipotese:
      'Empresas com contrato público relevante e aumento simultâneo de estrutura ' +
      'apresentam sinais compatíveis com investigação de regime e créditos acumulados.',
    parametros: [
      { rotulo: 'CNAE', valor: 'Serviços e indústria' },
      { rotulo: 'Porte declarado', valor: 'Demais' },
      { rotulo: 'UF', valor: 'GO · DF' },
    ],
    sinaisExigidos: ['Contrato público ganho', 'Aumento de faixa de empregados'],
    ativa: false,
    criadaEm: '09/08/2026',
    fichasNoMes: 0,
  },
]

export function tese(id: string): Tese {
  const t = TESES.find((x) => x.id === id)
  if (!t) throw new Error(`Tese não registrada: ${id}`)
  return t
}

/* ==========================================================================
   FILA DE OPORTUNIDADES (fictícia)
   ========================================================================== */

export const OPORTUNIDADES: Oportunidade[] = [
  {
    id: 'OP-1041',
    razaoSocial: 'METALÚRGICA AURORA DO CERRADO LTDA',
    cnpj: '00.000.001/0001-00',
    cnae: '24.24-5 — Metalurgia de metais não-ferrosos',
    porte: 'Demais',
    municipio: 'Anápolis',
    uf: 'GO',
    teseId: 'TESE-01',
    eventoGatilho: 'Passou a constar como consumidora livre de energia',
    detectadoEm: '16/08/2026',
    dimensoes: {
      fitEstrutural: 94,
      evidenciaTese: 88,
      recencia: 92,
      qualidadeFontes: 96,
      intensidadeSinal: 85,
      confiancaInferencia: 74,
    },
    grade: 'A',
    freshness: 'ok',
    criteriosAtendidos: 8,
    criteriosTotais: 10,
    evidenciasIndependentes: 5,
    sinaisRecentes: 2,
    limiteInferencia:
      'Faturamento não é observável nesta cadeia de fontes. O porte é PROXY, ' +
      'derivado de capital social e de faixa de porte declarada — não é receita medida. ' +
      'A apuração pelo Lucro Real é PRESUMIDA a partir da não-opção pelo Simples, não confirmada. ' +
      'A existência de crédito depende integralmente de análise técnica do profissional habilitado.',
    proximaAcao:
      'Investigar: confirmar regime de apuração e volume de consumo antes de qualquer abordagem técnica.',
    julgamento: null,
    afirmacoes: [
      {
        camada: 'DADO',
        texto: 'CNPJ ativo · CNAE 24.24-5 · porte declarado "Demais" · UF GO',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do cadastro, sem derivação',
        limiteInferencia: 'Dado observado. Nenhuma inferência aplicada.',
      },
      {
        camada: 'DADO',
        texto: 'Não consta como optante do Simples Nacional',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do campo de opção pelo Simples',
        limiteInferencia:
          'Dado observado. Não-opção pelo Simples NÃO confirma apuração pelo Lucro Real — ' +
          'Lucro Presumido também é compatível com este dado.',
      },
      {
        camada: 'DADO',
        texto: 'Capital social acima do limiar definido na tese',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Comparação do capital declarado com o limiar parametrizado na tese',
        limiteInferencia:
          'Dado observado, comparado a um limiar escolhido pelo assinante. ' +
          'Capital social não é receita nem patrimônio corrente.',
      },
      {
        camada: 'SINAL',
        texto: 'Passou a constar no cadastro de agentes do mercado livre de energia',
        fonteId: 'SRC-002',
        coletadoEm: '11/08/2026',
        referenteA: 'Cadastro de referência de julho/2026',
        transformacao:
          'Comparação do cadastro de julho com o de junho: ausente antes, presente depois',
        limiteInferencia:
          'Sinal derivado de duas coletas. Indica entrada no cadastro, não volume de consumo — ' +
          'o volume não foi observado.',
      },
      {
        camada: 'SINAL',
        texto: 'Aumento de faixa de empregados no último período declarado',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Faixa declarada, período de referência de 2025',
        transformacao: 'Comparação de faixa entre dois períodos declarados',
        limiteInferencia:
          'Sinal derivado de FAIXA, não de número absoluto. A data de referência tem ' +
          'defasagem em relação à coleta — o quadro atual pode ser outro.',
      },
      {
        camada: 'INFERÊNCIA',
        texto:
          'O conjunto de sinais apresenta alta aderência ao perfil parametrizado na tese: ' +
          '8 de 10 critérios atendidos, 5 evidências independentes, 2 sinais recentes.',
        fonteId: 'SRC-001',
        coletadoEm: '16/08/2026',
        referenteA: 'Cruzamento das coletas de 11/08 e 14/08/2026',
        transformacao: 'Regra da tese TESE-01, versão 1.0, aplicada às camadas DADO e SINAL',
        limiteInferencia:
          'HIPÓTESE, não conclusão. Mede aderência a um padrão definido pelo assinante — ' +
          'não afirma direito, elegibilidade nem valor recuperável.',
      },
      {
        camada: 'OPORTUNIDADE',
        texto:
          'Sinais compatíveis para investigação sob a tese "Lucro Real com consumo livre de energia".',
        fonteId: 'SRC-002',
        coletadoEm: '16/08/2026',
        referenteA: 'Publicação da ficha em 16/08/2026',
        transformacao: 'Critérios mínimos da tese atingidos; ficha publicada na fila',
        limiteInferencia:
          'Recomenda investigação. Não é parecer tributário e não substitui o profissional habilitado.',
      },
    ],
  },
  {
    id: 'OP-1042',
    razaoSocial: 'INDÚSTRIA DE EMBALAGENS PONTAL VERDE S.A.',
    cnpj: '00.000.002/0001-00',
    cnae: '22.22-6 — Fabricação de embalagens de material plástico',
    porte: 'Demais',
    municipio: 'Uberlândia',
    uf: 'MG',
    teseId: 'TESE-01',
    eventoGatilho: 'Saiu do Simples Nacional no período declarado',
    detectadoEm: '15/08/2026',
    dimensoes: {
      fitEstrutural: 88,
      evidenciaTese: 79,
      recencia: 84,
      qualidadeFontes: 96,
      intensidadeSinal: 72,
      confiancaInferencia: 68,
    },
    grade: 'B',
    freshness: 'ok',
    criteriosAtendidos: 7,
    criteriosTotais: 10,
    evidenciasIndependentes: 4,
    sinaisRecentes: 1,
    limiteInferencia:
      'Consumo livre de energia NÃO foi observado para este CNPJ — a ficha entrou pela ' +
      'saída do Simples, com um dos sinais exigidos ausente. Porte é proxy. ' +
      'Faturamento não é observável.',
    proximaAcao:
      'Investigar: verificar se há consumo livre de energia não capturado pelas fontes atuais.',
    julgamento: null,
    afirmacoes: [
      {
        camada: 'DADO',
        texto: 'CNPJ ativo · CNAE 22.22-6 · porte declarado "Demais" · UF MG',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do cadastro',
        limiteInferencia: 'Dado observado.',
      },
      {
        camada: 'SINAL',
        texto: 'Deixou de constar como optante do Simples Nacional',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Comparação entre posições de 30/06 e 31/07/2026',
        transformacao: 'Comparação do campo de opção entre duas coletas',
        limiteInferencia:
          'Sinal derivado. A saída do Simples não informa qual regime passou a vigorar.',
      },
      {
        camada: 'INFERÊNCIA',
        texto:
          'Aderência parcial: 7 de 10 critérios. Um sinal exigido pela tese ' +
          '(consumo livre de energia) NÃO foi observado.',
        fonteId: 'SRC-001',
        coletadoEm: '15/08/2026',
        referenteA: 'Cruzamento da coleta de 14/08/2026',
        transformacao: 'Regra da tese TESE-01, versão 1.0',
        limiteInferencia:
          'HIPÓTESE mais fraca que a ficha OP-1041: sinal exigido ausente. ' +
          'Ausência de sinal na fonte não prova ausência do fato no mundo.',
      },
    ],
  },
  {
    id: 'OP-1043',
    razaoSocial: 'DISTRIBUIDORA SERRA DOURADA COMERCIAL LTDA',
    cnpj: '00.000.003/0001-00',
    cnae: '46.39-7 — Comércio atacadista de produtos alimentícios',
    porte: 'Demais',
    municipio: 'Goiânia',
    uf: 'GO',
    teseId: 'TESE-02',
    eventoGatilho: 'Nova filial registrada + mudança de faixa de porte',
    detectadoEm: '16/08/2026',
    dimensoes: {
      fitEstrutural: 91,
      evidenciaTese: 84,
      recencia: 95,
      qualidadeFontes: 96,
      intensidadeSinal: 90,
      confiancaInferencia: 71,
    },
    grade: 'A',
    freshness: 'ok',
    criteriosAtendidos: 6,
    criteriosTotais: 7,
    evidenciasIndependentes: 4,
    sinaisRecentes: 2,
    limiteInferencia:
      'Os dois sinais são observados e recentes, mas a relação entre eles é INFERIDA — ' +
      'a coincidência temporal não prova causa. Faturamento não observável.',
    proximaAcao: 'Investigar: confirmar o motivo do reenquadramento antes da abordagem.',
    julgamento: null,
    afirmacoes: [
      {
        camada: 'DADO',
        texto: 'CNPJ ativo · CNAE 46.39-7 · UF GO · situação cadastral ativa',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do cadastro',
        limiteInferencia: 'Dado observado.',
      },
      {
        camada: 'SINAL',
        texto: 'Novo estabelecimento filial registrado no período',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Comparação entre posições de 30/06 e 31/07/2026',
        transformacao: 'Diferença na contagem de estabelecimentos do mesmo CNPJ raiz',
        limiteInferencia:
          'Sinal derivado. Registro de filial não informa operação efetiva no endereço.',
      },
      {
        camada: 'SINAL',
        texto: 'Mudança de faixa de porte declarado (EPP → Demais)',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Comparação entre posições de 30/06 e 31/07/2026',
        transformacao: 'Comparação da faixa de porte entre duas coletas',
        limiteInferencia:
          'Sinal derivado de faixa declarada. Não é medição de receita.',
      },
      {
        camada: 'INFERÊNCIA',
        texto:
          'Dois sinais exigidos observados no mesmo trimestre: aderência alta à TESE-02.',
        fonteId: 'SRC-001',
        coletadoEm: '16/08/2026',
        referenteA: 'Cruzamento da coleta de 14/08/2026',
        transformacao: 'Regra da tese TESE-02, versão 1.0',
        limiteInferencia:
          'HIPÓTESE. A simultaneidade dos sinais é observada; a CAUSA comum é suposta.',
      },
    ],
  },
  {
    id: 'OP-1044',
    razaoSocial: 'TRANSPORTES RIO VERMELHO LOGÍSTICA LTDA',
    cnpj: '00.000.004/0001-00',
    cnae: '49.30-2 — Transporte rodoviário de carga',
    porte: 'Demais',
    municipio: 'Rio Verde',
    uf: 'GO',
    teseId: 'TESE-02',
    eventoGatilho: 'Mudança de faixa de porte declarado',
    detectadoEm: '09/08/2026',
    dimensoes: {
      fitEstrutural: 76,
      evidenciaTese: 62,
      recencia: 58,
      qualidadeFontes: 96,
      intensidadeSinal: 55,
      confiancaInferencia: 60,
    },
    grade: 'C',
    freshness: 'warn',
    criteriosAtendidos: 4,
    criteriosTotais: 7,
    evidenciasIndependentes: 2,
    sinaisRecentes: 1,
    limiteInferencia:
      'Apenas um dos dois sinais exigidos foi observado. Grade C: hipótese exploratória, ' +
      'não evidência forte. Freshness em amarelo — o sinal está esfriando.',
    proximaAcao: 'Manter em observação: sinal isolado, sem confirmação independente.',
    julgamento: 'monitorar',
    afirmacoes: [
      {
        camada: 'DADO',
        texto: 'CNPJ ativo · CNAE 49.30-2 · UF GO',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do cadastro',
        limiteInferencia: 'Dado observado.',
      },
      {
        camada: 'SINAL',
        texto: 'Mudança de faixa de porte declarado',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Comparação entre posições de 31/05 e 30/06/2026',
        transformacao: 'Comparação da faixa de porte entre duas coletas',
        limiteInferencia:
          'Sinal derivado. Sem segundo sinal para corroborar — evidência isolada.',
      },
      {
        camada: 'INFERÊNCIA',
        texto: 'Aderência baixa: 4 de 7 critérios, um único sinal, sem corroboração.',
        fonteId: 'SRC-001',
        coletadoEm: '09/08/2026',
        referenteA: 'Cruzamento da coleta de 14/08/2026',
        transformacao: 'Regra da tese TESE-02, versão 1.0',
        limiteInferencia:
          'HIPÓTESE EXPLORATÓRIA. Este é o tipo de ficha que testa a tese, não que fecha negócio.',
      },
    ],
  },
  {
    id: 'OP-1045',
    razaoSocial: 'CONSTRUTORA PLANALTO CENTRAL ENGENHARIA S.A.',
    cnpj: '00.000.005/0001-00',
    cnae: '42.11-1 — Construção de rodovias e ferrovias',
    porte: 'Demais',
    municipio: 'Brasília',
    uf: 'DF',
    teseId: 'TESE-03',
    eventoGatilho: 'Contrato público relevante registrado',
    detectadoEm: '16/08/2026',
    dimensoes: {
      fitEstrutural: 82,
      evidenciaTese: 70,
      recencia: 88,
      qualidadeFontes: 64,
      intensidadeSinal: 80,
      confiancaInferencia: 55,
    },
    grade: 'C',
    freshness: 'ok',
    criteriosAtendidos: 5,
    criteriosTotais: 8,
    evidenciasIndependentes: 3,
    sinaisRecentes: 1,
    limiteInferencia:
      'A fonte de contratos públicos está DEGRADADA nesta janela de coleta — a qualidade ' +
      'de fontes caiu para 64 e o grade foi rebaixado por isso. O canon proíbe inferir porte ' +
      'a partir de contrato quando esta fonte está degradada.',
    proximaAcao:
      'Aguardar recuperação da fonte antes de abordar. Limitação declarada nesta ficha.',
    julgamento: null,
    afirmacoes: [
      {
        camada: 'DADO',
        texto: 'CNPJ ativo · CNAE 42.11-1 · UF DF',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do cadastro',
        limiteInferencia: 'Dado observado.',
      },
      {
        camada: 'SINAL',
        texto: 'Contrato público registrado no período',
        fonteId: 'SRC-003',
        coletadoEm: '16/08/2026',
        referenteA: 'Publicação de agosto/2026',
        transformacao: 'Leitura de contrato publicado, associado ao CNPJ',
        limiteInferencia:
          'FONTE DEGRADADA nesta janela: cobertura incompleta. Contrato registrado não ' +
          'informa execução, recebimento nem margem. Proibido inferir porte a partir daqui.',
      },
      {
        camada: 'INFERÊNCIA',
        texto: 'Aderência parcial com qualidade de fonte reduzida: 5 de 8 critérios.',
        fonteId: 'SRC-003',
        coletadoEm: '16/08/2026',
        referenteA: 'Cruzamento das coletas de 14/08 e 16/08/2026',
        transformacao: 'Regra da tese TESE-03, versão 1.0, com penalidade por fonte degradada',
        limiteInferencia:
          'HIPÓTESE com confiança baixa (55). A degradação da fonte é a causa declarada.',
      },
    ],
  },
  {
    id: 'OP-1046',
    razaoSocial: 'FRIGORÍFICO VALE DO ARAGUAIA LTDA',
    cnpj: '00.000.006/0001-00',
    cnae: '10.11-2 — Abate de reses',
    porte: 'Demais',
    municipio: 'Barra do Garças',
    uf: 'MT',
    teseId: 'TESE-01',
    eventoGatilho: 'Consta como consumidora livre de energia',
    detectadoEm: '02/07/2026',
    dimensoes: {
      fitEstrutural: 70,
      evidenciaTese: 66,
      recencia: 22,
      qualidadeFontes: 96,
      intensidadeSinal: 60,
      confiancaInferencia: 52,
    },
    grade: 'D',
    freshness: 'old',
    criteriosAtendidos: 5,
    criteriosTotais: 10,
    evidenciasIndependentes: 2,
    sinaisRecentes: 0,
    limiteInferencia:
      'Freshness VERMELHO: o sinal que gerou esta ficha tem mais de 45 dias e a UF está ' +
      'fora dos parâmetros da tese (MT não consta em GO·MG·SP). Recência derrubou o score. ' +
      'Não abordar sem revalidar.',
    proximaAcao:
      'Revalidar ou descartar: fora do parâmetro de UF da tese e sem sinal recente.',
    julgamento: 'descartada',
    afirmacoes: [
      {
        camada: 'DADO',
        texto: 'CNPJ ativo · CNAE 10.11-2 · UF MT',
        fonteId: 'SRC-001',
        coletadoEm: '14/08/2026',
        referenteA: 'Posição cadastral de 31/07/2026',
        transformacao: 'Leitura direta do cadastro',
        limiteInferencia:
          'Dado observado. UF FORA do parâmetro declarado da tese — a ficha não deveria ' +
          'ter sido publicada com este perfil.',
      },
      {
        camada: 'SINAL',
        texto: 'Consta no cadastro de agentes do mercado livre de energia',
        fonteId: 'SRC-002',
        coletadoEm: '11/08/2026',
        referenteA: 'Cadastro de referência de junho/2026',
        transformacao: 'Presença no cadastro, sem mudança de estado detectada',
        limiteInferencia:
          'ESTADO, não evento: a empresa já constava antes da janela. Não há mudança — ' +
          'e a unidade de valor do FARO é a mudança.',
      },
      {
        camada: 'INFERÊNCIA',
        texto: 'Aderência marginal: 5 de 10 critérios, nenhum sinal recente, UF fora do escopo.',
        fonteId: 'SRC-002',
        coletadoEm: '02/07/2026',
        referenteA: 'Cruzamento da coleta de junho/2026',
        transformacao: 'Regra da tese TESE-01, versão 1.0',
        limiteInferencia:
          'HIPÓTESE FRACA, mantida na fila só para demonstrar o comportamento do score ' +
          'quando a recência colapsa. Descartada no Tribunal.',
      },
    ],
  },
]

export function oportunidade(id: string): Oportunidade | undefined {
  return OPORTUNIDADES.find((o) => o.id === id)
}

/* ==========================================================================
   FARO WATCH — feed de eventos (fictício)
   ========================================================================== */

export const EVENTOS: EventoWatch[] = [
  {
    id: 'EV-2201',
    tipo: 'Entrou em cadastro',
    empresa: 'METALÚRGICA AURORA DO CERRADO LTDA',
    cnpj: '00.000.001/0001-00',
    descricao: 'Passou a constar como consumidora livre de energia',
    teseId: 'TESE-01',
    fonteId: 'SRC-002',
    detectadoEm: '16/08/2026',
    referenteA: 'Cadastro de julho/2026',
    freshness: 'ok',
    novo: true,
  },
  {
    id: 'EV-2202',
    tipo: 'Nova filial',
    empresa: 'DISTRIBUIDORA SERRA DOURADA COMERCIAL LTDA',
    cnpj: '00.000.003/0001-00',
    descricao: 'Novo estabelecimento filial registrado',
    teseId: 'TESE-02',
    fonteId: 'SRC-001',
    detectadoEm: '16/08/2026',
    referenteA: 'Posição cadastral de 31/07/2026',
    freshness: 'ok',
    novo: true,
  },
  {
    id: 'EV-2203',
    tipo: 'Contrato público ganho',
    empresa: 'CONSTRUTORA PLANALTO CENTRAL ENGENHARIA S.A.',
    cnpj: '00.000.005/0001-00',
    descricao: 'Contrato público relevante registrado — fonte degradada na janela',
    teseId: 'TESE-03',
    fonteId: 'SRC-003',
    detectadoEm: '16/08/2026',
    referenteA: 'Publicação de agosto/2026',
    freshness: 'ok',
    novo: true,
  },
  {
    id: 'EV-2204',
    tipo: 'Saiu do Simples',
    empresa: 'INDÚSTRIA DE EMBALAGENS PONTAL VERDE S.A.',
    cnpj: '00.000.002/0001-00',
    descricao: 'Deixou de constar como optante do Simples Nacional',
    teseId: 'TESE-01',
    fonteId: 'SRC-001',
    detectadoEm: '15/08/2026',
    referenteA: 'Comparação entre 30/06 e 31/07/2026',
    freshness: 'ok',
    novo: true,
  },
  {
    id: 'EV-2205',
    tipo: 'Mudança de porte',
    empresa: 'DISTRIBUIDORA SERRA DOURADA COMERCIAL LTDA',
    cnpj: '00.000.003/0001-00',
    descricao: 'Faixa de porte declarado alterada (EPP → Demais)',
    teseId: 'TESE-02',
    fonteId: 'SRC-001',
    detectadoEm: '15/08/2026',
    referenteA: 'Comparação entre 30/06 e 31/07/2026',
    freshness: 'ok',
    novo: false,
  },
  {
    id: 'EV-2206',
    tipo: 'Aumento de estrutura',
    empresa: 'METALÚRGICA AURORA DO CERRADO LTDA',
    cnpj: '00.000.001/0001-00',
    descricao: 'Faixa de empregados aumentou no período declarado',
    teseId: 'TESE-01',
    fonteId: 'SRC-001',
    detectadoEm: '14/08/2026',
    referenteA: 'Faixa declarada, referência 2025',
    freshness: 'warn',
    novo: false,
  },
  {
    id: 'EV-2207',
    tipo: 'Mudança de porte',
    empresa: 'TRANSPORTES RIO VERMELHO LOGÍSTICA LTDA',
    cnpj: '00.000.004/0001-00',
    descricao: 'Faixa de porte declarado alterada',
    teseId: 'TESE-02',
    fonteId: 'SRC-001',
    detectadoEm: '09/08/2026',
    referenteA: 'Comparação entre 31/05 e 30/06/2026',
    freshness: 'warn',
    novo: false,
  },
  {
    id: 'EV-2208',
    tipo: 'Fonte degradada',
    empresa: '— (evento de infraestrutura, não de empresa)',
    cnpj: '—',
    descricao:
      'Fonte SRC-003 (contratos públicos) com cobertura incompleta — fichas dependentes ' +
      'rebaixadas e limitação declarada',
    teseId: 'TESE-03',
    fonteId: 'SRC-003',
    detectadoEm: '16/08/2026',
    referenteA: 'Coleta de 16/08/2026',
    freshness: 'stale',
    novo: true,
  },
  {
    id: 'EV-2209',
    tipo: 'Sem mudança de estado',
    empresa: 'FRIGORÍFICO VALE DO ARAGUAIA LTDA',
    cnpj: '00.000.006/0001-00',
    descricao:
      'Consta no cadastro de energia, mas sem mudança na janela — estado, não evento',
    teseId: 'TESE-01',
    fonteId: 'SRC-002',
    detectadoEm: '02/07/2026',
    referenteA: 'Cadastro de junho/2026',
    freshness: 'old',
    novo: false,
  },
]

/* ==========================================================================
   PAINEL DA TESE — funil (fictício)
   ========================================================================== */

export const FUNIS: FunilTese[] = [
  {
    teseId: 'TESE-01',
    fichasPublicadas: 34,
    aprovadas: 12,
    abordadas: 8,
    reunioes: 3,
    propostas: 1,
    receitaInformadaPeloAssinante: 0,
  },
  {
    teseId: 'TESE-02',
    fichasPublicadas: 21,
    aprovadas: 7,
    abordadas: 4,
    reunioes: 1,
    propostas: 0,
    receitaInformadaPeloAssinante: 0,
  },
  {
    teseId: 'TESE-03',
    fichasPublicadas: 0,
    aprovadas: 0,
    abordadas: 0,
    reunioes: 0,
    propostas: 0,
    receitaInformadaPeloAssinante: 0,
  },
]

export function funil(teseId: string): FunilTese {
  const f = FUNIS.find((x) => x.teseId === teseId)
  if (!f) throw new Error(`Funil não registrado: ${teseId}`)
  return f
}

/* ==========================================================================
   MOTIVOS DE DESCARTE — Tribunal Magro. Canon §9.
   O motivo estruturado é o dado que alimenta o Thesis Engine.
   ========================================================================== */

export const MOTIVOS_DESCARTE = [
  'Fora do perfil da tese',
  'Sinal não se confirmou na prática',
  'Sem contato ou autoridade acessível',
  'Timing errado',
  'Já é cliente ou já foi abordada',
  'Concorrente já atende',
] as const

export const MOTIVOS_APROVACAO = [
  'Perfil forte, abordar agora',
  'Perfil compatível, entrar na fila',
  'Vale investigar apesar do score',
] as const
