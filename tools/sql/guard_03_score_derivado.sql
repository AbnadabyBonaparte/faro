-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 3 · SCORE DERIVADO
--
-- Tenta escrever o total a mao, no INSERT e no UPDATE. As duas tentativas tem
-- que FALHAR. Depois insere as parcelas e confere que o total apareceu sozinho
-- e bate com a soma ponderada.
--
-- Canon: MODELO-FARO-V2.md §4 — "nunca 'a IA deu 87'".
-- ════════════════════════════════════════════════════════════════════════════

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_tenant uuid; v_tese uuid; v_versao uuid; v_evento uuid; v_ficha uuid;
  v_coleta uuid; v_total integer; v_esperado integer;
  v_falhas text := ''; v_passou boolean;
BEGIN
  -- ── cenario minimo ───────────────────────────────────────────────────────
  INSERT INTO core.tenants (slug, nome) VALUES ('guarda-score','Guarda score')
    RETURNING id INTO v_tenant;

  INSERT INTO fontes.source_registry
    (source_id, nome, orgao, forma_de_acesso, tipo, periodicidade, licenca,
     cobertura, confiabilidade, fallback_declarado)
  VALUES ('SRC-GUARDA','Fonte de guarda','Orgao ficticio','arquivo','cadastro',
          'mensal','dados abertos','teste','E1','declarar limitacao')
  ON CONFLICT (source_id) DO NOTHING;

  INSERT INTO jazida.coletas (source_id, collected_at, reference_date, hash)
    VALUES ('SRC-GUARDA', now(), current_date, 'hash-guarda-1')
    RETURNING id INTO v_coleta;

  INSERT INTO eventos.eventos (tipo, cnpj, source_id, coleta_atual_id, reference_date, depois)
    VALUES ('mudou_porte','00.000.001/0001-00','SRC-GUARDA', v_coleta, current_date, '{}'::jsonb)
    RETURNING id INTO v_evento;

  INSERT INTO teses.teses (tenant_id, codigo) VALUES (v_tenant,'T-GUARDA')
    RETURNING id INTO v_tese;
  INSERT INTO teses.versoes (tese_id, tenant_id, versao, nome, hipotese, estado)
    VALUES (v_tese, v_tenant, 1, 'Tese de guarda', 'hipotese', 'estudo')
    RETURNING id INTO v_versao;

  -- ── 1. INSERT com total digitado tem que FALHAR ──────────────────────────
  v_passou := false;
  BEGIN
    INSERT INTO fichas.fichas
      (tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
       limite_de_inferencia, acao_texto, score_total)
    VALUES (v_tenant, v_versao, v_evento, 'FICTICIA LTDA','00.000.001/0001-00',
            'proxy nao vira fato','investigar', 87);
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ INSERT aceitou score_total digitado';
  END IF;

  -- ── ficha legitima: sem total ────────────────────────────────────────────
  INSERT INTO fichas.fichas
    (tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
     porte_proxy, porte_proxy_base, porte_proxy_limite,
     limite_de_inferencia, acao_texto)
  VALUES (v_tenant, v_versao, v_evento, 'FICTICIA LTDA', '00.000.001/0001-00',
          'Demais','capital social','capital nao e receita',
          'porte e proxy declarado','investigar')
  RETURNING id INTO v_ficha;

  -- ── 2. UPDATE do total tem que FALHAR ────────────────────────────────────
  v_passou := false;
  BEGIN
    UPDATE fichas.fichas SET score_total = 99 WHERE id = v_ficha;
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ UPDATE aceitou escrita direta de score_total';
  END IF;

  -- ── 3. Com parcelas, o total aparece SOZINHO e bate ──────────────────────
  INSERT INTO fichas.score_parcelas (ficha_id, dimensao, valor, peso) VALUES
    (v_ficha,'fitEstrutural',        94, 0.25),
    (v_ficha,'evidenciaTese',        88, 0.20),
    (v_ficha,'recencia',             92, 0.15),
    (v_ficha,'qualidadeFontes',      96, 0.15),
    (v_ficha,'intensidadeSinal',     85, 0.15),
    (v_ficha,'confiancaInferencia',  74, 0.10);

  SELECT score_total INTO v_total FROM fichas.fichas WHERE id = v_ficha;
  SELECT round(sum(contribuicao))::integer INTO v_esperado
    FROM fichas.score_parcelas WHERE ficha_id = v_ficha;

  IF v_total IS NULL THEN
    v_falhas := v_falhas || E'\n  ✗ total nao foi derivado apos inserir parcelas';
  ELSIF v_total <> v_esperado THEN
    v_falhas := v_falhas || format(E'\n  ✗ total derivado %s difere da soma %s', v_total, v_esperado);
  END IF;

  IF v_falhas <> '' THEN
    RAISE EXCEPTION E'GUARDA SCORE DERIVADO REPROVADA:%', v_falhas;
  END IF;

  RAISE NOTICE 'score derivado: INSERT e UPDATE diretos recusados; total = % (soma das parcelas) ✓', v_total;
END
$$;
