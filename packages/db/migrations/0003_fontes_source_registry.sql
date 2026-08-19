-- ════════════════════════════════════════════════════════════════════════════
-- 0003 · FONTES — o Source Registry
--
-- "O FARO nao e uma base de dados. E uma camada de inteligencia sobre bases
-- publicas." Toda fonte tem ficha completa, e TODA FONTE E PROVADA VIVA ANTES
-- DE SER PROMETIDA.
--
-- O registry e GLOBAL (nao por tenant): a fonte publica e a mesma pra todo
-- mundo. Por isso e legivel por qualquer autenticado e escrito so pelo motor.
--
-- Canon: MODELO-FARO-V2.md §7.1 · transplante HL (frequencia prometida)
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE fontes.source_registry (
  -- Identificador ESTAVEL citado em cada afirmacao. Nunca reciclado.
  source_id            text PRIMARY KEY,
  nome                 text NOT NULL,
  orgao                text NOT NULL,
  forma_de_acesso      text NOT NULL,
  tipo                 text NOT NULL,

  periodicidade        text NOT NULL,
  -- 🔴 TRANSPLANTE HL: frequencia nao e metadado, e COMPROMISSO OPERACIONAL.
  -- O Watch alerta quando a coleta atrasa em relacao a esta promessa.
  frequencia_prometida interval,

  ultima_coleta_em     timestamptz,
  proxima_coleta_em    timestamptz,

  licenca              text NOT NULL,
  campos_disponiveis   jsonb NOT NULL DEFAULT '[]'::jsonb,
  cobertura            text NOT NULL,

  confiabilidade       text NOT NULL CHECK (confiabilidade IN ('E1','E2','E3')),
  status               text NOT NULL DEFAULT 'viva'
                         CHECK (status IN ('viva','degradada','indisponivel')),
  -- O que o produto faz quando esta fonte cai. Declarado ANTES de cair.
  fallback_declarado   text NOT NULL,

  -- ── FONTE NORMATIVA: o Relogio da Reforma ────────────────────────────────
  -- A LC 214/2025 ja foi alterada pela LC 227/2026. O produto le a versao
  -- VIGENTE, nunca a decorada. Sem coluna de versao, isso vira boa intencao.
  eh_normativa         boolean NOT NULL DEFAULT false,
  versao_vigente       text,
  versao_verificada_em timestamptz,

  criado_em            timestamptz NOT NULL DEFAULT now(),
  atualizado_em        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fonte_normativa_declara_versao
    CHECK (NOT eh_normativa OR versao_vigente IS NOT NULL)
);

COMMENT ON CONSTRAINT fonte_normativa_declara_versao ON fontes.source_registry IS
  'Fonte normativa sem versao vigente e falso positivo com aparencia de rigor.';

CREATE INDEX ON fontes.source_registry (status);
CREATE INDEX ON fontes.source_registry (eh_normativa) WHERE eh_normativa;

-- Histórico de coleta: prova de que a fonte esteve viva, e quando.
CREATE TABLE fontes.saude_coleta (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id         text NOT NULL REFERENCES fontes.source_registry(source_id),
  verificado_em     timestamptz NOT NULL DEFAULT now(),
  status_observado  text NOT NULL CHECK (status_observado IN ('viva','degradada','indisponivel')),
  latencia_ms       integer,
  erro              text,
  -- Atrasou em relacao a frequencia prometida?
  atraso            interval
);

CREATE INDEX ON fontes.saude_coleta (source_id, verificado_em DESC);

ALTER TABLE fontes.source_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE fontes.source_registry FORCE  ROW LEVEL SECURITY;
ALTER TABLE fontes.saude_coleta    ENABLE ROW LEVEL SECURITY;
ALTER TABLE fontes.saude_coleta    FORCE  ROW LEVEL SECURITY;

-- Registry e catalogo publico interno: todo autenticado le, ninguem escreve
-- pelo app (so o motor, que roda fora do RLS de usuario).
CREATE POLICY registry_leitura ON fontes.source_registry
  FOR SELECT TO authenticated USING (true);
CREATE POLICY saude_leitura ON fontes.saude_coleta
  FOR SELECT TO authenticated USING (true);

REVOKE ALL ON fontes.source_registry, fontes.saude_coleta FROM PUBLIC, anon;
GRANT SELECT ON fontes.source_registry, fontes.saude_coleta TO authenticated;
