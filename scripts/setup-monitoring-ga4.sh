#!/bin/bash

# Script de configuration Google Analytics 4 (guide)
# Usage: ./scripts/setup-monitoring-ga4.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo "📊 Configuration Google Analytics 4"
echo "===================================="
echo ""

info "Ce script te guide pour configurer Google Analytics 4."
info "GA4 permet de :"
info "  • Suivre les visiteurs"
info "  • Analyser le comportement"
info "  • Mesurer les conversions"
info ""

read -p "Continuer avec le guide ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

echo ""
info "📋 Étapes de configuration GA4 :"
echo ""

echo "1. Créer un compte Google Analytics"
info "   → Aller sur https://analytics.google.com"
info "   → Se connecter avec un compte Google"
info "   → Cliquer 'Start measuring'"
echo ""

echo "2. Créer une propriété"
info "   → Nom de la propriété : 'Reboul Store'"
info "   → Fuseau horaire : Europe/Paris"
info "   → Devise : EUR"
echo ""

echo "3. Créer un flux de données Web"
info "   → Type : Web"
info "   → URL du site web : https://www.reboulstore.com"
info "   → Nom du flux : 'Reboul Store Production'"
info "   → Copier la 'Measurement ID' (format : G-XXXXXXXXXX)"
echo ""

echo "4. Ajouter le code GA4 dans le frontend"
warn "   ⚠️  Il faut ajouter le script GA4 dans les fichiers frontend :"
info ""
info "   Pour Reboul Store (frontend/) :"
info "   → Ajouter dans index.html ou via un composant React"
info "   → Code à ajouter :"
echo ""
echo '   <!-- Google tag (gtag.js) -->'
echo '   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>'
echo '   <script>'
echo '     window.dataLayer = window.dataLayer || [];'
echo '     function gtag(){dataLayer.push(arguments);}'
echo '     gtag("js", new Date());'
echo '     gtag("config", "G-XXXXXXXXXX");'
echo '   </script>'
echo ""

info "   Pour Admin Central (admin-central/frontend/) :"
info "   → Même procédure"
info "   → Utiliser la même Measurement ID ou créer une propriété séparée"
echo ""

echo "5. Vérifier l'installation"
info "   → Installer l'extension Chrome 'Google Analytics Debugger'"
info "   → Visiter le site"
info "   → Vérifier dans GA4 > Realtime que les événements arrivent"
echo ""

success "✅ Guide terminé !"
echo ""
info "📝 Documentation complète : docs/ADMIN_CENTRAL_MONITORING.md"
warn "⚠️  Ne pas oublier de remplacer G-XXXXXXXXXX par ta vraie Measurement ID"
