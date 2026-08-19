-- ════════════════════════════════════════════════════════════════════════════
-- 0022 · A CAÇADA PARA DE ESCOLHER COLETA NO ESCURO
--
-- 🔴 DEFEITO ENCONTRADO PELA PRIMEIRA CAÇADA REAL, nao por teste.
--
-- `fichas.cacar` escolhia o lote assim:
--     ORDER BY c.collected_at DESC LIMIT 1
--
-- E `collected_at` e a data do LOTE da fonte, nao a hora da carga. Com tres
-- coletas do mesmo mes na jazida — o recorte grande, o recorte de intersecao e
-- a correcao dele — as tres tem `collected_at` identico, e o `LIMIT 1` devolve
-- QUALQUER UMA. Sem erro. Sem aviso.
--
-- Na corrida desta noite isso apareceu duas vezes: primeiro no diff (que eu
-- disparei com o mesmo padrao de consulta e comparou o par errado, fazendo o
-- freio de churn recusar um par que eu nao quis comparar), depois na caçada.
--
-- O estrago possivel em producao e pior que o desta noite: uma recarga de lote
-- corrigido conviveria com o lote defeituoso, e a caçada poderia varrer o
-- defeituoso — entregando ficha construida sobre dado que a casa ja sabia estar
-- errado, sem nada na tela dizendo isso.
--
-- Conserto: desempate por `fechada_em`, que e a hora em que a carga FECHOU.
-- Entre dois lotes da mesma data de referencia, vale o que terminou por ultimo.
--
-- 🟡 O que este conserto NAO faz: nao escolhe por qualidade, so por recencia de
-- carga. Se alguem carregar um lote pior depois de um melhor, a caçada vai no
-- pior. Escolher por qualidade exigiria a coleta declarar qualidade — e isso e
-- decisao de modelagem, nao de desempate.
-- ════════════════════════════════════════════════════════════════════════════

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
    ORDER BY c.collected_at DESC, c.fechada_em DESC LIMIT 1;

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
      -- `anterior_a`: comparacao de texto em campo AAAAMMDD. Serve para idade —
      -- "CNPJ aberto antes de X" e ordem lexicografica no formato da RFB.
      ELSIF v_op = 'anterior_a' THEN
        v_where := v_where || format(' AND (%I.payload ->> %L) < %s AND (%I.payload ->> %L) <> %L',
                                     v_alias, v_campo, v_vals, v_alias, v_campo, '');
      -- `intervalo_numerico`: dois valores, faixa fechada. Campo vazio nao entra.
      ELSIF v_op = 'intervalo_numerico' THEN
        v_where := v_where || format(
          ' AND (%I.payload ->> %L) ~ %L AND replace(%I.payload ->> %L, %L, %L)::numeric'
          || ' BETWEEN %s AND %s',
          v_alias, v_campo, '^[0-9]+([,.][0-9]+)?$',
          v_alias, v_campo, ',', '.',
          quote_literal((v_crit -> 'valores' ->> 0)),
          quote_literal((v_crit -> 'valores' ->> 1)));
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
      ELSIF v_op = 'anterior_a' THEN
        v_teste := format('((%I.payload ->> %L) < %s AND (%I.payload ->> %L) <> %L)',
                          v_alias, v_campo, v_vals, v_alias, v_campo, '');
      ELSIF v_op = 'intervalo_numerico' THEN
        v_teste := format(
          '((%I.payload ->> %L) ~ %L AND replace(%I.payload ->> %L, %L, %L)::numeric'
          || ' BETWEEN %s AND %s)',
          v_alias, v_campo, '^[0-9]+([,.][0-9]+)?$',
          v_alias, v_campo, ',', '.',
          quote_literal((v_crit -> 'valores' ->> 0)),
          quote_literal((v_crit -> 'valores' ->> 1)));
      ELSE
        RAISE EXCEPTION 'operador de bonificador nao suportado: %', v_op;
      END IF;

      -- `peso` viaja com o bonificador: sem ele todo bonificador vale igual, e
      -- "priorizar o quintal" seria indistinguivel de "priorizar o estado".
      v_sel_crit := v_sel_crit || format(
        ', jsonb_build_object(%L,%L, %L,%L, %L,%L, %L, %I.payload ->> %L, %L,%L, %L,%L, %L, %s, %L, %s)',
        'chave',   v_crit ->> 'chave',
        'rotulo',  v_crit ->> 'rotulo',
        'campo',   v_campo,
        'valor',   v_alias, v_campo,
        'especie', 'BONIFICADOR',
        'fonte',   v_crit ->> 'fonte',
        'casou',   v_teste,
        'peso',    coalesce(v_crit ->> 'peso', '1'));
    END;
  END LOOP;

  IF v_conj_aux IS NOT NULL THEN
    SELECT c.id INTO v_coleta_emp
      FROM jazida.coletas_completas c
      WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                     WHERE s.coleta_id = c.id AND s.conjunto = v_conj_aux)
      ORDER BY c.collected_at DESC, c.fechada_em DESC LIMIT 1;
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
