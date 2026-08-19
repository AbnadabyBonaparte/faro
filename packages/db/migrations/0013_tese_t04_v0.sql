-- ════════════════════════════════════════════════════════════════════════════
-- 0013 · T-04 v0 — A PRIMEIRA TESE REAL DA CASA
--
-- "Insumos e energia no Lucro Real" (CATALOGO-DE-TESES-DA-CASA.md §T-04), a
-- tese-semente do MVP.
--
-- 🟡 TODO PARAMETRO AQUI E **HIPOTESE v0**. Nenhum deles foi validado contra
-- resultado de campo — nem podia ser, porque nao houve campo ainda. O refino
-- sai da leitura conjunta com o design partner, e e decisao do dono no portao.
-- Escrever "v0" no nome nao e modestia: e a promessa de que existe v1.
--
-- 🔴 O DISCRIMINADOR DA TESE ESTA FALTANDO.
-- O catalogo declara quatro fontes para a T-04: SPED · CNAE · processo
-- produtivo · consumo livre de energia (CCEE). Destas, o FARO coleta UMA
-- sozinho — o CNAE. A CCEE esta bloqueada (403 declarado pela propria CCEE em
-- 19/08), e SPED/processo produtivo nao sao publicos: sao o que o operador
-- confere DEPOIS que a ficha aponta o alvo.
--
-- A tese v0 roda assim mesmo, e cada ficha carrega o buraco escrito na linha.
-- Isso e Confidence Policy operando na direcao mais desconfortavel: contra a
-- propria entrega. A alternativa — rodar calado — produziria uma ficha que
-- parece completa e nao e.
--
-- Canon: CATALOGO-DE-TESES-DA-CASA.md §T-04 · MODELO-FARO-V2.md §12 · ORDEM ONDA 3 §1
-- ════════════════════════════════════════════════════════════════════════════

-- ── O TENANT DA CASA ────────────────────────────────────────────────────────
-- O garimpo proprio da ALSHAM. E dele que saem as teses do catalogo, e e por
-- isso que `eh_da_casa` existe desde a 0002: a Lei de Dados trata tese da casa
-- e tese de assinante de formas diferentes.

INSERT INTO core.tenants (id, slug, nome, eh_da_casa)
VALUES ('00000000-0000-4000-8000-00000000a15a', 'alsham', 'ALSHAM — o garimpo da casa', true)
ON CONFLICT (slug) DO NOTHING;

-- ── A TESE ──────────────────────────────────────────────────────────────────

INSERT INTO teses.teses (id, tenant_id, codigo)
VALUES ('00000000-0000-4000-8000-0000000004aa',
        '00000000-0000-4000-8000-00000000a15a', 'T-04')
ON CONFLICT (tenant_id, codigo) DO NOTHING;

-- ── A CERTIDAO — sem ela a versao nao fica `ativa` (trigger da 0007) ────────

INSERT INTO teses.proveniencia
  (tese_id, origem, referencia, autor, nao_derivou_de_tenant_cliente)
VALUES ('00000000-0000-4000-8000-0000000004aa',
        'fonte_publica',
        'CATALOGO-DE-TESES-DA-CASA.md §T-04 — consolidado dos pareceres Gemini §2, '
          || 'Manus §2 e GPT §2.4, sobre o Tema 779/STJ (essencialidade ou relevancia). '
          || 'Parametros observaveis derivados exclusivamente da Base Aberta de CNPJ da RFB.',
        'ALSHAM Global Commerce — catalogo da casa',
        true)
ON CONFLICT (tese_id) DO NOTHING;

-- ── A VERSAO 1 — os parametros como DADO ────────────────────────────────────

INSERT INTO teses.versoes
  (id, tese_id, tenant_id, versao, nome, hipotese, parametros, sinais_exigidos,
   estado, motivo_do_estado, verificada_em)
VALUES (
  '00000000-0000-4000-8000-00000004a001',
  '00000000-0000-4000-8000-0000000004aa',
  '00000000-0000-4000-8000-00000000a15a',
  1,
  'T-04 v0 — Insumos e energia no Lucro Real (MT/GO)',

  'Empresas industriais de porte medio/grande em MT e GO apresentam sinais '
  || 'compativeis com creditos nao cumulativos de PIS/Cofins sobre insumos e '
  || 'energia, nao aproveitados integralmente. HIPOTESE v0: nenhum aproveitamento '
  || 'foi observado — o que se observa e o PERFIL compativel com a tese.',

  -- 🔴 PARAMETROS COMO DADO, nunca como `if` no codigo. Anti-Vies da casa:
  -- refinar a tese na leitura conjunta com o design partner tem que ser UPDATE
  -- de linha (nova versao), nao deploy.
  jsonb_build_object(
    'selo', 'HIPOTESE v0',
    -- O alvo e o ESTABELECIMENTO (CNPJ de 14 digitos). Mas um criterio mora em
    -- outro arquivo da fonte: `porte` esta em `empresas`, chaveado pelo CNPJ
    -- basico de 8 digitos. Por isso cada criterio declara o SEU conjunto — e o
    -- motor junta por `left(chave_estabelecimento, 8) = chave_empresa`.
    'conjunto_alvo', 'estabelecimentos',
    'criterios', jsonb_build_array(
      jsonb_build_object(
        'chave', 'cnae_industrial',
        'conjunto', 'estabelecimentos',
        'rotulo', 'CNAE de industria de transformacao ou consumo intensivo',
        'campo', 'cnae_fiscal_principal',
        'operador', 'prefixo_em',
        -- Divisoes 10..33 da CNAE 2.0 = industria de transformacao.
        -- Seed, nao lista fechada: e dado, e sai por UPDATE de versao.
        'valores', jsonb_build_array(
          '10','11','12','13','14','15','16','17','18','19','20','21','22',
          '23','24','25','26','27','28','29','30','31','32','33'),
        'especie', 'FATO',
        'fonte', 'RFB-CNPJ'
      ),
      jsonb_build_object(
        'chave', 'uf_alvo',
        'conjunto', 'estabelecimentos',
        'rotulo', 'UF do territorio do design partner',
        'campo', 'uf',
        'operador', 'em',
        'valores', jsonb_build_array('MT','GO'),
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
        -- 05 = "demais" na classificacao da RFB. NAO significa Lucro Real.
        'valores', jsonb_build_array('05'),
        -- 🔴 PROXY, e declarado como tal. Porte da RFB nao prova regime.
        'especie', 'PROXY',
        'base_do_proxy', 'Porte "demais" (05) exclui ME e EPP, que sao presumidamente '
          || 'Simples ou Lucro Presumido. Sobra o universo onde o Lucro Real e comum.',
        'limite', 'NAO prova Lucro Real. Empresa de porte 05 pode estar no Lucro '
          || 'Presumido, e nesse caso a tese nao se aplica. So a apuracao confirma.',
        'fonte', 'RFB-CNPJ'
      )
    ),
    -- 🔴 O QUE A TESE PRECISARIA E NAO TEM. Escrito na propria tese, para que
    -- nenhuma ficha nasca sem herdar a lacuna.
    'criterios_indisponiveis', jsonb_build_array(
      jsonb_build_object(
        'chave', 'consumo_livre_energia',
        'rotulo', 'Consumidor livre de energia (o discriminador da tese)',
        'fonte', 'CCEE-CL',
        'estado', 'INDISPONIVEL',
        'motivo', 'HTTP 403 declarado pela propria CCEE em 19/08/2026 — '
          || 'error code 0.aa2b3417.1787140361.93c660e. Desbloqueio e ato administrativo.',
        'efeito_na_ficha', 'A dimensao intensidadeSinal cai, e a linha do limite '
          || 'de inferencia declara a ausencia.'
      ),
      jsonb_build_object(
        'chave', 'sped',
        'rotulo', 'Escrituracao fiscal digital',
        'fonte', null,
        'estado', 'NAO_PUBLICO',
        'motivo', 'SPED e dado da propria empresa. O FARO nunca vai coleta-lo de '
          || 'fonte publica — ele e o que o operador confere DEPOIS da ficha.',
        'efeito_na_ficha', 'Entra como "por que nao perseguir": documentacao '
          || 'provavelmente ausente ate o operador confirmar.'
      )
    )
  ),

  jsonb_build_array('cnae_industrial','uf_alvo','ativa','porte_grande'),

  'ativa',
  'HIPOTESE v0 — parametros nao validados contra resultado de campo. '
    || 'Rodando SEM o discriminador de energia (CCEE bloqueada). '
    || 'Refino previsto na leitura conjunta com o design partner.',
  now()
)
ON CONFLICT (tese_id, versao) DO NOTHING;

-- ── PESOS DO SCORE, POR VERSAO DE TESE ──────────────────────────────────────
-- A Onda 1 deixou `versao_pesos` na ficha mas os pesos viviam so no TypeScript.
-- Tese diferente pondera diferente: numa tese de energia, a intensidade do
-- sinal vale mais que a recencia. Peso e da TESE, entao e dado da tese.

CREATE TABLE teses.pesos (
  tese_versao_id uuid NOT NULL REFERENCES teses.versoes(id) ON DELETE CASCADE,
  dimensao       text NOT NULL CHECK (dimensao IN (
                   'fitEstrutural','evidenciaTese','recencia',
                   'qualidadeFontes','intensidadeSinal','confiancaInferencia')),
  peso           numeric NOT NULL CHECK (peso > 0 AND peso <= 1),
  PRIMARY KEY (tese_versao_id, dimensao)
);

COMMENT ON TABLE teses.pesos IS
  'Pesos por VERSAO de tese. Recalibrar pesos = versao nova, e a ficha antiga '
  'continua apontando para os pesos que a geraram. Sem isso o ground truth mente.';

-- Os seis pesos tem que somar 1: score cuja soma nao fecha nao e media
-- ponderada, e numero solto com aparencia de media.
CREATE OR REPLACE FUNCTION teses.pesos_somam_um(p_versao uuid)
RETURNS boolean LANGUAGE sql STABLE SET search_path = '' AS $$
  SELECT round(coalesce(sum(peso), 0), 6) = 1
    FROM teses.pesos WHERE tese_versao_id = p_versao;
$$;

ALTER TABLE teses.pesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE teses.pesos FORCE  ROW LEVEL SECURITY;
CREATE POLICY pesos_do_tenant ON teses.pesos
  FOR SELECT TO authenticated
  USING (tese_versao_id IN (
    SELECT v.id FROM teses.versoes v WHERE v.tenant_id IN (SELECT core.tenants_do_usuario())));
REVOKE ALL ON teses.pesos FROM PUBLIC, anon;
GRANT SELECT ON teses.pesos TO authenticated;

-- Pesos da T-04 v0: os PESOS_V1 do @faro/core, sem invencao. Quando a CCEE
-- voltar, `intensidadeSinal` provavelmente sobe — e isso sera uma v1.
INSERT INTO teses.pesos (tese_versao_id, dimensao, peso) VALUES
  ('00000000-0000-4000-8000-00000004a001', 'fitEstrutural',       0.25),
  ('00000000-0000-4000-8000-00000004a001', 'evidenciaTese',       0.20),
  ('00000000-0000-4000-8000-00000004a001', 'recencia',            0.15),
  ('00000000-0000-4000-8000-00000004a001', 'qualidadeFontes',     0.15),
  ('00000000-0000-4000-8000-00000004a001', 'intensidadeSinal',    0.15),
  ('00000000-0000-4000-8000-00000004a001', 'confiancaInferencia', 0.10);

-- ── COMPONENTES DO EV, POR VERSAO DE TESE ───────────────────────────────────
-- As faixas vem do catalogo, com o selo do juiz que as produziu. O EV da ficha
-- e calculado destes componentes — nao digitado.

CREATE TABLE teses.ev_parametros (
  tese_versao_id       uuid PRIMARY KEY REFERENCES teses.versoes(id) ON DELETE CASCADE,
  bruto                numeric,
  bruto_selo           text NOT NULL CHECK (bruto_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),
  bruto_origem         text NOT NULL,
  prob_elegibilidade      numeric CHECK (prob_elegibilidade BETWEEN 0 AND 1),
  prob_elegibilidade_selo text NOT NULL CHECK (prob_elegibilidade_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),
  prob_homologacao        numeric CHECK (prob_homologacao BETWEEN 0 AND 1),
  prob_homologacao_selo   text NOT NULL CHECK (prob_homologacao_selo IN ('MEDIDO','ESTIMATIVA','NAO_VERIFICADO')),
  ajuste_prazo_caixa      numeric CHECK (ajuste_prazo_caixa BETWEEN 0 AND 1),
  custo_documentacao      numeric,
  honorarios_habilitado   numeric,
  observacao           text NOT NULL
);

ALTER TABLE teses.ev_parametros ENABLE ROW LEVEL SECURITY;
ALTER TABLE teses.ev_parametros FORCE  ROW LEVEL SECURITY;
CREATE POLICY ev_parametros_do_tenant ON teses.ev_parametros
  FOR SELECT TO authenticated
  USING (tese_versao_id IN (
    SELECT v.id FROM teses.versoes v WHERE v.tenant_id IN (SELECT core.tenants_do_usuario())));
REVOKE ALL ON teses.ev_parametros FROM PUBLIC, anon;
GRANT SELECT ON teses.ev_parametros TO authenticated;

INSERT INTO teses.ev_parametros (
  tese_versao_id, bruto, bruto_selo, bruto_origem,
  prob_elegibilidade, prob_elegibilidade_selo,
  prob_homologacao, prob_homologacao_selo,
  ajuste_prazo_caixa, custo_documentacao, honorarios_habilitado, observacao)
VALUES (
  '00000000-0000-4000-8000-00000004a001',
  -- Piso da faixa mais conservadora do catalogo (Manus e GPT: R$ 200 mil a
  -- 1,5-2,0 milhoes). O piso, nao a media: comecar pelo teto de um benchmark
  -- e o jeito mais rapido de a primeira ficha decepcionar.
  200000, 'ESTIMATIVA',
  'CATALOGO-DE-TESES-DA-CASA.md §T-04 — piso da faixa em empresa-tipo de R$ 100M. '
    || 'A empresa da ficha NAO foi medida: nao ha faturamento publico por CNPJ.',
  -- P(aproveitamento) 25%-65% (Manus) — a mais baixa do catalogo. Piso de novo.
  0.25, 'ESTIMATIVA',
  -- Tema 779/STJ e maturidade alta, mas "a Receita glosa itens cinzentos".
  0.60, 'ESTIMATIVA',
  -- Desconto por tempo ate o caixa: HIPOTESE pura, nao ha base.
  0.70,
  15000,   -- custo de documentacao — HIPOTESE v0
  0,       -- honorarios do habilitado: NAO e receita do FARO e nao se estima aqui
  'TODOS os numeros sao HIPOTESE v0 e usam o PISO das faixas do catalogo. '
    || 'O honorario do habilitado entra ZERO de proposito: o FARO nunca indexa '
    || 'preco a exito e nao estima o bolso do operador. Sera calibrado pelo '
    || 'ground truth da Fase 1 — que ainda nao existe.'
);

-- ── REGRAS DO "POR QUE NAO PERSEGUIR", POR VERSAO ───────────────────────────
-- Movimento 3 da Regra de Pedro vira DADO. Uma ficha que nao argumenta contra
-- si mesma nao publica (guarda 04), entao estas regras nao sao enfeite: sao o
-- que impede a publicacao de virar impossivel ou de virar automatica demais.

CREATE TABLE teses.regras_contra (
  tese_versao_id uuid NOT NULL REFERENCES teses.versoes(id) ON DELETE CASCADE,
  codigo         text NOT NULL CHECK (codigo IN (
                   'documentacao_provavelmente_ausente','periodo_possivelmente_prescrito',
                   'precedente_desfavoravel','fonte_degradada','sinal_isolado',
                   'porte_incompativel_com_custo','capacidade_de_utilizacao_duvidosa')),
  texto          text NOT NULL,
  -- Quando aplicar: `sempre`, ou uma condicao avaliada pelo motor.
  quando         text NOT NULL DEFAULT 'sempre',
  PRIMARY KEY (tese_versao_id, codigo)
);

ALTER TABLE teses.regras_contra ENABLE ROW LEVEL SECURITY;
ALTER TABLE teses.regras_contra FORCE  ROW LEVEL SECURITY;
CREATE POLICY regras_contra_do_tenant ON teses.regras_contra
  FOR SELECT TO authenticated
  USING (tese_versao_id IN (
    SELECT v.id FROM teses.versoes v WHERE v.tenant_id IN (SELECT core.tenants_do_usuario())));
REVOKE ALL ON teses.regras_contra FROM PUBLIC, anon;
GRANT SELECT ON teses.regras_contra TO authenticated;

INSERT INTO teses.regras_contra (tese_versao_id, codigo, texto, quando) VALUES
  ('00000000-0000-4000-8000-00000004a001',
   'sinal_isolado',
   'O discriminador da tese — consumo livre de energia (CCEE) — esta INDISPONIVEL. '
     || 'O que sustenta esta ficha e CNAE + UF + porte, e isso descreve milhares de '
     || 'empresas. Sem o sinal de energia, este alvo nao se distingue dos pares.',
   'sempre'),

  ('00000000-0000-4000-8000-00000004a001',
   'documentacao_provavelmente_ausente',
   'A T-04 depende de SPED e da descricao do processo produtivo para provar '
     || 'essencialidade ou relevancia do insumo (Tema 779/STJ). Nada disso e publico: '
     || 'so a empresa tem. Se ela nao abrir a escrituracao, a tese nao avanca.',
   'sempre'),

  ('00000000-0000-4000-8000-00000004a001',
   'porte_incompativel_com_custo',
   'O porte veio de PROXY (faixa da RFB), nao de faturamento observado. Se a '
     || 'empresa for menor do que o proxy sugere, o custo do trabalho tributario '
     || 'come o credito e a caçada da prejuizo aos dois lados.',
   'porte_e_proxy'),

  ('00000000-0000-4000-8000-00000004a001',
   'capacidade_de_utilizacao_duvidosa',
   'Credito reconhecido nao e caixa. Empresa sem debito federal suficiente para '
     || 'compensar fica com credito parado — a quinta camada (CAIXA) nao se atinge, '
     || 'e o EV liquido real vira uma fracao do estimado.',
   'sempre'),

  ('00000000-0000-4000-8000-00000004a001',
   'fonte_degradada',
   'A fonte de energia esta com status `indisponivel` no registry desde 19/08. '
     || 'Enquanto estiver, toda ficha desta tese nasce com Evidence Grade rebaixado.',
   'fonte_indisponivel');

COMMENT ON TABLE teses.regras_contra IS
  'O "por que nao perseguir" como DADO da tese. Argumentar contra si mesmo nao '
  'pode depender de o programador lembrar: e linha de tabela, e a guarda cobra.';
