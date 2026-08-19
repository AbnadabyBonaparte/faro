-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 05 · O DIFF PARE EXATAMENTE OS EVENTOS ESPERADOS
--
-- Duas coletas fabricadas com mudancas CONHECIDAS. A guarda nao pergunta "veio
-- evento?" — ela exige a contagem exata, tipo a tipo. Um evento a mais reprova
-- igual a um evento a menos: falso positivo custa mais caro que silencio, e
-- ninguem paga para receber ruido.
--
-- Roda dentro de transacao e faz ROLLBACK: prova sem sujar o banco.
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

INSERT INTO jazida.coletas (id, source_id, collected_at, reference_date, hash, linhas) VALUES
  ('aaaaaaaa-0000-4000-8000-000000000001', 'RFB-CNPJ',
   '2026-07-11T03:00:00Z', '2026-07-11', 'fixture-lote-julho',  10),
  ('aaaaaaaa-0000-4000-8000-000000000002', 'RFB-CNPJ',
   '2026-08-08T03:00:00Z', '2026-08-08', 'fixture-lote-agosto', 10);

-- Coleta so entra no diff depois de FECHADA COM OK (0010). O fixture fecha as
-- duas — e o proprio fato de precisar fechar prova que a trava existe.
INSERT INTO jazida.coletas_fechamento (coleta_id, ok, linhas) VALUES
  ('aaaaaaaa-0000-4000-8000-000000000001', true, 10),
  ('aaaaaaaa-0000-4000-8000-000000000002', true, 10);

-- payload -> hash: no fixture o hash e derivado do payload, como no carregador.
CREATE OR REPLACE FUNCTION pg_temp.snap(
  p_coleta uuid, p_conjunto text, p_chave text, p_payload jsonb, p_quando timestamptz
) RETURNS void LANGUAGE sql AS $fn$
  INSERT INTO jazida.snapshots
    (coleta_id, source_id, conjunto, chave_natural, collected_at, reference_date, hash, payload)
  VALUES (p_coleta, 'RFB-CNPJ', p_conjunto, p_chave, p_quando, p_quando::date,
          md5(p_payload::text), p_payload);
$fn$;

\set C1 '''aaaaaaaa-0000-4000-8000-000000000001'''
\set C2 '''aaaaaaaa-0000-4000-8000-000000000002'''
\set T1 '''2026-07-11T03:00:00Z'''
\set T2 '''2026-08-08T03:00:00Z'''

-- ── EMPRESAS ────────────────────────────────────────────────────────────────
-- 11111111 muda de porte  → 1 porte_alterado
SELECT pg_temp.snap(:C1, 'empresas', '11111111', '{"porte":"05","razao_social":"ALFA"}',  :T1);
SELECT pg_temp.snap(:C2, 'empresas', '11111111', '{"porte":"03","razao_social":"ALFA"}',  :T2);
-- 22222222 nao muda        → nenhum evento
SELECT pg_temp.snap(:C1, 'empresas', '22222222', '{"porte":"05","razao_social":"BETA"}',  :T1);
SELECT pg_temp.snap(:C2, 'empresas', '22222222', '{"porte":"05","razao_social":"BETA"}',  :T2);
-- 23232323 muda razao social (campo SEM regra) → nenhum evento.
-- Prova que o motor nao pare evento por qualquer byte diferente.
SELECT pg_temp.snap(:C1, 'empresas', '23232323', '{"porte":"05","razao_social":"GAMA"}',  :T1);
SELECT pg_temp.snap(:C2, 'empresas', '23232323', '{"porte":"05","razao_social":"GAMA ME"}', :T2);

-- ── ESTABELECIMENTOS ────────────────────────────────────────────────────────
SELECT pg_temp.snap(:C1, 'estabelecimentos', '33333333000101',
  '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}', :T1);
SELECT pg_temp.snap(:C2, 'estabelecimentos', '33333333000101',
  '{"cnae_fiscal_principal":"6201500","situacao_cadastral":"02"}', :T2);   -- cnae_alterado

SELECT pg_temp.snap(:C1, 'estabelecimentos', '44444444000102',
  '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}', :T1);
SELECT pg_temp.snap(:C2, 'estabelecimentos', '44444444000102',
  '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"08"}', :T2);   -- situacao_alterada

SELECT pg_temp.snap(:C2, 'estabelecimentos', '55555555000103',
  '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}', :T2);   -- estabelecimento_novo

SELECT pg_temp.snap(:C1, 'estabelecimentos', '66666666000104',
  '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}', :T1);   -- saiu_da_fonte

-- Dois campos mudam na mesma linha → DOIS eventos, nao um "mudou".
SELECT pg_temp.snap(:C1, 'estabelecimentos', '77777777000105',
  '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}', :T1);
SELECT pg_temp.snap(:C2, 'estabelecimentos', '77777777000105',
  '{"cnae_fiscal_principal":"6201500","situacao_cadastral":"08"}', :T2);

-- ── SIMPLES ─────────────────────────────────────────────────────────────────
-- 🔴 A ARMADILHA: 11111111 existe em `empresas` E em `simples` com a MESMA
-- chave. Se o diff ignorasse o conjunto, cruzaria as duas linhas e pariria
-- eventos fantasmas. A contagem exata la embaixo e quem pega isso.
SELECT pg_temp.snap(:C1, 'simples', '11111111', '{"opcao_pelo_simples":"N"}', :T1);
SELECT pg_temp.snap(:C2, 'simples', '11111111', '{"opcao_pelo_simples":"S"}', :T2);  -- entrou

SELECT pg_temp.snap(:C1, 'simples', '99999999', '{"opcao_pelo_simples":"S"}', :T1);
SELECT pg_temp.snap(:C2, 'simples', '99999999', '{"opcao_pelo_simples":"N"}', :T2);  -- saiu

-- Hash muda mas a direcao da regra nao casa (S -> S) → nenhum evento.
SELECT pg_temp.snap(:C1, 'simples', '12121212',
  '{"opcao_pelo_simples":"S","data_opcao_simples":"20200101"}', :T1);
SELECT pg_temp.snap(:C2, 'simples', '12121212',
  '{"opcao_pelo_simples":"S","data_opcao_simples":"20200102"}', :T2);

-- Aparece so na 2a coleta, mas `simples` nao pare evento de presenca
-- (senao a mesma empresa seria contada em empresas, estabelecimentos e simples).
SELECT pg_temp.snap(:C2, 'simples', '13131313', '{"opcao_pelo_simples":"S"}', :T2);

-- ════════════════════════════════════════════════════════════════════════════
-- PROVA 1 — a primeira coleta e LINHA DE BASE e nao pare nada
-- ════════════════════════════════════════════════════════════════════════════
DO $$
DECLARE r record; n bigint;
BEGIN
  SELECT * INTO r FROM eventos.diferenciar('aaaaaaaa-0000-4000-8000-000000000001');
  IF r.tipo <> 'linha_de_base' THEN
    RAISE EXCEPTION 'GUARDA 05: primeira coleta devia ser linha_de_base, veio %', r.tipo;
  END IF;
  -- Escopo: a guarda 04 deixa eventos proprios no banco (fonte SRC-GUARDA).
  -- Contar "todos os eventos" faria esta guarda reprovar por sujeira alheia.
  SELECT count(*) INTO n FROM eventos.eventos WHERE source_id = 'RFB-CNPJ';
  IF n <> 0 THEN
    RAISE EXCEPTION 'GUARDA 05: primeira coleta pariu % evento(s). '
      'No dia 1 isso seriam dezenas de milhoes de falsos positivos.', n;
  END IF;
  RAISE NOTICE 'ok  primeira coleta = linha de base, 0 eventos';
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- PROVA 2 — contagem EXATA, tipo a tipo
-- ════════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  esperado jsonb := jsonb_build_object(
    'porte_alterado',              1,
    'cnae_alterado',               2,
    'situacao_cadastral_alterada', 2,
    'estabelecimento_novo',        1,
    'saiu_da_fonte',               1,
    'entrou_simples',              1,
    'saiu_simples',                1
  );
  obtido jsonb;
BEGIN
  PERFORM eventos.diferenciar('aaaaaaaa-0000-4000-8000-000000000002');

  SELECT coalesce(jsonb_object_agg(tipo, n), '{}'::jsonb) INTO obtido
    FROM (SELECT tipo, count(*) AS n FROM eventos.eventos
           WHERE source_id = 'RFB-CNPJ' GROUP BY tipo) x;

  IF obtido <> esperado THEN
    RAISE EXCEPTION E'GUARDA 05: o diff nao pariu os eventos esperados.\n  esperado: %\n  obtido:   %',
      jsonb_pretty(esperado), jsonb_pretty(obtido);
  END IF;
  RAISE NOTICE 'ok  9 eventos, exatamente os 7 tipos esperados';
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- PROVA 3 — o "antes" e o "depois" carregam o valor certo
-- Contagem certa com conteudo errado ainda e ficha mentirosa.
-- ════════════════════════════════════════════════════════════════════════════
DO $$
DECLARE a text; d text;
BEGIN
  SELECT antes ->> 'valor', depois ->> 'valor' INTO a, d
    FROM eventos.eventos WHERE tipo = 'porte_alterado' AND cnpj = '11111111';
  IF a <> '05' OR d <> '03' THEN
    RAISE EXCEPTION 'GUARDA 05: porte_alterado gravou antes=% depois=% (esperado 05 -> 03)', a, d;
  END IF;

  SELECT depois ->> 'ausente' INTO d
    FROM eventos.eventos WHERE tipo = 'saiu_da_fonte' AND source_id = 'RFB-CNPJ';
  IF d <> 'true' THEN
    RAISE EXCEPTION 'GUARDA 05: saiu_da_fonte sem declarar a ausencia no depois';
  END IF;

  PERFORM 1 FROM eventos.eventos
   WHERE tipo = 'saiu_da_fonte' AND depois ? 'limite_de_inferencia';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'GUARDA 05: saiu_da_fonte sem limite de inferencia — o evento '
      'estaria afirmando que a empresa fechou, e ele nao sabe disso';
  END IF;
  RAISE NOTICE 'ok  antes/depois corretos e ausencia declarada com limite';
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- PROVA 4 — TODO evento aponta para as DUAS coletas
-- Evento sem as duas pontas e alegacao de mudanca, nao prova de mudanca.
-- ════════════════════════════════════════════════════════════════════════════
DO $$
DECLARE n bigint;
BEGIN
  SELECT count(*) INTO n FROM eventos.eventos
   WHERE source_id = 'RFB-CNPJ'
     AND (coleta_anterior_id IS NULL OR coleta_atual_id IS NULL);
  IF n > 0 THEN
    RAISE EXCEPTION 'GUARDA 05: % evento(s) sem as duas coletas', n;
  END IF;
  RAISE NOTICE 'ok  todo evento carrega as duas coletas';
END $$;

ROLLBACK;
