#!/bin/bash

# Script de configuration CDN Cloudflare (guide interactif)
# Usage: ./scripts/setup-cdn-cloudflare.sh

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

error() {
    echo -e "${RED}[✗]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo "☁️  Configuration CDN Cloudflare"
echo "================================="
echo ""

info "Ce script te guide pour configurer Cloudflare CDN."
info "Cloudflare fournit :"
info "  • CDN (cache global)"
info "  • WAF (Web Application Firewall)"
info "  • Protection DDoS"
info "  • Analytics"
info ""

warn "⚠️  Prérequis :"
warn "  1. Avoir un compte Cloudflare (gratuit)"
warn "  2. Le domaine doit être enregistré chez un registrar"
warn "  3. Avoir accès aux DNS records du domaine"
echo ""

read -p "Continuer avec le guide ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

echo ""
info "📋 Étapes de configuration Cloudflare :"
echo ""

echo "1. Créer un compte Cloudflare"
info "   → Aller sur https://dash.cloudflare.com/sign-up"
info "   → Créer un compte (gratuit)"
echo ""

echo "2. Ajouter le domaine"
info "   → Dans le dashboard Cloudflare, cliquer 'Add a Site'"
info "   → Entrer : reboulstore.com"
info "   → Choisir le plan 'Free' (gratuit)"
echo ""

echo "3. Configurer les DNS Records"
info "   → Cloudflare détectera automatiquement les records existants"
info "   → Vérifier que ces records pointent vers 152.228.218.35 :"
info "     • A record : reboulstore.com → 152.228.218.35"
info "     • A record : www.reboulstore.com → 152.228.218.35"
info "     • A record : admin.reboulstore.com → 152.228.218.35"
info "   → Si besoin, modifier ou ajouter les records"
echo ""

echo "4. Changer les nameservers"
warn "   ⚠️  IMPORTANT : Cloudflare te donnera 2 nameservers (ex: ns1.cloudflare.com)"
info "   → Aller sur ton registrar (là où tu as acheté le domaine)"
info "   → Remplacer les nameservers actuels par ceux de Cloudflare"
info "   → Attendre propagation (5-30 minutes)"
echo ""

echo "5. Activer les fonctionnalités Cloudflare"
info "   → SSL/TLS : Mode 'Full' ou 'Full (strict)'"
info "   → Proxy status : 'Proxied' (nuage orange) pour tous les A records"
info "   → Auto Minify : Activer (CSS, HTML, JS)"
info "   → Brotli : Activer"
echo ""

echo "6. Configurer WAF (Web Application Firewall)"
info "   → Aller dans Security > WAF"
info "   → Le WAF est activé automatiquement sur le plan Free"
info "   → Configurer les règles selon besoins"
echo ""

echo "7. Configurer Cache Rules (optionnel)"
info "   → Aller dans Rules > Cache Rules"
info "   → Créer des règles pour :"
info "     • Assets statiques : Cache tout (Cache Everything)"
info "     • HTML : Bypass cache (Bypass)"
info "     • API : Bypass cache (Bypass)"
echo ""

success "✅ Guide terminé !"
echo ""
info "📝 Documentation complète : docs/CDN_CONFIGURATION.md"
info ""
warn "⚠️  Une fois les nameservers changés, les DNS seront gérés par Cloudflare"
warn "⚠️  Tous les changements DNS se font maintenant dans Cloudflare, pas Vercel"
