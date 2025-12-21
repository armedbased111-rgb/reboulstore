#!/bin/bash

# Script d'aide pour configurer GA4 CLI

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Configuration GA4 CLI${NC}"
echo ""

# Vérifier si le fichier JSON existe
if [ -f "credentials/ga4-service-account.json" ]; then
    echo -e "${GREEN}✅ Fichier credentials trouvé${NC}"
    
    # Extraire le Project ID depuis le JSON
    PROJECT_ID=$(grep -o '"project_id": "[^"]*' credentials/ga4-service-account.json | cut -d'"' -f4)
    echo -e "${BLUE}   Project ID: ${PROJECT_ID}${NC}"
else
    echo -e "${YELLOW}⚠️  Fichier credentials non trouvé${NC}"
    echo "   Place le fichier JSON téléchargé dans: cli/credentials/ga4-service-account.json"
fi

# Vérifier si les variables d'environnement sont définies
if [ -f ".env.ga4" ]; then
    echo -e "${GREEN}✅ Fichier .env.ga4 trouvé${NC}"
    source .env.ga4
else
    echo -e "${YELLOW}⚠️  Fichier .env.ga4 non trouvé${NC}"
fi

# Afficher la configuration
echo ""
echo -e "${BLUE}📊 Configuration actuelle:${NC}"
echo "   Property ID: ${GA4_PROPERTY_ID:-517129434}"
echo "   Credentials: ${GA4_CREDENTIALS_PATH:-credentials/ga4-service-account.json}"
echo ""

# Si tout est configuré, proposer de tester
if [ -f "credentials/ga4-service-account.json" ] && [ ! -z "$GA4_PROPERTY_ID" ]; then
    echo -e "${GREEN}✅ Configuration complète !${NC}"
    echo ""
    echo "Tester la connexion avec:"
    echo "  python main.py analytics realtime --test"
else
    echo -e "${YELLOW}📋 Étapes restantes:${NC}"
    [ ! -f "credentials/ga4-service-account.json" ] && echo "  1. Placer le fichier JSON dans cli/credentials/"
    [ -z "$GA4_PROPERTY_ID" ] && echo "  2. Créer le fichier .env.ga4 avec GA4_PROPERTY_ID=517129434"
    echo ""
    echo "Voir: docs/GA4_CLI_SETUP_STEPS.md pour les instructions détaillées"
fi
