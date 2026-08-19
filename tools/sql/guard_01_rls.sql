-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 1 · RLS 100% + ZERO GRANT PARA ANON
--
-- Enumera TODAS as tabelas dos schemas do FARO e reprova se qualquer uma
-- estiver sem RLS ENABLE, sem RLS FORCE, ou com privilegio para anon.
--
-- Guarda que so checa as tabelas que voce lembrou de listar nao guarda nada.
-- Esta enumera o catalogo — tabela nova nasce coberta ou quebra o CI.
-- ════════════════════════════════════════════════════════════════════════════

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_faltas text := '';
  r record;
BEGIN
  -- ── Sem RLS ENABLE ou sem FORCE ──────────────────────────────────────────
  FOR r IN
    SELECT n.nspname AS sch, c.relname AS tab, c.relrowsecurity, c.relforcerowsecurity
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname IN ('core','fontes','jazida','eventos','teses','fichas','tribunal','watch','uso')
      AND c.relkind IN ('r','p')          -- tabela e tabela particionada
    ORDER BY 1,2
  LOOP
    IF NOT r.relrowsecurity THEN
      v_faltas := v_faltas || format(E'\n  ✗ %s.%s — RLS NAO habilitado', r.sch, r.tab);
    ELSIF NOT r.relforcerowsecurity THEN
      v_faltas := v_faltas || format(E'\n  ✗ %s.%s — RLS sem FORCE (dono passa por cima)', r.sch, r.tab);
    END IF;
  END LOOP;

  -- ── Grant para anon ──────────────────────────────────────────────────────
  FOR r IN
    SELECT table_schema AS sch, table_name AS tab, privilege_type AS priv
    FROM information_schema.role_table_grants
    WHERE grantee = 'anon'
      AND table_schema IN ('core','fontes','jazida','eventos','teses','fichas','tribunal','watch','uso')
  LOOP
    v_faltas := v_faltas || format(E'\n  ✗ %s.%s — grant %s para ANON', r.sch, r.tab, r.priv);
  END LOOP;

  -- ── Grant para PUBLIC (equivale a anon: todo mundo herda) ────────────────
  FOR r IN
    SELECT table_schema AS sch, table_name AS tab, privilege_type AS priv
    FROM information_schema.role_table_grants
    WHERE grantee = 'PUBLIC'
      AND table_schema IN ('core','fontes','jazida','eventos','teses','fichas','tribunal','watch','uso')
  LOOP
    v_faltas := v_faltas || format(E'\n  ✗ %s.%s — grant %s para PUBLIC', r.sch, r.tab, r.priv);
  END LOOP;

  IF v_faltas <> '' THEN
    RAISE EXCEPTION E'GUARDA RLS REPROVADA:%', v_faltas;
  END IF;
END
$$;

-- Inventario: a prova positiva, tabela por tabela.
SELECT
  n.nspname                                  AS schema,
  c.relname                                  AS tabela,
  CASE WHEN c.relrowsecurity THEN 'sim' ELSE 'NAO' END      AS rls,
  CASE WHEN c.relforcerowsecurity THEN 'sim' ELSE 'NAO' END AS force,
  (SELECT count(*) FROM pg_policies p
    WHERE p.schemaname = n.nspname AND p.tablename = c.relname) AS policies,
  (SELECT count(*) FROM information_schema.role_table_grants g
    WHERE g.table_schema = n.nspname AND g.table_name = c.relname
      AND g.grantee IN ('anon','PUBLIC'))    AS grants_anon
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('core','fontes','jazida','eventos','teses','fichas','tribunal','watch','uso')
  AND c.relkind IN ('r','p')
ORDER BY 1, 2;
