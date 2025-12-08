#!/bin/sh

echo "=========================================="
echo "🔧 FRONTEND ENTRYPOINT - DÉBUT"
echo "=========================================="
echo "📍 Répertoire: $(pwd)"
echo "📍 node_modules existe: $([ -d node_modules ] && echo 'OUI' || echo 'NON')"
echo ""

echo "📦 Installation des dépendances..."
npm install --legacy-peer-deps || {
  echo "❌ Erreur npm install, nouvelle tentative..."
  npm install --legacy-peer-deps --force
}

echo ""
echo "📍 Vérification @tailwindcss/postcss..."
if [ ! -d "node_modules/@tailwindcss/postcss" ]; then
  echo "❌ @tailwindcss/postcss MANQUANT - Installation..."
  npm install @tailwindcss/postcss --legacy-peer-deps --save-dev || npm install @tailwindcss/postcss --legacy-peer-deps --save-dev --force
fi

echo ""
echo "✅ Installation terminée"
echo "🚀 Démarrage: $@"
echo "=========================================="
exec "$@"
