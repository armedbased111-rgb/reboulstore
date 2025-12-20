#!/bin/bash

# Script d'installation du CLI Python

echo "🚀 Installation du CLI Python - Reboul Store"

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi

# Créer un environnement virtuel
echo "📦 Création de l'environnement virtuel..."
python3 -m venv venv

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo "📥 Installation des dépendances..."
pip install -r requirements.txt

# Rendre le CLI exécutable
chmod +x main.py

echo "✅ Installation terminée!"
echo ""
echo "Pour utiliser le CLI:"
echo "  source venv/bin/activate"
echo "  python main.py --help"

