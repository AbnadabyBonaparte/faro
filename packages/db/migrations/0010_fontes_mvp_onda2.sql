-- ════════════════════════════════════════════════════════════════════════════
-- 0010 · AS DUAS FONTES DO MVP — registro, particao e tipos de evento
--
-- LEI DA ONDA 2: "toda fonte e provada viva ANTES de ser prometida". Este
-- arquivo so existe porque as duas foram testadas de verdade em 19/08/2026, e
-- ele grava o resultado do teste — inclusive quando o resultado foi RUIM.
--
--   RFB-CNPJ  → 🟢 VIVA      (WebDAV 207, dois lotes baixados e conferidos)
--   CCEE-CL   → ⛔ BLOQUEADA (HTTP 403 declarado pela propria CCEE)
--
-- A CCEE entra no registry como `indisponivel`. Entrar como `viva` seria
-- mentira; nao entrar seria esconder. Ela entra com o fallback declarado e a
-- data em que o bloqueio foi observado.
--
-- Canon: MODELO-FARO-V2.md §7.1 · ORDEM ONDA 2 §1, §2
-- ════════════════════════════════════════════════════════════════════════════

-- ── AS FONTES ───────────────────────────────────────────────────────────────

INSERT INTO fontes.source_registry (
  source_id, nome, orgao, forma_de_acesso, tipo,
  periodicidade, frequencia_prometida,
  licenca, campos_disponiveis, cobertura,
  confiabilidade, status, fallback_declarado
) VALUES (
  'RFB-CNPJ',
  'Cadastro Nacional da Pessoa Juridica — Dados Abertos',
  'Receita Federal do Brasil',
  -- Descoberta da Onda 2: o host roda Nextcloud e o diretorio publico so
  -- responde por WebDAV no share `gn672Ad4CF8N6TK`. O caminho "obvio" da
  -- documentacao antiga devolve 404. Fica escrito para o proximo nao apanhar.
  'WebDAV (Nextcloud public share) em arquivos.receitafederal.gov.br — '
    || 'PROPFIND /public.php/webdav/Dados/Cadastros/CNPJ/{AAAA-MM}/',
  'cadastro',
  'mensal',
  '45 days'::interval,   -- ~1 mes + folga: o lote nao cai em dia fixo
  'Dados abertos — Lei 12.527/2011 (LAI) e Decreto 8.777/2016',
  jsonb_build_object(
    'ingeridos', jsonb_build_array(
      'Empresas (EMPRECSV)', 'Estabelecimentos (ESTABELE)', 'Simples (SIMPLES)'
    ),
    -- 🔴 LEI 7: o que NAO se ingere fica escrito. Silencio vira promessa.
    'nao_ingeridos_declarados', jsonb_build_array(
      'Socios (SOCIOCSV)', 'Municipios', 'Naturezas', 'Paises',
      'Qualificacoes', 'Motivos'
    ),
    'ausentes_no_lote_observado', jsonb_build_array(
      'Cnaes.zip — ausente nos lotes 2026-07 e 2026-08 conferidos em 19/08/2026'
    )
  ),
  'Universo das pessoas juridicas ativas e baixadas no Brasil. '
    || 'Lote mensal completo (nao incremental): ~7,7 GB comprimidos, 36 arquivos.',
  'E1',
  'viva',
  'Sem lote novo dentro da frequencia prometida, o Watch abre evento '
    || '`coleta_atrasada` e TODA ficha derivada desta fonte passa a exibir '
    || 'Freshness degradado. O motor NAO reprocessa o lote velho como se fosse novo.'
), (
  'CCEE-CL',
  'Consumidores livres e especiais — dados abertos',
  'Camara de Comercializacao de Energia Eletrica',
  'HTTP em dadosabertos.ccee.org.br e www.ccee.org.br',
  'cadastro',
  'mensal',
  '45 days'::interval,
  'Dados abertos declarados pela CCEE — termos nao lidos (acesso bloqueado)',
  jsonb_build_object(
    'ingeridos', jsonb_build_array(),
    'nao_ingeridos_declarados', jsonb_build_array('TUDO — fonte inacessivel'),
    'bloqueio_observado', jsonb_build_object(
      'quando', '2026-08-19',
      'http', 403,
      'pagina', 'Bloqueio Manutencao / acesso bloqueado (pagina propria da CCEE)',
      'mensagem', 'O acesso foi bloqueado por nao atender as politicas de '
                  || 'seguranca da CCEE.',
      'remedio_declarado_pela_propria_ccee',
        'abrir chamado informando Error Code e IP de origem — 0800 591 4185 / '
        || 'atendimento@ccee.org.br'
    )
  ),
  'NAO VERIFICADA — nenhuma linha desta fonte foi lida.',
  'E1',
  -- 🔴 Entra BLOQUEADA. Um registry que so aceita fonte boa nao e registry,
  -- e vitrine.
  'indisponivel',
  'Enquanto `indisponivel`, nenhuma tese pode declarar dependencia desta fonte '
    || 'sem que a ficha nasca com Evidence Grade rebaixado e o motivo visivel. '
    || 'Desbloqueio e ato administrativo (chamado na CCEE), nao ajuste tecnico: '
    || 'contornar bloqueio de seguranca declarado nao e opcao desta casa.'
);

-- ── PARTICOES DA JAZIDA ─────────────────────────────────────────────────────
-- Cada fonte nova cria sua particao na migration que a registra. E o contrato
-- que a 0005 deixou escrito.

CREATE TABLE jazida.snapshots_rfb_cnpj
  PARTITION OF jazida.snapshots FOR VALUES IN ('RFB-CNPJ');
CREATE TABLE jazida.snapshots_ccee_cl
  PARTITION OF jazida.snapshots FOR VALUES IN ('CCEE-CL');

ALTER TABLE jazida.snapshots_rfb_cnpj ENABLE ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots_rfb_cnpj FORCE  ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots_ccee_cl  ENABLE ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots_ccee_cl  FORCE  ROW LEVEL SECURITY;

REVOKE ALL ON jazida.snapshots_rfb_cnpj, jazida.snapshots_ccee_cl
  FROM PUBLIC, anon, authenticated;

SELECT core.tornar_append_only('jazida', 'snapshots_rfb_cnpj');
SELECT core.tornar_append_only('jazida', 'snapshots_ccee_cl');

-- ── TIPOS DE EVENTO DO MVP ──────────────────────────────────────────────────
-- Tipo de evento e DADO (0006). Estes sao os que o diff da Onda 2 sabe parir.
-- Os da semente da 0006 continuam validos: sao mais genericos e serao usados
-- por outras fontes.

INSERT INTO eventos.tipos (codigo, rotulo, descricao, escopo) VALUES
  ('estabelecimento_novo',          'Estabelecimento novo',
   'Estabelecimento (CNPJ completo) que nao constava na coleta anterior da fonte', 'empresa'),
  ('cnae_alterado',                 'CNAE alterado',
   'Mudanca no CNAE fiscal principal do estabelecimento', 'empresa'),
  ('porte_alterado',                'Porte alterado',
   'Mudanca na faixa de porte declarada da empresa (base do CNPJ)', 'empresa'),
  ('situacao_cadastral_alterada',   'Situacao cadastral alterada',
   'Mudanca no codigo de situacao cadastral do estabelecimento', 'empresa'),
  ('entrou_simples',                'Entrou no Simples',
   'Passou a constar como optante pelo Simples Nacional', 'empresa'),
  ('saiu_simples',                  'Saiu do Simples',
   'Deixou de constar como optante pelo Simples Nacional', 'empresa'),
  ('consumidor_livre_novo',         'Consumidor livre novo',
   'Passou a constar na relacao de consumidores livres/especiais', 'empresa'),
  ('saiu_da_fonte',                 'Saiu da fonte',
   'Chave que constava na coleta anterior e nao consta na atual. '
   || 'NAO significa que a empresa fechou — significa que a fonte parou de lista-la.',
   'empresa');

COMMENT ON TABLE eventos.tipos IS
  'Tipo de evento e DADO, nao enum — Anti-Vies da casa. Nicho novo entra sem migration. '
  'Onda 2 acrescentou os 8 tipos que o diff RFB/CCEE sabe parir.';

-- ── LEDGER: custo da CASA existe e nao tem tenant ───────────────────────────
-- A coleta de fonte publica e RATEADA, nao vendida: baixar o lote da RFB custa
-- o mesmo tendo 1 ou 300 assinantes. Forcar um tenant_id aqui obrigaria a
-- inventar um dono para um custo que nao tem dono — e numero inventado e
-- exatamente o que a Lei 7 proibe.
--
-- tenant_id NULL passa a significar, explicitamente, "custo de infraestrutura
-- da casa". A policy `ledger_do_tenant` ja compara com `tenants_do_usuario()`,
-- e NULL nunca casa — entao o custo da casa continua invisivel para o
-- assinante, que e o comportamento certo.

ALTER TABLE uso.ledger ALTER COLUMN tenant_id DROP NOT NULL;

ALTER TABLE uso.ledger
  ADD CONSTRAINT ledger_sem_tenant_e_custo_da_casa
  CHECK (tenant_id IS NOT NULL OR metrica IN
    ('linhas_processadas','ms_computacao','bytes_armazenados','chamada_fonte'));

COMMENT ON COLUMN uso.ledger.tenant_id IS
  'NULL = custo de infraestrutura da casa (coleta de fonte publica, rateada). '
  'Nunca visivel ao assinante: a policy compara com tenants_do_usuario() e NULL nao casa.';

-- Sem `fonte_source_id` o ledger da casa diria "gastei" sem dizer "com o que".
ALTER TABLE uso.ledger
  ADD COLUMN source_id text REFERENCES fontes.source_registry(source_id),
  ADD COLUMN coleta_id uuid REFERENCES jazida.coletas(id);

CREATE INDEX ON uso.ledger (source_id, ocorrido_em DESC) WHERE source_id IS NOT NULL;

-- ── SAUDE DA COLETA: o que se observou em 19/08/2026 ────────────────────────
-- Isto nao e semente decorativa: e o resultado dos dois testes reais.

INSERT INTO fontes.saude_coleta (source_id, verificado_em, status_observado, erro)
VALUES
  ('RFB-CNPJ', '2026-08-19T11:44:00Z', 'viva', NULL),
  ('CCEE-CL',  '2026-08-19T11:52:26Z', 'indisponivel',
   'HTTP 403 — pagina propria da CCEE "acesso bloqueado": '
   || '"O acesso foi bloqueado por nao atender as politicas de seguranca da CCEE." '
   || 'Error Code 0.aa2b3417.1787140361.93c660e · IP de origem 160.79.106.136');

UPDATE fontes.source_registry
   SET ultima_coleta_em = '2026-08-19T11:44:00Z'
 WHERE source_id = 'RFB-CNPJ';

-- ── CONJUNTO: uma fonte pode ter varios arquivos com chaves que colidem ─────
-- A RFB entrega Empresas e Simples chaveados pelo MESMO cnpj_basico de 8
-- digitos. Sem separar por conjunto, o diff compararia a linha de Empresas
-- contra a linha do Simples da mesma empresa e pariria evento a cada coleta.
-- Este bug seria descoberto em producao, com o cliente vendo o falso positivo.

ALTER TABLE jazida.snapshots
  ADD COLUMN conjunto text NOT NULL DEFAULT 'padrao';

COMMENT ON COLUMN jazida.snapshots.conjunto IS
  'Arquivo/dataset dentro da fonte (empresas, estabelecimentos, simples). '
  'A chave natural so e unica DENTRO de um conjunto — Empresas e Simples da RFB '
  'compartilham o cnpj_basico.';

-- O indice que o diff realmente usa passa a incluir o conjunto.
CREATE INDEX ON jazida.snapshots (source_id, conjunto, chave_natural, collected_at DESC);

-- 🔴 CONTRA-ARGUMENTO DECLARADO (Regra de Pedro, movimento 3):
-- nao existe UNIQUE (source_id, coleta_id, conjunto, chave_natural). Existiria
-- se o custo fosse baixo — mas em Estabelecimentos sao ~60M de linhas por
-- coleta, e o indice unico custaria alguns GB por lote so para reprovar o que
-- o UNIQUE (source_id, hash) de `jazida.coletas` ja reprova antes: coleta
-- repetida nao entra duas vezes.
-- A idempotencia, portanto, e de LOTE, nao de linha, e depende de o carregador
-- gravar coleta + snapshots na MESMA transacao. Se alguem quebrar isso, a
-- protecao cai — por isso esta escrito aqui, e por isso ha teste.

-- ── FECHAMENTO DA COLETA: metade de um lote nao pode passar por lote ───────
--
-- `jazida.coletas` e append-only (0005). Isso e lei, nao inconveniente — mas
-- cria um problema real: nao da para abrir a coleta, carregar, e depois marcar
-- "pronta", porque marcar seria UPDATE.
--
-- A saida e a propria disciplina append-only: correcao nao se escreve por cima,
-- se ACRESCENTA. O fechamento e uma linha nova numa trilha nova.
--
-- Sem isto, uma carga que morre no meio deixa uma coleta com metade das linhas
-- e cara de coleta inteira. O diff seguinte leria as linhas que faltaram como
-- `saiu_da_fonte` e o assinante receberia milhares de eventos falsos — e falso
-- positivo, aqui, custa mais caro que silencio.

CREATE TABLE jazida.coletas_fechamento (
  coleta_id   uuid PRIMARY KEY REFERENCES jazida.coletas(id),
  fechada_em  timestamptz NOT NULL DEFAULT now(),
  ok          boolean NOT NULL,
  linhas      bigint NOT NULL,
  duracao_ms  bigint,
  -- Obrigatorio quando ok = false: coleta que falhou sem dizer por que e ruido.
  erro        text,
  CONSTRAINT falha_declara_motivo CHECK (ok OR erro IS NOT NULL)
);

ALTER TABLE jazida.coletas_fechamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE jazida.coletas_fechamento FORCE  ROW LEVEL SECURITY;
REVOKE ALL ON jazida.coletas_fechamento FROM PUBLIC, anon, authenticated;
SELECT core.tornar_append_only('jazida', 'coletas_fechamento');

-- A UNICA porta pela qual o diff enxerga coleta. Coleta sem fechamento ok
-- simplesmente nao existe para o resto do sistema.
CREATE VIEW jazida.coletas_completas
  WITH (security_invoker = true) AS
  SELECT c.id, c.source_id, c.collected_at, c.reference_date, c.source_version,
         c.hash, f.linhas, f.fechada_em, f.duracao_ms
    FROM jazida.coletas c
    JOIN jazida.coletas_fechamento f ON f.coleta_id = c.id AND f.ok;

COMMENT ON VIEW jazida.coletas_completas IS
  'Coleta so existe para o motor depois de fechada com ok. Carga interrompida '
  'fica na jazida como tentativa registrada, nunca como lote valido.';

COMMENT ON COLUMN jazida.coletas.linhas IS
  'Contagem declarada na ABERTURA (0 = ainda desconhecida). A contagem real e a '
  'de jazida.coletas_fechamento — a tabela e append-only e nao aceita correcao.';

-- ── LAYOUT DECLARADO: a fonte nao pode mudar de forma no escuro ─────────────
-- Achado do Banco de Evolucao: parser que "se vira" com layout novo entrega
-- dado errado com cara de dado certo. Aqui o layout e declarado, conferido a
-- cada coleta, e divergencia PARA a coleta em vez de adivinhar.

CREATE TABLE fontes.layouts (
  source_id       text NOT NULL REFERENCES fontes.source_registry(source_id),
  conjunto        text NOT NULL,
  versao          text NOT NULL,
  -- Ordem importa: e o layout posicional do CSV sem cabecalho.
  colunas         text[] NOT NULL,
  delimitador     text NOT NULL DEFAULT ';',
  encoding        text NOT NULL DEFAULT 'latin1',
  -- SUBSTRING que identifica o membro dentro do zip. Nao e sufixo: o arquivo do
  -- Simples se chama `F.K03200$W.SIMPLES.CSV.D60808`, com o identificador no
  -- MEIO do nome. Assumir sufixo teria quebrado numa fonte de tres.
  padrao_arquivo  text NOT NULL,
  -- Quais colunas formam a chave natural.
  chave           text[] NOT NULL,
  -- Prova: onde e quando este layout foi conferido contra bytes reais.
  conferido_em    timestamptz,
  conferido_contra text,
  vigente         boolean NOT NULL DEFAULT true,
  PRIMARY KEY (source_id, conjunto, versao)
);

COMMENT ON TABLE fontes.layouts IS
  'Layout DECLARADO da fonte. O parser confere antes de ingerir; divergencia '
  'rebaixa a fonte para `degradada` e PARA a coleta com erro declarado. '
  'Parser que se adapta sozinho entrega dado errado com cara de dado certo.';

ALTER TABLE fontes.layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE fontes.layouts FORCE  ROW LEVEL SECURITY;
CREATE POLICY layouts_leitura ON fontes.layouts
  FOR SELECT TO authenticated USING (true);
REVOKE ALL ON fontes.layouts FROM PUBLIC, anon;
GRANT SELECT ON fontes.layouts TO authenticated;

INSERT INTO fontes.layouts
  (source_id, conjunto, versao, colunas, padrao_arquivo, chave,
   conferido_em, conferido_contra) VALUES
  ('RFB-CNPJ', 'empresas', '2026-07',
   ARRAY['cnpj_basico','razao_social','natureza_juridica',
         'qualificacao_responsavel','capital_social','porte',
         'ente_federativo_responsavel'],
   'EMPRECSV', ARRAY['cnpj_basico'],
   '2026-08-19T00:00:00Z',
   'K3241.K03200Y1.D60711.EMPRECSV (lote 2026-07) e K3241.K03200Y1.D60808.EMPRECSV '
   || '(lote 2026-08): 4.494.860 linhas cada, 7 colunas, ; como delimitador, '
   || 'todos os campos entre aspas duplas'),

  ('RFB-CNPJ', 'estabelecimentos', '2026-07',
   ARRAY['cnpj_basico','cnpj_ordem','cnpj_dv','identificador_matriz_filial',
         'nome_fantasia','situacao_cadastral','data_situacao_cadastral',
         'motivo_situacao_cadastral','nome_cidade_exterior','pais',
         'data_inicio_atividade','cnae_fiscal_principal','cnae_fiscal_secundaria',
         'tipo_logradouro','logradouro','numero','complemento','bairro','cep',
         'uf','municipio','ddd_1','telefone_1','ddd_2','telefone_2','ddd_fax',
         'fax','correio_eletronico','situacao_especial','data_situacao_especial'],
   'ESTABELE', ARRAY['cnpj_basico','cnpj_ordem','cnpj_dv'],
   '2026-08-19T00:00:00Z',
   'K3241.K03200Y1.D60711.ESTABELE (lote 2026-07): 30 colunas, ; como delimitador, '
   || 'todos os campos entre aspas duplas. Conferido campo a campo contra as '
   || 'primeiras linhas reais.'),

  ('RFB-CNPJ', 'simples', '2026-07',
   ARRAY['cnpj_basico','opcao_pelo_simples','data_opcao_simples',
         'data_exclusao_simples','opcao_pelo_mei','data_opcao_mei',
         'data_exclusao_mei'],
   -- 🔴 O membro do zip do Simples NAO segue o padrao dos outros:
   -- `F.K03200$W.SIMPLES.CSV.D60808`, e nao `K3241.K03200Y1.D60808.SIMPLESCSV`.
   -- Casar por sufixo teria falhado. O padrao e SUBSTRING, nao sufixo.
   'SIMPLES.CSV', ARRAY['cnpj_basico'],
   '2026-08-19T00:00:00Z',
   'F.K03200$W.SIMPLES.CSV.D60808 (lote 2026-08): nome do membro conferido; '
   || 'colunas declaradas a partir da documentacao oficial.');

COMMENT ON COLUMN fontes.layouts.conferido_em IS
  'NULL = layout declarado a partir da documentacao, ainda NAO conferido contra '
  'bytes reais. Lei 7: layout nao conferido e ESTIMATIVA, nao fato.';
