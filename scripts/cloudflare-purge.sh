#!/bin/bash

# Script pour purger le cache Cloudflare
# Usage: ./scripts/cloudflare-purge.sh [--zone ZONE_ID] [--token TOKEN]
#
# Variables d'environnement:
#   CLOUDFLARE_API_TOKEN    Token API Cloudflare (obligatoire)
#   CLOUDFLARE_ZONE_ID      Zone ID Cloudflare (obligatoire)
#   CLOUDFLARE_EMAIL        Email Cloudflare (optionnel, pour API key)

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Variables
ZONE_ID="${CLOUDFLARE_ZONE_ID}"
API_TOKEN="${CLOUDFLARE_API_TOKEN}"
API_EMAIL="${CLOUDFLARE_EMAIL}"
API_KEY="${CLOUDFLARE_API_KEY}"
PURGE_EVERYTHING=true
FILES=""

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --zone)
            ZONE_ID="$2"
            shift 2
            ;;
        --token)
            API_TOKEN="$2"
            shift 2
            ;;
        --email)
            API_EMAIL="$2"
            shift 2
            ;;
        --key)
            API_KEY="$2"
            shift 2
            ;;
        --files)
            PURGE_EVERYTHING=false
            shift
            # Lire les fichiers depuis stdin ou arguments
            while [[ $# -gt 0 ]] && [[ ! "$1" =~ ^-- ]]; do
                FILES="$FILES $1"
                shift
            done
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --zone ZONE_ID      Zone ID Cloudflare"
            echo "  --token TOKEN       Token API Cloudflare"
            echo "  --email EMAIL       Email Cloudflare (pour API key)"
            echo "  --key KEY           API Key Cloudflare (pour API key)"
            echo "  --files FILE1 ...  Purger des fichiers spécifiques (au lieu de tout)"
            echo ""
            echo "Variables d'environnement:"
            echo "  CLOUDFLARE_ZONE_ID      Zone ID Cloudflare"
            echo "  CLOUDFLARE_API_TOKEN   Token API Cloudflare (recommandé)"
            echo "  CLOUDFLARE_EMAIL       Email Cloudflare (pour API key)"
            echo "  CLOUDFLARE_API_KEY     API Key Cloudflare (pour API key)"
            exit 0
            ;;
        *)
            error "Option inconnue: $1. Utilisez --help pour voir les options"
            ;;
    esac
done

# Vérifier que les variables nécessaires sont définies
if [ -z "$ZONE_ID" ]; then
    error "CLOUDFLARE_ZONE_ID n'est pas défini. Utilisez --zone ou définissez CLOUDFLARE_ZONE_ID"
fi

# Vérifier qu'on a soit un token, soit email+key
if [ -z "$API_TOKEN" ] && [ -z "$API_KEY" ]; then
    error "CLOUDFLARE_API_TOKEN ou CLOUDFLARE_API_KEY n'est pas défini"
fi

if [ -n "$API_KEY" ] && [ -z "$API_EMAIL" ]; then
    error "CLOUDFLARE_EMAIL est requis si CLOUDFLARE_API_KEY est utilisé"
fi

section "🌐 Purge Cache Cloudflare"

info "Zone ID: $ZONE_ID"

# Construire la commande curl
if [ -n "$API_TOKEN" ]; then
    # Utiliser API Token (recommandé)
    info "Méthode: API Token"
    AUTH_HEADER="Authorization: Bearer $API_TOKEN"
else
    # Utiliser API Key + Email (ancienne méthode)
    info "Méthode: API Key + Email"
    AUTH_HEADER="X-Auth-Email: $API_EMAIL"
    AUTH_KEY="X-Auth-Key: $API_KEY"
fi

# Construire le body JSON
if [ "$PURGE_EVERYTHING" = true ]; then
    BODY='{"purge_everything":true}'
    info "Type: Purge complète (tout le cache)"
else
    # Convertir les fichiers en array JSON
    FILES_ARRAY=$(echo "$FILES" | tr ' ' '\n' | sed 's/^/"/;s/$/"/' | tr '\n' ',' | sed 's/,$//')
    BODY="{\"files\":[$FILES_ARRAY]}"
    info "Type: Purge sélective (fichiers spécifiques)"
fi

# Exécuter la purge
info "Envoi de la requête à l'API Cloudflare..."

if [ -n "$API_TOKEN" ]; then
    RESPONSE=$(curl -s -X POST \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$BODY" \
        -w "\n%{http_code}")
else
    RESPONSE=$(curl -s -X POST \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
        -H "X-Auth-Email: $API_EMAIL" \
        -H "X-Auth-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$BODY" \
        -w "\n%{http_code}")
fi

# Extraire le code HTTP et le body
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY_RESPONSE=$(echo "$RESPONSE" | sed '$d')

# Vérifier le résultat
if [ "$HTTP_CODE" = "200" ]; then
    # Vérifier que la réponse JSON indique le succès
    if echo "$BODY_RESPONSE" | grep -q '"success":true'; then
        info "✅ Cache Cloudflare purgé avec succès"
        
        # Afficher les détails si disponibles
        if echo "$BODY_RESPONSE" | grep -q '"id"'; then
            PURGE_ID=$(echo "$BODY_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
            info "  ID de purge: $PURGE_ID"
        fi
    else
        # Extraire le message d'erreur
        ERROR_MSG=$(echo "$BODY_RESPONSE" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "Erreur inconnue")
        error "❌ Échec de la purge: $ERROR_MSG"
    fi
else
    # Extraire le message d'erreur
    ERROR_MSG=$(echo "$BODY_RESPONSE" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "Erreur HTTP $HTTP_CODE")
    error "❌ Échec de la purge (HTTP $HTTP_CODE): $ERROR_MSG"
fi

