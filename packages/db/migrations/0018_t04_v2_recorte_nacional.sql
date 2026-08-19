-- ════════════════════════════════════════════════════════════════════════════
-- 0018 · T-04 versao 2 — o recorte que a aritmetica obrigou
--
-- 🔴 A DESCOBERTA MAIS IMPORTANTE DESTA ONDA, e ela e comercial, nao tecnica:
--
-- **A T-04 v0, como parametrizada, produz ZERO fichas.**
--
-- Nao por defeito do motor. O pipeline rodou inteiro, em 7,5 segundos, sobre
-- 4,75 milhoes de estabelecimentos reais. O que ele devolveu foi zero, e o zero
-- esta certo. Os numeros medidos no recorte disponivel (1/10 da base):
--
--     eventos `porte_alterado` no recorte .................... 351
--     estabelecimentos industriais ativos (Brasil) ......... 91.848
--     destes, em MT/GO ...................................... 5.166
--     territorio T-04 v0 (MT/GO + porte 05) .................... 82
--     eventos que caem em industria ativa (Brasil) ............... 1
--     >>> intersecao T-04 v0 × evento ............................ 0
--
-- A conta que importa: 82 alvos no territorio, contra uma taxa de evento de
-- 351 em 4,49 milhoes de empresas (0,0078% ao mes). O valor esperado de fichas
-- e 82 × 0,000078 ≈ **0,006 por mes**. Multiplicando pelos 10 arquivos da base
-- inteira: ~820 alvos e ~3.510 eventos, e o esperado sobe para **~0,06 por
-- mes** — ainda menos de uma ficha por ANO.
--
-- Isto NAO se resolve carregando a base inteira. E aritmetica de duas
-- grandezas pequenas se multiplicando: um territorio estreito (MT/GO) vezes um
-- evento raro (mudanca de porte).
--
-- ── O QUE ISSO SIGNIFICA PARA O PRODUTO ────────────────────────────────────
-- Os caminhos sao tres, e os tres sao decisao do dono, nao do executor:
--   (a) alargar o territorio — MT/GO e o do design partner, e alargar muda a
--       promessa comercial;
--   (b) usar tipos de evento que disparam sobre a industria — `cnae_alterado`
--       e `situacao_cadastral_alterada` sao ~5x mais frequentes E moram no
--       mesmo conjunto que o alvo da tese. Mas eles exigem diff de
--       ESTABELECIMENTOS, que so roda sobre a base inteira (o freio de churn
--       da 0012 recusa recorte, e recusa com razao);
--   (c) aceitar que a T-04 e uma tese de baixa cadencia — o que casa bem com a
--       Escada ("nao vendemos volume, vendemos pontaria") e mal com a franquia
--       de 7 fichas/mes do Pro.
--
-- 🔴 A LEITURA DURA: a franquia de 3/7/15 fichas do MODELO-DE-NEGOCIO §D.0 foi
-- escolhida para a regua de preco descer. Esta e a primeira medicao real de
-- CADENCIA, e ela nao sustenta 7 fichas/mes com uma tese so. Ou o assinante
-- roda varias teses, ou a franquia e outra. O `uso.ledger` agora tem por onde
-- medir isso.
--
-- ── ESTA VERSAO 2 ──────────────────────────────────────────────────────────
-- Versao 2 existe para EXERCITAR O PIPELINE sobre bytes reais e provar que ele
-- pare ficha de verdade. Ela remove o recorte de UF e de porte.
--
-- ⚠️ **NAO E TESE DE VENDA.** Fica `segmentada`, nunca `ativa`: o catalogo
-- comercial continua sendo a v0 (MT/GO), e nenhuma ficha desta v2 deve ser
-- oferecida a ninguem. Ela existe porque a alternativa — nao provar o pipeline
-- ponta a ponta — seria entregar uma onda sem prova.
--
-- Canon: CATALOGO-DE-TESES-DA-CASA.md §T-04 · MODELO-DE-NEGOCIO.md §D.0 · ORDEM ONDA 3 §4
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO teses.versoes
  (id, tese_id, tenant_id, versao, nome, hipotese, parametros, sinais_exigidos,
   estado, motivo_do_estado, verificada_em)
VALUES (
  '00000000-0000-4000-8000-00000004a002',
  '00000000-0000-4000-8000-0000000004aa',
  '00000000-0000-4000-8000-00000000a15a',
  2,
  'T-04 v0 — recorte NACIONAL (demonstracao do pipeline, nao e tese de venda)',

  'Mesma hipotese da versao 1, sem o recorte de UF e sem o recorte de porte. '
  || 'Existe para exercitar o motor sobre dado real e medir cadencia — nao para '
  || 'ser vendida.',

  jsonb_build_object(
    'selo', 'HIPOTESE v0 · RECORTE DE DEMONSTRACAO',
    'conjunto_alvo', 'estabelecimentos',
    'criterios', jsonb_build_array(
      jsonb_build_object(
        'chave', 'cnae_industrial',
        'conjunto', 'estabelecimentos',
        'rotulo', 'CNAE de industria de transformacao',
        'campo', 'cnae_fiscal_principal',
        'operador', 'prefixo_em',
        'valores', jsonb_build_array(
          '10','11','12','13','14','15','16','17','18','19','20','21','22',
          '23','24','25','26','27','28','29','30','31','32','33'),
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
        'chave', 'porte_declarado',
        'conjunto', 'empresas',
        'rotulo', 'Faixa de porte declarada a RFB',
        'campo', 'porte',
        'operador', 'em',
        -- Sem recorte: as tres faixas entram. Continua PROXY.
        'valores', jsonb_build_array('01','03','05'),
        'especie', 'PROXY',
        'base_do_proxy', 'Faixa cadastral declarada pela empresa a RFB.',
        'limite', 'NAO prova regime tributario nem faturamento. Nesta v2 o porte '
          || 'nem sequer filtra — entra so para que a ficha declare o que observou.',
        'fonte', 'RFB-CNPJ'
      )
    ),
    -- As mesmas lacunas da v1. Alargar territorio nao tapa buraco de fonte.
    'criterios_indisponiveis', jsonb_build_array(
      jsonb_build_object(
        'chave', 'consumo_livre_energia',
        'rotulo', 'Consumidor livre de energia (o discriminador da tese)',
        'fonte', 'CCEE-CL',
        'estado', 'INDISPONIVEL',
        'motivo', 'HTTP 403 declarado pela propria CCEE em 19/08/2026.',
        'efeito_na_ficha', 'intensidadeSinal cai e o limite declara a ausencia.'
      ),
      jsonb_build_object(
        'chave', 'sped',
        'rotulo', 'Escrituracao fiscal digital',
        'fonte', null,
        'estado', 'NAO_PUBLICO',
        'motivo', 'Dado da propria empresa, nunca publico.',
        'efeito_na_ficha', 'Entra como "por que nao perseguir".'
      )
    )
  ),

  jsonb_build_array('cnae_industrial','ativa','porte_declarado'),

  -- 🔴 `segmentada`, nunca `ativa`. Caça (a funcao aceita), mas nao e catalogo.
  'segmentada',
  'RECORTE DE DEMONSTRACAO. Existe para provar o pipeline sobre dado real. '
    || 'A tese comercial e a versao 1 (MT/GO). Nenhuma ficha desta versao deve '
    || 'ser oferecida a cliente.',
  now()
)
ON CONFLICT (tese_id, versao) DO NOTHING;

-- Pesos e EV: os mesmos da v1. Recorte diferente nao muda o que a tese vale.
INSERT INTO teses.pesos (tese_versao_id, dimensao, peso)
SELECT '00000000-0000-4000-8000-00000004a002', dimensao, peso
  FROM teses.pesos WHERE tese_versao_id = '00000000-0000-4000-8000-00000004a001';

INSERT INTO teses.ev_parametros
SELECT '00000000-0000-4000-8000-00000004a002',
       bruto, bruto_selo, bruto_origem,
       prob_elegibilidade, prob_elegibilidade_selo,
       prob_homologacao, prob_homologacao_selo,
       ajuste_prazo_caixa, custo_documentacao, honorarios_habilitado,
       observacao || ' (recorte de demonstracao — mesmos parametros da v1)'
  FROM teses.ev_parametros WHERE tese_versao_id = '00000000-0000-4000-8000-00000004a001';

INSERT INTO teses.regras_contra (tese_versao_id, codigo, texto, quando)
SELECT '00000000-0000-4000-8000-00000004a002', codigo, texto, quando
  FROM teses.regras_contra WHERE tese_versao_id = '00000000-0000-4000-8000-00000004a001';

-- Uma razao a mais, so desta versao: o recorte largo e um problema em si.
INSERT INTO teses.regras_contra (tese_versao_id, codigo, texto, quando) VALUES
  ('00000000-0000-4000-8000-00000004a002',
   'precedente_desfavoravel',
   'Esta ficha veio do RECORTE NACIONAL, sem filtro de UF nem de porte. Ela nao '
     || 'respeita o territorio nem o perfil do design partner — foi gerada para '
     || 'provar o motor, nao para ser abordada.',
   'sempre');
