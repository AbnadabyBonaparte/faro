-- ════════════════════════════════════════════════════════════════════════════
-- 0002 · CORE — tenants, memberships, profiles
--
-- A LEI DE DADOS NO CONCRETO: o isolamento por tenant é FÍSICO, via RLS.
-- Nenhuma consulta cruza tenant. Não é disciplina de quem escreve query — é o
-- banco recusando.
--
-- Canon: LEI-DE-DADOS.md (regra de ouro) · MODELO-FARO-V2.md §15.1
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE core.tenants (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text NOT NULL UNIQUE,
  nome          text NOT NULL,
  -- O tenant próprio da ALSHAM: o garimpo da casa, o lote com escritura.
  -- Marcado no schema porque a Lei de Dados trata os dois de forma diferente.
  eh_da_casa    boolean NOT NULL DEFAULT false,
  criado_em     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN core.tenants.eh_da_casa IS
  'true apenas para o tenant proprio da ALSHAM. Dossies do canal operador saem '
  'EXCLUSIVAMENTE deste tenant — nunca de tenant de cliente. Ver CANAL-OPERADOR-PARCEIRO.md';

CREATE TABLE core.profiles (
  -- Espelha auth.users do Supabase. Sem FK aqui para as migrations rodarem
  -- tambem em Postgres puro (CI). A FK entra na migration de ambiente.
  id            uuid PRIMARY KEY,
  email         text,
  nome          text,
  criado_em     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE core.memberships (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  profile_id    uuid NOT NULL REFERENCES core.profiles(id) ON DELETE CASCADE,
  papel         text NOT NULL DEFAULT 'membro',
  criado_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, profile_id)
);

CREATE INDEX ON core.memberships (profile_id);
CREATE INDEX ON core.memberships (tenant_id);

-- ── A FUNÇÃO QUE DERIVA O TENANT DA SESSÃO ──────────────────────────────────
-- 🔴 O tenant NUNCA vem do cliente. Vem de sessão × memberships, no servidor.
-- Um app que pudesse mandar `tenant_id` no corpo da requisição não teria
-- isolamento nenhum — teria uma sugestão de isolamento.
CREATE OR REPLACE FUNCTION core.tenants_do_usuario()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY INVOKER          -- roda com o privilégio de quem chama: as policies valem
SET search_path = ''      -- imune a search_path hijack
AS $$
  SELECT m.tenant_id
  FROM core.memberships m
  WHERE m.profile_id = NULLIF(
    current_setting('request.jwt.claim.sub', true), ''
  )::uuid
$$;

COMMENT ON FUNCTION core.tenants_do_usuario() IS
  'SECURITY INVOKER de proposito: objeto que roda como dono e ponto cego de auditoria. '
  'Ver Banco de Evolucao, entrada CURADORIA-MENSAL-01 · CIRURGIA 360-PRIMA.';

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE core.tenants     ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenants     FORCE  ROW LEVEL SECURITY;
ALTER TABLE core.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.profiles    FORCE  ROW LEVEL SECURITY;
ALTER TABLE core.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.memberships FORCE  ROW LEVEL SECURITY;

CREATE POLICY tenants_do_usuario ON core.tenants
  FOR SELECT TO authenticated
  USING (id IN (SELECT core.tenants_do_usuario()));

CREATE POLICY proprio_profile ON core.profiles
  FOR SELECT TO authenticated
  USING (id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid);

-- ⚠️ Não consulta memberships dentro da policy de memberships.
-- Recursão em policy foi achado real do Banco de Evolução (erro 42P17).
CREATE POLICY proprias_memberships ON core.memberships
  FOR SELECT TO authenticated
  USING (profile_id = NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid);

-- ── GRANTS: zero para anon, no PRÓPRIO arquivo ──────────────────────────────
REVOKE ALL ON core.tenants, core.profiles, core.memberships FROM PUBLIC, anon;
GRANT SELECT ON core.tenants, core.profiles, core.memberships TO authenticated;
