-- ════════════════════════════════════════════════════════════════════════════
-- 0017 · A CAÇADA TEM QUE DIZER DE QUAL CONJUNTO ESTA FALANDO
--
-- 🔴 DOIS DEFEITOS MEUS, ENCONTRADOS MEDINDO — nao lendo o codigo de novo.
--
-- A 0016 atacou o criterio de CNAE e a caçada continuou passando de 11 minutos.
-- Em vez de adivinhar outra vez, decompus e cronometrei:
--
--     filtro do alvo sozinho ....... 4,0 s   → 5.166 candidatos
--     a caçada inteira ............. > 11 min (cancelada)
--
-- O filtro nao era o problema. O JOIN era. E por dois motivos, os dois meus:
--
-- ── DEFEITO 1 · O JOIN NAO DIZIA O CONJUNTO ────────────────────────────────
-- A juncao era `aux.coleta_id = X AND aux.chave_natural = left(alvo.chave, 8)`.
-- Falta `aux.conjunto = 'empresas'` — e sem isso o indice
-- `(source_id, conjunto, chave_natural, collected_at)` nao serve, porque suas
-- colunas da frente ficam livres. O planejador desiste do indice e junta duas
-- tabelas de milhoes de linhas por hash.
--
-- ── DEFEITO 2 · O ALVO TAMBEM NAO DIZIA, E ISSO E PIOR ─────────────────────
-- O alvo era filtrado so por `coleta_id`. Nos meus testes isso funcionou por
-- ACIDENTE: `carregarArquivoLocal` cria uma coleta por arquivo, entao coleta e
-- conjunto coincidiam.
--
-- Mas `executarColeta` — o coletor de verdade, o que roda em producao — carrega
-- empresas, estabelecimentos e simples na MESMA coleta. Ali `coleta_id = X`
-- casa com os tres conjuntos ao mesmo tempo, e a caçada compararia o CNAE de um
-- estabelecimento com o payload de uma linha de `simples`.
--
-- Nao daria erro. Daria candidato errado, em silencio. E o teste de integracao
-- nao pegaria, porque o caminho que ele exercita nao e o que roda em producao —
-- que e exatamente o tipo de ponto cego que a casa ja registrou no Banco de
-- Evolucao: **dois caminhos para a mesma coisa, e so um deles testado.**
--
-- O conserto e uma linha em cada lado. O que ele ensina vale mais que ele.
--
-- Canon: MODELO-FARO-V2.md §11 · ORDEM ONDA 3 §2
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

  -- Qual conjunto auxiliar a tese usa, se usa algum. Uma tese pode cruzar no
  -- maximo dois conjuntos hoje; se um dia precisar de tres, isto vira laço —
  -- e a mudanca sera visivel aqui, nao escondida numa string.
  SELECT DISTINCT c ->> 'conjunto' INTO v_conj_aux
    FROM jsonb_array_elements(v_params -> 'criterios') c
   WHERE (c ->> 'conjunto') <> v_conj_alvo;

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
        ', jsonb_build_object(%L, %L, %L, %L, %L, %L, %L, %I.payload ->> %L, %L, %L, %L, %L)',
        'chave',    v_crit ->> 'chave',
        'rotulo',   v_crit ->> 'rotulo',
        'campo',    v_campo,
        'valor',    v_alias, v_campo,
        'especie',  v_crit ->> 'especie',
        'fonte',    v_crit ->> 'fonte');
    END;
  END LOOP;

  IF v_conj_aux IS NOT NULL THEN
    SELECT c.id INTO v_coleta_emp
      FROM jazida.coletas_completas c
      WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                     WHERE s.coleta_id = c.id AND s.conjunto = v_conj_aux)
      ORDER BY c.collected_at DESC LIMIT 1;
    IF v_coleta_emp IS NULL THEN
      RAISE EXCEPTION 'a tese exige criterio no conjunto "%" e nao ha coleta completa dele',
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
       AND alvo.conjunto  = %L          -- 🔴 DEFEITO 2 corrigido
       %s
     ON CONFLICT (cacada_id, cnpj) DO NOTHING
  $f$,
    v_cacada, v_tenant, p_tese_versao_id,
    CASE WHEN v_conj_aux IS NOT NULL THEN 'aux.payload ->> ''razao_social''' ELSE 'NULL' END,
    ltrim(v_sel_crit, ', '),
    CASE WHEN p_modo = 'incremental' THEN 'ev.id' ELSE 'NULL::uuid' END,
    -- 🔴 DEFEITO 1 corrigido: `aux.conjunto` no JOIN destrava o indice
    -- (source_id, conjunto, chave_natural, collected_at).
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

-- O indice que o JOIN corrigido usa. Ja existia por (source_id, conjunto,
-- chave_natural, collected_at) desde a 0010; este acrescenta o recorte por
-- coleta, que e como a caçada de fato pergunta.
CREATE INDEX IF NOT EXISTS snapshots_coleta_conjunto_chave
  ON jazida.snapshots (coleta_id, conjunto, chave_natural);

COMMENT ON FUNCTION fichas.cacar(uuid, text) IS
  'O unico lugar que cria candidato. Filtra alvo E auxiliar por conjunto: sem '
  'isso a caçada cruza conjuntos diferentes em silencio quando a coleta traz '
  'mais de um (que e o caso do coletor de producao).';
