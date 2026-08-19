-- ════════════════════════════════════════════════════════════════════════════
-- 0016 · A CAÇADA PRECISA TERMINAR
--
-- 🔴 ESTA MIGRATION EXISTE POR CAUSA DE UM NUMERO OBSERVADO, nao de teoria.
--
-- A primeira versao de `fichas.cacar` rodou **mais de 12 minutos** contra a
-- amostra real (4,75 M estabelecimentos × 4,49 M empresas) e foi CANCELADA
-- antes de terminar. Sobre a base inteira — 73,6 M estabelecimentos — isso nao
-- e lentidao: e uma caçada que nao acaba.
--
-- A causa nao era o JOIN. Era o criterio de CNAE: o operador `prefixo_em`
-- gerava, POR LINHA, um EXISTS sobre 24 prefixos com LIKE. Sao ~114 milhoes de
-- comparacoes de texto, mais uma extracao de jsonb em cada uma.
--
-- Como TODOS os prefixos da lista tem o mesmo comprimento (as divisoes 10..33
-- da CNAE), o mesmo predicado se escreve como um `left(campo, 2) IN (...)`:
-- um substring e uma busca em hash, no lugar de 24 LIKEs.
--
-- A generalizacao continua honesta: quando os prefixos tiverem comprimentos
-- DIFERENTES, a funcao volta ao laco de LIKE. Nao se troca corretude por
-- velocidade — se detecta o caso em que a forma rapida e equivalente.
--
-- ⚠️ CONTRA-ARGUMENTO AO PROPRIO CONSERTO: isto resolve o custo por linha, nao
-- o custo de varrer a base inteira. Enquanto a caçada tiver que ler todos os
-- estabelecimentos para depois filtrar, o tempo cresce com a fonte, nao com o
-- tamanho da resposta. A saida estrutural — indices por campo de tese, ou uma
-- projecao materializada dos campos que as teses realmente leem — e obra de
-- outra onda, e fica declarada aqui em vez de descoberta em producao.
--
-- Canon: MODELO-FARO-V2.md §11 (lote, nunca tempo real) · ORDEM ONDA 3 §2
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
  v_cacada        uuid;
  v_crit          jsonb;
  v_where         text := '';
  v_sel_crit      text := '';
  v_join_emp      boolean := false;
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

  SELECT c.id INTO v_coleta_est
    FROM jazida.coletas_completas c
    WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                   WHERE s.coleta_id = c.id AND s.conjunto = v_conj_alvo)
    ORDER BY c.collected_at DESC LIMIT 1;

  IF v_coleta_est IS NULL THEN
    RAISE EXCEPTION 'nao ha coleta completa do conjunto "%" — nada a caçar', v_conj_alvo;
  END IF;

  FOR v_crit IN SELECT * FROM jsonb_array_elements(v_params -> 'criterios')
  LOOP
    DECLARE
      v_alias  text;
      v_campo  text := v_crit ->> 'campo';
      v_op     text := v_crit ->> 'operador';
      v_vals   text;
      v_lens   int[];
      v_len    int;
    BEGIN
      IF (v_crit ->> 'conjunto') = v_conj_alvo THEN
        v_alias := 'alvo';
      ELSE
        v_alias := 'aux';
        v_join_emp := true;
      END IF;

      SELECT string_agg(quote_literal(x), ','), array_agg(DISTINCT length(x))
        INTO v_vals, v_lens
        FROM jsonb_array_elements_text(v_crit -> 'valores') AS t(x);

      IF v_op = 'em' THEN
        v_where := v_where || format(' AND (%I.payload ->> %L) IN (%s)',
                                     v_alias, v_campo, v_vals);

      ELSIF v_op = 'prefixo_em' THEN
        IF array_length(v_lens, 1) = 1 THEN
          -- 🔴 O CONSERTO: prefixos de comprimento uniforme viram left() + IN.
          -- Equivalente ao LIKE, e uma ordem de grandeza mais barato.
          v_len := v_lens[1];
          v_where := v_where || format(' AND left(%I.payload ->> %L, %s) IN (%s)',
                                       v_alias, v_campo, v_len, v_vals);
        ELSE
          -- Comprimentos diferentes: o laco de LIKE continua sendo o correto.
          -- Lento, mas certo — e o dia em que uma tese precisar disso, o
          -- relatorio da caçada vai mostrar o custo.
          v_where := v_where || format(
            ' AND EXISTS (SELECT 1 FROM unnest(ARRAY[%s]) p WHERE (%I.payload ->> %L) LIKE p || %L)',
            v_vals, v_alias, v_campo, '%');
        END IF;

      ELSE
        RAISE EXCEPTION 'operador de criterio desconhecido: %', v_op;
      END IF;

      v_sel_crit := v_sel_crit || format(
        ', jsonb_build_object(%L, %L, %L, %L, %L, %L, %L, %I.payload ->> %L, %L, %L, %L, %L)',
        'chave',    v_crit ->> 'chave',
        'rotulo',   v_crit ->> 'rotulo',
        'campo',    v_campo,
        'valor',    v_alias, v_campo,
        'especie',  v_crit ->> 'especie',
        'fonte',    v_crit ->> 'fonte');
    END;
  END LOOP;

  IF v_join_emp THEN
    SELECT c.id INTO v_coleta_emp
      FROM jazida.coletas_completas c
      WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                     WHERE s.coleta_id = c.id AND s.conjunto = 'empresas')
      ORDER BY c.collected_at DESC LIMIT 1;
    IF v_coleta_emp IS NULL THEN
      RAISE EXCEPTION 'a tese exige criterio em `empresas` e nao ha coleta completa desse conjunto';
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
     WHERE alvo.coleta_id = %L::uuid %s
     ON CONFLICT (cacada_id, cnpj) DO NOTHING
  $f$,
    v_cacada, v_tenant, p_tese_versao_id,
    CASE WHEN v_join_emp THEN 'aux.payload ->> ''razao_social''' ELSE 'NULL' END,
    ltrim(v_sel_crit, ', '),
    CASE WHEN p_modo = 'incremental' THEN 'ev.id' ELSE 'NULL::uuid' END,
    CASE WHEN v_join_emp THEN format(
      'JOIN jazida.snapshots aux ON aux.coleta_id = %L::uuid '
      || 'AND aux.chave_natural = left(alvo.chave_natural, 8)', v_coleta_emp)
      ELSE '' END,
    CASE WHEN p_modo = 'incremental' THEN
      'JOIN eventos.eventos ev ON ev.cnpj IN (alvo.chave_natural, left(alvo.chave_natural, 8))'
      ELSE '' END,
    v_coleta_est, v_where);

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

-- ── O INDICE QUE O EVENTO PEDE ──────────────────────────────────────────────
-- A caçada incremental junta evento por CNPJ. Sem indice, cada estabelecimento
-- do lote vira uma varredura da tabela de eventos.
CREATE INDEX IF NOT EXISTS eventos_por_cnpj ON eventos.eventos (cnpj)
  WHERE cnpj IS NOT NULL;

COMMENT ON FUNCTION fichas.cacar(uuid, text) IS
  'O unico lugar que cria candidato. Criterios vem da tese, como dado. '
  'Prefixos de comprimento uniforme viram left()+IN — 12 min de varredura '
  'cancelada foi o que ensinou. Modo `inicial` nao gera ficha; `incremental` sim.';
