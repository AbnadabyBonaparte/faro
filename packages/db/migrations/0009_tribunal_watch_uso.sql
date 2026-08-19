-- ════════════════════════════════════════════════════════════════════════════
-- 0009 · TRIBUNAL · WATCH · USAGE LEDGER
--
-- TRIBUNAL MAGRO: 3 botoes e um motivo. Sem Kanban, sem estagio de negociacao.
-- O MOTIVO E DADO DE 1a CLASSE — e o combustivel do Thesis Engine, o unico
-- ativo que concorrente nenhum copia junto com a fonte publica.
--
-- Canon: MODELO-FARO-V2.md §9, §10, §16 · ORDEM ONDA 1 §1.2
-- ════════════════════════════════════════════════════════════════════════════

-- Motivo como DADO, nao enum (Anti-Vies): o vocabulario de descarte muda por
-- nicho, e o proximo nicho nao pode precisar de migration pra existir.
CREATE TABLE tribunal.motivos (
  codigo        text PRIMARY KEY,
  rotulo        text NOT NULL,
  -- Para qual julgamento este motivo faz sentido.
  julgamento    text NOT NULL CHECK (julgamento IN ('aprovada','descartada','monitorar')),
  ativo         boolean NOT NULL DEFAULT true
);

CREATE TABLE tribunal.julgamentos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  ficha_id      uuid NOT NULL REFERENCES fichas.fichas(id) ON DELETE CASCADE,
  julgamento    text NOT NULL CHECK (julgamento IN ('aprovada','descartada','monitorar')),
  -- 🔴 Julgamento sem motivo nao ensina nada a tese. NOT NULL de proposito.
  motivo_codigo text NOT NULL REFERENCES tribunal.motivos(codigo),
  motivo_texto  text,
  julgado_por   uuid NOT NULL REFERENCES core.profiles(id),
  julgado_em    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON tribunal.julgamentos (tenant_id, julgado_em DESC);
CREATE INDEX ON tribunal.julgamentos (ficha_id);
-- O indice que o Thesis Engine vai usar: "que motivo aparece em que julgamento".
CREATE INDEX ON tribunal.julgamentos (julgamento, motivo_codigo);

-- ── WATCH: assinaturas de monitoramento + feed ──────────────────────────────
CREATE TABLE watch.assinaturas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  -- Os quatro alvos do canon §8.
  alvo          text NOT NULL CHECK (alvo IN ('tese','empresa','recorte','tipo_evento')),
  -- Referencia polimorfica: tese_id, cnpj, json do recorte, ou codigo do tipo.
  alvo_ref      text NOT NULL,
  ativa         boolean NOT NULL DEFAULT true,
  criada_em     timestamptz NOT NULL DEFAULT now(),
  criada_por    uuid REFERENCES core.profiles(id),
  UNIQUE (tenant_id, alvo, alvo_ref)
);

CREATE INDEX ON watch.assinaturas (tenant_id) WHERE ativa;

CREATE TABLE watch.feed (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  assinatura_id  uuid NOT NULL REFERENCES watch.assinaturas(id) ON DELETE CASCADE,
  evento_id      uuid NOT NULL REFERENCES eventos.eventos(id),
  -- Ficha, quando o evento virou oportunidade. Nem todo evento vira.
  ficha_id       uuid REFERENCES fichas.fichas(id),
  entregue_em    timestamptz NOT NULL DEFAULT now(),
  lido_em        timestamptz
);

CREATE INDEX ON watch.feed (tenant_id, entregue_em DESC);
CREATE INDEX ON watch.feed (assinatura_id, entregue_em DESC);

-- ── USAGE LEDGER: desde o dia 1 ─────────────────────────────────────────────
-- "Sem custo por ficha conhecido, preco e chute." Canon §16.
-- Append-only: um consumo que aconteceu nao desacontece.
CREATE TABLE uso.ledger (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  tese_id            uuid REFERENCES teses.teses(id),
  ocorrido_em        timestamptz NOT NULL DEFAULT now(),
  -- O que foi consumido.
  metrica            text NOT NULL CHECK (metrica IN (
                       'linhas_processadas','ms_computacao','bytes_armazenados',
                       'ficha_publicada','ficha_aprovada','revisao_humana_min',
                       'chamada_fonte')),
  quantidade         numeric NOT NULL,
  -- Custo em centavos, quando conhecido. NULL = ainda nao medido, nao zero.
  custo_centavos     bigint,
  referencia         text
);

CREATE INDEX ON uso.ledger (tenant_id, ocorrido_em DESC);
CREATE INDEX ON uso.ledger (tenant_id, metrica, ocorrido_em DESC);
CREATE INDEX ON uso.ledger (tese_id, metrica) WHERE tese_id IS NOT NULL;

COMMENT ON COLUMN uso.ledger.custo_centavos IS
  'NULL significa NAO MEDIDO, nunca zero. Custo zero e afirmacao, ausencia e ausencia.';

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE tribunal.motivos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribunal.motivos     FORCE  ROW LEVEL SECURITY;
ALTER TABLE tribunal.julgamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribunal.julgamentos FORCE  ROW LEVEL SECURITY;
ALTER TABLE watch.assinaturas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch.assinaturas    FORCE  ROW LEVEL SECURITY;
ALTER TABLE watch.feed           ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch.feed           FORCE  ROW LEVEL SECURITY;
ALTER TABLE uso.ledger           ENABLE ROW LEVEL SECURITY;
ALTER TABLE uso.ledger           FORCE  ROW LEVEL SECURITY;

CREATE POLICY motivos_leitura ON tribunal.motivos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY julgamentos_do_tenant ON tribunal.julgamentos
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()));
CREATE POLICY julgar_no_proprio_tenant ON tribunal.julgamentos
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id IN (SELECT core.tenants_do_usuario()));

CREATE POLICY assinaturas_do_tenant ON watch.assinaturas
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()))
  WITH CHECK (tenant_id IN (SELECT core.tenants_do_usuario()));

CREATE POLICY feed_do_tenant ON watch.feed
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()));

CREATE POLICY ledger_do_tenant ON uso.ledger
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()));

REVOKE ALL ON tribunal.motivos, tribunal.julgamentos, watch.assinaturas,
              watch.feed, uso.ledger
  FROM PUBLIC, anon;
GRANT SELECT ON tribunal.motivos, tribunal.julgamentos, watch.feed, uso.ledger
  TO authenticated;
GRANT INSERT ON tribunal.julgamentos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON watch.assinaturas TO authenticated;

-- ── APPEND-ONLY: julgamento e ledger nao se reescrevem ──────────────────────
SELECT core.tornar_append_only('tribunal', 'julgamentos');
SELECT core.tornar_append_only('uso', 'ledger');

-- Semente dos motivos. Vocabulario minimo — cresce por dado, nao por migration.
INSERT INTO tribunal.motivos (codigo, rotulo, julgamento) VALUES
  ('perfil_forte_abordar_agora',   'Perfil forte, abordar agora',         'aprovada'),
  ('perfil_compativel_fila',       'Perfil compativel, entrar na fila',   'aprovada'),
  ('vale_apesar_do_score',         'Vale investigar apesar do score',     'aprovada'),
  ('fora_do_perfil',               'Fora do perfil da tese',              'descartada'),
  ('sinal_nao_se_confirmou',       'Sinal nao se confirmou na pratica',   'descartada'),
  ('sem_contato_ou_autoridade',    'Sem contato ou autoridade acessivel', 'descartada'),
  ('timing_errado',                'Timing errado',                       'descartada'),
  ('ja_e_cliente',                 'Ja e cliente ou ja foi abordada',     'descartada'),
  ('concorrente_ja_atende',        'Concorrente ja atende',               'descartada'),
  ('sinal_isolado_aguardar',       'Sinal isolado, aguardar corroboracao','monitorar'),
  ('fonte_degradada',              'Fonte degradada',                     'monitorar'),
  ('fora_de_timing',               'Fora de timing',                      'monitorar');
