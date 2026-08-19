-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 07 · O FREIO DE CHURN SEGURA MESMO
--
-- Nasceu de um numero real, medido em 19/08/2026: o diff entre dois recortes
-- reais da RFB (`Estabelecimentos1` de julho contra o de agosto) pariu
-- 4.256.121 "estabelecimento_novo" e 4.256.121 "saiu_da_fonte" — 89,5% do
-- arquivo — porque a Receita reparticiona quais CNPJs caem em qual arquivo a
-- cada lote. Nenhuma empresa nasceu. Nenhuma fechou.
--
-- Esta guarda reconstroi o defeito em miniatura e exige que o banco RECUSE.
-- Sem ela, o freio seria um comentario bonito numa migration.
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

INSERT INTO jazida.coletas (id, source_id, collected_at, reference_date, hash) VALUES
  ('cccccccc-0000-4000-8000-000000000001','RFB-CNPJ','2026-07-11T03:00:00Z','2026-07-11','freio-julho'),
  ('cccccccc-0000-4000-8000-000000000002','RFB-CNPJ','2026-08-08T03:00:00Z','2026-08-08','freio-agosto'),
  ('cccccccc-0000-4000-8000-000000000003','RFB-CNPJ','2026-09-05T03:00:00Z','2026-09-05','freio-setembro');

INSERT INTO jazida.coletas_fechamento (coleta_id, ok, linhas) VALUES
  ('cccccccc-0000-4000-8000-000000000001', true, 2000),
  ('cccccccc-0000-4000-8000-000000000002', true, 2000),
  ('cccccccc-0000-4000-8000-000000000003', true, 2000);

-- Duas coletas ACIMA do piso (2000 linhas > piso 1000) e quase disjuntas:
-- julho tem as chaves 1..2000, agosto tem 1901..3900. Sobrepoem 100 (5%).
-- E exatamente a forma do defeito real, so que em miniatura.
INSERT INTO jazida.snapshots
  (coleta_id, source_id, conjunto, chave_natural, collected_at, reference_date, hash, payload)
SELECT 'cccccccc-0000-4000-8000-000000000001','RFB-CNPJ','estabelecimentos',
       lpad(i::text, 14, '0'), '2026-07-11T03:00:00Z','2026-07-11',
       md5('{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}'),
       '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}'::jsonb
  FROM generate_series(1, 2000) i;

INSERT INTO jazida.snapshots
  (coleta_id, source_id, conjunto, chave_natural, collected_at, reference_date, hash, payload)
SELECT 'cccccccc-0000-4000-8000-000000000002','RFB-CNPJ','estabelecimentos',
       lpad(i::text, 14, '0'), '2026-08-08T03:00:00Z','2026-08-08',
       md5('{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}'),
       '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}'::jsonb
  FROM generate_series(1901, 3900) i;

-- ── PROVA 1: o freio para o diff ────────────────────────────────────────────
DO $$
DECLARE r record; n int := 0;
BEGIN
  FOR r IN SELECT * FROM eventos.diferenciar('cccccccc-0000-4000-8000-000000000002',
                                             'cccccccc-0000-4000-8000-000000000001')
  LOOP
    n := n + 1;
    IF r.tipo <> 'freio_de_churn' THEN
      RAISE EXCEPTION 'GUARDA 07: o diff aceitou um lote em que 95%% das chaves '
        'trocaram e pariu "%". Em producao seriam milhoes de "estabelecimento '
        'novo" falsos.', r.tipo;
    END IF;
  END LOOP;
  IF n <> 1 THEN
    RAISE EXCEPTION 'GUARDA 07: o freio nao se anunciou — esperava uma linha '
      'freio_de_churn, vieram %', n;
  END IF;
  RAISE NOTICE 'ok  o freio recusou o par com 95%% de troca e se anunciou';
END $$;

-- ── PROVA 2: e nao gravou NADA ──────────────────────────────────────────────
-- Freio que para depois de gravar nao e freio: a trilha e append-only e o
-- estrago nao se apaga.
DO $$
DECLARE n bigint;
BEGIN
  SELECT count(*) INTO n FROM eventos.eventos
   WHERE coleta_atual_id = 'cccccccc-0000-4000-8000-000000000002';
  IF n <> 0 THEN
    RAISE EXCEPTION 'GUARDA 07: o freio parou DEPOIS de gravar % evento(s). '
      'A trilha e append-only — o estrago nao se apaga.', n;
  END IF;
  SELECT count(*) INTO n FROM eventos.execucoes_diff
   WHERE coleta_atual_id = 'cccccccc-0000-4000-8000-000000000002';
  IF n <> 0 THEN
    RAISE EXCEPTION 'GUARDA 07: par reprovado ficou marcado como executado — '
      'a correcao do lote nunca mais rodaria';
  END IF;
  RAISE NOTICE 'ok  nenhum evento gravado, par nao marcado como executado';
END $$;

-- ── PROVA 3: a queda foi DECLARADA, nao engolida ────────────────────────────
DO $$
BEGIN
  PERFORM 1 FROM fontes.saude_coleta
   WHERE source_id = 'RFB-CNPJ' AND status_observado = 'degradada'
     AND erro LIKE 'freio de churn:%';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'GUARDA 07: o freio parou em silencio. '
      'Lote recusado sem registro e lote que ninguem investiga.';
  END IF;
  RAISE NOTICE 'ok  a recusa entrou em fontes.saude_coleta com o motivo';
END $$;

-- ── PROVA 4: churn NORMAL continua passando ─────────────────────────────────
-- Um freio que reprova tudo e tao inutil quanto um que nao reprova nada.
-- Setembro repete as chaves de agosto com 20 novas (1% de 2000, abaixo de 2%).
INSERT INTO jazida.snapshots
  (coleta_id, source_id, conjunto, chave_natural, collected_at, reference_date, hash, payload)
SELECT 'cccccccc-0000-4000-8000-000000000003','RFB-CNPJ','estabelecimentos',
       lpad(i::text, 14, '0'), '2026-09-05T03:00:00Z','2026-09-05',
       -- O hash e do PAYLOAD, como o carregador faz. Escrever md5(i) aqui
       -- deixaria o hash igual ao de agosto mesmo com o payload diferente, e o
       -- diff — que compara hash antes de comparar campo — nao veria a mudanca.
       -- (Foi assim que este fixture nasceu errado, e a guarda pegou.)
       md5(CASE WHEN i = 1901
            THEN '{"cnae_fiscal_principal":"6201500","situacao_cadastral":"02"}'
            ELSE '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}' END),
       CASE WHEN i = 1901
            THEN '{"cnae_fiscal_principal":"6201500","situacao_cadastral":"02"}'::jsonb
            ELSE '{"cnae_fiscal_principal":"4711302","situacao_cadastral":"02"}'::jsonb END
  FROM generate_series(1901, 3920) i;

DO $$
DECLARE obtido jsonb;
BEGIN
  PERFORM eventos.diferenciar('cccccccc-0000-4000-8000-000000000003',
                              'cccccccc-0000-4000-8000-000000000002');
  SELECT coalesce(jsonb_object_agg(tipo, n), '{}'::jsonb) INTO obtido
    FROM (SELECT tipo, count(*) AS n FROM eventos.eventos
           WHERE coleta_atual_id = 'cccccccc-0000-4000-8000-000000000003'
           GROUP BY tipo) x;
  IF obtido <> jsonb_build_object('estabelecimento_novo', 20, 'cnae_alterado', 1) THEN
    RAISE EXCEPTION 'GUARDA 07: churn normal (1%%) devia passar com 20 novos e 1 cnae. Veio %',
      jsonb_pretty(obtido);
  END IF;
  RAISE NOTICE 'ok  churn normal de 1%% passa: 20 novos e 1 cnae alterado';
END $$;

ROLLBACK;
