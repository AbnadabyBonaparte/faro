-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 2 · IMUTABILIDADE DAS TRILHAS APPEND-ONLY
--
-- Nao basta "ter trigger". Esta guarda TENTA o UPDATE e o DELETE de verdade e
-- reprova se algum passar. Testar a moldura em vez do quadro foi achado real do
-- Banco de Evolucao — aqui se testa o quadro.
-- ════════════════════════════════════════════════════════════════════════════

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_tenant   uuid;
  v_profile  uuid;
  v_falhas   text := '';
  v_passou   boolean;
BEGIN
  -- Cenario minimo, com CNPJ ficticio sequencial (padrao da casa).
  INSERT INTO core.tenants (slug, nome, eh_da_casa)
    VALUES ('guarda-imut', 'Tenant de guarda', false) RETURNING id INTO v_tenant;
  INSERT INTO core.profiles (id, email, nome)
    VALUES (gen_random_uuid(), 'guarda@exemplo.invalido', 'Guarda') RETURNING id INTO v_profile;

  INSERT INTO uso.ledger (tenant_id, metrica, quantidade)
    VALUES (v_tenant, 'ficha_publicada', 1);

  -- ── UPDATE em uso.ledger tem que FALHAR ──────────────────────────────────
  v_passou := false;
  BEGIN
    UPDATE uso.ledger SET quantidade = 999 WHERE tenant_id = v_tenant;
    v_passou := true;   -- se chegou aqui, o UPDATE passou: defeito
  EXCEPTION WHEN OTHERS THEN
    NULL;               -- recusou, como manda a lei
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ uso.ledger aceitou UPDATE';
  END IF;

  -- ── DELETE em uso.ledger tem que FALHAR ──────────────────────────────────
  v_passou := false;
  BEGIN
    DELETE FROM uso.ledger WHERE tenant_id = v_tenant;
    v_passou := true;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  IF v_passou THEN
    v_falhas := v_falhas || E'\n  ✗ uso.ledger aceitou DELETE';
  END IF;

  IF v_falhas <> '' THEN
    RAISE EXCEPTION E'GUARDA IMUTABILIDADE REPROVADA:%', v_falhas;
  END IF;

  RAISE NOTICE 'imutabilidade: UPDATE e DELETE recusados em uso.ledger ✓';
END
$$;

-- ── Inventario: toda trilha imutavel tem o trigger? ─────────────────────────
DO $$
DECLARE
  v_esperadas text[] := ARRAY[
    'jazida.coletas','jazida.snapshots_default',
    'eventos.eventos','tribunal.julgamentos','uso.ledger'
  ];
  v_t text; v_sch text; v_tab text; v_faltas text := '';
BEGIN
  FOREACH v_t IN ARRAY v_esperadas LOOP
    v_sch := split_part(v_t, '.', 1);
    v_tab := split_part(v_t, '.', 2);
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger tg
      JOIN pg_class c ON c.oid = tg.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = v_sch AND c.relname = v_tab
        AND tg.tgname = 'zz_append_only' AND NOT tg.tgisinternal
    ) THEN
      v_faltas := v_faltas || format(E'\n  ✗ %s sem trigger append-only', v_t);
    END IF;
  END LOOP;
  IF v_faltas <> '' THEN
    RAISE EXCEPTION E'GUARDA IMUTABILIDADE (inventario) REPROVADA:%', v_faltas;
  END IF;
END
$$;

SELECT n.nspname AS schema, c.relname AS tabela, 'append-only' AS trilha
FROM pg_trigger tg
JOIN pg_class c ON c.oid = tg.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE tg.tgname = 'zz_append_only' AND NOT tg.tgisinternal
ORDER BY 1, 2;
