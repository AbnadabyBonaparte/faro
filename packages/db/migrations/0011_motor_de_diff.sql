-- ════════════════════════════════════════════════════════════════════════════
-- 0011 · O MOTOR DE DIFF — onde nasce a unidade de valor
--
-- "Encontrei uma MUDANCA, nao uma empresa." O diff e o unico lugar do sistema
-- que tem o direito de criar um evento.
--
-- POR QUE EM SQL E NAO EM TYPESCRIPT: sao dezenas de milhoes de linhas por
-- coleta. Trazer isso para o processo Node para comparar campo a campo seria
-- pagar rede e memoria para fazer, pior, o que o banco faz num JOIN. E, mais
-- importante: com a regra em SQL existe UMA implementacao. Se o TypeScript
-- tivesse a sua copia, um dia as duas discordariam e o cliente veria a
-- discordancia antes de nos.
--
-- O @faro/motor ORQUESTRA (escolhe as coletas, mede, registra); quem compara
-- e esta funcao.
--
-- Canon: MODELO-FARO-V2.md §2, §11 · ORDEM ONDA 2 §3
-- ════════════════════════════════════════════════════════════════════════════

-- ── AS REGRAS SAO DADO ──────────────────────────────────────────────────────
-- Anti-Vies: "campo X mudou => evento Y" e uma LINHA, nao um `if`. Fonte nova
-- ou tese nova entra sem migration e sem deploy.

CREATE TABLE eventos.regras_diff (
  source_id     text NOT NULL REFERENCES fontes.source_registry(source_id),
  conjunto      text NOT NULL,
  -- Chave dentro do payload jsonb do snapshot.
  campo         text NOT NULL,
  tipo_evento   text NOT NULL REFERENCES eventos.tipos(codigo),
  -- Quando a mudanca so vira evento numa direcao (ex.: virar optante do
  -- Simples e um evento; deixar de ser e OUTRO), estes recortam.
  de            text,
  para          text,
  ativo         boolean NOT NULL DEFAULT true,
  PRIMARY KEY (source_id, conjunto, campo, tipo_evento)
);

COMMENT ON TABLE eventos.regras_diff IS
  'Mapeia campo mudado -> tipo de evento. DADO, nao codigo: fonte nova entra '
  'sem migration. `de`/`para` NULL significam "qualquer valor".';

-- Evento de aparecimento/sumico por conjunto (nao e mudanca de campo).
CREATE TABLE eventos.regras_presenca (
  source_id     text NOT NULL REFERENCES fontes.source_registry(source_id),
  conjunto      text NOT NULL,
  tipo_apareceu text REFERENCES eventos.tipos(codigo),
  tipo_sumiu    text REFERENCES eventos.tipos(codigo),
  ativo         boolean NOT NULL DEFAULT true,
  PRIMARY KEY (source_id, conjunto)
);

ALTER TABLE eventos.regras_diff     ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos.regras_diff     FORCE  ROW LEVEL SECURITY;
ALTER TABLE eventos.regras_presenca ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos.regras_presenca FORCE  ROW LEVEL SECURITY;
CREATE POLICY regras_diff_leitura ON eventos.regras_diff
  FOR SELECT TO authenticated USING (true);
CREATE POLICY regras_presenca_leitura ON eventos.regras_presenca
  FOR SELECT TO authenticated USING (true);
REVOKE ALL ON eventos.regras_diff, eventos.regras_presenca FROM PUBLIC, anon;
GRANT SELECT ON eventos.regras_diff, eventos.regras_presenca TO authenticated;

INSERT INTO eventos.regras_diff (source_id, conjunto, campo, tipo_evento, de, para) VALUES
  ('RFB-CNPJ', 'empresas',         'porte',                  'porte_alterado',              NULL, NULL),
  ('RFB-CNPJ', 'estabelecimentos', 'cnae_fiscal_principal',  'cnae_alterado',               NULL, NULL),
  ('RFB-CNPJ', 'estabelecimentos', 'situacao_cadastral',     'situacao_cadastral_alterada', NULL, NULL),
  -- Direcao importa: entrar e sair do Simples sao teses opostas.
  ('RFB-CNPJ', 'simples',          'opcao_pelo_simples',     'entrou_simples',              'N',  'S'),
  ('RFB-CNPJ', 'simples',          'opcao_pelo_simples',     'saiu_simples',                'S',  'N');

INSERT INTO eventos.regras_presenca (source_id, conjunto, tipo_apareceu, tipo_sumiu) VALUES
  ('RFB-CNPJ', 'estabelecimentos', 'estabelecimento_novo', 'saiu_da_fonte'),
  -- Empresas e Simples nao param evento de presenca: aparecer em Empresas ja
  -- aparece em Estabelecimentos, e contar duas vezes seria inflar o numero.
  ('RFB-CNPJ', 'empresas',         NULL,                   NULL),
  ('RFB-CNPJ', 'simples',          NULL,                   NULL),
  ('CCEE-CL',  'consumidores_livres', 'consumidor_livre_novo', 'saiu_da_fonte');

-- ── A EXECUCAO DO DIFF E ELA MESMA UM FATO ──────────────────────────────────
--
-- 🔴 DEFEITO ENCONTRADO PELO TESTE DE INTEGRACAO DA ONDA 2, antes de existir
-- cliente: rodar o diff duas vezes sobre o MESMO par de coletas paria os mesmos
-- eventos de novo. Um retry do batch — a coisa mais banal que existe as 3h da
-- manha — dobraria a noticia na cara do assinante.
--
-- A trava nao pode ser "o motor toma cuidado". Tem que ser do banco: o par de
-- coletas so pode ser diferenciado UMA vez, e a segunda chamada devolve o que
-- a primeira achou, sem inserir nada.

CREATE TABLE eventos.execucoes_diff (
  coleta_anterior_id uuid NOT NULL REFERENCES jazida.coletas(id),
  coleta_atual_id    uuid NOT NULL REFERENCES jazida.coletas(id),
  rodado_em          timestamptz NOT NULL DEFAULT now(),
  duracao_ms         bigint,
  eventos            bigint NOT NULL,
  PRIMARY KEY (coleta_anterior_id, coleta_atual_id)
);

COMMENT ON TABLE eventos.execucoes_diff IS
  'Um par de coletas so se diferencia uma vez. Segunda chamada devolve o mesmo '
  'resultado sem inserir — retry de batch nao pode dobrar a noticia.';

ALTER TABLE eventos.execucoes_diff ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos.execucoes_diff FORCE  ROW LEVEL SECURITY;
REVOKE ALL ON eventos.execucoes_diff FROM PUBLIC, anon, authenticated;
SELECT core.tornar_append_only('eventos', 'execucoes_diff');

-- ── A FUNCAO ────────────────────────────────────────────────────────────────

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
BEGIN
  -- 🔴 So coleta FECHADA COM OK entra no diff. Uma carga interrompida tem
  -- linhas de menos, e diferenciar contra ela pariria `saiu_da_fonte` para
  -- tudo que faltou carregar. Ver jazida.coletas_completas (0010).
  SELECT c.source_id, c.reference_date INTO v_source, v_ref
    FROM jazida.coletas_completas c WHERE c.id = p_coleta_atual;
  IF v_source IS NULL THEN
    RAISE EXCEPTION
      'coleta % nao existe ou nao foi fechada com ok — diff so roda sobre lote inteiro',
      p_coleta_atual;
  END IF;

  -- Sem anterior explicita, a anterior e a coleta imediatamente mais velha da
  -- MESMA fonte. Nunca de outra fonte: diff entre fontes nao e diff, e mistura.
  IF v_anterior IS NULL THEN
    SELECT c.id INTO v_anterior
      FROM jazida.coletas_completas c
     WHERE c.source_id = v_source
       AND c.collected_at <
           (SELECT collected_at FROM jazida.coletas_completas WHERE id = p_coleta_atual)
     ORDER BY c.collected_at DESC
     LIMIT 1;
  END IF;

  -- 🔴 PRIMEIRA COLETA NAO PARE EVENTO.
  -- Sem coleta anterior, TODA linha pareceria "nova" e o motor entregaria 60
  -- milhoes de eventos falsos no primeiro dia. Primeira coleta e linha de base,
  -- nao noticia. Canon §2: evento nasce do diff, nunca de uma leitura so.
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

  -- 🔴 JA RODOU? Devolve o que achou da primeira vez e NAO insere nada.
  -- Nao e otimizacao: e a diferenca entre um retry inofensivo e o assinante
  -- recebendo a mesma noticia duas vezes.
  IF EXISTS (SELECT 1 FROM eventos.execucoes_diff x
              WHERE x.coleta_anterior_id = v_anterior
                AND x.coleta_atual_id = p_coleta_atual) THEN
    RETURN QUERY
      SELECT e.tipo, count(*)::bigint
        FROM eventos.eventos e
       WHERE e.coleta_atual_id = p_coleta_atual
         AND e.coleta_anterior_id = v_anterior
       GROUP BY e.tipo
       ORDER BY e.tipo;
    RETURN;
  END IF;

  -- ── 1. MUDANCA DE CAMPO ───────────────────────────────────────────────────
  -- So entra no LEFT JOIN quem mudou de hash: comparar payload de quem nao
  -- mudou seria pagar caro por nada.
  INSERT INTO eventos.eventos
    (tipo, cnpj, source_id, coleta_anterior_id, coleta_atual_id, reference_date, antes, depois)
  SELECT r.tipo_evento,
         a.chave_natural,
         v_source,
         v_anterior,
         p_coleta_atual,
         v_ref,
         jsonb_build_object('campo', r.campo, 'valor', b.payload -> r.campo),
         jsonb_build_object('campo', r.campo, 'valor', a.payload -> r.campo)
    FROM jazida.snapshots a
    JOIN jazida.snapshots b
      ON b.coleta_id = v_anterior
     AND b.source_id = a.source_id
     AND b.conjunto  = a.conjunto
     AND b.chave_natural = a.chave_natural
    JOIN eventos.regras_diff r
      ON r.source_id = a.source_id
     AND r.conjunto  = a.conjunto
     AND r.ativo
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
     AND NOT EXISTS (
       SELECT 1 FROM jazida.snapshots b
        WHERE b.coleta_id = v_anterior
          AND b.source_id = a.source_id
          AND b.conjunto  = a.conjunto
          AND b.chave_natural = a.chave_natural);

  -- ── 3. SUMIU ──────────────────────────────────────────────────────────────
  -- `depois` e NOT NULL na tabela: aqui o "depois" e a AUSENCIA, e ausencia se
  -- declara, nao se deixa em branco. Gravar NULL faria "sumiu" parecer defeito
  -- de carga.
  INSERT INTO eventos.eventos
    (tipo, cnpj, source_id, coleta_anterior_id, coleta_atual_id, reference_date, antes, depois)
  SELECT p.tipo_sumiu, b.chave_natural, v_source, v_anterior, p_coleta_atual,
         v_ref, b.payload,
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
     AND NOT EXISTS (
       SELECT 1 FROM jazida.snapshots a
        WHERE a.coleta_id = p_coleta_atual
          AND a.source_id = b.source_id
          AND a.conjunto  = b.conjunto
          AND a.chave_natural = b.chave_natural);

  INSERT INTO eventos.execucoes_diff (coleta_anterior_id, coleta_atual_id, eventos)
  SELECT v_anterior, p_coleta_atual, count(*)
    FROM eventos.eventos e
   WHERE e.coleta_atual_id = p_coleta_atual AND e.coleta_anterior_id = v_anterior;

  RETURN QUERY
    SELECT e.tipo, count(*)::bigint
      FROM eventos.eventos e
     WHERE e.coleta_atual_id = p_coleta_atual
       AND e.coleta_anterior_id = v_anterior
     GROUP BY e.tipo
     ORDER BY e.tipo;
END
$$;

COMMENT ON FUNCTION eventos.diferenciar(uuid, uuid) IS
  'O unico lugar que cria evento. Primeira coleta e linha de base e nao pare '
  'nada — sem isso o dia 1 entregaria dezenas de milhoes de falsos positivos.';
