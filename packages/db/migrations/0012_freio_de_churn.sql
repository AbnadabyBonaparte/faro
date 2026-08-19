-- ════════════════════════════════════════════════════════════════════════════
-- 0012 · O FREIO DE CHURN — o diff se recusa a publicar um absurdo
--
-- 🔴 ESTA MIGRATION EXISTE POR CAUSA DE UM NUMERO OBSERVADO, nao de uma
-- hipotese. Em 19/08/2026, rodando o diff entre `Estabelecimentos1` de
-- 2026-07 e `Estabelecimentos1` de 2026-08 — dois arquivos reais da RFB —
-- o motor pariu:
--
--     estabelecimento_novo   4.256.121
--     saiu_da_fonte          4.256.121
--     cnae_alterado                237
--     situacao_cadastral         1.728
--
-- Os dois primeiros numeros sao IDENTICOS e valem ~90% do arquivo. Nao houve
-- churn nenhum: a RFB reparticiona quais CNPJs caem em qual dos 10 arquivos a
-- cada lote. `Estabelecimentos1` de julho e `Estabelecimentos1` de agosto sao
-- recortes quase disjuntos da MESMA base.
--
-- A licao operacional e dura e vale escrita: **o diff so pode rodar sobre a
-- fonte INTEIRA, nunca sobre um recorte dela.** Um piloto "com amostra pra
-- economizar" teria entregue 4,2 milhoes de "estabelecimento novo" falsos no
-- primeiro dia — e o assinante teria cancelado no segundo.
--
-- Medido: das 4.753.435 chaves de cada recorte, apenas 497.314 (10,5%) estao
-- nos dois. 89,5% do arquivo foi trocado sem nenhuma empresa nascer ou fechar.
--
-- Mas "a gente lembra de carregar tudo" nao e protecao. Protecao e o banco se
-- recusar. Este freio existe para que o erro seja IMPOSSIVEL de publicar, e
-- nao apenas improvavel.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE fontes.source_registry
  ADD COLUMN limite_churn numeric NOT NULL DEFAULT 0.05
    CHECK (limite_churn > 0 AND limite_churn <= 1),
  -- 🔴 PISO. Percentual sobre lote pequeno nao e sinal, e ruido: numa coleta de
  -- 11 linhas, duas novidades ja sao 18%. O freio so tem sentido onde a lei dos
  -- grandes numeros tem — e sem o piso ele reprovaria todo teste e toda fonte
  -- pequena, ate alguem desliga-lo. Freio que atrapalha vira freio desligado.
  ADD COLUMN piso_churn bigint NOT NULL DEFAULT 1000
    CHECK (piso_churn >= 0);

COMMENT ON COLUMN fontes.source_registry.limite_churn IS
  'Fracao maxima do lote que pode aparecer/sumir de uma coleta para a outra '
  'antes de o diff considerar o par suspeito e PARAR. Padrao 5%. E por fonte '
  'porque cadastro de empresa nao vira 20% ao mes, mas um cadastro pequeno e '
  'novo pode mesmo dobrar.';

-- O cadastro de CNPJ do Brasil nao muda 5% em um mes. Se mudou, foi lote
-- incompleto, recorte, ou a RFB mudou de forma — nenhum deles e noticia.
UPDATE fontes.source_registry SET limite_churn = 0.02 WHERE source_id = 'RFB-CNPJ';

CREATE OR REPLACE FUNCTION eventos.diferenciar(
  p_coleta_atual    uuid,
  p_coleta_anterior uuid DEFAULT NULL
)
RETURNS TABLE (tipo text, quantidade bigint)
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_source     text;
  v_ref        date;
  v_anterior   uuid := p_coleta_anterior;
  v_limite     numeric;
  v_base       bigint;
  v_apareceu   bigint;
  v_sumiu      bigint;
  v_piso       bigint;
BEGIN
  SELECT c.source_id, c.reference_date INTO v_source, v_ref
    FROM jazida.coletas_completas c WHERE c.id = p_coleta_atual;
  IF v_source IS NULL THEN
    RAISE EXCEPTION
      'coleta % nao existe ou nao foi fechada com ok — diff so roda sobre lote inteiro',
      p_coleta_atual;
  END IF;

  IF v_anterior IS NULL THEN
    SELECT c.id INTO v_anterior
      FROM jazida.coletas_completas c
     WHERE c.source_id = v_source
       AND c.collected_at <
           (SELECT collected_at FROM jazida.coletas_completas WHERE id = p_coleta_atual)
     ORDER BY c.collected_at DESC
     LIMIT 1;
  END IF;

  -- Primeira coleta e LINHA DE BASE: nao pare nada.
  IF v_anterior IS NULL THEN
    RETURN QUERY SELECT 'linha_de_base'::text, 0::bigint;
    RETURN;
  END IF;

  IF v_anterior = p_coleta_atual THEN
    RAISE EXCEPTION 'diff de uma coleta contra ela mesma nao e diff';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM jazida.coletas_completas WHERE id = v_anterior) THEN
    RAISE EXCEPTION 'coleta anterior % nao foi fechada com ok', v_anterior;
  END IF;

  -- Ja rodou? Devolve o que achou da primeira vez e nao insere nada.
  IF EXISTS (SELECT 1 FROM eventos.execucoes_diff x
              WHERE x.coleta_anterior_id = v_anterior
                AND x.coleta_atual_id = p_coleta_atual) THEN
    RETURN QUERY
      SELECT e.tipo, count(*)::bigint FROM eventos.eventos e
       WHERE e.coleta_atual_id = p_coleta_atual AND e.coleta_anterior_id = v_anterior
       GROUP BY e.tipo ORDER BY e.tipo;
    RETURN;
  END IF;

  -- ══ FREIO DE CHURN ════════════════════════════════════════════════════════
  -- Conta ANTES de inserir. Um diff que ja gravou 4 milhoes de eventos falsos e
  -- um diff que ja falhou: a trilha e append-only e o estrago nao se apaga.
  SELECT count(*) INTO v_base
    FROM jazida.snapshots WHERE coleta_id = p_coleta_atual;

  SELECT count(*) INTO v_apareceu
    FROM jazida.snapshots a
   WHERE a.coleta_id = p_coleta_atual
     AND NOT EXISTS (SELECT 1 FROM jazida.snapshots b
                      WHERE b.coleta_id = v_anterior
                        AND b.source_id = a.source_id
                        AND b.conjunto = a.conjunto
                        AND b.chave_natural = a.chave_natural);

  SELECT count(*) INTO v_sumiu
    FROM jazida.snapshots b
   WHERE b.coleta_id = v_anterior
     AND NOT EXISTS (SELECT 1 FROM jazida.snapshots a
                      WHERE a.coleta_id = p_coleta_atual
                        AND a.source_id = b.source_id
                        AND a.conjunto = b.conjunto
                        AND a.chave_natural = b.chave_natural);

  SELECT r.limite_churn, r.piso_churn INTO v_limite, v_piso
    FROM fontes.source_registry r WHERE r.source_id = v_source;

  IF v_base >= v_piso AND greatest(v_apareceu, v_sumiu)::numeric / v_base > v_limite THEN
    INSERT INTO fontes.saude_coleta (source_id, status_observado, erro)
    VALUES (v_source, 'degradada',
      format('freio de churn: %s apareceram e %s sumiram em %s linhas (limite %s%%). '
             || 'Par de coletas %s -> %s NAO foi diferenciado.',
             v_apareceu, v_sumiu, v_base, round(v_limite * 100, 1),
             v_anterior, p_coleta_atual));

    -- 🔴 POR QUE ISTO NAO E `RAISE EXCEPTION`:
    -- a primeira versao levantava excecao aqui, e a guarda 07 pegou o defeito —
    -- a excecao desfazia o proprio INSERT em `saude_coleta` que acabara de ser
    -- feito. O freio parava o diff e apagava o registro de que parou. Lote
    -- recusado em silencio e lote que ninguem investiga.
    --
    -- Entao o freio RETORNA em vez de explodir. A recusa fica gravada, e o
    -- chamador recebe uma linha `freio_de_churn` no lugar dos eventos. Quem
    -- ignorar o retorno recebe ZERO evento — o modo de falha e nao publicar
    -- nada, nunca publicar lixo. Fail-safe vale mais que fail-loud quando o
    -- barulho custa o registro.
    RETURN QUERY SELECT 'freio_de_churn'::text, greatest(v_apareceu, v_sumiu);
    RETURN;
  END IF;

  -- ── 1. MUDANCA DE CAMPO ───────────────────────────────────────────────────
  INSERT INTO eventos.eventos
    (tipo, cnpj, source_id, coleta_anterior_id, coleta_atual_id, reference_date, antes, depois)
  SELECT r.tipo_evento, a.chave_natural, v_source, v_anterior, p_coleta_atual, v_ref,
         jsonb_build_object('campo', r.campo, 'valor', b.payload -> r.campo),
         jsonb_build_object('campo', r.campo, 'valor', a.payload -> r.campo)
    FROM jazida.snapshots a
    JOIN jazida.snapshots b
      ON b.coleta_id = v_anterior AND b.source_id = a.source_id
     AND b.conjunto  = a.conjunto AND b.chave_natural = a.chave_natural
    JOIN eventos.regras_diff r
      ON r.source_id = a.source_id AND r.conjunto = a.conjunto AND r.ativo
   WHERE a.coleta_id = p_coleta_atual
     AND a.hash IS DISTINCT FROM b.hash
     AND (b.payload -> r.campo) IS DISTINCT FROM (a.payload -> r.campo)
     AND (r.de   IS NULL OR b.payload ->> r.campo = r.de)
     AND (r.para IS NULL OR a.payload ->> r.campo = r.para);

  -- ── 2. APARECEU ───────────────────────────────────────────────────────────
  INSERT INTO eventos.eventos
    (tipo, cnpj, source_id, coleta_anterior_id, coleta_atual_id, reference_date, antes, depois)
  SELECT p.tipo_apareceu, a.chave_natural, v_source, v_anterior, p_coleta_atual,
         v_ref, NULL, a.payload
    FROM jazida.snapshots a
    JOIN eventos.regras_presenca p
      ON p.source_id = a.source_id AND p.conjunto = a.conjunto
     AND p.ativo AND p.tipo_apareceu IS NOT NULL
   WHERE a.coleta_id = p_coleta_atual
     AND NOT EXISTS (SELECT 1 FROM jazida.snapshots b
                      WHERE b.coleta_id = v_anterior AND b.source_id = a.source_id
                        AND b.conjunto = a.conjunto AND b.chave_natural = a.chave_natural);

  -- ── 3. SUMIU ──────────────────────────────────────────────────────────────
  INSERT INTO eventos.eventos
    (tipo, cnpj, source_id, coleta_anterior_id, coleta_atual_id, reference_date, antes, depois)
  SELECT p.tipo_sumiu, b.chave_natural, v_source, v_anterior, p_coleta_atual, v_ref, b.payload,
         jsonb_build_object(
           'ausente', true,
           'limite_de_inferencia',
           'A fonte parou de listar esta chave. NAO significa que a empresa '
           || 'encerrou: pode ser recorte, atraso ou falha de publicacao da fonte.')
    FROM jazida.snapshots b
    JOIN eventos.regras_presenca p
      ON p.source_id = b.source_id AND p.conjunto = b.conjunto
     AND p.ativo AND p.tipo_sumiu IS NOT NULL
   WHERE b.coleta_id = v_anterior
     AND NOT EXISTS (SELECT 1 FROM jazida.snapshots a
                      WHERE a.coleta_id = p_coleta_atual AND a.source_id = b.source_id
                        AND a.conjunto = b.conjunto AND a.chave_natural = b.chave_natural);

  INSERT INTO eventos.execucoes_diff (coleta_anterior_id, coleta_atual_id, eventos)
  SELECT v_anterior, p_coleta_atual, count(*)
    FROM eventos.eventos e
   WHERE e.coleta_atual_id = p_coleta_atual AND e.coleta_anterior_id = v_anterior;

  RETURN QUERY
    SELECT e.tipo, count(*)::bigint FROM eventos.eventos e
     WHERE e.coleta_atual_id = p_coleta_atual AND e.coleta_anterior_id = v_anterior
     GROUP BY e.tipo ORDER BY e.tipo;
END
$$;

COMMENT ON FUNCTION eventos.diferenciar(uuid, uuid) IS
  'O unico lugar que cria evento. Primeira coleta e linha de base. Par ja '
  'diferenciado nao roda de novo. E churn acima do limite da fonte PARA o diff: '
  'um lote que diz que 90% do cadastro do Brasil sumiu esta errado sobre o lote, '
  'nao sobre o Brasil.';
