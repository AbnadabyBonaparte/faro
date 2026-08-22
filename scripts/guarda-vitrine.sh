#!/usr/bin/env bash
# Guarda de vitrine — censo 22/08/2026.
# public/ é servido ao mundo inteiro. Documento interno, material comercial,
# proposta a cliente e credencial NUNCA moram aqui.
# Nasceu de dois achados reais: proposta comercial a município nominalmente
# identificado e relatório interno de cliente, ambos servindo 200 em produção.
set -uo pipefail

PADROES='\.(md|pdf|docx|xlsx|csv|sql|env)$'
# index.html e afins são a aplicação; .html solto em public/ costuma ser doc interno.
# Falsos positivos conhecidos, cada um com o motivo:
#  · ^apps/public/   -> em monorepo, "public" as vezes e o NOME DE UM APP, nao a
#                       pasta de assets servida. Nao e vitrine.
#  · .bonaparte-seed -> placeholders binarios minimos (MIT) que um script de seed
#                       consome; 130 bytes, zero conteudo.
#  · manifest/robots/sitemap/i18n/index.html -> sao a propria aplicacao.
IGNORAR='(^apps/public/|\.bonaparte-seed/|manifest|site\.webmanifest|robots|sitemap|browserconfig|locales?/|i18n/|messages/|\.well-known|/index\.html$)'

achados=$(git -c core.quotepath=false ls-files \
  | grep -iE '(^|/)public/' \
  | grep -iE "$PADROES" \
  | grep -viE "$IGNORAR" || true)

if [ -n "$achados" ]; then
  echo "❌ GUARDA DE VITRINE: documento interno dentro de public/"
  echo "   public/ vai ao ar. Mova para docs/ ou remova."
  echo "$achados" | sed 's/^/   · /'
  exit 1
fi
echo "✅ guarda de vitrine: nenhum documento interno em public/"
