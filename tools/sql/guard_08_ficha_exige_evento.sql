-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 08 · A FICHA EXIGE EVENTO, E A TESE EXIGE PESO QUE FECHA
--
-- Duas leis que a Onda 3 criou, e que sem guarda seriam so intencao:
--
--   1. **Candidato sem evento nao vira ficha.** E a fronteira entre o FARO e
--      uma lista de empresas que batem num filtro. Se ela cair, o produto vira
--      exatamente aquilo que o canon §2 recusa ser — e ninguem notaria, porque
--      a ficha sairia bonita.
--
--   2. **Os pesos de uma tese somam 1.** Score cuja soma nao fecha nao e media
--      ponderada: e numero solto com aparencia de media.
--
-- Roda em transacao e desfaz.
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── 1 · PESOS ───────────────────────────────────────────────────────────────
DO $$
DECLARE quebrado text;
BEGIN
  SELECT string_agg(v.nome, ', ') INTO quebrado
    FROM teses.versoes v
   WHERE EXISTS (SELECT 1 FROM teses.pesos p WHERE p.tese_versao_id = v.id)
     AND NOT teses.pesos_somam_um(v.id);
  IF quebrado IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 08: pesos que nao somam 1 em: %. '
      'Media ponderada cujos pesos nao fecham nao e media.', quebrado;
  END IF;
  RAISE NOTICE 'ok  todos os conjuntos de pesos somam 1';
END $$;

-- ── 2 · TODA TESE ATIVA TEM PESOS E EV ──────────────────────────────────────
-- Tese ativa sem pesos nao pontua; sem EV nao entrega o numero-mestre.
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(v.nome, ', ') INTO faltando
    FROM teses.versoes v
   WHERE v.estado = 'ativa'
     AND (NOT EXISTS (SELECT 1 FROM teses.pesos p WHERE p.tese_versao_id = v.id)
       OR NOT EXISTS (SELECT 1 FROM teses.ev_parametros e WHERE e.tese_versao_id = v.id));
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 08: tese ATIVA sem pesos ou sem parametros de EV: %', faltando;
  END IF;
  RAISE NOTICE 'ok  toda tese ativa tem pesos e EV';
END $$;

-- ── 3 · A LEI: CANDIDATO SEM EVENTO NAO PUBLICA ─────────────────────────────
DO $$
DECLARE
  v_tenant uuid; v_versao uuid; v_coleta uuid; v_cacada uuid; v_cand uuid;
  v_passou boolean := false;
BEGIN
  SELECT id INTO v_tenant FROM core.tenants WHERE eh_da_casa LIMIT 1;
  SELECT id INTO v_versao FROM teses.versoes WHERE estado = 'ativa' LIMIT 1;

  INSERT INTO jazida.coletas (source_id, collected_at, reference_date, hash)
  VALUES ('RFB-CNPJ', now(), current_date, 'guarda-08') RETURNING id INTO v_coleta;
  INSERT INTO jazida.coletas_fechamento (coleta_id, ok, linhas) VALUES (v_coleta, true, 1);

  INSERT INTO fichas.cacadas (tenant_id, tese_versao_id, modo, coleta_id)
  VALUES (v_tenant, v_versao, 'inicial', v_coleta) RETURNING id INTO v_cacada;

  -- Candidato com perfil perfeito e SEM evento.
  INSERT INTO fichas.candidatos
    (cacada_id, tenant_id, tese_versao_id, cnpj, cnpj_basico, razao_social,
     criterios_casados, evento_id)
  VALUES (v_cacada, v_tenant, v_versao, '00000001000100', '00000001', 'GUARDA 08 LTDA',
          '[{"chave":"x","rotulo":"x","campo":"x","valor":"x","especie":"FATO","fonte":"RFB-CNPJ"}]'::jsonb,
          NULL)
  RETURNING id INTO v_cand;

  BEGIN
    PERFORM fichas.publicar(v_cand);
    v_passou := true;
  EXCEPTION WHEN restrict_violation THEN
    RAISE NOTICE 'ok  candidato sem evento foi RECUSADO';
  END;

  IF v_passou THEN
    RAISE EXCEPTION 'GUARDA 08: candidato SEM EVENTO virou ficha. '
      'Isso e uma lista de empresas que batem num filtro, nao o FARO.';
  END IF;
END $$;

-- ── 4 · TESE QUE NAO ESTA ATIVA NAO CAÇA ────────────────────────────────────
DO $$
DECLARE v_versao uuid; v_passou boolean := false;
BEGIN
  SELECT id INTO v_versao FROM teses.versoes WHERE estado NOT IN ('ativa','segmentada') LIMIT 1;
  IF v_versao IS NULL THEN
    -- Fabrica uma em estudo para ter contra o que provar.
    INSERT INTO teses.versoes (tese_id, tenant_id, versao, nome, hipotese, estado)
    SELECT tese_id, tenant_id, 99, 'guarda 08 em estudo', 'h', 'estudo'
      FROM teses.versoes WHERE estado = 'ativa' LIMIT 1
    RETURNING id INTO v_versao;
  END IF;

  BEGIN
    PERFORM fichas.cacar(v_versao, 'inicial');
    v_passou := true;
  EXCEPTION WHEN restrict_violation THEN
    RAISE NOTICE 'ok  tese fora de `ativa`/`segmentada` nao caça';
  END;

  IF v_passou THEN
    RAISE EXCEPTION 'GUARDA 08: tese em estudo caçou. Ficha de hipotese nao '
      'assumida e pior que ficha nenhuma.';
  END IF;
END $$;

-- ── 5 · A FICHA NASCE PREPARADA ─────────────────────────────────────────────
DO $$
DECLARE n bigint;
BEGIN
  SELECT count(*) INTO n FROM fichas.fichas
   WHERE acao_estado <> 'preparada' AND acao_autorizada_por IS NULL;
  IF n > 0 THEN
    RAISE EXCEPTION 'GUARDA 08: % ficha(s) fora de `preparada` sem autor. '
      'O sistema prepara, o humano autoriza.', n;
  END IF;
  RAISE NOTICE 'ok  nenhuma ficha avancou sem humano';
END $$;

ROLLBACK;
