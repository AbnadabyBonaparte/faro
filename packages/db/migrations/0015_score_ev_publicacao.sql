-- ════════════════════════════════════════════════════════════════════════════
-- 0015 · SCORE, EV E A PUBLICACAO DA FICHA
--
-- O candidato vira ficha aqui — e so aqui.
--
-- As seis dimensoes NAO sao inventadas na hora: cada uma se calcula de um fato
-- do banco e grava a propria justificativa. Um `30` em intensidade de sinal sem
-- explicacao e tao opaco quanto o score-caixa-preta que o canon proibe.
--
-- 🔴 O QUE ESTA MIGRATION NAO FAZ, DE PROPOSITO:
-- nao escreve `score_total`. Ela grava as PARCELAS e deixa o trigger da Onda 1
-- derivar o total. Se algum dia alguem quiser digitar o total, o banco recusa —
-- e essa recusa foi provada na guarda 03 desde a fundacao.
--
-- Canon: MODELO-FARO-V2.md §4, §4.1, §4.2, §5 · REGRA-DE-PEDRO.md · ORDEM ONDA 3 §3
-- ════════════════════════════════════════════════════════════════════════════

-- ── AS SEIS DIMENSOES ───────────────────────────────────────────────────────
--
-- Cada uma devolve valor 0..100 e o texto que a explica.

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
  v_n_indisp    int;
  v_ref         date;
  v_dias        int;
  v_fontes_ok   int;
  v_fontes_tot  int;
  v_evento      uuid;
BEGIN
  SELECT c.criterios_casados, v.parametros, c.evento_id
    INTO v_crit, v_params, v_evento
    FROM fichas.candidatos c
    JOIN teses.versoes v ON v.id = c.tese_versao_id
   WHERE c.id = p_candidato;

  IF v_crit IS NULL THEN
    RAISE EXCEPTION 'candidato % nao existe', p_candidato;
  END IF;

  v_n_crit  := jsonb_array_length(v_crit);
  SELECT count(*) INTO v_n_proxy
    FROM jsonb_array_elements(v_crit) x WHERE x ->> 'especie' = 'PROXY';
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

  -- 1 · FIT ESTRUTURAL — quantos criterios casaram, e quantos deles sao FATO.
  -- Todos casaram (senao nao seria candidato), entao o que resta medir e a
  -- QUALIDADE do casamento: criterio por proxy vale menos que criterio por fato.
  RETURN QUERY SELECT
    'fitEstrutural',
    round(100.0 * (v_n_crit - v_n_proxy * 0.5) / nullif(v_n_crit, 0), 1),
    format('%s de %s criterios da tese casaram; %s deles por PROXY, que conta '
           || 'meio ponto porque proxy nao prova.', v_n_crit, v_n_crit, v_n_proxy);

  -- 2 · EVIDENCIA DA TESE — quanto do que a tese PRECISA existe de verdade.
  -- Aqui e onde a CCEE bloqueada dói, e tem que doer.
  RETURN QUERY SELECT
    'evidenciaTese',
    round(100.0 * v_n_crit / nullif(v_n_crit + v_n_indisp * 2, 0), 1),
    format('A tese declara %s criterio(s) observavel(is) e %s criterio(s) '
           || 'INDISPONIVEL(is). Cada indisponivel pesa dobrado: o que falta '
           || 'costuma ser justamente o que discriminaria.', v_n_crit, v_n_indisp);

  -- 3 · RECENCIA — idade da coleta contra a frequencia prometida da fonte.
  RETURN QUERY SELECT
    'recencia',
    CASE WHEN v_dias <= 30 THEN 100 WHEN v_dias <= 45 THEN 80
         WHEN v_dias <= 90 THEN 55 WHEN v_dias <= 180 THEN 30 ELSE 10 END::numeric,
    format('Lote de referencia com %s dia(s). A fonte promete lote mensal '
           || '(frequencia declarada de 45 dias com folga).', v_dias);

  -- 4 · QUALIDADE DAS FONTES — E1 e otimo, mas fonte fora do ar nao vale E1.
  RETURN QUERY SELECT
    'qualidadeFontes',
    round(100.0 * v_fontes_ok / nullif(v_fontes_tot, 0), 1),
    format('%s de %s fonte(s) do registry estao `viva`. Confiabilidade E1 '
           || '(orgao oficial), mas fonte fora do ar nao entrega E1 nenhum.',
           v_fontes_ok, v_fontes_tot);

  -- 5 · INTENSIDADE DO SINAL — quantos sinais INDEPENDENTES corroboram.
  -- Um evento e um sinal. O perfil sozinho nao e sinal: e filtro.
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

  -- 6 · CONFIANCA DA INFERENCIA — quanto da conclusao repousa em proxy.
  RETURN QUERY SELECT
    'confiancaInferencia',
    round(greatest(0, 100.0 - v_n_proxy * 25.0 - v_n_indisp * 15.0), 1),
    format('%s proxy(s) (-25 cada) e %s lacuna(s) de fonte (-15 cada) sobre '
           || 'uma inferencia que, no limite, e um perfil compativel — nunca '
           || 'uma apuracao.', v_n_proxy, v_n_indisp);
END
$$;

-- ── A PUBLICACAO ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fichas.publicar(p_candidato uuid)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_c        record;
  v_v        record;
  v_ev       record;
  v_ficha    uuid;
  v_crit     jsonb;
  v_porte    jsonb;
  v_ordem    int := 0;
  v_evento   record;
  v_liq      numeric;
  v_selo     text;
  v_indisp   text;
  v_regra    record;
  v_dim      record;
BEGIN
  SELECT * INTO v_c FROM fichas.candidatos WHERE id = p_candidato;
  IF v_c IS NULL THEN RAISE EXCEPTION 'candidato % nao existe', p_candidato; END IF;

  -- 🔴 SEM EVENTO NAO HA FICHA. A lei do canon §2, como recusa do banco.
  IF v_c.evento_id IS NULL THEN
    RAISE EXCEPTION
      'candidato % nao tem evento — perfil que casa sem nada ter mudado e LISTA, '
      'nao ficha. Ficha exige a mudanca que a justifica.', p_candidato
      USING ERRCODE = 'restrict_violation';
  END IF;

  SELECT * INTO v_v  FROM teses.versoes     WHERE id = v_c.tese_versao_id;
  SELECT * INTO v_ev FROM teses.ev_parametros WHERE tese_versao_id = v_c.tese_versao_id;
  SELECT * INTO v_evento FROM eventos.eventos WHERE id = v_c.evento_id;

  IF v_ev IS NULL THEN
    RAISE EXCEPTION 'tese % nao tem parametros de EV — ficha sem EV liquido nao '
      'e a entrega do FARO', v_c.tese_versao_id;
  END IF;

  -- ── EV LIQUIDO — derivado dos componentes, com o PIOR selo ────────────────
  v_selo := (SELECT CASE
      WHEN 'NAO_VERIFICADO' IN (v_ev.bruto_selo, v_ev.prob_elegibilidade_selo,
                                v_ev.prob_homologacao_selo) THEN 'NAO_VERIFICADO'
      WHEN 'ESTIMATIVA' IN (v_ev.bruto_selo, v_ev.prob_elegibilidade_selo,
                            v_ev.prob_homologacao_selo) THEN 'ESTIMATIVA'
      ELSE 'MEDIDO' END);

  IF v_ev.bruto IS NULL OR v_ev.prob_elegibilidade IS NULL
     OR v_ev.prob_homologacao IS NULL OR v_ev.ajuste_prazo_caixa IS NULL THEN
    v_liq := NULL;
    v_indisp := 'componente(s) do EV sem valor — EV nao calculavel';
  ELSE
    v_liq := v_ev.bruto * v_ev.prob_elegibilidade * v_ev.prob_homologacao
             * v_ev.ajuste_prazo_caixa
             - coalesce(v_ev.custo_documentacao, 0)
             - coalesce(v_ev.honorarios_habilitado, 0);
    v_indisp := NULL;
  END IF;

  -- ── O PROXY DE PORTE, se houver ───────────────────────────────────────────
  SELECT x INTO v_porte FROM jsonb_array_elements(v_c.criterios_casados) x
   WHERE x ->> 'especie' = 'PROXY' AND x ->> 'campo' = 'porte' LIMIT 1;

  -- ── A FICHA. Nasce `preparada`: movimento 4 da Regra de Pedro. ────────────
  INSERT INTO fichas.fichas (
    tenant_id, tese_versao_id, evento_id, razao_social, cnpj,
    porte_proxy, porte_proxy_base, porte_proxy_limite,
    versao_pesos,
    ev_bruto, ev_bruto_selo, ev_bruto_origem,
    ev_prob_elegibilidade, ev_prob_elegibilidade_selo,
    ev_prob_homologacao, ev_prob_homologacao_selo,
    ev_ajuste_prazo_caixa, ev_custo_documentacao, ev_honorarios_habilitado,
    ev_liquido, ev_liquido_selo, ev_indisponivel_por,
    grade, freshness, limite_de_inferencia, acao_texto, acao_estado)
  VALUES (
    v_c.tenant_id, v_c.tese_versao_id, v_c.evento_id,
    coalesce(v_c.razao_social, '(razao social nao ingerida)'), v_c.cnpj,
    v_porte ->> 'valor',
    CASE WHEN v_porte IS NULL THEN NULL ELSE
      'Faixa de porte declarada pela RFB. Exclui ME e EPP.' END,
    CASE WHEN v_porte IS NULL THEN NULL ELSE
      'NAO prova Lucro Real nem faturamento. Porte da RFB e faixa cadastral, '
      || 'nao apuracao.' END,
    'tese:' || v_c.tese_versao_id::text,
    v_ev.bruto, v_ev.bruto_selo, v_ev.bruto_origem,
    v_ev.prob_elegibilidade, v_ev.prob_elegibilidade_selo,
    v_ev.prob_homologacao, v_ev.prob_homologacao_selo,
    v_ev.ajuste_prazo_caixa, v_ev.custo_documentacao, v_ev.honorarios_habilitado,
    v_liq, v_selo, v_indisp,
    -- Grade e Freshness derivados abaixo; entram como C/warn e sao corrigidos.
    'C', 'ok',
    -- 🔴 O LIMITE DE INFERENCIA DA FICHA INTEIRA.
    'Esta ficha aponta um PERFIL COMPATIVEL com a tese, nunca um credito '
    || 'apurado. O discriminador da tese — consumo livre de energia (CCEE) — '
    || 'esta INDISPONIVEL (bloqueio registrado em 19/08/2026): a hipotese se '
    || 'sustenta em CNAE, UF, situacao cadastral e porte apenas. Porte e PROXY '
    || 'e nao prova regime tributario. Nada aqui e parecer tributario nem '
    || 'garantia de recuperacao.',
    'Preparar abordagem: confirmar regime de apuracao e consumo de energia '
    || 'antes de qualquer contato. Nao abordar sem essa confirmacao.',
    'preparada')
  RETURNING id INTO v_ficha;

  -- ── AS PARCELAS. O total cai por trigger. ─────────────────────────────────
  FOR v_dim IN SELECT * FROM fichas.dimensoes_do_candidato(p_candidato)
  LOOP
    INSERT INTO fichas.score_parcelas (ficha_id, dimensao, valor, peso, justificativa)
    SELECT v_ficha, v_dim.dimensao, v_dim.valor, p.peso, v_dim.justificativa
      FROM teses.pesos p
     WHERE p.tese_versao_id = v_c.tese_versao_id AND p.dimensao = v_dim.dimensao;
  END LOOP;

  -- ── A CADEIA DE EVIDENCIA: um no por criterio, mais o evento ──────────────
  FOR v_crit IN SELECT * FROM jsonb_array_elements(v_c.criterios_casados)
  LOOP
    v_ordem := v_ordem + 1;
    INSERT INTO fichas.evidencia (
      ficha_id, ordem, camada, texto, source_id, collected_at, reference_date,
      regra_de_transformacao, confianca, limite_de_inferencia)
    SELECT v_ficha, v_ordem,
           CASE WHEN v_crit ->> 'especie' = 'PROXY' THEN 'INFERENCIA' ELSE 'DADO' END,
           format('%s: %s', v_crit ->> 'rotulo', v_crit ->> 'valor'),
           v_crit ->> 'fonte', c.collected_at, c.reference_date,
           format('Criterio "%s" da tese, campo `%s` do conjunto da fonte, '
                  || 'comparado contra a lista de valores da versao da tese.',
                  v_crit ->> 'chave', v_crit ->> 'campo'),
           CASE WHEN v_crit ->> 'especie' = 'PROXY' THEN 0.5 ELSE 0.95 END,
           CASE WHEN v_crit ->> 'especie' = 'PROXY'
                THEN 'PROXY declarado: o valor e cadastral e nao prova o fato economico.'
                ELSE 'Valor cadastral declarado pela empresa a RFB na data de referencia; '
                     || 'cadastro pode estar desatualizado em relacao a operacao real.' END
      FROM fichas.cacadas ca JOIN jazida.coletas c ON c.id = ca.coleta_id
     WHERE ca.id = v_c.cacada_id;
  END LOOP;

  -- O evento: a camada SINAL, o que fez isto virar noticia.
  v_ordem := v_ordem + 1;
  INSERT INTO fichas.evidencia (
    ficha_id, ordem, camada, texto, source_id, collected_at, reference_date,
    regra_de_transformacao, confianca, limite_de_inferencia)
  SELECT v_ficha, v_ordem, 'SINAL',
         format('Evento "%s" detectado: %s → %s',
                v_evento.tipo, v_evento.antes ->> 'valor', v_evento.depois ->> 'valor'),
         v_evento.source_id, c.collected_at, v_evento.reference_date,
         'Diferenca entre duas coletas completas da mesma fonte, comparadas por '
         || 'hash do payload ingerido e depois campo a campo.',
         0.9,
         'A mudanca e do CADASTRO, na data do lote. Nao se sabe quando ela '
         || 'ocorreu de fato, nem por que a empresa a declarou.'
    FROM jazida.coletas c WHERE c.id = v_evento.coleta_atual_id;

  -- A lacuna tambem e evidencia: o que NAO se pode ver entra na cadeia.
  v_ordem := v_ordem + 1;
  INSERT INTO fichas.evidencia (
    ficha_id, ordem, camada, texto, source_id, collected_at, reference_date,
    regra_de_transformacao, confianca, limite_de_inferencia)
  VALUES (v_ficha, v_ordem, 'INFERENCIA',
    'Consumo livre de energia (CCEE): NAO OBSERVADO — fonte indisponivel.',
    'CCEE-CL', now(), current_date,
    'Nenhuma transformacao: a fonte nao respondeu. Registrado como ausencia '
    || 'declarada, nunca como ausencia de sinal.',
    0.0,
    'A ausencia NAO significa que a empresa nao e consumidora livre. Significa '
    || 'que nao se olhou — porque nao se pode olhar.');

  -- ── MOVIMENTO 3: a ficha argumenta contra si mesma ────────────────────────
  FOR v_regra IN
    SELECT * FROM teses.regras_contra WHERE tese_versao_id = v_c.tese_versao_id
  LOOP
    IF v_regra.quando = 'sempre'
       OR (v_regra.quando = 'porte_e_proxy' AND v_porte IS NOT NULL)
       OR (v_regra.quando = 'fonte_indisponivel' AND EXISTS (
             SELECT 1 FROM fontes.source_registry WHERE status <> 'viva'))
    THEN
      INSERT INTO fichas.por_que_nao_perseguir (ficha_id, codigo, texto)
      VALUES (v_ficha, v_regra.codigo, v_regra.texto);
    END IF;
  END LOOP;

  -- ── MOVIMENTO 2: o adjacente ──────────────────────────────────────────────
  -- A mexerica na promocao: outro estabelecimento do MESMO grupo que tambem
  -- casou com a tese. Carrega prova igual a do principal.
  INSERT INTO fichas.adjacentes (ficha_id, tipo, texto, source_id, collected_at, alvo_id)
  SELECT v_ficha, 'empresa_do_grupo',
         format('O grupo tem %s outro(s) estabelecimento(s) que tambem casam com '
                || 'esta tese. Abordar a matriz pode valer mais que abordar so este.',
                count(*)),
         'RFB-CNPJ', now(), NULL
    FROM fichas.candidatos o
   WHERE o.cnpj_basico = v_c.cnpj_basico AND o.id <> p_candidato
     AND o.tese_versao_id = v_c.tese_versao_id
  HAVING count(*) > 0;

  -- ── GRADE E FRESHNESS, derivados ──────────────────────────────────────────
  -- Grade A exige tres nos independentes de fonte oficial. Com uma fonte fora
  -- do ar, esta tese nao alcanca A — e nao deve alcancar.
  UPDATE fichas.fichas f SET
    grade = CASE
      WHEN (SELECT count(DISTINCT e.source_id) FROM fichas.evidencia e
             WHERE e.ficha_id = v_ficha AND e.confianca >= 0.9) >= 2
       AND NOT EXISTS (SELECT 1 FROM fontes.source_registry WHERE status <> 'viva')
      THEN 'A'
      WHEN (SELECT count(*) FROM fichas.evidencia e
             WHERE e.ficha_id = v_ficha AND e.confianca >= 0.9) >= 3 THEN 'B'
      WHEN (SELECT count(*) FROM fichas.evidencia e
             WHERE e.ficha_id = v_ficha AND e.confianca >= 0.5) >= 2 THEN 'C'
      ELSE 'D' END,
    freshness = (
      SELECT CASE WHEN d <= 30 THEN 'ok' WHEN d <= 45 THEN 'warn'
                  WHEN d <= 90 THEN 'stale' ELSE 'old' END
        FROM (SELECT current_date - c.reference_date AS d
                FROM fichas.cacadas ca JOIN jazida.coletas c ON c.id = ca.coleta_id
               WHERE ca.id = v_c.cacada_id) t)
  WHERE f.id = v_ficha;

  UPDATE fichas.cacadas SET fichas_publicadas = fichas_publicadas + 1
   WHERE id = v_c.cacada_id;

  INSERT INTO uso.ledger (tenant_id, tese_id, metrica, quantidade, custo_centavos)
  VALUES (v_c.tenant_id, (SELECT tese_id FROM teses.versoes WHERE id = v_c.tese_versao_id),
          'ficha_publicada', 1, NULL);

  RETURN v_ficha;
END
$$;

COMMENT ON FUNCTION fichas.publicar(uuid) IS
  'O unico lugar que cria ficha. Recusa candidato sem evento. Grava parcelas e '
  'deixa o total cair por trigger. A ficha nasce `preparada` e espera o humano.';
