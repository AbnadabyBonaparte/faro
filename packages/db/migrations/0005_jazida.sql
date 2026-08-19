-- ════════════════════════════════════════════════════════════════════════════
-- 0005 · JAZIDA — snapshots brutos por fonte
--
-- Desenhada pra LOTE. Canon §11: "nunca processar a jazida em tempo real".
-- A varredura roda de madrugada; o assinante le ficha pronta em milissegundos.
--
-- PARTICIONAMENTO E INDEXACAO SAO REQUISITO DE FUNDACAO, nao otimizacao
-- posterior — a jazida-mae tem dezenas de milhoes de linhas.
--
-- Canon: MODELO-FARO-V2.md §11 · junta/marianas (custo computacional oculto)
-- ════════════════════════════════════════════════════════════════════════════

-- Uma coleta = uma passada do motor numa fonte. E o "quando" de tudo.
CREATE TABLE jazida.coletas (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id        text NOT NULL REFERENCES fontes.source_registry(source_id),
  collected_at     timestamptz NOT NULL,
  reference_date   date NOT NULL,
  source_version   text,
  -- Hash do lote inteiro: prova de integridade e chave de deduplicacao.
  hash             text NOT NULL,
  linhas           bigint NOT NULL DEFAULT 0,
  UNIQUE (source_id, hash)
);

CREATE INDEX ON jazida.coletas (source_id, collected_at DESC);
CREATE INDEX ON jazida.coletas (source_id, reference_date DESC);

-- Snapshots brutos. PARTICIONADO POR FONTE desde o dia 1 — reparticionar uma
-- tabela de 60M de linhas depois e cirurgia; nascer particionado e de graca.
CREATE TABLE jazida.snapshots (
  id               bigint GENERATED ALWAYS AS IDENTITY,
  coleta_id        uuid NOT NULL REFERENCES jazida.coletas(id),
  source_id        text NOT NULL REFERENCES fontes.source_registry(source_id),
  -- Chave natural do registro dentro da fonte (CNPJ, id do agente, etc).
  chave_natural    text NOT NULL,
  collected_at     timestamptz NOT NULL,
  reference_date   date NOT NULL,
  source_version   text,
  -- Hash da LINHA: o diff compara hash, nao payload inteiro.
  hash             text NOT NULL,
  payload          jsonb NOT NULL,
  PRIMARY KEY (source_id, id)
) PARTITION BY LIST (source_id);

COMMENT ON TABLE jazida.snapshots IS
  'Particionada por source_id desde a fundacao. Cada fonte nova cria sua particao '
  'na migration que a registra. Indexacao e requisito, nao otimizacao.';

-- Particao DEFAULT: garante que nenhuma insercao se perca antes de a fonte ter
-- particao propria. Fonte de verdade continua sendo o registry.
CREATE TABLE jazida.snapshots_default PARTITION OF jazida.snapshots DEFAULT;

-- O indice que o diff usa: "qual era o hash desta chave na coleta anterior?"
CREATE INDEX ON jazida.snapshots (source_id, chave_natural, collected_at DESC);
CREATE INDEX ON jazida.snapshots (coleta_id);

ALTER TABLE jazida.coletas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE jazida.coletas   FORCE  ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots FORCE  ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots_default ENABLE ROW LEVEL SECURITY;
ALTER TABLE jazida.snapshots_default FORCE  ROW LEVEL SECURITY;

-- 🔴 A jazida bruta NAO e legivel pelo app. Nem por tenant, nem por ninguem.
-- O assinante ve FICHA, nao dado bruto. Zero policy = zero linha visivel.
-- (RLS ligado sem policy nega tudo — e o comportamento desejado aqui.)
COMMENT ON TABLE jazida.coletas IS
  'RLS ligado SEM policy de leitura: proposital. O app nunca le a jazida bruta.';

REVOKE ALL ON jazida.coletas, jazida.snapshots, jazida.snapshots_default
  FROM PUBLIC, anon, authenticated;

-- A jazida e append-only: um snapshot e um retrato de um instante. Retrato que
-- se edita nao e retrato.
SELECT core.tornar_append_only('jazida', 'coletas');
SELECT core.tornar_append_only('jazida', 'snapshots_default');
