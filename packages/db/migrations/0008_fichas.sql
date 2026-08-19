-- ════════════════════════════════════════════════════════════════════════════
-- 0008 · FICHAS — a entrega, no formato da REGRA DE PEDRO
--
-- Quatro leis viram estrutura aqui, nao disciplina:
--   1. SCORE DERIVADO — o total e recalculado das parcelas por trigger.
--      Escrita direta do total e RECUSADA pelo banco.
--   2. CONFIDENCE POLICY — campos de proxy FISICAMENTE separados dos de fato.
--   3. SELO E COLUNA — `ESTIMATIVA` viaja na linha, nao em rodape.
--   4. REGRA DE PEDRO — adjacente, por-que-nao e acao-preparada sao obrigatorios.
--
-- Canon: MODELO-FARO-V2.md §4, §4.1, §4.2, §5 · REGRA-DE-PEDRO.md
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE fichas.fichas (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id            uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,

  -- Aponta pra VERSAO da tese, nao pra tese. Recalibrar nao reescreve o passado.
  tese_versao_id       uuid NOT NULL REFERENCES teses.versoes(id),
  -- Ficha sem evento e lista, nao FARO.
  evento_id            uuid NOT NULL REFERENCES eventos.eventos(id),

  razao_social         text NOT NULL,
  cnpj                 text NOT NULL,

  -- ── 🔴 CONFIDENCE POLICY NO SCHEMA ────────────────────────────────────────
  -- Fato e proxy em COLUNAS DIFERENTES. Um proxy nao pode ser lido como fato
  -- por descuido de query: ele nao mora no campo do fato.
  porte_observado      text,          -- FATO: veio da fonte
  porte_proxy          text,          -- PROXY: derivado
  porte_proxy_base     text,          -- por que este proxy e aceitavel
  porte_proxy_limite   text,          -- o que ele NAO prova

  faturamento_observado   numeric,    -- quase sempre NULL: nao e publico por empresa
  faturamento_proxy_base  text,
  faturamento_proxy_limite text,

  CONSTRAINT proxy_declara_base_e_limite CHECK (
    (porte_proxy IS NULL) OR (porte_proxy_base IS NOT NULL AND porte_proxy_limite IS NOT NULL)
  ),
  CONSTRAINT porte_nao_e_fato_e_proxy CHECK (
    NOT (porte_observado IS NOT NULL AND porte_proxy IS NOT NULL)
  ),

  -- ── SCORE ────────────────────────────────────────────────────────────────
  -- DERIVADO. Escrita direta e recusada pelo trigger abaixo.
  score_total          integer,
  versao_pesos         text NOT NULL DEFAULT 'v1',

  -- ── EV LIQUIDO — o numero-mestre. Cada componente com SEU SELO. ──────────
  ev_bruto             numeric,
  ev_bruto_selo        text NOT NULL DEFAULT 'NAO_VERIFICADO'
                         CHECK (ev_bruto_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),
  ev_bruto_origem      text,

  ev_prob_elegibilidade      numeric CHECK (ev_prob_elegibilidade BETWEEN 0 AND 1),
  ev_prob_elegibilidade_selo text NOT NULL DEFAULT 'NAO_VERIFICADO'
                         CHECK (ev_prob_elegibilidade_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),

  ev_prob_homologacao        numeric CHECK (ev_prob_homologacao BETWEEN 0 AND 1),
  ev_prob_homologacao_selo   text NOT NULL DEFAULT 'NAO_VERIFICADO'
                         CHECK (ev_prob_homologacao_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),

  ev_ajuste_prazo_caixa      numeric CHECK (ev_ajuste_prazo_caixa BETWEEN 0 AND 1),
  ev_custo_documentacao      numeric,
  ev_honorarios_habilitado   numeric,

  -- Derivado por trigger, junto com o selo (o PIOR dos componentes).
  ev_liquido           numeric,
  ev_liquido_selo      text CHECK (ev_liquido_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),
  ev_indisponivel_por  text,

  -- ── EVIDENCIA ────────────────────────────────────────────────────────────
  grade                text CHECK (grade IN ('A','B','C','D')),
  freshness            text CHECK (freshness IN ('ok','warn','stale','old')),

  -- ── REGRA DE PEDRO, movimento 1 ──────────────────────────────────────────
  limite_de_inferencia text NOT NULL CHECK (length(btrim(limite_de_inferencia)) > 0),

  -- ── REGRA DE PEDRO, movimento 4: prepara, nao dispara ────────────────────
  acao_texto           text NOT NULL,
  acao_estado          text NOT NULL DEFAULT 'preparada'
                         CHECK (acao_estado IN ('preparada','autorizada','executada','cancelada')),
  acao_autorizada_por  uuid REFERENCES core.profiles(id),
  acao_autorizada_em   timestamptz,

  CONSTRAINT acao_so_avanca_com_autor CHECK (
    acao_estado = 'preparada' OR acao_estado = 'cancelada'
    OR (acao_autorizada_por IS NOT NULL AND acao_autorizada_em IS NOT NULL)
  ),

  publicada_em         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON CONSTRAINT acao_so_avanca_com_autor ON fichas.fichas IS
  'Regra de Pedro, movimento 4: o sistema prepara, o humano autoriza. '
  'Acao executada sem autor nomeado e impossivel, nao desaconselhada.';

CREATE INDEX ON fichas.fichas (tenant_id, publicada_em DESC);
CREATE INDEX ON fichas.fichas (tenant_id, score_total DESC NULLS LAST);
CREATE INDEX ON fichas.fichas (tese_versao_id);
CREATE INDEX ON fichas.fichas (evento_id);
CREATE INDEX ON fichas.fichas (cnpj);

-- ── PARCELAS DO SCORE: as 6 dimensoes, uma linha cada ───────────────────────
CREATE TABLE fichas.score_parcelas (
  ficha_id      uuid NOT NULL REFERENCES fichas.fichas(id) ON DELETE CASCADE,
  dimensao      text NOT NULL CHECK (dimensao IN (
                  'fitEstrutural','evidenciaTese','recencia',
                  'qualidadeFontes','intensidadeSinal','confiancaInferencia')),
  valor         numeric NOT NULL CHECK (valor BETWEEN 0 AND 100),
  peso          numeric NOT NULL CHECK (peso BETWEEN 0 AND 1),
  -- A parcela tambem nao mente: contribuicao e GERADA.
  contribuicao  numeric GENERATED ALWAYS AS (valor * peso) STORED,
  PRIMARY KEY (ficha_id, dimensao)
);

-- ── 🔴 A TRAVA DO SCORE DERIVADO ────────────────────────────────────────────
-- Recalcula o total a partir das parcelas e marca a escrita como legitima.
CREATE OR REPLACE FUNCTION fichas.recalcular_score(p_ficha_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE v_total integer;
BEGIN
  SELECT round(coalesce(sum(p.contribuicao), 0))::integer
    INTO v_total
  FROM fichas.score_parcelas p WHERE p.ficha_id = p_ficha_id;

  PERFORM set_config('faro.score_derivado', 'on', true);
  UPDATE fichas.fichas SET score_total = v_total WHERE id = p_ficha_id;
  PERFORM set_config('faro.score_derivado', 'off', true);
END
$$;

-- Recusa qualquer escrita de total que NAO venha do recalculo.
CREATE OR REPLACE FUNCTION fichas.recusa_score_digitado()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF current_setting('faro.score_derivado', true) = 'on' THEN
    RETURN NEW;  -- veio de fichas.recalcular_score()
  END IF;

  IF TG_OP = 'INSERT' AND NEW.score_total IS NOT NULL THEN
    RAISE EXCEPTION
      'score_total e DERIVADO das parcelas — nao se digita. Insira as parcelas e chame fichas.recalcular_score().'
      USING ERRCODE = 'restrict_violation';
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.score_total IS DISTINCT FROM OLD.score_total THEN
    RAISE EXCEPTION
      'score_total e DERIVADO das parcelas — escrita direta recusada.'
      USING ERRCODE = 'restrict_violation';
  END IF;

  RETURN NEW;
END
$$;

CREATE TRIGGER score_e_derivado
  BEFORE INSERT OR UPDATE ON fichas.fichas
  FOR EACH ROW EXECUTE FUNCTION fichas.recusa_score_digitado();

-- Mexeu na parcela, o total se refaz sozinho.
CREATE OR REPLACE FUNCTION fichas.parcela_mudou()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  PERFORM fichas.recalcular_score(COALESCE(NEW.ficha_id, OLD.ficha_id));
  RETURN NULL;
END
$$;

CREATE TRIGGER refaz_total
  AFTER INSERT OR UPDATE OR DELETE ON fichas.score_parcelas
  FOR EACH ROW EXECUTE FUNCTION fichas.parcela_mudou();

-- ── CADEIA DE EVIDENCIA: um no por afirmacao ────────────────────────────────
-- Fonte, data e limite POR NO — nao por ficha. Canon §3.
CREATE TABLE fichas.evidencia (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ficha_id               uuid NOT NULL REFERENCES fichas.fichas(id) ON DELETE CASCADE,
  ordem                  integer NOT NULL,
  camada                 text NOT NULL CHECK (camada IN
                           ('DADO','SINAL','INFERENCIA','TESE','OPORTUNIDADE')),
  texto                  text NOT NULL,
  source_id              text NOT NULL REFERENCES fontes.source_registry(source_id),
  collected_at           timestamptz NOT NULL,
  reference_date         date NOT NULL,
  regra_de_transformacao text NOT NULL CHECK (length(btrim(regra_de_transformacao)) > 0),
  confianca              numeric NOT NULL CHECK (confianca BETWEEN 0 AND 1),
  -- Obrigatorio ate na camada DADO.
  limite_de_inferencia   text NOT NULL CHECK (length(btrim(limite_de_inferencia)) > 0),
  UNIQUE (ficha_id, ordem)
);

CREATE INDEX ON fichas.evidencia (ficha_id, ordem);

-- ── REGRA DE PEDRO, movimento 2: o adjacente ────────────────────────────────
CREATE TABLE fichas.adjacentes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ficha_id      uuid NOT NULL REFERENCES fichas.fichas(id) ON DELETE CASCADE,
  tipo          text NOT NULL CHECK (tipo IN
                  ('evento_vizinho','tese_ao_lado','empresa_do_grupo','prazo_proximo')),
  texto         text NOT NULL,
  -- O adjacente carrega prova igual ao principal. Nao e palpite de vendedor.
  source_id     text NOT NULL REFERENCES fontes.source_registry(source_id),
  collected_at  timestamptz NOT NULL,
  alvo_id       uuid
);

CREATE INDEX ON fichas.adjacentes (ficha_id);

-- ── REGRA DE PEDRO, movimento 3: argumentar contra si ───────────────────────
CREATE TABLE fichas.por_que_nao_perseguir (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ficha_id      uuid NOT NULL REFERENCES fichas.fichas(id) ON DELETE CASCADE,
  codigo        text NOT NULL CHECK (codigo IN (
                  'documentacao_provavelmente_ausente','periodo_possivelmente_prescrito',
                  'precedente_desfavoravel','fonte_degradada','sinal_isolado',
                  'porte_incompativel_com_custo','capacidade_de_utilizacao_duvidosa')),
  texto         text NOT NULL
);

CREATE INDEX ON fichas.por_que_nao_perseguir (ficha_id);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE fichas.fichas                ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.fichas                FORCE  ROW LEVEL SECURITY;
ALTER TABLE fichas.score_parcelas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.score_parcelas        FORCE  ROW LEVEL SECURITY;
ALTER TABLE fichas.evidencia             ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.evidencia             FORCE  ROW LEVEL SECURITY;
ALTER TABLE fichas.adjacentes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.adjacentes            FORCE  ROW LEVEL SECURITY;
ALTER TABLE fichas.por_que_nao_perseguir ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.por_que_nao_perseguir FORCE  ROW LEVEL SECURITY;

CREATE POLICY fichas_do_tenant ON fichas.fichas
  FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()));

-- Filhas herdam o isolamento pela mae. Uma so consulta de tenant, sempre.
CREATE POLICY parcelas_do_tenant ON fichas.score_parcelas
  FOR SELECT TO authenticated USING (ficha_id IN (
    SELECT f.id FROM fichas.fichas f WHERE f.tenant_id IN (SELECT core.tenants_do_usuario())));
CREATE POLICY evidencia_do_tenant ON fichas.evidencia
  FOR SELECT TO authenticated USING (ficha_id IN (
    SELECT f.id FROM fichas.fichas f WHERE f.tenant_id IN (SELECT core.tenants_do_usuario())));
CREATE POLICY adjacentes_do_tenant ON fichas.adjacentes
  FOR SELECT TO authenticated USING (ficha_id IN (
    SELECT f.id FROM fichas.fichas f WHERE f.tenant_id IN (SELECT core.tenants_do_usuario())));
CREATE POLICY pqnp_do_tenant ON fichas.por_que_nao_perseguir
  FOR SELECT TO authenticated USING (ficha_id IN (
    SELECT f.id FROM fichas.fichas f WHERE f.tenant_id IN (SELECT core.tenants_do_usuario())));

REVOKE ALL ON fichas.fichas, fichas.score_parcelas, fichas.evidencia,
              fichas.adjacentes, fichas.por_que_nao_perseguir
  FROM PUBLIC, anon;
GRANT SELECT ON fichas.fichas, fichas.score_parcelas, fichas.evidencia,
                fichas.adjacentes, fichas.por_que_nao_perseguir
  TO authenticated;
-- Ficha e publicada pelo motor, nao pelo app. Sem INSERT para authenticated.
