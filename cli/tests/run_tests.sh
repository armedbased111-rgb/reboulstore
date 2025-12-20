#!/bin/bash

# Script pour exécuter tous les tests

echo "🧪 Exécution des tests du CLI Python"

# Activer l'environnement virtuel si disponible
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Exécuter les tests unitaires
echo ""
echo "📋 Tests unitaires..."
python3 -m pytest tests/test_code_generation.py -v

# Exécuter les tests d'intégration
echo ""
echo "📋 Tests d'intégration..."
python3 -m pytest tests/test_integration.py -v

# Exécuter avec unittest si pytest n'est pas disponible
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Pytest non disponible, utilisation de unittest..."
    python3 -m unittest discover tests -v
fi

echo ""
echo "✅ Tests terminés"

