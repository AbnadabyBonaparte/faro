-- ════════════════════════════════════════════════════════════════════════════
-- 0020 · T-MED — A PRIMEIRA CAÇADA INTERNA DA CASA
--
-- Martelo do dono, 19/08/2026. A ALSHAM vira cliente numero zero do proprio
-- FARO: dor propria, dado real, tempo medido. A tese abastece o Conversion OS.
--
-- 🔴 O QUE ESTA MIGRATION PROVA, E POR QUE IMPORTA:
--
-- A T-04 procura industria GRANDE — porte 05, fora de ME/EPP. A T-MED procura
-- clinica PEQUENA — porte 01/03, ME/EPP. As duas rodam no MESMO motor, com a
-- MESMA funcao `fichas.cacar`, e a inversao inteira acontece em DADO: muda a
-- linha da tabela, nao muda uma linha de codigo do motor.
--
-- Se a inversao de vertical exigisse `if tese = 'T-MED'`, o Anti-Vies da casa
-- teria falhado no primeiro teste real. Nao exigiu.
--
-- 🟡 O QUE MUDOU DE CODIGO, E POR QUE NAO CONTRADIZ O ACIMA:
--
-- Dois OPERADORES novos entram em `fichas.cacar` — `anterior_a` e
-- `intervalo_numerico`. Eles nao sabem o que e clinica: sao comparacoes
-- genericas (data anterior a X, numero entre A e B) que qualquer tese futura
-- usa. A capacidade cresceu; o motor continua sem conhecer vertical nenhuma.
--
-- Canon: DOUTRINA-DO-MINERADOR.md · CATALOGO-DE-TESES-DA-CASA.md T-MED
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1 · OS DOIS OPERADORES NOVOS ────────────────────────────────────────────
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
$$;-- (definicao acima: identica a 0019 mais os dois ELSIF novos em cada laco)

-- ── 1.1 · O BONIFICADOR GANHA PESO PROPRIO ──────────────────────────────────
-- Ate aqui todo bonificador valia igual: `20 * atendidos / total`. Com isso,
-- "estar no estado certo" e "estar na cidade certa" pontuavam o mesmo, e o
-- pedido do dono — sub-peso MAXIMO para o quintal de Barra do Garças — nao
-- tinha como ser expresso em dado.
--
-- Agora cada bonificador declara `peso` (default 1) e o fit soma pesos em vez
-- de contar itens. O teto de 20 pontos NAO muda: preferencia comercial continua
-- ordenando a fila sem nunca decidir se o alvo serve.

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
  v_n_bonus     numeric;   -- soma dos PESOS dos bonificadores da tese
  v_n_bonus_ok  numeric;   -- soma dos pesos dos que casaram
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
         coalesce(sum(coalesce((x ->> 'peso')::numeric, 1))
                    FILTER (WHERE x ->> 'especie' = 'BONIFICADOR'), 0),
         coalesce(sum(coalesce((x ->> 'peso')::numeric, 1))
                    FILTER (WHERE x ->> 'especie' = 'BONIFICADOR'
                              AND (x ->> 'casou')::boolean), 0)
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
                ELSE format('%s de %s pontos de preferencia atendidos (soma dos '
                            || 'pesos dos bonificadores) — preferencia comercial '
                            || 'vale ate 20 dos 100 pontos e ORDENA a fila, '
                            || 'nunca decide elegibilidade.',
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


-- ── 2 · A TESE T-MED, COM DOIS SUB-PERFIS ───────────────────────────────────
-- Dona: o tenant da casa. A Lei de Dados vale para nos tambem — tese interna
-- mora sob o mesmo isolamento de qualquer assinante.
--
-- Os dois alvos do dono viram DUAS VERSOES da MESMA tese, e cada candidato sai
-- carimbado com a versao que o produziu (`fichas.candidatos.tese_versao_id`),
-- que e o carimbo de perfil pedido — sem coluna nova.
--
--   versao 1 · PERFIL B — a clinica ESTABELECIDA. Caça por ESTOQUE.
--   versao 2 · PERFIL A — o RECEM-CHEGADO.       Caça por EVENTO.
--
-- 🟡 LIMITE ASSUMIDO: `versaoAtivaDaTese()` devolve UMA versao por codigo.
-- Com duas vivas, ela devolve a `ativa` (B). A caçada do perfil A e disparada
-- pelo id da versao, explicitamente. Na onda do app isso vira selecao de
-- sub-perfil na interface; aqui esta declarado para nao virar surpresa.

INSERT INTO teses.teses (id, tenant_id, codigo, criada_em)
VALUES ('00000000-0000-4000-8000-00000000dede',
        '00000000-0000-4000-8000-00000000a15a',
        'T-MED', now())
ON CONFLICT (tenant_id, codigo) DO NOTHING;

-- A certidao de proveniencia vem ANTES da versao: a guarda da casa recusa tese
-- ativa sem ela, e recusou esta na primeira tentativa. Funcionou como devia.

INSERT INTO teses.proveniencia
  (tese_id, origem, referencia, autor, nao_derivou_de_tenant_cliente)
VALUES ('00000000-0000-4000-8000-00000000dede',
        'pesquisa_propria',
        'DOUTRINA-DO-MINERADOR.md §2 e CATALOGO-DE-TESES-DA-CASA.md T-MED, '
          || 'martelo do dono de 19/08/2026. Parametros observaveis derivados '
          || 'exclusivamente da Base Aberta de CNPJ da RFB. A leitura de negocio '
          || '(clinica pequena tende a nao ter presenca digital profissional) vem '
          || 'da operacao propria da casa nos casos Fernanda e Bela — nunca de '
          || 'dado de tenant cliente do FARO, que nao existe.',
        'ALSHAM Global Commerce — tese interna',
        true)
ON CONFLICT (tese_id) DO NOTHING;

-- ── 2.1 · PERFIL B — A CLINICA PEQUENA ESTABELECIDA (estoque) ───────────────

INSERT INTO teses.versoes
  (id, tese_id, tenant_id, versao, nome, hipotese, parametros, sinais_exigidos,
   estado, motivo_do_estado, verificada_em)
VALUES (
  '00000000-0000-4000-8000-0000000ded01',
  '00000000-0000-4000-8000-00000000dede',
  '00000000-0000-4000-8000-00000000a15a',
  1,
  'T-MED perfil B — clinica pequena estabelecida',

  'Clinicas e consultorios de porte ME/EPP, ativos ha mais de um ano, com uma '
  || 'unica unidade e capital social compativel com operacao pequena, '
  || 'apresentam sinais compativeis com AUSENCIA de presenca digital '
  || 'profissional. HIPOTESE v0: o que se observa e PERFIL de porte e '
  || 'estrutura — a ausencia de site NAO foi verificada em fonte nenhuma.',

  jsonb_build_object(
    'selo', 'HIPOTESE v0',
    'perfil', 'B',
    'perfil_rotulo', 'A clinica estabelecida — caça por estoque',
    'conjunto_alvo', 'estabelecimentos',
    'criterios', jsonb_build_array(
      jsonb_build_object(
        'chave', 'cnae_saude',
        'conjunto', 'estabelecimentos',
        'rotulo', 'CNAE de saude — medicina/odontologia (8630) e demais profissionais (8650)',
        'campo', 'cnae_fiscal_principal',
        'operador', 'prefixo_em',
        'valores', jsonb_build_array('8630','8650'),
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
        'chave', 'porte_pequeno',
        'conjunto', 'empresas',
        'rotulo', 'Porte ME ou EPP',
        'campo', 'porte',
        'operador', 'em',
        'valores', jsonb_build_array('01','03'),
        'especie', 'PROXY',
        'base_do_proxy', 'Porte 01 (ME) e 03 (EPP) sao as faixas declaradas de '
          || 'micro e pequena empresa na propria base da RFB.',
        'limite', 'Porte declarado NAO mede faturamento nem numero de pacientes.',
        'fonte', 'RFB-CNPJ'
      ),
      jsonb_build_object(
        'chave', 'madura',
        'conjunto', 'estabelecimentos',
        'rotulo', 'Aberta ha mais de 12 meses',
        'campo', 'data_inicio_atividade',
        'operador', 'anterior_a',
        'valores', jsonb_build_array('20250819'),
        'especie', 'FATO',
        'fonte', 'RFB-CNPJ'
      )
    ),

    -- 🔴 A INVERSAO EM ESTADO PURO: na T-04 o porte grande era CRITERIO porque
    -- so a industria grande tem o credito. Aqui o porte pequeno e criterio pela
    -- razao oposta — clinica grande ja tem agencia. Mesmo campo, mesma funcao,
    -- leitura invertida, zero linha de codigo.
    'bonificadores', jsonb_build_array(
      jsonb_build_object(
        'chave', 'territorio_alsham',
        'conjunto', 'estabelecimentos',
        'rotulo', 'No territorio de atuacao da ALSHAM (MT/GO)',
        'campo', 'uf',
        'operador', 'em',
        'valores', jsonb_build_array('MT','GO'),
        'fonte', 'RFB-CNPJ',
        'peso', 3,
        'por_que', 'Alvo em MT/GO e visitavel. Preferencia comercial, nao '
          || 'aderencia — por isso pontua e nao corta.'
      ),
      jsonb_build_object(
        'chave', 'quintal_barra_do_garcas',
        'conjunto', 'estabelecimentos',
        'rotulo', 'No quintal — Barra do Garças, Aragarças e vizinhas',
        'campo', 'municipio',
        'operador', 'em',
        -- Codigos de municipio da RFB (nao IBGE), conferidos contra
        -- F.K03200$Z.D60808.MUNICCSV do lote 2026-08 e cruzados com a UF do
        -- proprio snapshot carregado. Nomes se repetem entre estados; codigo nao.
        'valores', jsonb_build_array(
          '9035',  -- BARRA DO GARCAS / MT
          '0095',  -- PONTAL DO ARAGUAIA / MT
          '9233',  -- ARAGARCAS / GO
          '9163',  -- TORIXOREU / MT
          '9077',  -- GENERAL CARNEIRO / MT
          '9195',  -- NOVA XAVANTINA / MT
          '9261',  -- BALIZA / GO
          '9267'), -- BOM JARDIM DE GOIAS / GO
        'peso', 5,
        'fonte', 'RFB-CNPJ',
        'por_que', 'E o raio em que a ALSHAM atende hoje sem deslocamento longo. '
          || 'Peso 5 contra 3 do estado: dentro de MT/GO, o quintal vale mais. '
          || 'Continua pontuando e nao cortando — a caçada e nacional.'
      ),
      jsonb_build_object(
        'chave', 'unidade_unica',
        'conjunto', 'estabelecimentos',
        'rotulo', 'E matriz (nao e filial de rede)',
        'campo', 'identificador_matriz_filial',
        'operador', 'em',
        'valores', jsonb_build_array('1'),
        'fonte', 'RFB-CNPJ',
        'peso', 2,
        'por_que', 'Filial de rede tem decisao de marketing centralizada e '
          || 'quase sempre fornecedor contratado.'
      ),
      jsonb_build_object(
        'chave', 'capital_pequeno',
        'conjunto', 'empresas',
        'rotulo', 'Capital social ate R$ 200 mil',
        'campo', 'capital_social',
        'operador', 'intervalo_numerico',
        'valores', jsonb_build_array('0','200000'),
        'fonte', 'RFB-CNPJ',
        'peso', 1,
        'por_que', 'Capital social tem granularidade fina onde o porte so tem '
          || 'tres degraus. Pontua, nao corta: capital e escolha contabil, nao '
          || 'medida de operacao.'
      ),
      jsonb_build_object(
        'chave', 'natureza_de_clinica',
        'conjunto', 'empresas',
        'rotulo', 'Sociedade simples, LTDA pequena ou empresario individual',
        'campo', 'natureza_juridica',
        'operador', 'em',
        'valores', jsonb_build_array('2135','2062','2232','2240'),
        'fonte', 'RFB-CNPJ',
        'peso', 1,
        'por_que', 'Sao as formas juridicas tipicas de consultorio. Pontua '
          || 'porque a forma sugere o tamanho — nao prova.'
      )
    ),

    'criterios_indisponiveis', jsonb_build_array(
      jsonb_build_object(
        'chave', 'presenca_digital',
        'rotulo', 'Tem site profissional, agendamento online, perfil ativo',
        'fonte', null,
        'estado', 'NAO_PUBLICO',
        'motivo', 'O discriminador REAL desta tese nao esta em fonte publica '
          || 'nenhuma da RFB. A caçada entrega PERFIL compativel; quem confirma '
          || 'a ausencia de site e uma verificacao manual, fora do motor.',
        'efeito_na_ficha', 'confiancaInferencia cai e o limite de inferencia '
          || 'declara que a dor foi presumida, nunca observada.'
      ),
      jsonb_build_object(
        'chave', 'rede_de_filiais',
        'rotulo', 'A empresa NAO tem outras unidades',
        'fonte', 'RFB-CNPJ',
        'estado', 'NAO_IMPLEMENTADO',
        'motivo', 'Exigiria contar estabelecimentos por cnpj_basico dentro da '
          || 'caçada — auto-juncao sobre milhoes de linhas. O bonificador '
          || '`unidade_unica` cobre o caso comum (ser matriz) e nao cobre o '
          || 'caso de matriz COM filiais.',
        'efeito_na_ficha', 'Alvo com rede pode aparecer. Entra como "por que '
          || 'nao perseguir" para conferencia humana.'
      )
    )
  ),

  jsonb_build_array('cnae_saude','ativa','porte_pequeno','madura'),
  'ativa',
  'Perfil de volume da T-MED: e o cliente classico do Conversion OS, o mesmo '
    || 'dos casos Fernanda e Bela. Ativa porque e a caçada que roda por padrao.',
  now()
) ON CONFLICT (tese_id, versao) DO NOTHING;

-- ── 2.2 · PERFIL A — O RECEM-CHEGADO (evento) ───────────────────────────────
-- Sem criterio de porte e sem criterio de idade: quem acabou de abrir nao tem
-- porte estabilizado nem historico. O que qualifica e o EVENTO.

INSERT INTO teses.versoes
  (id, tese_id, tenant_id, versao, nome, hipotese, parametros, sinais_exigidos,
   estado, motivo_do_estado, verificada_em)
VALUES (
  '00000000-0000-4000-8000-0000000ded02',
  '00000000-0000-4000-8000-00000000dede',
  '00000000-0000-4000-8000-00000000a15a',
  2,
  'T-MED perfil A — profissional de saude recem-formalizado',

  'Profissionais de saude que acabaram de se formalizar como pessoa juridica '
  || 'apresentam sinais compativeis com AUSENCIA COMPLETA de captacao digital: '
  || 'nao houve tempo de contratar ninguem. HIPOTESE v0: o que se observa e o '
  || 'EVENTO de formalizacao — a ausencia de site NAO foi verificada.',

  jsonb_build_object(
    'selo', 'HIPOTESE v0',
    'perfil', 'A',
    'perfil_rotulo', 'O recem-chegado — caça por evento',
    'conjunto_alvo', 'estabelecimentos',
    'criterios', jsonb_build_array(
      jsonb_build_object(
        'chave', 'cnae_saude',
        'conjunto', 'estabelecimentos',
        'rotulo', 'CNAE de saude — medicina/odontologia (8630) e demais profissionais (8650)',
        'campo', 'cnae_fiscal_principal',
        'operador', 'prefixo_em',
        'valores', jsonb_build_array('8630','8650'),
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
      )
    ),
    'bonificadores', jsonb_build_array(
      jsonb_build_object(
        'chave', 'territorio_alsham',
        'conjunto', 'estabelecimentos',
        'rotulo', 'No territorio de atuacao da ALSHAM (MT/GO)',
        'campo', 'uf',
        'operador', 'em',
        'valores', jsonb_build_array('MT','GO'),
        'fonte', 'RFB-CNPJ',
        'peso', 3,
        'por_que', 'Alvo em MT/GO e visitavel. Preferencia comercial, nao aderencia.'
      ),
      jsonb_build_object(
        'chave', 'quintal_barra_do_garcas',
        'conjunto', 'estabelecimentos',
        'rotulo', 'No quintal — Barra do Garças, Aragarças e vizinhas',
        'campo', 'municipio',
        'operador', 'em',
        -- Codigos de municipio da RFB (nao IBGE), conferidos contra
        -- F.K03200$Z.D60808.MUNICCSV do lote 2026-08 e cruzados com a UF do
        -- proprio snapshot carregado. Nomes se repetem entre estados; codigo nao.
        'valores', jsonb_build_array(
          '9035',  -- BARRA DO GARCAS / MT
          '0095',  -- PONTAL DO ARAGUAIA / MT
          '9233',  -- ARAGARCAS / GO
          '9163',  -- TORIXOREU / MT
          '9077',  -- GENERAL CARNEIRO / MT
          '9195',  -- NOVA XAVANTINA / MT
          '9261',  -- BALIZA / GO
          '9267'), -- BOM JARDIM DE GOIAS / GO
        'peso', 5,
        'fonte', 'RFB-CNPJ',
        'por_que', 'E o raio em que a ALSHAM atende hoje sem deslocamento longo. '
          || 'Peso 5 contra 3 do estado: dentro de MT/GO, o quintal vale mais. '
          || 'Continua pontuando e nao cortando — a caçada e nacional.'
      ),
      jsonb_build_object(
        'chave', 'unidade_unica',
        'conjunto', 'estabelecimentos',
        'rotulo', 'E matriz (nao e filial de rede)',
        'campo', 'identificador_matriz_filial',
        'operador', 'em',
        'valores', jsonb_build_array('1'),
        'fonte', 'RFB-CNPJ',
        'peso', 2,
        'por_que', 'Filial nova de rede ja nasce com fornecedor da rede.'
      ),
      jsonb_build_object(
        'chave', 'recem_aberta',
        'conjunto', 'estabelecimentos',
        'rotulo', 'Inicio de atividade nos ultimos 12 meses',
        'campo', 'data_inicio_atividade',
        'operador', 'intervalo_numerico',
        'valores', jsonb_build_array('20250819','20260831'),
        'fonte', 'RFB-CNPJ',
        'peso', 3,
        'por_que', 'O evento diz que algo mudou; a data de inicio diz se a '
          || 'mudanca e de quem acabou de nascer ou de quem so mexeu no cadastro. '
          || 'Pontua, nao corta: reativacao de CNPJ antigo tambem interessa.'
      )
    ),
    'criterios_indisponiveis', jsonb_build_array(
      jsonb_build_object(
        'chave', 'presenca_digital',
        'rotulo', 'Tem site profissional, agendamento online, perfil ativo',
        'fonte', null,
        'estado', 'NAO_PUBLICO',
        'motivo', 'O discriminador REAL da tese nao esta em fonte publica.',
        'efeito_na_ficha', 'confiancaInferencia cai e o limite de inferencia '
          || 'declara que a dor foi presumida, nunca observada.'
      )
    )
  ),

  jsonb_build_array('cnae_saude','ativa'),
  'segmentada',
  'Sub-perfil de EVENTO da T-MED, recorte dos recem-chegados. Fica '
    || '`segmentada` e nao `ativa` porque `versaoAtivaDaTese` devolve uma versao '
    || 'por codigo: com as duas ativas, a caçada padrao ficaria ambigua. A '
    || 'caçada do perfil A e disparada pelo id da versao.',
  now()
) ON CONFLICT (tese_id, versao) DO NOTHING;

-- ── 3 · OS PESOS — a segunda prova de que o motor nao conhece vertical ──────
-- Na T-04 o peso maior e de `evidenciaTese` (0,20) porque a tese tributaria
-- vive de evidencia documental. Aqui o peso maior do perfil B e de
-- `fitEstrutural` (0,35): o perfil E a tese. E `confiancaInferencia` dobra
-- (0,20) porque o discriminador real — nao ter site — nao esta em fonte
-- nenhuma, e a honestidade sobre isso tem que pesar no numero.

INSERT INTO teses.pesos (tese_versao_id, dimensao, peso) VALUES
  ('00000000-0000-4000-8000-0000000ded01', 'fitEstrutural',       0.35),
  ('00000000-0000-4000-8000-0000000ded01', 'evidenciaTese',       0.10),
  ('00000000-0000-4000-8000-0000000ded01', 'recencia',            0.15),
  ('00000000-0000-4000-8000-0000000ded01', 'qualidadeFontes',     0.10),
  ('00000000-0000-4000-8000-0000000ded01', 'intensidadeSinal',    0.10),
  ('00000000-0000-4000-8000-0000000ded01', 'confiancaInferencia', 0.20),
  -- No perfil A o que vale e o RELOGIO: uma clinica que abriu ha tres semanas
  -- e outra que abriu ha onze meses nao valem a mesma ligacao.
  ('00000000-0000-4000-8000-0000000ded02', 'fitEstrutural',       0.25),
  ('00000000-0000-4000-8000-0000000ded02', 'evidenciaTese',       0.10),
  ('00000000-0000-4000-8000-0000000ded02', 'recencia',            0.30),
  ('00000000-0000-4000-8000-0000000ded02', 'qualidadeFontes',     0.10),
  ('00000000-0000-4000-8000-0000000ded02', 'intensidadeSinal',    0.10),
  ('00000000-0000-4000-8000-0000000ded02', 'confiancaInferencia', 0.15)
ON CONFLICT DO NOTHING;

-- ── 4 · O EV — declarado NAO CALCULAVEL, de proposito ───────────────────────
-- 🔴 A tese e INTERNA: nao existe credito tributario a estimar. O valor de um
-- alvo aqui e o custo de aquisicao que a casa deixa de pagar, e esse numero a
-- casa NAO tem — nunca mediu CAC de Conversion OS.
--
-- Inventar um numero para a ficha "ficar completa" seria exatamente o vicio que
-- a Lei 7 existe para impedir. Os componentes entram NULOS, o motor detecta e
-- grava `ev_indisponivel_por` na ficha. EV vazio e informacao; EV chutado e
-- mentira.

INSERT INTO teses.ev_parametros (
  tese_versao_id, bruto, bruto_selo, bruto_origem,
  prob_elegibilidade, prob_elegibilidade_selo,
  prob_homologacao, prob_homologacao_selo,
  ajuste_prazo_caixa, custo_documentacao, honorarios_habilitado, observacao)
SELECT v, NULL, 'NAO_VERIFICADO',
  'Tese interna: o retorno nao e credito tributario, e contrato de Conversion '
    || 'OS. A casa nunca mediu o valor medio nem a taxa de conversao desse '
    || 'contrato, entao nao ha piso de faixa para usar.',
  NULL, 'NAO_VERIFICADO', NULL, 'NAO_VERIFICADO', NULL, NULL, 0,
  'EV NAO CALCULAVEL POR DECISAO. Volta a ser calculavel quando a casa medir '
    || 'valor de contrato e taxa de conversao do Conversion OS em operacao real.'
FROM (VALUES ('00000000-0000-4000-8000-0000000ded01'::uuid),
             ('00000000-0000-4000-8000-0000000ded02'::uuid)) t(v)
ON CONFLICT DO NOTHING;

-- ── 5 · POR QUE NAO PERSEGUIR ───────────────────────────────────────────────
--
-- 🔴 ACHADO DESTA CAÇADA, registrado onde doi:
--
-- `teses.regras_contra.codigo` e um CHECK com sete valores fixos. A lei da casa
-- diz que RAZAO DE JULGAMENTO E DADO, nunca enum — e aqui ela nao esta sendo
-- cumprida. O defeito so apareceu agora porque, ate hoje, todas as teses eram
-- tributarias e cabiam nos sete rotulos; a primeira tese de outra vertical nao
-- coube, e a constraint recusou.
--
-- O conserto CERTO e transformar isso numa tabela de razoes por tenant. O
-- conserto de hoje e ampliar o CHECK, porque trocar o modelo no meio da
-- primeira caçada real seria mudar o chao com o pe em cima. Fica escrito para
-- a onda do app: **isto e divida, nao solucao.**

ALTER TABLE teses.regras_contra DROP CONSTRAINT regras_contra_codigo_check;
ALTER TABLE teses.regras_contra ADD CONSTRAINT regras_contra_codigo_check CHECK (
  codigo = ANY (ARRAY[
    'documentacao_provavelmente_ausente','periodo_possivelmente_prescrito',
    'precedente_desfavoravel','fonte_degradada','sinal_isolado',
    'porte_incompativel_com_custo','capacidade_de_utilizacao_duvidosa',
    -- entradas da T-MED (19/08/2026)
    'discriminador_nao_verificado','estrutura_maior_que_aparenta',
    'fora_do_territorio_atendivel','regra_de_conselho_profissional']));

INSERT INTO teses.regras_contra (tese_versao_id, codigo, texto, quando)
SELECT v, codigo, texto, quando FROM (VALUES
  ('discriminador_nao_verificado',
   'O discriminador da tese — nao ter presenca digital profissional — NAO foi '
     || 'verificado em fonte nenhuma. Antes de abordar, olhe se a clinica ja tem '
     || 'site e agendamento: se tiver, o alvo esta errado e o motor nao tinha '
     || 'como saber.',
   'sempre'),
  ('estrutura_maior_que_aparenta',
   'Ser matriz nao prova ser unidade unica. Se esta matriz tiver filiais, a '
     || 'decisao de marketing provavelmente e centralizada e ja tem fornecedor.',
   'sempre'),
  ('fora_do_territorio_atendivel',
   'A caçada e nacional. Fora de MT/GO o alvo e elegivel pela tese mas custa '
     || 'viagem ou atendimento remoto — confira o bonificador de territorio no '
     || 'score antes de investir deslocamento.',
   'sempre'),
  ('regra_de_conselho_profissional',
   'Publicidade de servico de saude tem regra propria de conselho profissional. '
     || 'A abordagem comercial e livre; o que se PROMETE ao cliente final dele '
     || 'nao e. Isso e do profissional habilitado, nao do FARO.',
   'sempre')
) r(codigo, texto, quando)
CROSS JOIN (VALUES ('00000000-0000-4000-8000-0000000ded01'::uuid),
                   ('00000000-0000-4000-8000-0000000ded02'::uuid)) t(v)
ON CONFLICT DO NOTHING;
