/* ============================================================================
   PÁGINA DO FUNDADOR — /osc
   ============================================================================

   Página fora do menu, fora de indexação, não linkada de lugar nenhum.
   Existe para uma leitura conjunta, ao vivo.

   🔴 A FICHA ABAIXO É REAL. Saiu da caçada que a ALSHAM rodou PARA SI MESMA
   em 19–20/08/2026, contra os lotes de julho e agosto da Receita Federal.
   Score, dimensões, evidências e razões contra são os valores gravados no
   banco — nenhum deles foi escolhido para a tela ficar bonita.

   O que foi retirado: CNPJ e razão social. O que sobrou identifica a
   FORMA da entrega, nunca a empresa.
   ========================================================================== */

/** Uma parcela do score, com o peso que a tese declarou. */
export type Parcela = {
  readonly dimensao: string
  readonly rotulo: string
  readonly valor: number
  readonly peso: number
  readonly porQue: string
}

/** Uma linha de evidência: o que foi visto, de onde veio, quando. */
export type Evidencia = {
  readonly camada: 'DADO' | 'SINAL'
  readonly texto: string
  readonly fonte: string
  readonly referenteA: string
  readonly atendido: boolean
}

/* ── O SCORE, DECOMPOSTO ─────────────────────────────────────────────────
   88,6×0,25 + 50×0,10 + 100×0,30 + 50×0,10 + 40×0,10 + 85×0,15 = 78,9 → 79.
   O total não é digitado em lugar nenhum: é a soma ponderada destas seis. */
export const PARCELAS: readonly Parcela[] = [
  {
    dimensao: 'fitEstrutural',
    rotulo: 'Encaixe no perfil',
    valor: 88.6,
    peso: 0.25,
    porQue:
      'Todos os critérios obrigatórios casaram, um deles por aproximação. ' +
      'Parte das preferências comerciais foi atendida.',
  },
  {
    dimensao: 'evidenciaTese',
    rotulo: 'Evidência da tese',
    valor: 50,
    peso: 0.1,
    porQue:
      'A tese declara critérios que nenhuma fonte pública observa. Cada um ' +
      'que falta pesa dobrado — o que não se vê costuma ser justamente o que ' +
      'separaria este alvo dos outros.',
  },
  {
    dimensao: 'recencia',
    rotulo: 'Recência do lote',
    valor: 100,
    peso: 0.3,
    porQue: 'Lote de referência com 18 dias, dentro da frequência prometida pela fonte.',
  },
  {
    dimensao: 'qualidadeFontes',
    rotulo: 'Qualidade das fontes',
    valor: 50,
    peso: 0.1,
    porQue:
      'Uma das duas fontes cadastradas estava fora do ar no momento da caçada. ' +
      'Órgão oficial que não responde não entrega confiabilidade nenhuma.',
  },
  {
    dimensao: 'intensidadeSinal',
    rotulo: 'Intensidade do sinal',
    valor: 40,
    peso: 0.1,
    porQue: 'Uma mudança detectada no mês, de um tipo só.',
  },
  {
    dimensao: 'confiancaInferencia',
    rotulo: 'Confiança da inferência',
    valor: 85,
    peso: 0.15,
    porQue:
      'Quase tudo aqui é leitura direta de cadastro. Quanto menos o motor ' +
      'precisa deduzir, mais alto este número.',
  },
] as const

export const FICHA = {
  identificacao: 'CNPJ e razão social retirados',
  score: 79,
  grade: 'B',
  frescor: 'Atual',
  gatilho: 'Atividade principal mudou de 8690901 para 8650003',
  detectadoEm: 'lote de agosto de 2026, comparado ao de julho',
  ev: 'não calculável — declarado na ficha, não estimado',
  evPorQue:
    'O retorno desta tese é contrato de serviço, e a casa nunca mediu valor ' +
    'médio nem taxa de conversão desse contrato. Inventar um número para a ' +
    'ficha parecer completa seria o oposto do que este produto vende.',
} as const

export const EVIDENCIAS: readonly Evidencia[] = [
  {
    camada: 'DADO',
    texto: 'Atividade econômica de saúde',
    fonte: 'Receita Federal · cadastro nacional de CNPJ',
    referenteA: 'posição de 01/08/2026',
    atendido: true,
  },
  {
    camada: 'DADO',
    texto: 'Situação cadastral ativa',
    fonte: 'Receita Federal · cadastro nacional de CNPJ',
    referenteA: 'posição de 01/08/2026',
    atendido: true,
  },
  {
    camada: 'DADO',
    texto: 'É matriz, não filial de rede',
    fonte: 'Receita Federal · cadastro nacional de CNPJ',
    referenteA: 'posição de 01/08/2026',
    atendido: true,
  },
  {
    camada: 'DADO',
    texto: 'Início de atividade nos últimos 12 meses',
    fonte: 'Receita Federal · cadastro nacional de CNPJ',
    referenteA: 'posição de 01/08/2026',
    atendido: true,
  },
  {
    camada: 'DADO',
    texto: 'Fora do território de atuação preferencial',
    fonte: 'Receita Federal · cadastro nacional de CNPJ',
    referenteA: 'posição de 01/08/2026',
    atendido: false,
  },
  {
    camada: 'SINAL',
    texto: 'Mudança de atividade principal entre julho e agosto',
    fonte: 'Receita Federal · comparação entre dois lotes',
    referenteA: 'julho/2026 → agosto/2026',
    atendido: true,
  },
] as const

/** As razões contra. Vêm do banco, e a ficha não é publicada sem elas. */
export const RAZOES_CONTRA: readonly string[] = [
  'O discriminador da tese não foi verificado. Nenhuma fonte pública diz se ' +
    'esta empresa tem ou não presença digital profissional — quem confirma é gente.',
  'Ser matriz não prova ser unidade única. Se houver filiais, a decisão de ' +
    'marketing pode nem ser tomada aqui.',
  'Está fora do território atendível hoje. Elegível pela tese, mas custa ' +
    'viagem ou atendimento remoto.',
  'Publicidade de serviço de saúde tem regra própria de conselho profissional. ' +
    'A abordagem comercial precisa respeitar isso.',
] as const

/* ── O QUE ESTÁ NA MESA ──────────────────────────────────────────────────── */

export const ENTREGAS: readonly { item: string; nota: string }[] = [
  {
    item: '3 teses parametrizadas em leitura conjunta',
    nota:
      'Sentado com você. Tese é a descrição do padrão que você procura — ela ' +
      'nasce do que você sabe do seu mercado, não de um formulário.',
  },
  {
    item: 'Mineração do mês inteiro no seu território',
    nota: 'O motor varre o recorte que as teses definirem, do começo ao fim do mês.',
  },
  {
    item: 'Até 10 fichas completas',
    nota:
      'No formato que você vê acima: score decomposto, fonte e data em cada ' +
      'linha, e as razões contra.',
  },
  {
    item: '3 censos de refino',
    nota:
      'O censo conta o território antes de caçar, em faixa. Serve para ajustar ' +
      'a tese quando ela vier larga demais ou estreita demais — sem gastar caçada.',
  },
  {
    item: 'Alertas de mudança no território',
    nota: 'Quando o cadastro público mudar dentro do recorte, você fica sabendo.',
  },
] as const

export const PRAZOS: readonly { o: string; quando: string }[] = [
  { o: 'Primeira pesquisa na sua mão', quando: '5 a 10 dias úteis' },
  { o: 'Motor rodando para você', quando: 'até 10 dias' },
] as const

/* ── MERCADO ──────────────────────────────────────────────────────────────
   ⚠️ LEIA ANTES DE MEXER NESTES NÚMEROS.

   Dos quatro fornecedores citados na ordem original, TRÊS não publicam preço
   nenhum — ggvinteligencia, waxi e beanalytic são todos orçamento sob consulta.
   Verificado buscando as páginas em 20/08/2026.

   Atribuir a eles uma faixa em reais, com link, numa página que o leitor pode
   conferir em dois cliques, seria a mentira mais cara possível: ele clica, não
   acha o preço, e tudo que a página diz sobre honestidade morre junto.

   O que sobrou é verdade inteira e argumenta melhor:
   · a única faixa com fonte publicada aparece com a faixa e o link;
   · os outros três aparecem pelo que de fato são — trabalho sério, preço só
     depois de reunião. O FARO publica o dele nesta página.
   ────────────────────────────────────────────────────────────────────────── */
export type LinhaMercado = {
  readonly categoria: string
  readonly faixa: string
  readonly fonte: string
  readonly url: string
  readonly publicaPreco: boolean
}

export const MERCADO: readonly LinhaMercado[] = [
  {
    categoria: 'Pesquisa de mercado tradicional, presencial',
    faixa: 'R$ 5.000 a R$ 30.000 por estudo',
    fonte: 'Data Goal — tabela publicada',
    url: 'https://www.datagoal.com.br/preco-de-pesquisa-de-mercado-quanto-investir-em-dados-confiaveis-em-2026/',
    publicaPreco: true,
  },
  {
    categoria: 'Consultoria comercial para PME',
    faixa: 'orçamento sob consulta',
    fonte: 'GGV Inteligência em Vendas',
    url: 'https://ggvinteligencia.com.br',
    publicaPreco: false,
  },
  {
    categoria: 'Diagnóstico estratégico com IA',
    faixa: 'orçamento sob consulta',
    fonte: 'Waxi',
    url: 'https://waxi.com.br',
    publicaPreco: false,
  },
  {
    categoria: 'Consultoria de dados e BI',
    faixa: 'orçamento sob consulta',
    fonte: 'beAnalytic',
    url: 'https://beanalytic.com.br',
    publicaPreco: false,
  },
] as const

export const OFERTA = {
  rotulo: 'Operador Fundador · 30 dias',
  valor: 'R$ 6.000',
  chamadaValor: 'Investimento de partida do motor principal',
  vagas: 1,
  cta: 'Aceito — iniciar a mineração',
  /* O WhatsApp do DONO. O botão é o cliente falando com o vendedor — nunca o
     contrário. Formato do `wa.me`: código do país + DDD + número, sem sinal,
     sem espaço, sem parêntese. 55 é o Brasil, 63 é o DDD. */
  ctaNumero: '5563992428800',
  /* Texto que já chega escrito na conversa, na voz de QUEM APERTA o botão.
     Invertê-lo seria o vendedor se respondendo sozinho. Vai cru aqui e é
     codificado na hora de montar o endereço — hífen longo e acento não
     sobrevivem colados numa URL escrita à mão. */
  ctaTexto: 'Aceito a oferta de fundador — vamos iniciar.',
} as const

/* ── A OBJEÇÃO DE PREÇO, RESPONDIDA ANTES DE NASCER ───────────────────────
   Quem lê /precos vê FARO Pro por R$ 1.997/mês e pergunta, com razão, por que
   o mês de fundação custa três vezes isso. A resposta não é retórica — as três
   linhas abaixo são conferíveis:

   · a /precos de fato não tem CTA de compra nenhum (nenhum href, nenhum botão,
     nenhum checkout) — os planos existem como tabela declarada, não como
     produto comprável;
   · "FARO Pro" é o nome exato do degrau de R$ 1.997/mês naquela página;
   · a mecânica de abater a entrada na assinatura já é canon — a FARO Caçada
     avulsa abate 100% no 1º mês do Pro (MODELO-DE-NEGOCIO.md §D.0).

   A condição de fundador que antes era um parágrafo solto da oferta foi
   absorvida na linha 3: dizer "preço travado" duas vezes no mesmo painel não
   reforça, gasta.
   ────────────────────────────────────────────────────────────────────────── */
export const PORQUE_SEIS_MIL = {
  pergunta: 'Por que R$ 6.000, se a assinatura custará menos?',
  linhas: [
    'Os planos da página de preços são o software de autoatendimento — e ele ' +
      'ainda não está à venda. Não existe botão de compra naquela página: ' +
      'ninguém consegue contratá-los hoje, nem você.',
    'O Mês de Fundação é outra coisa. É o fundador operando o motor ' +
      'pessoalmente para um cliente só: leitura conjunta das três teses, ' +
      'parametrização, revisão humana de cada ficha e dossiê entregue em mão. ' +
      'É o trabalho que o mercado precifica como consultoria — a tabela logo ' +
      'acima — e não como assinatura.',
    'Condição de fundador: assinando o FARO Pro no lançamento, o primeiro mês ' +
      'já está incluso neste investimento, e o preço de fundador fica travado. ' +
      'Quem entra agora não paga a tabela que vier depois.',
  ],
} as const
