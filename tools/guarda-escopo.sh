#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
# GUARDA DE ESCOPO POR BRANCH
#
# A guarda "maquete intocada" nasceu na Onda 1 com uma regra absoluta: nada
# toca `apps/maquete`. Isso protegia a referência visual enquanto o motor era
# erguido — e funcionou.
#
# 🔴 AJUSTE DECLARADO (ordem COMERCIAL, 19/08/2026):
# a ordem da Escada e do Ritual é uma ordem DE maquete. A regra absoluta a
# reprovaria por fazer exatamente o que foi mandada fazer.
#
# A lição da casa é que **guarda se ajusta declarando, nunca se enfraquece em
# silêncio**. Então a guarda não foi afrouxada: ela ficou MAIS específica, e
# passou a valer nos dois sentidos.
#
#   branch `faro/onda-*`        → NÃO pode tocar apps/maquete
#   branch `faro/comercial-*`   → PODE tocar apps/maquete, e NÃO pode tocar
#   branch `faro/maquete-*`         o motor (services/ e packages/)
#   branch `faro/visual-*`
#   qualquer outra              → trata como Onda (protege a maquete)
#
# `faro/visual-*` entrou em 19/08/2026 pela ORDEM VISUAL, que manda produzir a
# pele do produto — hero, OG, favicon, fundos — e portanto mexe na maquete por
# definição. Mesma regra dos irmãos: libera a maquete, tranca o motor.
#
# `faro/tempo-de-cozinha` entrou em 19/08/2026 pela missão do mesmo nome, que
# escreve o SLA da Caçada no canon E na maquete. É nome literal, não padrão, de
# propósito: ordem de escopo declarado entra pelo nome exato e sai quando
# mergeia. Padrão novo só se a casa passar a ter uma FAMÍLIA de branches assim —
# senão o curinga vira porta aberta para tudo.
#
# O segundo sentido é o que impede o ajuste de virar buraco: antes, uma branch
# de maquete não podia mexer em nada da maquete; agora ela pode, mas em troca
# não pode mexer no motor. O total de coisas que uma branch pode tocar sem
# ordem não aumentou.
#
# ⚠️ O QUE ESTA GUARDA NÃO PROTEGE, E POR QUÊ:
# `.github/` e `tools/` — isto é, ela mesma e a esteira que a roda.
#
# A primeira versão os incluía, e reprovou o próprio PR que a criou: a ordem
# mandava ajustar a guarda, e ajustar a guarda é mexer em `tools/`. Dava para
# abrir uma exceção para os arquivos da própria guarda, mas isso seria teatro:
# quem pode editar a branch pode editar a guarda, e uma guarda que se declara
# imexível só dá conforto falso a quem lê o YAML sem ler o diff.
#
# A proteção real de `.github/` e `tools/` é o **portão**: o dono vê o diff
# antes do merge, e mudança de guarda aparece nele em letra garrafal. Guarda
# nenhuma substitui isso, e é melhor dizer do que fingir.
#
# Uso:  tools/guarda-escopo.sh <base-sha> <nome-da-branch>
# ════════════════════════════════════════════════════════════════════════════

set -euo pipefail

BASE="${1:-}"
BRANCH="${2:-}"

if [ -z "$BASE" ]; then
  echo "sem base de comparação — checagem pulada"
  exit 0
fi

tocou() { git diff --name-only "$BASE" HEAD -- "$@" | grep -q .; }
listar() { git diff --name-only "$BASE" HEAD -- "$@"; }

case "$BRANCH" in
  faro/comercial-* | faro/maquete-* | faro/visual-* | faro/tempo-de-cozinha)
    echo "▸ branch de produto/comercial: \`$BRANCH\`"
    echo "  apps/maquete LIBERADA (exceção declarada — ver cabeçalho deste arquivo)"
    echo "  o motor fica PROTEGIDO nesta branch"

    if tocou services packages; then
      echo "✗ branch comercial/maquete tocou o MOTOR:"
      listar services packages | sed 's/^/    /'
      echo
      echo "  A exceção liberou a maquete, não o motor. Mudança de motor entra"
      echo "  por branch de Onda, com a ordem que a autoriza."
      exit 1
    fi
    echo "✓ motor intocado"
    ;;

  *)
    echo "▸ branch de Onda (ou não classificada): \`$BRANCH\`"
    echo "  apps/maquete PROTEGIDA"

    if tocou apps/maquete; then
      echo "✗ apps/maquete foi tocada numa branch que não é de maquete:"
      listar apps/maquete | sed 's/^/    /'
      echo
      echo "  A maquete é a referência visual e fica intocada até a ordem que a"
      echo "  substituir. Se esta mudança for legítima, ela pertence a uma"
      echo "  branch \`faro/comercial-*\` ou \`faro/maquete-*\`."
      exit 1
    fi
    echo "✓ apps/maquete intocada"
    ;;
esac
