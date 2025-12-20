#!/bin/bash

# Script de test manuel pour vérifier les commandes du CLI

echo "🧪 Tests manuels du CLI Python"
echo ""

# Activer l'environnement virtuel si disponible
if [ -d "venv" ]; then
    source venv/bin/activate
fi

CLI_PATH="main.py"
BASE_DIR=$(pwd)

# Test 1: Help
echo "📋 Test 1: Commande --help"
python3 $CLI_PATH --help | head -5
echo "✅ Test 1 terminé"
echo ""

# Test 2: Roadmap check
echo "📋 Test 2: Roadmap check"
python3 $CLI_PATH roadmap check
echo "✅ Test 2 terminé"
echo ""

# Test 3: Context generate (sans sauvegarder)
echo "📋 Test 3: Context generate (dry-run)"
python3 $CLI_PATH context generate --output /tmp/test-context.md
if [ -f /tmp/test-context.md ]; then
    echo "✅ Fichier généré:"
    head -10 /tmp/test-context.md
    rm /tmp/test-context.md
fi
echo "✅ Test 3 terminé"
echo ""

# Test 4: Code generate entity (dry-run dans un dossier temporaire)
echo "📋 Test 4: Code generate entity (dry-run)"
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR
mkdir -p backend/src/entities
cd $BASE_DIR

# Simuler la génération (sans créer de fichier réel)
echo "⚠️  Test 4 nécessite une structure backend complète - SKIP"
echo "✅ Test 4 terminé (skipped)"
echo ""

# Test 5: Code generate module --help
echo "📋 Test 5: Code generate module --help"
python3 $CLI_PATH code generate module --help
echo "✅ Test 5 terminé"
echo ""

echo "✅ Tous les tests manuels terminés"

