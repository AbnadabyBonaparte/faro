-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 4 · REGRA DE PEDRO NO SCHEMA
--
-- Os quatro movimentos tem que ser IMPOSSIVEIS de burlar, nao so recomendados.
-- Esta guarda tenta burlar cada um.
--
-- Canon: REGRA-DE-PEDRO.md
-- ════════════════════════════════════════════════════════════════════════════

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_tenant uuid; v_tese uuid; v_versao uuid; v_evento uuid; v_coleta uuid;
  v_falhas text := ''; v_passou boolean;
BEGIN
  INSERT INTO core.tenants (slug, nome) VALUES ('guarda-pedro','Guarda Pedro')
    RETURNING id INTO v_tenant;
  INSERT INTO jazida.coletas (source_id, collected_at, reference_date, hash)
    VALUES ('SRC-GUARDA', now(), current_date, 'hash-guarda-pedro')
    RETURNING id INTO v_coleta;
  INSERT INTO eventos.eventos (tipo, cnpj, source_id, coleta_atual_id, reference_date, depois)
    VALUES ('mudou_porte','00.000.002/0001-00','SRC-GUARDA', v_coleta, current_date,'{}'::jsonb)
    RETURNING id INTO v_evento;
  INSERT INTO teses.teses (tenant_id, codigo) VALUES (v_tenant,'T-PEDRO')
    RETURNING id INTO v_tese;
  INSERT INTO teses.versoes (tese_id, tenant_id, versao, nome, hipotese, estado)
    VALUES (v_tese, v_tenant, 1, 'Pedro', 'hipotese', 'estudo')
    RETURNING id INTO v_versao;

  -- ── MOVIMENTO 1: ficha sem limite de inferencia tem que FALHAR ───────────
  v_passou := false;
  BEGIN
    INSERT INTO fichas.fichas
      (tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
       limite_de_inferencia, acao_texto)
    VALUES (v_tenant, v_versao, v_evento,'X','00.000.002/0001-00','   ','agir');
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ movimento 1: aceitou ficha com limite de inferencia em branco';
  END IF;

  -- ── MOVIMENTO 4: acao executada sem autor tem que FALHAR ─────────────────
  v_passou := false;
  BEGIN
    INSERT INTO fichas.fichas
      (tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
       limite_de_inferencia, acao_texto, acao_estado)
    VALUES (v_tenant, v_versao, v_evento,'X','00.000.002/0001-00',
            'limite declarado','disparar','executada');
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ movimento 4: aceitou acao executada sem autor — o humano nao autorizou';
  END IF;

  -- ── CONFIDENCE POLICY: proxy sem base/limite tem que FALHAR ──────────────
  v_passou := false;
  BEGIN
    INSERT INTO fichas.fichas
      (tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
       porte_proxy, limite_de_inferencia, acao_texto)
    VALUES (v_tenant, v_versao, v_evento,'X','00.000.002/0001-00',
            'Demais','limite','agir');
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ confidence policy: aceitou proxy sem base e sem limite declarados';
  END IF;

  -- ── CONFIDENCE POLICY: mesmo campo como fato E proxy tem que FALHAR ──────
  v_passou := false;
  BEGIN
    INSERT INTO fichas.fichas
      (tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
       porte_observado, porte_proxy, porte_proxy_base, porte_proxy_limite,
       limite_de_inferencia, acao_texto)
    VALUES (v_tenant, v_versao, v_evento,'X','00.000.002/0001-00',
            'Demais','Demais','base','limite','limite','agir');
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ confidence policy: aceitou porte como fato E proxy ao mesmo tempo';
  END IF;

  -- ── LEI DE DADOS: tese da casa ativa sem certidao tem que FALHAR ─────────
  DECLARE v_casa uuid; v_tese_casa uuid;
  BEGIN
    INSERT INTO core.tenants (slug, nome, eh_da_casa)
      VALUES ('guarda-casa','Tenant da casa', true) RETURNING id INTO v_casa;
    INSERT INTO teses.teses (tenant_id, codigo) VALUES (v_casa,'T-CASA')
      RETURNING id INTO v_tese_casa;
    v_passou := false;
    BEGIN
      INSERT INTO teses.versoes (tese_id, tenant_id, versao, nome, hipotese, estado)
        VALUES (v_tese_casa, v_casa, 1, 'Sem certidao','h','ativa');
      v_passou := true;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    IF v_passou THEN
      v_falhas := v_falhas || E'\n  ✗ lei de dados: tese da casa ficou ATIVA sem certidao de proveniencia';
    END IF;
  END;

  IF v_falhas <> '' THEN
    RAISE EXCEPTION E'GUARDA REGRA DE PEDRO REPROVADA:%', v_falhas;
  END IF;

  RAISE NOTICE 'regra de pedro + confidence policy + lei de dados: todas as burlas recusadas ✓';
END
$$;
