-- ════════════════════════════════════════════════════════════════════════════
-- 0006 · EVENTOS — a unidade de valor do FARO
--
-- "Encontrei uma MUDANCA", nao "encontrei uma empresa". Um evento nasce do DIFF
-- entre duas coletas — nunca de uma leitura so. As duas coletas ficam gravadas:
-- e a prova de que houve mudanca.
--
-- APPEND-ONLY e IMUTAVEL: um evento que aconteceu nao desacontece.
--
-- Canon: MODELO-FARO-V2.md §2 · ORDEM ONDA 1 §1.2
-- ════════════════════════════════════════════════════════════════════════════

-- 🔴 ANTI-VIES DA CASA: tipo de evento e DADO, nao enum.
-- Enum amarraria o produto aos eventos que o primeiro cliente precisou. Uma
-- tabela deixa o proximo nicho (FARO-LICITACOES, M&A, agro) entrar sem migration.
CREATE TABLE eventos.tipos (
  codigo        text PRIMARY KEY,
  rotulo        text NOT NULL,
  descricao     text NOT NULL,
  -- Evento de empresa ou de infraestrutura (fonte caiu, norma mudou)?
  escopo        text NOT NULL DEFAULT 'empresa'
                  CHECK (escopo IN ('empresa','fonte','norma')),
  ativo         boolean NOT NULL DEFAULT true,
  criado_em     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE eventos.tipos IS
  'Tipo de evento e DADO, nao enum — Anti-Vies da casa. Nicho novo entra sem migration.';

CREATE TABLE eventos.eventos (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo                 text NOT NULL REFERENCES eventos.tipos(codigo),
  -- Nulo em evento de fonte/norma.
  cnpj                 text,
  source_id            text NOT NULL REFERENCES fontes.source_registry(source_id),

  -- 🔴 AS DUAS COLETAS: sem elas nao ha prova de mudanca, ha alegacao de mudanca.
  coleta_anterior_id   uuid REFERENCES jazida.coletas(id),
  coleta_atual_id      uuid NOT NULL REFERENCES jazida.coletas(id),

  detectado_em         timestamptz NOT NULL DEFAULT now(),
  reference_date       date NOT NULL,

  antes                jsonb,
  depois               jsonb NOT NULL,

  CONSTRAINT diff_precisa_de_duas_coletas
    CHECK (coleta_anterior_id IS NULL OR coleta_anterior_id <> coleta_atual_id)
);

CREATE INDEX ON eventos.eventos (cnpj, detectado_em DESC);
CREATE INDEX ON eventos.eventos (tipo, detectado_em DESC);
CREATE INDEX ON eventos.eventos (source_id, detectado_em DESC);
CREATE INDEX ON eventos.eventos (detectado_em DESC);

ALTER TABLE eventos.tipos    ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos.tipos    FORCE  ROW LEVEL SECURITY;
ALTER TABLE eventos.eventos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos.eventos  FORCE  ROW LEVEL SECURITY;

CREATE POLICY tipos_leitura ON eventos.tipos
  FOR SELECT TO authenticated USING (true);

-- Evento e derivado de fonte publica: nao pertence a tenant nenhum.
-- Legivel por autenticado; o recorte por tese acontece na ficha.
CREATE POLICY eventos_leitura ON eventos.eventos
  FOR SELECT TO authenticated USING (true);

REVOKE ALL ON eventos.tipos, eventos.eventos FROM PUBLIC, anon;
GRANT SELECT ON eventos.tipos, eventos.eventos TO authenticated;

SELECT core.tornar_append_only('eventos', 'eventos');

-- Semente do catalogo de tipos. E SEMENTE, nao lista fechada.
INSERT INTO eventos.tipos (codigo, rotulo, descricao, escopo) VALUES
  ('entrou_em_cadastro',     'Entrou em cadastro',      'Passou a constar em cadastro que antes nao a listava', 'empresa'),
  ('saiu_de_cadastro',       'Saiu de cadastro',        'Deixou de constar em cadastro',                        'empresa'),
  ('mudou_regime',           'Mudou de regime',         'Alteracao de regime tributario declarado',             'empresa'),
  ('nova_filial',            'Nova filial',             'Novo estabelecimento do mesmo CNPJ raiz',              'empresa'),
  ('mudou_porte',            'Mudou de porte',          'Alteracao na faixa de porte declarada',                'empresa'),
  ('mudou_faixa_empregados', 'Mudou faixa de empregados','Alteracao na faixa declarada de empregados',          'empresa'),
  ('contrato_publico',       'Contrato publico',        'Contrato publico registrado',                          'empresa'),
  ('mudou_atividade',        'Mudou de atividade',      'Alteracao de CNAE principal ou secundario',            'empresa'),
  ('fonte_degradada',        'Fonte degradada',         'Fonte com cobertura incompleta ou fora do ar',         'fonte'),
  ('coleta_atrasada',        'Coleta atrasada',         'Coleta fora da frequencia prometida',                  'fonte'),
  ('norma_alterada',         'Norma alterada',          'Texto normativo mudou de versao vigente',              'norma');
