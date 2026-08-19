#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
# TESTE DA GUARDA DE ESCOPO — prova que o ajuste não abriu buraco.
#
# A ordem COMERCIAL liberou `apps/maquete` em branches de maquete. Toda vez que
# uma guarda ganha exceção, a pergunta certa é: **ela ainda reprova o que
# reprovava antes?** Este teste responde com repositório de verdade, commits de
# verdade, e a guarda rodando de verdade.
#
# Quatro casos, dois de cada lado:
#   1. branch de Onda tocando a maquete          → tem que REPROVAR
#   2. branch de Onda sem tocar a maquete        → tem que PASSAR
#   3. branch comercial tocando a maquete        → tem que PASSAR (a exceção)
#   4. branch comercial tocando o motor          → tem que REPROVAR (o freio)
#
# Sem o caso 4, a exceção seria só um afrouxamento com nome bonito.
#
# E um quinto, que documenta um limite assumido: branch comercial PODE mexer na
# própria guarda. Não é descuido — está explicado no cabeçalho de
# `guarda-escopo.sh`. Guarda não guarda a si mesma; quem guarda é o portão.
# ════════════════════════════════════════════════════════════════════════════

set -uo pipefail

GUARDA="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/guarda-escopo.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

falhou=0

# ── um repositório de brinquedo, com a mesma forma do de verdade ────────────
cd "$TMP"
git init -q .
git config user.email teste@faro.local
git config user.name "teste da guarda"
mkdir -p apps/maquete/src services/motor/src docs/canon
echo "referencia visual" > apps/maquete/src/page.tsx
echo "motor"             > services/motor/src/index.ts
echo "canon"             > docs/canon/MODELO.md
git add -A
git commit -qm base
BASE="$(git rev-parse HEAD)"

# Cada caso parte da mesma base e é desfeito depois — a ordem dos casos não
# pode virar dependência invisível (lição da Onda 2 com as guardas 03 e 04).
caso() {
  local nome="$1" branch="$2" esperado="$3"; shift 3
  git reset -q --hard "$BASE"
  "$@"
  git add -A && git commit -qm "$nome" >/dev/null

  local saida obtido
  saida="$("$GUARDA" "$BASE" "$branch" 2>&1)" && obtido=passou || obtido=reprovou

  if [ "$obtido" = "$esperado" ]; then
    printf '  \033[32m✓\033[0m %-52s %s\n' "$nome" "$obtido"
  else
    printf '  \033[31m✗\033[0m %-52s esperado %s, obtido %s\n' \
      "$nome" "$esperado" "$obtido"
    echo "$saida" | sed 's/^/      /'
    falhou=1
  fi
}

echo "▸ guarda de escopo por branch"

caso "Onda tocando a maquete" \
     "faro/onda-3-caca" reprovou \
     bash -c 'echo mexido >> apps/maquete/src/page.tsx'

caso "Onda mexendo só no motor" \
     "faro/onda-3-caca" passou \
     bash -c 'echo mexido >> services/motor/src/index.ts'

caso "comercial tocando a maquete (a exceção declarada)" \
     "faro/comercial-escada-e-ritual" passou \
     bash -c 'echo mexido >> apps/maquete/src/page.tsx; echo x >> docs/canon/MODELO.md'

caso "comercial tocando o MOTOR (o freio da exceção)" \
     "faro/comercial-escada-e-ritual" reprovou \
     bash -c 'echo mexido >> services/motor/src/index.ts'

# Branch sem classificação cai no lado seguro: protege a maquete.
caso "branch não classificada tocando a maquete" \
     "experimento-qualquer" reprovou \
     bash -c 'echo mexido >> apps/maquete/src/page.tsx'

caso "visual tocando a maquete (ORDEM VISUAL, 19/08)" \
     "faro/visual-abissal" passou \
     bash -c 'echo mexido >> apps/maquete/src/page.tsx'

caso "visual tocando o MOTOR (o mesmo freio dos irmãos)" \
     "faro/visual-abissal" reprovou \
     bash -c 'echo mexido >> services/motor/src/index.ts'

# Limite ASSUMIDO, não esquecido: a guarda não se protege. Ver o cabeçalho de
# guarda-escopo.sh — a proteção de `tools/` e `.github/` é o portão do dono.
caso "comercial mexendo na própria guarda (limite assumido)" \
     "faro/comercial-escada-e-ritual" passou \
     bash -c 'mkdir -p tools && echo mexido >> tools/guarda-escopo.sh'

if [ "$falhou" -ne 0 ]; then
  echo
  echo "✗ GUARDA DE ESCOPO REPROVADA — o ajuste abriu buraco"
  exit 1
fi
echo "✓ a guarda reprova o que deve, dos dois lados"
