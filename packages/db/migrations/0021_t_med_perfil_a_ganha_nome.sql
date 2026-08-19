-- ════════════════════════════════════════════════════════════════════════════
-- 0021 · O PERFIL A GANHA NOME
--
-- Descoberto rodando a primeira caçada real: o perfil A (recem-chegado) so tem
-- criterios e bonificadores sobre `estabelecimentos`. Como `fichas.cacar` deriva
-- o conjunto AUXILIAR dos conjuntos citados pela tese, uma tese que nao cita
-- `empresas` nunca junta com `empresas` — e `razao_social` mora la.
--
-- Resultado pratico: o candidato do perfil A saía com CNPJ e sem nome. Para um
-- dossie que o dono vai usar para ligar, CNPJ sem razao social nao e alvo, e
-- lista de numero.
--
-- O conserto NAO e um join especial no motor. E um bonificador a mais na tese —
-- `natureza_de_clinica`, o mesmo que o perfil B ja usa — que por ser sobre
-- `empresas` traz a juncao junto. Dado resolvendo o que codigo nao precisava
-- resolver.
-- ════════════════════════════════════════════════════════════════════════════

UPDATE teses.versoes
   SET parametros = jsonb_set(
         parametros,
         '{bonificadores}',
         (parametros -> 'bonificadores') || jsonb_build_array(
           jsonb_build_object(
             'chave', 'natureza_de_clinica',
             'conjunto', 'empresas',
             'rotulo', 'Sociedade simples, LTDA pequena ou empresario individual',
             'campo', 'natureza_juridica',
             'operador', 'em',
             'valores', jsonb_build_array('2135','2062','2232','2240'),
             'peso', 1,
             'fonte', 'RFB-CNPJ',
             'por_que', 'Forma juridica tipica de consultorio. Pontua pouco (peso 1) '
               || 'porque sugere tamanho sem provar — e, de quebra, e o bonificador '
               || 'que faz a caçada cruzar com `empresas` e trazer a razao social.'
           )))
 WHERE id = '00000000-0000-4000-8000-0000000ded02'
   AND NOT (parametros -> 'bonificadores') @> '[{"chave":"natureza_de_clinica"}]'::jsonb;
