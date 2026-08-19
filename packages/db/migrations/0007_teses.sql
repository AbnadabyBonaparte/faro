-- ════════════════════════════════════════════════════════════════════════════
-- 0007 · TESES — versionadas, com estado e certidao de proveniencia
--
-- Duas leis moram aqui:
--   1. TODA EDICAO GERA VERSAO NOVA. A ficha aponta pra versao que a gerou.
--      Sem isso, recalibrar a tese reescreve o passado e o ground truth mente.
--   2. CERTIDAO DE PROVENIENCIA no catalogo da casa: declaracao expressa de que
--      a tese NAO derivou de tenant de cliente. Sem certidao, nao entra.
--
-- Canon: LEI-DE-DADOS.md camada 3 · CATALOGO-DE-TESES-DA-CASA.md
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE teses.teses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  -- Codigo estavel dentro do tenant (T-04, etc). O catalogo da casa usa.
  codigo        text,
  criada_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, codigo)
);

CREATE INDEX ON teses.teses (tenant_id);

CREATE TABLE teses.versoes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tese_id           uuid NOT NULL REFERENCES teses.teses(id) ON DELETE CASCADE,
  tenant_id         uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  versao            integer NOT NULL,

  nome              text NOT NULL,
  hipotese          text NOT NULL,
  parametros        jsonb NOT NULL DEFAULT '[]'::jsonb,
  sinais_exigidos   jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Detectar tese MORTA, nao so viva. Canon: tese estatica = produto fraco.
  estado            text NOT NULL DEFAULT 'estudo'
                      CHECK (estado IN ('ativa','estudo','segmentada','contraditada','morta')),
  -- Quando contraditada: qual a contradicao, entre quem, aguardando o que.
  motivo_do_estado  text,
  verificada_em     timestamptz,

  criada_em         timestamptz NOT NULL DEFAULT now(),
  criada_por        uuid REFERENCES core.profiles(id),

  UNIQUE (tese_id, versao)
);

CREATE INDEX ON teses.versoes (tenant_id, estado);
CREATE INDEX ON teses.versoes (tese_id, versao DESC);

-- ── CERTIDAO DE PROVENIENCIA ────────────────────────────────────────────────
-- So o catalogo da casa exige. Tese de assinante e DELE e nao carrega certidao
-- — a casa nao tem o que declarar sobre a tese do cliente porque nao a usa.
CREATE TABLE teses.proveniencia (
  tese_id                        uuid PRIMARY KEY REFERENCES teses.teses(id) ON DELETE CASCADE,
  origem                         text NOT NULL
                                   CHECK (origem IN ('parecer','fonte_publica','pesquisa_propria','caso_operado')),
  referencia                     text NOT NULL,
  autor                          text NOT NULL,
  -- 🔴 A LINHA VERMELHA DA LEI DE DADOS, como constraint.
  nao_derivou_de_tenant_cliente  boolean NOT NULL,
  declarada_em                   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT certidao_exige_declaracao
    CHECK (nao_derivou_de_tenant_cliente = true)
);

COMMENT ON CONSTRAINT certidao_exige_declaracao ON teses.proveniencia IS
  'A declaracao so pode ser true. Nao ha certidao "talvez": ou a tese nasceu limpa, '
  'ou nao ha certidao — e sem certidao ela nao entra no catalogo da casa.';

-- Trava: tese do tenant da casa em estado ATIVA exige certidao.
CREATE OR REPLACE FUNCTION teses.exige_certidao_no_catalogo()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE v_da_casa boolean;
BEGIN
  IF NEW.estado <> 'ativa' THEN RETURN NEW; END IF;
  SELECT t.eh_da_casa INTO v_da_casa FROM core.tenants t WHERE t.id = NEW.tenant_id;
  IF v_da_casa AND NOT EXISTS (
    SELECT 1 FROM teses.proveniencia p WHERE p.tese_id = NEW.tese_id
  ) THEN
    RAISE EXCEPTION
      'tese % do catalogo da casa nao pode ficar ativa sem certidao de proveniencia', NEW.tese_id
      USING ERRCODE = 'restrict_violation';
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER exige_certidao
  BEFORE INSERT OR UPDATE ON teses.versoes
  FOR EACH ROW EXECUTE FUNCTION teses.exige_certidao_no_catalogo();

ALTER TABLE teses.teses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE teses.teses        FORCE  ROW LEVEL SECURITY;
ALTER TABLE teses.versoes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE teses.versoes      FORCE  ROW LEVEL SECURITY;
ALTER TABLE teses.proveniencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE teses.proveniencia FORCE  ROW LEVEL SECURITY;

-- 🔴 A TESE DO ASSINANTE E DO ASSINANTE. Isolamento fisico, nao promessa.
CREATE POLICY teses_do_tenant ON teses.teses
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()))
  WITH CHECK (tenant_id IN (SELECT core.tenants_do_usuario()));

CREATE POLICY versoes_do_tenant ON teses.versoes
  FOR ALL TO authenticated
  USING (tenant_id IN (SELECT core.tenants_do_usuario()))
  WITH CHECK (tenant_id IN (SELECT core.tenants_do_usuario()));

CREATE POLICY proveniencia_do_tenant ON teses.proveniencia
  FOR SELECT TO authenticated
  USING (tese_id IN (
    SELECT t.id FROM teses.teses t WHERE t.tenant_id IN (SELECT core.tenants_do_usuario())
  ));

REVOKE ALL ON teses.teses, teses.versoes, teses.proveniencia FROM PUBLIC, anon;
GRANT SELECT, INSERT ON teses.teses, teses.versoes TO authenticated;
GRANT SELECT ON teses.proveniencia TO authenticated;
-- Sem UPDATE em versoes: editar tese = criar versao nova, nao alterar a velha.
