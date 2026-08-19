-- ════════════════════════════════════════════════════════════════════════════
-- 0019 · T-04 v1.1 — O TERRITORIO DEIXA DE CORTAR E PASSA A PONTUAR
--
-- 🔴 ESTA VERSAO NASCE DE UM NUMERO, nao de uma opiniao.
--
-- A Onda 3 mediu a T-04 v0 e achou zero:
--
--     territorio (MT/GO + porte 05) ........................ 82 alvos
--     taxa de evento medida ................ 351 / 4.494.860 = 0,0078%/mes
--     cadencia esperada ...................... 82 × 0,000078 = 0,006 ficha/mes
--
-- Menos de uma ficha por ano. O motor estava certo; o RECORTE e que era
-- inviavel — um territorio estreito multiplicado por um evento raro.
--
-- ── A DECISAO (dono, 19/08/2026) ───────────────────────────────────────────
-- **O territorio deixa de ser CORTE e passa a ser PESO.**
--
-- A caçada vira nacional; MT/GO — o territorio do design partner — sobe no
-- ranking em vez de ser a unica coisa que existe. Alvo fora de MT/GO continua
-- elegivel, so pontua menos.
--
-- Isto nao e afrouxar a tese. E parar de confundir DUAS perguntas diferentes:
--   · "esta empresa serve para a tese?"     → criterio, corta
--   · "esta empresa e prioritaria para NOS?" → preferencia, ordena
-- Misturar as duas num filtro joga fora alvos bons por um motivo que era de
-- conveniencia comercial, nao de aderencia a tese.
--
-- ⚠️ CONTRA-ARGUMENTO, porque ele existe: caçada nacional produz alvos que o
-- design partner nao consegue atender. Um alvo em Roraima e ficha legitima e
-- viagem inviavel. Por isso o territorio vira PESO e nao desaparece: ele
-- continua na ficha, continua no score, e continua visivel no ranking.
--
-- ── NOVIDADE DE MECANICA: BONIFICADOR ──────────────────────────────────────
-- Criterio corta; **bonificador pontua**. Os dois sao DADO da tese, com a
-- mesma forma, e o motor trata a diferenca. Sem isso, "priorizar MT/GO" viraria
-- um `if` no codigo — e a proxima preferencia comercial viraria outro.
--
-- Canon: CATALOGO-DE-TESES-DA-CASA.md §T-04 · ONDA-3-CACA.md §0
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1 · A CAÇADA APRENDE BONIFICADOR ────────────────────────────────────────

CREATE OR REPLACE FUNCTION fichas.cacar(
  p_tese_versao_id uuid,
  p_modo           text DEFAULT 'incremental'
)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_inicio        timestamptz := clock_timestamp();
  v_tenant        uuid;
  v_params        jsonb;
  v_estado        text;
  v_conj_alvo     text;
  v_conj_aux      text;
  v_cacada        uuid;
  v_crit          jsonb;
  v_where         text := '';
  v_sel_crit      text := '';
  v_coleta_est    uuid;
  v_coleta_emp    uuid;
  v_sql           text;
  v_n             bigint;
BEGIN
  SELECT v.tenant_id, v.parametros, v.estado
    INTO v_tenant, v_params, v_estado
    FROM teses.versoes v WHERE v.id = p_tese_versao_id;

  IF v_tenant IS NULL THEN
    RAISE EXCEPTION 'versao de tese % nao existe', p_tese_versao_id;
  END IF;

  IF v_estado NOT IN ('ativa','segmentada') THEN
    RAISE EXCEPTION 'tese em estado "%" nao caça — so `ativa` ou `segmentada`', v_estado
      USING ERRCODE = 'restrict_violation';
  END IF;

  v_conj_alvo := coalesce(v_params ->> 'conjunto_alvo', 'estabelecimentos');

  -- Conjunto auxiliar: olha criterios E bonificadores, porque um bonificador
  -- tambem pode morar no outro arquivo da fonte.
  SELECT DISTINCT c ->> 'conjunto' INTO v_conj_aux
    FROM jsonb_array_elements(
           coalesce(v_params -> 'criterios', '[]'::jsonb)
           || coalesce(v_params -> 'bonificadores', '[]'::jsonb)) c
   WHERE (c ->> 'conjunto') <> v_conj_alvo;

  SELECT c.id INTO v_coleta_est
    FROM jazida.coletas_completas c
    WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                   WHERE s.coleta_id = c.id AND s.conjunto = v_conj_alvo)
    ORDER BY c.collected_at DESC LIMIT 1;

  IF v_coleta_est IS NULL THEN
    RAISE EXCEPTION 'nao ha coleta completa do conjunto "%" — nada a caçar', v_conj_alvo;
  END IF;

  -- ── CRITERIOS: entram no WHERE (cortam) ───────────────────────────────────
  FOR v_crit IN SELECT * FROM jsonb_array_elements(v_params -> 'criterios')
  LOOP
    DECLARE
      v_alias  text := CASE WHEN (v_crit ->> 'conjunto') = v_conj_alvo
                            THEN 'alvo' ELSE 'aux' END;
      v_campo  text := v_crit ->> 'campo';
      v_op     text := v_crit ->> 'operador';
      v_vals   text;
      v_lens   int[];
    BEGIN
      SELECT string_agg(quote_literal(x), ','), array_agg(DISTINCT length(x))
        INTO v_vals, v_lens
        FROM jsonb_array_elements_text(v_crit -> 'valores') AS t(x);

      IF v_op = 'em' THEN
        v_where := v_where || format(' AND (%I.payload ->> %L) IN (%s)',
                                     v_alias, v_campo, v_vals);
      ELSIF v_op = 'prefixo_em' THEN
        IF array_length(v_lens, 1) = 1 THEN
          v_where := v_where || format(' AND left(%I.payload ->> %L, %s) IN (%s)',
                                       v_alias, v_campo, v_lens[1], v_vals);
        ELSE
          v_where := v_where || format(
            ' AND EXISTS (SELECT 1 FROM unnest(ARRAY[%s]) p WHERE (%I.payload ->> %L) LIKE p || %L)',
            v_vals, v_alias, v_campo, '%');
        END IF;
      ELSE
        RAISE EXCEPTION 'operador de criterio desconhecido: %', v_op;
      END IF;

      v_sel_crit := v_sel_crit || format(
        ', jsonb_build_object(%L,%L, %L,%L, %L,%L, %L, %I.payload ->> %L, %L,%L, %L,%L, %L, true)',
        'chave',   v_crit ->> 'chave',
        'rotulo',  v_crit ->> 'rotulo',
        'campo',   v_campo,
        'valor',   v_alias, v_campo,
        'especie', v_crit ->> 'especie',
        'fonte',   v_crit ->> 'fonte',
        'casou');
    END;
  END LOOP;

  -- ── BONIFICADORES: NAO entram no WHERE. Pontuam. ──────────────────────────
  -- O valor observado e o "casou" viajam no candidato; quem transforma isso em
  -- ponto e `fichas.dimensoes_do_candidato`.
  FOR v_crit IN SELECT * FROM jsonb_array_elements(
                  coalesce(v_params -> 'bonificadores', '[]'::jsonb))
  LOOP
    DECLARE
      v_alias  text := CASE WHEN (v_crit ->> 'conjunto') = v_conj_alvo
                            THEN 'alvo' ELSE 'aux' END;
      v_campo  text := v_crit ->> 'campo';
      v_op     text := v_crit ->> 'operador';
      v_vals   text;
      v_lens   int[];
      v_teste  text;
    BEGIN
      SELECT string_agg(quote_literal(x), ','), array_agg(DISTINCT length(x))
        INTO v_vals, v_lens
        FROM jsonb_array_elements_text(v_crit -> 'valores') AS t(x);

      IF v_op = 'em' THEN
        v_teste := format('((%I.payload ->> %L) IN (%s))', v_alias, v_campo, v_vals);
      ELSIF v_op = 'prefixo_em' AND array_length(v_lens, 1) = 1 THEN
        v_teste := format('(left(%I.payload ->> %L, %s) IN (%s))',
                          v_alias, v_campo, v_lens[1], v_vals);
      ELSE
        RAISE EXCEPTION 'operador de bonificador nao suportado: %', v_op;
      END IF;

      v_sel_crit := v_sel_crit || format(
        ', jsonb_build_object(%L,%L, %L,%L, %L,%L, %L, %I.payload ->> %L, %L,%L, %L,%L, %L, %s)',
        'chave',   v_crit ->> 'chave',
        'rotulo',  v_crit ->> 'rotulo',
        'campo',   v_campo,
        'valor',   v_alias, v_campo,
        'especie', 'BONIFICADOR',
        'fonte',   v_crit ->> 'fonte',
        'casou',   v_teste);
    END;
  END LOOP;

  IF v_conj_aux IS NOT NULL THEN
    SELECT c.id INTO v_coleta_emp
      FROM jazida.coletas_completas c
      WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                     WHERE s.coleta_id = c.id AND s.conjunto = v_conj_aux)
      ORDER BY c.collected_at DESC LIMIT 1;
    IF v_coleta_emp IS NULL THEN
      RAISE EXCEPTION 'a tese exige campo no conjunto "%" e nao ha coleta completa dele',
        v_conj_aux;
    END IF;
  END IF;

  INSERT INTO fichas.cacadas (tenant_id, tese_versao_id, modo, coleta_id)
  VALUES (v_tenant, p_tese_versao_id, p_modo, v_coleta_est)
  RETURNING id INTO v_cacada;

  v_sql := format($f$
    INSERT INTO fichas.candidatos
      (cacada_id, tenant_id, tese_versao_id, cnpj, cnpj_basico, razao_social,
       criterios_casados, evento_id)
    SELECT %L::uuid, %L::uuid, %L::uuid,
           alvo.chave_natural,
           left(alvo.chave_natural, 8),
           %s,
           jsonb_build_array(%s),
           %s
      FROM jazida.snapshots alvo
      %s
      %s
     WHERE alvo.coleta_id = %L::uuid
       AND alvo.conjunto  = %L
       %s
     ON CONFLICT (cacada_id, cnpj) DO NOTHING
  $f$,
    v_cacada, v_tenant, p_tese_versao_id,
    CASE WHEN v_conj_aux IS NOT NULL THEN 'aux.payload ->> ''razao_social''' ELSE 'NULL' END,
    ltrim(v_sel_crit, ', '),
    CASE WHEN p_modo = 'incremental' THEN 'ev.id' ELSE 'NULL::uuid' END,
    CASE WHEN v_conj_aux IS NOT NULL THEN format(
      'JOIN jazida.snapshots aux ON aux.coleta_id = %L::uuid AND aux.conjunto = %L '
      || 'AND aux.chave_natural = left(alvo.chave_natural, 8)', v_coleta_emp, v_conj_aux)
      ELSE '' END,
    CASE WHEN p_modo = 'incremental' THEN
      'JOIN eventos.eventos ev ON ev.cnpj IN (alvo.chave_natural, left(alvo.chave_natural, 8))'
      ELSE '' END,
    v_coleta_est, v_conj_alvo, v_where);

  EXECUTE v_sql;
  GET DIAGNOSTICS v_n = ROW_COUNT;

  UPDATE fichas.cacadas
     SET candidatos = v_n,
         duracao_ms = round(extract(epoch FROM clock_timestamp() - v_inicio) * 1000)
   WHERE id = v_cacada;

  INSERT INTO uso.ledger (tenant_id, metrica, quantidade, custo_centavos)
  VALUES (v_tenant, 'ms_computacao',
          round(extract(epoch FROM clock_timestamp() - v_inicio) * 1000), NULL);

  RETURN v_cacada;
END
$$;

-- ── 2 · O FIT ESTRUTURAL APRENDE A PREMIAR ──────────────────────────────────

CREATE OR REPLACE FUNCTION fichas.dimensoes_do_candidato(p_candidato uuid)
RETURNS TABLE (dimensao text, valor numeric, justificativa text)
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  v_crit        jsonb;
  v_params      jsonb;
  v_n_crit      int;
  v_n_proxy     int;
  v_n_bonus     int;
  v_n_bonus_ok  int;
  v_n_indisp    int;
  v_ref         date;
  v_dias        int;
  v_fontes_ok   int;
  v_fontes_tot  int;
  v_evento      uuid;
  v_base        numeric;
  v_teto_base   numeric;
BEGIN
  SELECT c.criterios_casados, v.parametros, c.evento_id
    INTO v_crit, v_params, v_evento
    FROM fichas.candidatos c
    JOIN teses.versoes v ON v.id = c.tese_versao_id
   WHERE c.id = p_candidato;

  IF v_crit IS NULL THEN
    RAISE EXCEPTION 'candidato % nao existe', p_candidato;
  END IF;

  SELECT count(*) FILTER (WHERE x ->> 'especie' <> 'BONIFICADOR'),
         count(*) FILTER (WHERE x ->> 'especie' = 'PROXY'),
         count(*) FILTER (WHERE x ->> 'especie' = 'BONIFICADOR'),
         count(*) FILTER (WHERE x ->> 'especie' = 'BONIFICADOR' AND (x ->> 'casou')::boolean)
    INTO v_n_crit, v_n_proxy, v_n_bonus, v_n_bonus_ok
    FROM jsonb_array_elements(v_crit) x;

  v_n_indisp := coalesce(jsonb_array_length(v_params -> 'criterios_indisponiveis'), 0);

  SELECT c.reference_date INTO v_ref
    FROM fichas.candidatos cd
    JOIN fichas.cacadas ca ON ca.id = cd.cacada_id
    JOIN jazida.coletas c ON c.id = ca.coleta_id
   WHERE cd.id = p_candidato;
  v_dias := greatest(0, (current_date - v_ref));

  SELECT count(*) FILTER (WHERE status = 'viva'), count(*)
    INTO v_fontes_ok, v_fontes_tot
    FROM fontes.source_registry;

  -- 1 · FIT ESTRUTURAL — criterio corta, bonificador PONTUA.
  -- Sem bonificador, os criterios valem os 100 pontos (comportamento da v0).
  -- Com bonificador, os criterios valem 80 e os bonificadores disputam 20.
  -- O teto de 20 e deliberado: preferencia comercial ORDENA a fila, nunca
  -- decide se o alvo serve — quem decide isso e o criterio.
  v_teto_base := CASE WHEN v_n_bonus > 0 THEN 80 ELSE 100 END;
  v_base := v_teto_base * (v_n_crit - v_n_proxy * 0.5) / nullif(v_n_crit, 0);

  RETURN QUERY SELECT
    'fitEstrutural',
    round(v_base + CASE WHEN v_n_bonus > 0
                        THEN 20.0 * v_n_bonus_ok / v_n_bonus ELSE 0 END, 1),
    format('%s criterio(s) casaram, %s por PROXY (meio ponto cada). %s',
           v_n_crit, v_n_proxy,
           CASE WHEN v_n_bonus = 0 THEN 'Tese sem bonificador.'
                ELSE format('%s de %s bonificador(es) atendido(s) — preferencia '
                            || 'comercial vale ate 20 dos 100 pontos e ORDENA a '
                            || 'fila, nunca decide elegibilidade.',
                            v_n_bonus_ok, v_n_bonus) END);

  -- 2 · EVIDENCIA DA TESE
  RETURN QUERY SELECT
    'evidenciaTese',
    round(100.0 * v_n_crit / nullif(v_n_crit + v_n_indisp * 2, 0), 1),
    format('A tese declara %s criterio(s) observavel(is) e %s criterio(s) '
           || 'INDISPONIVEL(is). Cada indisponivel pesa dobrado: o que falta '
           || 'costuma ser justamente o que discriminaria.', v_n_crit, v_n_indisp);

  -- 3 · RECENCIA
  RETURN QUERY SELECT
    'recencia',
    CASE WHEN v_dias <= 30 THEN 100 WHEN v_dias <= 45 THEN 80
         WHEN v_dias <= 90 THEN 55 WHEN v_dias <= 180 THEN 30 ELSE 10 END::numeric,
    format('Lote de referencia com %s dia(s). A fonte promete lote mensal '
           || '(frequencia declarada de 45 dias com folga).', v_dias);

  -- 4 · QUALIDADE DAS FONTES
  RETURN QUERY SELECT
    'qualidadeFontes',
    round(100.0 * v_fontes_ok / nullif(v_fontes_tot, 0), 1),
    format('%s de %s fonte(s) do registry estao `viva`. Confiabilidade E1 '
           || '(orgao oficial), mas fonte fora do ar nao entrega E1 nenhum.',
           v_fontes_ok, v_fontes_tot);

  -- 5 · INTENSIDADE DO SINAL
  RETURN QUERY SELECT
    'intensidadeSinal',
    CASE WHEN v_evento IS NULL THEN 0
         ELSE greatest(0, 60 - v_n_indisp * 20) END::numeric,
    CASE WHEN v_evento IS NULL
      THEN 'Nenhum evento — o perfil casa, mas nada mudou. Isso e filtro, nao sinal.'
      ELSE format('1 evento observado. Teto de 60 porque UM sinal nao e '
             || 'corroboracao, e ainda faltam %s criterio(s) indisponivel(is) '
             || 'que reforcariam ou derrubariam a hipotese.', v_n_indisp)
    END;

  -- 6 · CONFIANCA DA INFERENCIA
  RETURN QUERY SELECT
    'confiancaInferencia',
    round(greatest(0, 100.0 - v_n_proxy * 25.0 - v_n_indisp * 15.0), 1),
    format('%s proxy(s) (-25 cada) e %s lacuna(s) de fonte (-15 cada) sobre '
           || 'uma inferencia que, no limite, e um perfil compativel — nunca '
           || 'uma apuracao.', v_n_proxy, v_n_indisp);
END
$$;

-- ── 3 · A VERSAO 1.1 ────────────────────────────────────────────────────────
-- Versao 3 na numeracao do banco (a 1 e a v0 comercial, a 2 e o recorte de
-- demonstracao da Onda 3). O nome carrega "v1.1" porque e assim que a casa a
-- chama; o inteiro so precisa crescer.

INSERT INTO teses.versoes
  (id, tese_id, tenant_id, versao, nome, hipotese, parametros, sinais_exigidos,
   estado, motivo_do_estado, verificada_em)
VALUES (
  '00000000-0000-4000-8000-00000004a011',
  '00000000-0000-4000-8000-0000000004aa',
  '00000000-0000-4000-8000-00000000a15a',
  3,
  'T-04 v1.1 — Insumos e energia no Lucro Real (nacional, MT/GO prioritario)',

  'Empresas industriais de porte medio/grande, em todo o Brasil, apresentam '
  || 'sinais compativeis com creditos nao cumulativos de PIS/Cofins sobre '
  || 'insumos e energia nao aproveitados integralmente. MT e GO — territorio do '
  || 'design partner — sobem no ranking, mas nao cortam a fila. HIPOTESE v1.1: '
  || 'o que se observa e PERFIL compativel, nunca aproveitamento.',

  jsonb_build_object(
    'selo', 'HIPOTESE v1.1',
    'conjunto_alvo', 'estabelecimentos',
    'criterios', jsonb_build_array(
      jsonb_build_object(
        'chave', 'cnae_industrial',
        'conjunto', 'estabelecimentos',
        'rotulo', 'CNAE de industria de transformacao',
        'campo', 'cnae_fiscal_principal',
        'operador', 'prefixo_em',
        'valores', jsonb_build_array(
          '10','11','12','13','14','15','16','17','18','19','20','21','22',
          '23','24','25','26','27','28','29','30','31','32','33'),
        'especie', 'FATO',
        'fonte', 'RFB-CNPJ'
      ),
      jsonb_build_object(
        'chave', 'ativa',
        'conjunto', 'estabelecimentos',
        'rotulo', 'Situacao cadastral ativa',
        'campo', 'situacao_cadastral',
        'operador', 'em',
        'valores', jsonb_build_array('02'),
        'especie', 'FATO',
        'fonte', 'RFB-CNPJ'
      ),
      jsonb_build_object(
        'chave', 'porte_grande',
        'conjunto', 'empresas',
        'rotulo', 'Porte fora das faixas ME/EPP',
        'campo', 'porte',
        'operador', 'em',
        'valores', jsonb_build_array('05'),
        'especie', 'PROXY',
        'base_do_proxy', 'Porte "demais" (05) exclui ME e EPP, que sao '
          || 'presumidamente Simples ou Lucro Presumido.',
        'limite', 'NAO prova Lucro Real. So a apuracao confirma.',
        'fonte', 'RFB-CNPJ'
      )
    ),

    -- 🔴 O QUE MUDOU: MT/GO saiu de `criterios` e entrou aqui.
    'bonificadores', jsonb_build_array(
      jsonb_build_object(
        'chave', 'territorio_design_partner',
        'conjunto', 'estabelecimentos',
        'rotulo', 'No territorio do design partner (MT/GO)',
        'campo', 'uf',
        'operador', 'em',
        'valores', jsonb_build_array('MT','GO'),
        'fonte', 'RFB-CNPJ',
        'por_que', 'Alvo em MT/GO e atendivel pelo parceiro que temos hoje. '
          || 'Isso e preferencia comercial, nao aderencia a tese — por isso '
          || 'pontua e nao corta.'
      )
    ),

    'criterios_indisponiveis', jsonb_build_array(
      jsonb_build_object(
        'chave', 'consumo_livre_energia',
        'rotulo', 'Consumidor livre de energia (o discriminador da tese)',
        'fonte', 'CCEE-CL',
        'estado', 'INDISPONIVEL',
        'motivo', 'HTTP 403 declarado pela propria CCEE em 19/08/2026 — '
          || 'error code 0.aa2b3417.1787140361.93c660e. Segue indisponivel.',
        'efeito_na_ficha', 'intensidadeSinal cai e o limite de inferencia da '
          || 'ficha declara a ausencia, na cadeia, com confianca 0.'
      ),
      jsonb_build_object(
        'chave', 'sped',
        'rotulo', 'Escrituracao fiscal digital',
        'fonte', null,
        'estado', 'NAO_PUBLICO',
        'motivo', 'Dado da propria empresa. Nunca sai de fonte publica.',
        'efeito_na_ficha', 'Entra como "por que nao perseguir".'
      )
    )
  ),

  jsonb_build_array('cnae_industrial','ativa','porte_grande'),

  'ativa',
  'MEDICAO DA ONDA 3: 82 alvos × taxa de evento de 0,0078%/mes = 0,006 ficha/mes '
    || '— cadencia inviavel. O territorio passa de CORTE a PESO: a caçada vira '
    || 'nacional e MT/GO sobe no ranking. Decisao do dono em 19/08/2026.',
  now()
)
ON CONFLICT (tese_id, versao) DO NOTHING;

-- Pesos e EV iguais aos da v0: mudou o recorte, nao o que a tese vale.
INSERT INTO teses.pesos (tese_versao_id, dimensao, peso)
SELECT '00000000-0000-4000-8000-00000004a011', dimensao, peso
  FROM teses.pesos WHERE tese_versao_id = '00000000-0000-4000-8000-00000004a001';

INSERT INTO teses.ev_parametros
SELECT '00000000-0000-4000-8000-00000004a011',
       bruto, bruto_selo, bruto_origem,
       prob_elegibilidade, prob_elegibilidade_selo,
       prob_homologacao, prob_homologacao_selo,
       ajuste_prazo_caixa, custo_documentacao, honorarios_habilitado,
       observacao
  FROM teses.ev_parametros WHERE tese_versao_id = '00000000-0000-4000-8000-00000004a001';

INSERT INTO teses.regras_contra (tese_versao_id, codigo, texto, quando)
SELECT '00000000-0000-4000-8000-00000004a011', codigo, texto, quando
  FROM teses.regras_contra WHERE tese_versao_id = '00000000-0000-4000-8000-00000004a001';

-- A razao nova que a caçada nacional cria — e que nao existia na v0.
INSERT INTO teses.regras_contra (tese_versao_id, codigo, texto, quando) VALUES
  ('00000000-0000-4000-8000-00000004a011',
   'precedente_desfavoravel',
   'A caçada e NACIONAL desde a v1.1. Se este alvo estiver fora de MT/GO, ele '
     || 'e elegivel pela tese mas pode ser inatendivel pelo parceiro que temos '
     || 'hoje — confira o bonificador de territorio no score antes de investir '
     || 'viagem.',
   'sempre');
