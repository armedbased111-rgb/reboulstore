#!/bin/bash

# Script interactif pour configurer la purge Cloudflare
# Usage: ./scripts/setup-cloudflare.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

section "🌐 Configuration Purge Cache Cloudflare"

info "Ce script va t'aider à configurer la purge automatique du cache Cloudflare."
info "Tu auras besoin de :"
echo "  1. Zone ID (depuis Cloudflare Dashboard)"
echo "  2. API Token (à créer dans Cloudflare)"

echo ""
read -p "As-tu déjà un compte Cloudflare avec reboulstore.com configuré ? (o/n) " HAS_ACCOUNT

if [ "$HAS_ACCOUNT" != "o" ] && [ "$HAS_ACCOUNT" != "O" ]; then
    warn "Tu dois d'abord configurer Cloudflare pour reboulstore.com"
    info "Guide complet : docs/CLOUDFLARE_SETUP_COMPLETE.md"
    info "Une fois Cloudflare configuré, relance ce script"
    exit 0
fi

section "📋 Étape 1 : Récupérer le Zone ID"

info "1. Ouvre https://dash.cloudflare.com dans ton navigateur"
info "2. Sélectionne le domaine 'reboulstore.com'"
info "3. Dans la section 'Overview' (à droite), tu verras 'Zone ID'"
info "4. Copie le Zone ID (ex: abc123def456ghi789)"

echo ""
read -p "Colle ton Zone ID ici : " ZONE_ID

if [ -z "$ZONE_ID" ]; then
    error "Zone ID ne peut pas être vide"
fi

# Vérifier le format (alphanumérique, 32 caractères typiquement)
if ! echo "$ZONE_ID" | grep -qE '^[a-zA-Z0-9]{20,}$'; then
    warn "⚠️  Le Zone ID semble incorrect (format attendu: alphanumérique, ~32 caractères)"
    read -p "Continuer quand même ? (o/n) " CONTINUE
    if [ "$CONTINUE" != "o" ] && [ "$CONTINUE" != "O" ]; then
        exit 0
    fi
fi

section "🔑 Étape 2 : Créer un API Token"

info "1. Dans Cloudflare Dashboard, va dans 'My Profile' → 'API Tokens'"
info "2. Clique sur 'Create Token'"
info "3. Utilise le template 'Edit zone DNS' OU crée un token personnalisé :"
echo ""
echo "   Permissions nécessaires :"
echo "   - Zone → Zone Settings → Read"
echo "   - Zone → Cache Purge → Purge"
echo ""
echo "   Zone Resources :"
echo "   - Include → Specific zone → reboulstore.com"
echo ""
info "4. Clique sur 'Continue to summary' puis 'Create Token'"
info "5. ⚠️  IMPORTANT : Copie le token immédiatement (visible une seule fois !)"

echo ""
read -p "Colle ton API Token ici : " API_TOKEN

if [ -z "$API_TOKEN" ]; then
    error "API Token ne peut pas être vide"
fi

# Vérifier le format (commence souvent par des caractères alphanumériques)
if [ ${#API_TOKEN} -lt 20 ]; then
    warn "⚠️  Le token semble trop court (format attendu: ~40+ caractères)"
    read -p "Continuer quand même ? (o/n) " CONTINUE
    if [ "$CONTINUE" != "o" ] && [ "$CONTINUE" != "O" ]; then
        exit 0
    fi
fi

section "✅ Étape 3 : Tester la configuration"

info "Test de la connexion à l'API Cloudflare..."

# Tester avec curl
RESPONSE=$(curl -s -X GET \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY_RESPONSE=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    if echo "$BODY_RESPONSE" | grep -q '"success":true'; then
        ZONE_NAME=$(echo "$BODY_RESPONSE" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
        info "✅ Connexion réussie ! Zone détectée : $ZONE_NAME"
    else
        ERROR_MSG=$(echo "$BODY_RESPONSE" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "Erreur inconnue")
        error "❌ Échec de la connexion : $ERROR_MSG"
    fi
else
    ERROR_MSG=$(echo "$BODY_RESPONSE" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "Erreur HTTP $HTTP_CODE")
    error "❌ Échec de la connexion (HTTP $HTTP_CODE) : $ERROR_MSG"
fi

section "💾 Étape 4 : Sauvegarder la configuration"

# Déterminer où sauvegarder
ENV_FILE=""
if [ -f ".env.local" ]; then
    ENV_FILE=".env.local"
elif [ -f ".env" ]; then
    ENV_FILE=".env"
else
    ENV_FILE=".env.local"
fi

info "Sauvegarde dans : $ENV_FILE"

# Vérifier si les variables existent déjà
if grep -q "CLOUDFLARE_ZONE_ID" "$ENV_FILE" 2>/dev/null; then
    warn "⚠️  CLOUDFLARE_ZONE_ID existe déjà dans $ENV_FILE"
    read -p "Remplacer ? (o/n) " REPLACE
    if [ "$REPLACE" = "o" ] || [ "$REPLACE" = "O" ]; then
        # Supprimer les anciennes lignes
        sed -i.bak '/^CLOUDFLARE_ZONE_ID=/d' "$ENV_FILE" 2>/dev/null || true
        sed -i.bak '/^CLOUDFLARE_API_TOKEN=/d' "$ENV_FILE" 2>/dev/null || true
        rm -f "${ENV_FILE}.bak" 2>/dev/null || true
    else
        info "Configuration annulée"
        exit 0
    fi
fi

# Ajouter les variables
echo "" >> "$ENV_FILE"
echo "# Cloudflare Configuration (Purge Cache)" >> "$ENV_FILE"
echo "export CLOUDFLARE_ZONE_ID=\"$ZONE_ID\"" >> "$ENV_FILE"
echo "export CLOUDFLARE_API_TOKEN=\"$API_TOKEN\"" >> "$ENV_FILE"

info "✅ Configuration sauvegardée dans $ENV_FILE"

# Charger les variables pour le test
export CLOUDFLARE_ZONE_ID="$ZONE_ID"
export CLOUDFLARE_API_TOKEN="$API_TOKEN"

section "🧪 Étape 5 : Test de purge"

info "Test de purge du cache Cloudflare..."

if ./scripts/cloudflare-purge.sh; then
    info "✅ Purge réussie ! La configuration fonctionne parfaitement"
else
    error "❌ Échec du test de purge. Vérifie les identifiants."
fi

section "🎉 Configuration terminée !"

info "✅ Zone ID : $ZONE_ID"
info "✅ API Token : ${API_TOKEN:0:10}... (masqué)"
info "✅ Configuration sauvegardée dans : $ENV_FILE"
info ""
info "💡 Pour utiliser la purge automatique lors des déploiements :"
info "   source $ENV_FILE  # Charger les variables"
info "   ./scripts/deploy-prod.sh  # La purge se fera automatiquement"
info ""
info "💡 Pour purger manuellement :"
info "   ./scripts/cloudflare-purge.sh"
info ""
warn "⚠️  N'oublie pas de charger les variables avant les déploiements :"
info "   source $ENV_FILE"
info "   # OU ajoute dans ton .bashrc/.zshrc :"
info "   echo 'source $(pwd)/$ENV_FILE' >> ~/.bashrc"

