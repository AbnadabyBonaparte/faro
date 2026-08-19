-- ════════════════════════════════════════════════════════════════════════════
-- 0004 · IMUTABILIDADE — a trava das trilhas append-only
--
-- LEI: trilha append-only e IMUTAVEL. Sem UPDATE, sem DELETE.
-- Correcao = estorno com motivo, nunca reescrita.
--
-- Por que trigger e nao so policy: policy protege quem passa pelo RLS. O motor,
-- migrations e qualquer papel com BYPASSRLS passariam por cima. Trigger pega
-- TODO MUNDO, inclusive o dono da tabela e o service_role.
--
-- Canon: ORDEM ONDA 1 §1.2 · Banco de Evolucao (objeto que roda como dono e
-- ponto cego de auditoria)
-- ════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION core.recusa_mutacao()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION
    'trilha append-only: % em %.% e proibido. Correcao = estorno com motivo.',
    TG_OP, TG_TABLE_SCHEMA, TG_TABLE_NAME
    USING ERRCODE = 'restrict_violation';
END
$$;

COMMENT ON FUNCTION core.recusa_mutacao() IS
  'Aplicada como trigger BEFORE UPDATE OR DELETE nas trilhas imutaveis. '
  'Pega ate quem tem BYPASSRLS — policy sozinha nao pegaria.';

-- Helper: marca uma tabela como append-only de uma vez.
CREATE OR REPLACE FUNCTION core.tornar_append_only(p_schema text, p_tabela text)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER zz_append_only BEFORE UPDATE OR DELETE ON %I.%I
       FOR EACH ROW EXECUTE FUNCTION core.recusa_mutacao()',
    p_schema, p_tabela
  );
  -- Cinto e suspensorio: alem do trigger, tira o privilegio.
  EXECUTE format('REVOKE UPDATE, DELETE ON %I.%I FROM PUBLIC, anon, authenticated',
                 p_schema, p_tabela);
END
$$;
