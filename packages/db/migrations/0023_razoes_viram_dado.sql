-- ════════════════════════════════════════════════════════════════════════════
-- 0023 · RAZAO DE JULGAMENTO VIRA DADO, COMO A LEI JA MANDAVA
--
-- 🔴 O DEFEITO, achado publicando a primeira ficha real.
--
-- A lei da casa diz: razao de julgamento e DADO, nunca enum. Estavam em enum —
-- e nao em um, em DOIS: `teses.regras_contra.codigo` e
-- `fichas.por_que_nao_perseguir.codigo`, cada um com seu proprio CHECK de sete
-- valores, todos tributarios.
--
-- Na migration 0020 eu ampliei o primeiro CHECK e escrevi que era divida. A
-- divida cobrou juros na mesma noite: a caçada passou, o score saiu, e a
-- publicacao morreu no SEGUNDO CHECK, que eu nao tinha visto. Dois enums que
-- precisam concordar e um que ninguem sincroniza sao a mesma coisa.
--
-- Conserto: uma tabela de razoes. Os dois lados apontam para ela. Razao nova de
-- tese nova entra com INSERT, nao com ALTER TABLE — que era o ponto da lei.
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE fichas.razoes (
  codigo      text PRIMARY KEY,
  rotulo      text NOT NULL,
  -- De onde a razao nasceu. Serve para ninguem apagar uma razao achando que e
  -- lixo de outra vertical.
  origem      text NOT NULL,
  criada_em   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE fichas.razoes IS
  'Catalogo de razoes de "por que nao perseguir". E DADO: razao nova entra com '
  'INSERT. Substituiu dois CHECK de enum que precisavam concordar e nao tinham '
  'quem os sincronizasse — ver o cabecalho desta migration.';

INSERT INTO fichas.razoes (codigo, rotulo, origem) VALUES
  ('documentacao_provavelmente_ausente', 'Documentacao provavelmente ausente', 'fundacao'),
  ('periodo_possivelmente_prescrito',    'Periodo possivelmente prescrito',    'fundacao'),
  ('precedente_desfavoravel',            'Precedente desfavoravel',            'fundacao'),
  ('fonte_degradada',                    'Fonte degradada',                    'fundacao'),
  ('sinal_isolado',                      'Sinal isolado',                      'fundacao'),
  ('porte_incompativel_com_custo',       'Porte incompativel com o custo',     'fundacao'),
  ('capacidade_de_utilizacao_duvidosa',  'Capacidade de utilizacao duvidosa',  'fundacao'),
  ('discriminador_nao_verificado',       'O discriminador da tese nao foi verificado', 'T-MED'),
  ('estrutura_maior_que_aparenta',       'A estrutura pode ser maior que aparenta',    'T-MED'),
  ('fora_do_territorio_atendivel',       'Fora do territorio atendivel hoje',          'T-MED'),
  ('regra_de_conselho_profissional',     'Sujeito a regra de conselho profissional',   'T-MED')
ON CONFLICT (codigo) DO NOTHING;

ALTER TABLE teses.regras_contra DROP CONSTRAINT IF EXISTS regras_contra_codigo_check;
ALTER TABLE teses.regras_contra
  ADD CONSTRAINT regras_contra_codigo_fkey
  FOREIGN KEY (codigo) REFERENCES fichas.razoes(codigo);

ALTER TABLE fichas.por_que_nao_perseguir
  DROP CONSTRAINT IF EXISTS por_que_nao_perseguir_codigo_check;
ALTER TABLE fichas.por_que_nao_perseguir
  ADD CONSTRAINT por_que_nao_perseguir_codigo_fkey
  FOREIGN KEY (codigo) REFERENCES fichas.razoes(codigo);

-- A tabela de razoes e catalogo da casa: todo mundo le, ninguem escreve pela
-- aplicacao. Mesma postura das tabelas de dominio do schema.
ALTER TABLE fichas.razoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.razoes FORCE ROW LEVEL SECURITY;
CREATE POLICY razoes_leitura ON fichas.razoes FOR SELECT TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE ON fichas.razoes FROM PUBLIC, anon, authenticated;
