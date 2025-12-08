#!/bin/sh

echo "=========================================="
echo "🔧 BACKEND ENTRYPOINT - DÉBUT"
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
echo "📍 Vérification @nestjs/mapped-types..."
if [ ! -d "node_modules/@nestjs/mapped-types" ]; then
  echo "❌ @nestjs/mapped-types MANQUANT - Installation..."
  npm install @nestjs/mapped-types --legacy-peer-deps --save || npm install @nestjs/mapped-types --legacy-peer-deps --save --force
fi

echo ""
echo "✅ Installation terminée"
echo "🚀 Démarrage: $@"
echo "=========================================="
exec "$@"
