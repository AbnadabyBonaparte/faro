-- ════════════════════════════════════════════════════════════════════════════
-- 0001 · BOOTSTRAP DE PAPÉIS
--
-- Em Supabase estes papéis já existem. Em Postgres puro (CI, dev local) não —
-- e as migrations precisam rodar nos dois. Sem isto, as guardas de RLS não
-- teriam contra quem provar.
--
-- Canon: LEI-DE-DADOS.md · MODELO-FARO-V2.md §11
-- ════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;
END
$$;

-- ── LEI: o schema public não é área comum ───────────────────────────────────
-- Por padrão o Postgres deixa PUBLIC criar em `public`. Fechado aqui, na
-- fundação, e não numa migration de correção depois de algo vazar.
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM anon;

-- ── LEI: nada novo nasce aberto ao anon ─────────────────────────────────────
-- Default privileges: qualquer tabela criada daqui pra frente já nasce sem
-- grant para anon, mesmo que a migration esqueça de revogar.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS fontes;
CREATE SCHEMA IF NOT EXISTS jazida;
CREATE SCHEMA IF NOT EXISTS eventos;
CREATE SCHEMA IF NOT EXISTS teses;
CREATE SCHEMA IF NOT EXISTS fichas;
CREATE SCHEMA IF NOT EXISTS tribunal;
CREATE SCHEMA IF NOT EXISTS watch;
CREATE SCHEMA IF NOT EXISTS uso;

DO $$
DECLARE s text;
BEGIN
  FOREACH s IN ARRAY ARRAY['core','fontes','jazida','eventos','teses','fichas','tribunal','watch','uso']
  LOOP
    EXECUTE format('REVOKE ALL ON SCHEMA %I FROM PUBLIC', s);
    EXECUTE format('REVOKE ALL ON SCHEMA %I FROM anon', s);
    EXECUTE format('GRANT USAGE ON SCHEMA %I TO authenticated', s);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I REVOKE ALL ON TABLES FROM PUBLIC', s);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I REVOKE ALL ON TABLES FROM anon', s);
  END LOOP;
END
$$;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
