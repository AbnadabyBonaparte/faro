/**
 * AS FONTES DO MVP — o que o código sabe sobre cada uma.
 *
 * O `fontes.source_registry` no banco é a ficha da fonte (o que ela é, quem a
 * publica, o que promete). Este módulo é o COMO chegar nela: URL, forma de
 * autenticação, quais arquivos do lote entram e quais ficam declaradamente de
 * fora.
 *
 * A separação não é burocracia: o registry é lido pelo produto e mostrado ao
 * assinante; isto aqui é operação e nunca aparece em tela.
 *
 * Canon: MODELO-FARO-V2.md §7.1 · ORDEM ONDA 2 §2
 */

export type Conjunto = {
  /** Nome do conjunto na jazida — casa com `fontes.layouts.conjunto`. */
  readonly nome: string
  /** Como reconhecer o arquivo dentro do lote (sufixo do nome interno do zip). */
  readonly sufixoInterno: string
  /** Nome do arquivo no diretório da fonte, sem o mês. */
  readonly arquivos: readonly string[]
  /** Índices (0-based) das colunas que formam a chave natural, na ordem. */
  readonly indicesDaChave: readonly number[]
  /**
   * Colunas que entram no payload da jazida. Guardar 30 colunas de endereço em
   * 60M de linhas custa dezenas de GB para alimentar zero tese do MVP — e a Lei
   * de Dados manda coletar o necessário, não o disponível.
   */
  readonly colunasIngeridas: readonly string[]
}

export type Fonte = {
  readonly sourceId: string
  readonly base: string
  readonly usuario?: string
  readonly conjuntos: readonly Conjunto[]
  /** Arquivos do lote que existem e NÃO são ingeridos. Silêncio vira promessa. */
  readonly naoIngeridos: readonly string[]
  /** Monta o caminho do diretório de um lote. */
  readonly diretorioDoLote: (referencia: string) => string
}

/* ═══════════════════════════════════════════════════════════════════════════
   RFB — CNPJ Base Aberta
   ═══════════════════════════════════════════════════════════════════════════

   🔴 ACHADO DA ONDA 2, registrado para o próximo não apanhar:
   `arquivos.receitafederal.gov.br` roda **Nextcloud**. A raiz redireciona para
   um share público (`/index.php/s/gn672Ad4CF8N6TK`) e o diretório só responde
   por **WebDAV**, com o token do share entrando como USUÁRIO de Basic auth e
   senha vazia. Os caminhos "óbvios" da documentação antiga devolvem 404, o que
   faz a fonte parecer morta quando ela está viva.

   Comprovado em 19/08/2026: PROPFIND devolve 207 e lista 36 arquivos por lote.
   ═══════════════════════════════════════════════════════════════════════════ */

export const TOKEN_SHARE_RFB = 'gn672Ad4CF8N6TK'

export const RFB_CNPJ: Fonte = {
  sourceId: 'RFB-CNPJ',
  base: 'https://arquivos.receitafederal.gov.br/public.php/webdav',
  usuario: TOKEN_SHARE_RFB,
  diretorioDoLote: (referencia) => `/Dados/Cadastros/CNPJ/${referencia}`,

  conjuntos: [
    {
      nome: 'empresas',
      sufixoInterno: '.EMPRECSV',
      arquivos: Array.from({ length: 10 }, (_, i) => `Empresas${String(i)}.zip`),
      indicesDaChave: [0],
      // Só o que alimenta tese: porte move `porte_alterado`; razão social e
      // natureza jurídica são identificação da ficha.
      colunasIngeridas: ['cnpj_basico', 'razao_social', 'natureza_juridica', 'porte'],
    },
    {
      nome: 'estabelecimentos',
      sufixoInterno: '.ESTABELE',
      arquivos: Array.from({ length: 10 }, (_, i) => `Estabelecimentos${String(i)}.zip`),
      indicesDaChave: [0, 1, 2],
      colunasIngeridas: [
        'cnpj_basico',
        'cnpj_ordem',
        'cnpj_dv',
        'identificador_matriz_filial',
        'situacao_cadastral',
        'data_situacao_cadastral',
        'data_inicio_atividade',
        'cnae_fiscal_principal',
        'uf',
        'municipio',
      ],
    },
    {
      nome: 'simples',
      sufixoInterno: '.SIMPLES',
      arquivos: ['Simples.zip'],
      indicesDaChave: [0],
      colunasIngeridas: [
        'cnpj_basico',
        'opcao_pelo_simples',
        'data_opcao_simples',
        'data_exclusao_simples',
        'opcao_pelo_mei',
      ],
    },
  ],

  naoIngeridos: [
    'Socios0..9.zip — quadro societário: nenhuma tese do MVP depende dele, e são ' +
      '~680 MB por lote. Entra quando existir tese que o justifique.',
    'Municipios.zip, Naturezas.zip, Paises.zip, Qualificacoes.zip, Motivos.zip — ' +
      'tabelas de domínio. Pequenas, mas sem uso enquanto a ficha não traduzir códigos.',
    'Cnaes.zip — AUSENTE nos lotes 2026-07 e 2026-08 conferidos em 19/08/2026. ' +
      'Não é decisão nossa: o arquivo não estava lá.',
  ],
}

/* ═══════════════════════════════════════════════════════════════════════════
   CCEE — consumidores livres e especiais
   ═══════════════════════════════════════════════════════════════════════════

   ⛔ BLOQUEADA em 19/08/2026. Não é fonte morta e não é caminho errado: é a
   CCEE recusando este cliente HTTP, com página própria e código de erro.

   Nenhum contorno foi tentado, e não deve ser: burlar bloqueio de segurança
   declarado por um órgão não é engenharia, é passivo. O desbloqueio é ato
   administrativo — chamado na CCEE com o Error Code e o IP.
   ═══════════════════════════════════════════════════════════════════════════ */

export const CCEE_CL: Fonte = {
  sourceId: 'CCEE-CL',
  base: 'https://dadosabertos.ccee.org.br',
  diretorioDoLote: () => '/',
  conjuntos: [],
  naoIngeridos: ['TUDO — HTTP 403 declarado pela CCEE. Ver fontes.saude_coleta.'],
}

export const FONTES: Readonly<Record<string, Fonte>> = {
  'RFB-CNPJ': RFB_CNPJ,
  'CCEE-CL': CCEE_CL,
}

export function fonte(sourceId: string): Fonte {
  const f = FONTES[sourceId]
  if (f === undefined) throw new Error(`fonte desconhecida: ${sourceId}`)
  return f
}
