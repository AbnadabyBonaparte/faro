-- ════════════════════════════════════════════════════════════════════════════
-- GUARDA 06 · O REGISTRY NAO PODE PROMETER O QUE NAO TEM
--
-- "Toda fonte e provada viva ANTES de ser prometida" e uma lei bonita que so
-- vale se algo a cobrar. Esta guarda cobra:
--
--   1. fonte sem particao propria na jazida
--   2. fonte sem fallback declarado
--   3. fonte `viva` sem nenhuma observacao de saude — "viva" por afirmacao
--   4. fonte `viva` sem layout vigente para os conjuntos que o diff usa
--   5. regra de diff apontando para conjunto sem layout
--   6. regra de diff apontando para campo que o layout nao tem
--   7. tipo de evento citado por regra e ausente do catalogo
--   8. fonte normativa sem versao vigente
-- ════════════════════════════════════════════════════════════════════════════

\set ON_ERROR_STOP on

-- ── 1. PARTICAO ─────────────────────────────────────────────────────────────
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(r.source_id, ', ') INTO faltando
    FROM fontes.source_registry r
   WHERE NOT EXISTS (
     SELECT 1
       FROM pg_class p
       JOIN pg_inherits i ON i.inhrelid = p.oid
       JOIN pg_class mae ON mae.oid = i.inhparent
       JOIN pg_namespace n ON n.oid = mae.relnamespace
      WHERE n.nspname = 'jazida' AND mae.relname = 'snapshots'
        AND pg_get_expr(p.relpartbound, p.oid) LIKE '%' || r.source_id || '%');
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: fonte sem particao propria na jazida: %. '
      'A 0005 declarou que cada fonte cria sua particao na migration que a registra.',
      faltando;
  END IF;
END $$;

-- ── 2. FALLBACK ─────────────────────────────────────────────────────────────
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(source_id, ', ') INTO faltando
    FROM fontes.source_registry
   WHERE fallback_declarado IS NULL OR btrim(fallback_declarado) = '';
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: fonte sem fallback declarado: %. '
      'O que o produto faz quando a fonte cai se declara ANTES de ela cair.', faltando;
  END IF;
END $$;

-- ── 3. "VIVA" PRECISA DE OBSERVACAO ─────────────────────────────────────────
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(r.source_id, ', ') INTO faltando
    FROM fontes.source_registry r
   WHERE r.status = 'viva'
     AND NOT EXISTS (SELECT 1 FROM fontes.saude_coleta s
                      WHERE s.source_id = r.source_id AND s.status_observado = 'viva');
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: fonte marcada `viva` sem nenhuma observacao de saude: %. '
      'Viva por afirmacao e exatamente o que a Lei 7 proibe.', faltando;
  END IF;
END $$;

-- ── 4. LAYOUT PARA CADA CONJUNTO QUE O DIFF USA ─────────────────────────────
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(DISTINCT x.source_id || '/' || x.conjunto, ', ') INTO faltando
    FROM (
      SELECT source_id, conjunto FROM eventos.regras_diff WHERE ativo
      UNION
      SELECT source_id, conjunto FROM eventos.regras_presenca
       WHERE ativo AND (tipo_apareceu IS NOT NULL OR tipo_sumiu IS NOT NULL)
    ) x
    JOIN fontes.source_registry r ON r.source_id = x.source_id AND r.status = 'viva'
   WHERE NOT EXISTS (
     SELECT 1 FROM fontes.layouts l
      WHERE l.source_id = x.source_id AND l.conjunto = x.conjunto AND l.vigente);
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: regra de diff sem layout vigente: %. '
      'Ingerir sem layout declarado e confiar na sorte.', faltando;
  END IF;
END $$;

-- ── 5. CAMPO DA REGRA EXISTE NO LAYOUT ──────────────────────────────────────
-- Este e o defeito mais silencioso da lista: uma regra que aponta para um campo
-- inexistente nunca da erro. Ela so nunca dispara — e o produto passa meses
-- prometendo um evento que nao nasce nunca.
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(d.source_id || '/' || d.conjunto || '.' || d.campo, ', ') INTO faltando
    FROM eventos.regras_diff d
    JOIN fontes.layouts l
      ON l.source_id = d.source_id AND l.conjunto = d.conjunto AND l.vigente
   WHERE d.ativo AND NOT (d.campo = ANY (l.colunas));
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: regra aponta para campo que o layout nao tem: %. '
      'Regra assim nao da erro — ela so nunca dispara, e o evento prometido nunca nasce.',
      faltando;
  END IF;
END $$;

-- ── 6. CAMPO DA REGRA ESTA ENTRE OS INGERIDOS ───────────────────────────────
-- Variante do anterior: o campo existe no layout mas o motor nao o guarda no
-- payload. O JOIN acha a coluna, o payload nao tem a chave, e o evento tambem
-- nunca nasce. A lista de ingeridos vive no TypeScript (fontes/index.ts), entao
-- aqui a guarda confere contra o que efetivamente foi para a jazida.
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(DISTINCT d.source_id || '/' || d.conjunto || '.' || d.campo, ', ')
    INTO faltando
    FROM eventos.regras_diff d
   WHERE d.ativo
     AND EXISTS (SELECT 1 FROM jazida.snapshots s
                  WHERE s.source_id = d.source_id AND s.conjunto = d.conjunto)
     AND NOT EXISTS (
       SELECT 1 FROM jazida.snapshots s
        WHERE s.source_id = d.source_id AND s.conjunto = d.conjunto
          AND s.payload ? d.campo
        LIMIT 1);
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: campo da regra nao esta no payload ingerido: %. '
      'O motor nao guarda esse campo, entao o evento nunca nasceria.', faltando;
  END IF;
END $$;

-- ── 7. TIPO DE EVENTO CITADO EXISTE ─────────────────────────────────────────
-- As FKs ja garantem isto no INSERT. A guarda cobre o caso de o tipo ter sido
-- desativado depois, deixando a regra viva e o evento impossivel.
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(DISTINCT t.codigo, ', ') INTO faltando
    FROM eventos.tipos t
   WHERE NOT t.ativo
     AND (EXISTS (SELECT 1 FROM eventos.regras_diff d WHERE d.ativo AND d.tipo_evento = t.codigo)
       OR EXISTS (SELECT 1 FROM eventos.regras_presenca p
                   WHERE p.ativo AND t.codigo IN (p.tipo_apareceu, p.tipo_sumiu)));
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: regra ativa aponta para tipo de evento DESATIVADO: %', faltando;
  END IF;
END $$;

-- ── 8. FONTE NORMATIVA DECLARA VERSAO ───────────────────────────────────────
DO $$
DECLARE faltando text;
BEGIN
  SELECT string_agg(source_id, ', ') INTO faltando
    FROM fontes.source_registry
   WHERE eh_normativa AND (versao_vigente IS NULL OR versao_verificada_em IS NULL);
  IF faltando IS NOT NULL THEN
    RAISE EXCEPTION 'GUARDA 06: fonte normativa sem versao vigente verificada: %. '
      'O Relogio da Reforma le a norma VIGENTE, nunca a decorada.', faltando;
  END IF;
END $$;

-- ── RETRATO ─────────────────────────────────────────────────────────────────
SELECT r.source_id,
       r.status,
       (SELECT count(*) FROM fontes.layouts l
         WHERE l.source_id = r.source_id AND l.vigente)            AS layouts,
       (SELECT count(*) FROM fontes.layouts l
         WHERE l.source_id = r.source_id AND l.conferido_em IS NOT NULL) AS conferidos,
       (SELECT count(*) FROM eventos.regras_diff d
         WHERE d.source_id = r.source_id AND d.ativo)              AS regras,
       (SELECT count(*) FROM fontes.saude_coleta s
         WHERE s.source_id = r.source_id)                          AS observacoes
  FROM fontes.source_registry r
 ORDER BY r.source_id;
