-- ════════════════════════════════════════════════════════════════════════════
-- 0014 · O MOTOR DE CAÇA — tese × estado × evento
--
-- Onde nasce o candidato, e onde ele vira ficha.
--
-- Mesma disciplina da Onda 2: a regra mora no SQL, onde os dados estao. Sao
-- milhoes de linhas por caçada; trazer isso para o Node seria pagar rede e
-- memoria para fazer pior o que o banco faz num JOIN. E, de novo, o motivo
-- mais forte: com a regra em SQL existe UMA implementacao.
--
-- 🔴 A LEI QUE ESTA MIGRATION DEFENDE:
-- **candidato nao e ficha.** A varredura inicial pare CANDIDATOS — o perfil
-- casou com a tese. Ficha exige EVENTO: alguma coisa MUDOU. Sem isso o FARO
-- vira lista de empresas que batem num filtro, que e exatamente o produto que
-- o canon recusa ser (§2: "encontrei uma MUDANCA, nao encontrei uma empresa").
--
-- Canon: MODELO-FARO-V2.md §2, §4, §11 · REGRA-DE-PEDRO.md · ORDEM ONDA 3 §2, §3
-- ════════════════════════════════════════════════════════════════════════════

-- ── A CAÇADA: uma passada da tese sobre a base ──────────────────────────────

CREATE TABLE fichas.cacadas (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  tese_versao_id    uuid NOT NULL REFERENCES teses.versoes(id),
  -- `inicial`: perfil contra a base carregada, dia zero.
  -- `incremental`: eventos novos que casam com a tese — o que o Watch consome.
  modo              text NOT NULL CHECK (modo IN ('inicial','incremental')),
  coleta_id         uuid REFERENCES jazida.coletas(id),
  rodada_em         timestamptz NOT NULL DEFAULT now(),
  duracao_ms        bigint,
  candidatos        bigint NOT NULL DEFAULT 0,
  fichas_publicadas bigint NOT NULL DEFAULT 0
);

CREATE INDEX ON fichas.cacadas (tenant_id, rodada_em DESC);
CREATE INDEX ON fichas.cacadas (tese_versao_id, modo);

-- ── O CANDIDATO ─────────────────────────────────────────────────────────────
-- Guarda QUAIS criterios casaram e COM QUE DADO. Sem isso, "casou com a tese"
-- e afirmacao sem prova — e a ficha nao teria de onde tirar a cadeia.

CREATE TABLE fichas.candidatos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cacada_id         uuid NOT NULL REFERENCES fichas.cacadas(id) ON DELETE CASCADE,
  tenant_id         uuid NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
  tese_versao_id    uuid NOT NULL REFERENCES teses.versoes(id),
  cnpj              text NOT NULL,
  cnpj_basico       text NOT NULL,
  razao_social      text,
  -- Um objeto por criterio: chave, rotulo, campo, valor observado, especie,
  -- fonte, datas. E a materia-prima da cadeia de evidencia.
  criterios_casados jsonb NOT NULL,
  -- Evento que fez este candidato virar noticia. NULL na varredura inicial.
  evento_id         uuid REFERENCES eventos.eventos(id),
  criado_em         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cacada_id, cnpj)
);

CREATE INDEX ON fichas.candidatos (tenant_id, tese_versao_id);
CREATE INDEX ON fichas.candidatos (cnpj_basico);
CREATE INDEX ON fichas.candidatos (evento_id) WHERE evento_id IS NOT NULL;

COMMENT ON COLUMN fichas.candidatos.evento_id IS
  'NULL = veio da varredura inicial: o perfil casa, mas nada mudou. Candidato '
  'assim NAO vira ficha — ficha sem evento e lista, e lista nao e o produto.';

ALTER TABLE fichas.cacadas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.cacadas    FORCE  ROW LEVEL SECURITY;
ALTER TABLE fichas.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas.candidatos FORCE  ROW LEVEL SECURITY;

CREATE POLICY cacadas_do_tenant ON fichas.cacadas
  FOR SELECT TO authenticated USING (tenant_id IN (SELECT core.tenants_do_usuario()));
CREATE POLICY candidatos_do_tenant ON fichas.candidatos
  FOR SELECT TO authenticated USING (tenant_id IN (SELECT core.tenants_do_usuario()));

REVOKE ALL ON fichas.cacadas, fichas.candidatos FROM PUBLIC, anon;
GRANT SELECT ON fichas.cacadas, fichas.candidatos TO authenticated;

-- ── O SCORE PRECISA DIZER POR QUE ───────────────────────────────────────────
-- A Onda 1 gravou valor e peso por dimensao. Falta o porque: um 30 em
-- `intensidadeSinal` sem explicacao e tao opaco quanto o score-caixa-preta que
-- o canon proibe. Score decomposto que nao se justifica e decomposicao de
-- fachada.

ALTER TABLE fichas.score_parcelas ADD COLUMN justificativa text;

COMMENT ON COLUMN fichas.score_parcelas.justificativa IS
  'Por que a dimensao vale este numero. Sem isto a decomposicao e de fachada: '
  'o leitor ve seis numeros e continua sem saber de onde vieram.';

-- ── A CAÇADA, A FUNCAO ──────────────────────────────────────────────────────
--
-- Monta o WHERE a partir dos criterios da tese — que sao DADO. Nenhum CNAE,
-- nenhuma UF e nenhum porte aparece hardcoded aqui: mudar a tese e UPDATE de
-- linha, nunca deploy.

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

  -- 🔴 So tese ATIVA ou SEGMENTADA caça. Tese em `estudo` que caçasse
  -- entregaria ficha de hipotese nao assumida; tese `contraditada` ou `morta`
  -- entregaria ficha que a casa ja sabe estar errada.
  IF v_estado NOT IN ('ativa','segmentada') THEN
    RAISE EXCEPTION 'tese em estado "%" nao caça — so `ativa` ou `segmentada`', v_estado
      USING ERRCODE = 'restrict_violation';
  END IF;

  v_conj_alvo := coalesce(v_params ->> 'conjunto_alvo', 'estabelecimentos');

  -- A coleta COMPLETA mais recente de cada conjunto. Lote pela metade nao caça
  -- (mesma lei da Onda 2: `jazida.coletas_completas` e a unica porta).
  SELECT c.id INTO v_coleta_est
    FROM jazida.coletas_completas c
    WHERE EXISTS (SELECT 1 FROM jazida.snapshots s
                   WHERE s.coleta_id = c.id AND s.conjunto = v_conj_alvo)
    ORDER BY c.collected_at DESC LIMIT 1;

  IF v_coleta_est IS NULL THEN
    RAISE EXCEPTION 'nao ha coleta completa do conjunto "%" — nada a caçar', v_conj_alvo;
  END IF;

  -- ── Monta os predicados a partir dos criterios (que sao dado) ─────────────
  FOR v_crit IN SELECT * FROM jsonb_array_elements(v_params -> 'criterios')
  LOOP
    DECLARE
      v_alias text;
      v_campo text := v_crit ->> 'campo';
      v_op    text := v_crit ->> 'operador';
      v_vals  text;
    BEGIN
      IF (v_crit ->> 'conjunto') = v_conj_alvo THEN
        v_alias := 'alvo';
      ELSE
        v_alias := 'aux';
        v_join_emp := true;
      END IF;

      SELECT string_agg(quote_literal(x), ',')
        INTO v_vals FROM jsonb_array_elements_text(v_crit -> 'valores') AS t(x);

      IF v_op = 'em' THEN
        v_where := v_where || format(' AND (%I.payload ->> %L) IN (%s)',
                                     v_alias, v_campo, v_vals);
      ELSIF v_op = 'prefixo_em' THEN
        v_where := v_where || format(
          ' AND EXISTS (SELECT 1 FROM unnest(ARRAY[%s]) p WHERE (%I.payload ->> %L) LIKE p || %L)',
          v_vals, v_alias, v_campo, '%');
      ELSE
        RAISE EXCEPTION 'operador de criterio desconhecido: %', v_op;
      END IF;

      -- O que casou, com o dado que casou. Vira cadeia de evidencia depois.
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

  -- ── A CONSULTA ────────────────────────────────────────────────────────────
  -- `inicial`  = perfil casa, sem exigir evento (candidato, nunca ficha)
  -- `incremental` = perfil casa E ha evento novo sobre a chave
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
    -- No modo incremental o evento e OBRIGATORIO: JOIN, nao LEFT JOIN.
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

COMMENT ON FUNCTION fichas.cacar(uuid, text) IS
  'O unico lugar que cria candidato. Os criterios vem da versao da tese, como '
  'dado — nenhum CNAE ou UF aparece neste codigo. Modo `inicial` nao exige '
  'evento e por isso nao gera ficha; `incremental` exige.';
