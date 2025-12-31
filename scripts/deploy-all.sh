#!/bin/bash

# Script de déploiement unifié pour Reboul Store + Admin Central
# Usage: ./scripts/deploy-all.sh [--reboul] [--admin] [--skip-check] [--skip-backup]
#
# Ce script déploie les deux projets de manière coordonnée et sécurisée

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

# Variables d'environnement
DEPLOY_REBOUL=true
DEPLOY_ADMIN=true
SKIP_CHECK=false
SKIP_BACKUP=false

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --reboul)
            DEPLOY_REBOUL=true
            DEPLOY_ADMIN=false
            shift
            ;;
        --admin)
            DEPLOY_REBOUL=false
            DEPLOY_ADMIN=true
            shift
            ;;
        --skip-check)
            SKIP_CHECK=true
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --reboul       Déployer uniquement Reboul Store"
            echo "  --admin        Déployer uniquement Admin Central"
            echo "  --skip-check   Déployer sans vérification préalable"
            echo "  --skip-backup  Déployer sans backup de la base de données"
            echo ""
            echo "Variables d'environnement requises:"
            echo "  DEPLOY_HOST    Adresse du serveur (ex: deploy@152.228.218.35)"
            echo "  DEPLOY_PATH    Chemin sur le serveur (défaut: /opt/reboulstore)"
            exit 0
            ;;
        *)
            error "Option inconnue: $1. Utilisez --help pour voir les options disponibles"
            ;;
    esac
done

# Vérifier les variables d'environnement
if [ -z "$DEPLOY_HOST" ]; then
    error "DEPLOY_HOST n'est pas défini. Exemple: export DEPLOY_HOST=deploy@152.228.218.35"
fi

DEPLOY_PATH="${DEPLOY_PATH:-/opt/reboulstore}"

section "🚀 Déploiement Unifié - Reboul Store + Admin Central"

# Déploiement Reboul Store
if [ "$DEPLOY_REBOUL" = true ]; then
    section "📦 Déploiement Reboul Store"
    
    info "Exécution du script de déploiement Reboul Store..."
    
    SKIP_CHECK_FLAG=""
    if [ "$SKIP_CHECK" = true ]; then
        SKIP_CHECK_FLAG="--skip-check"
    fi
    
    SKIP_BACKUP_FLAG=""
    if [ "$SKIP_BACKUP" = true ]; then
        SKIP_BACKUP_FLAG="--skip-backup"
    fi
    
    if ./scripts/deploy-prod.sh $SKIP_CHECK_FLAG $SKIP_BACKUP_FLAG; then
        info "✅ Déploiement Reboul Store terminé"
    else
        error "❌ Échec du déploiement Reboul Store"
    fi
else
    info "⏭️  Déploiement Reboul Store ignoré (--admin spécifié)"
fi

# Déploiement Admin Central
if [ "$DEPLOY_ADMIN" = true ]; then
    section "📦 Déploiement Admin Central"
    
    info "Vérification que le répertoire admin-central existe..."
    
    # Vérifier que le répertoire existe localement
    if [ ! -d "admin-central" ]; then
        error "Le répertoire admin-central n'existe pas localement"
    fi
    
    # Vérifier que le script de déploiement existe
    if [ ! -f "admin-central/scripts/deploy-admin.sh" ]; then
        error "Le script admin-central/scripts/deploy-admin.sh n'existe pas"
    fi
    
    info "Exécution du script de déploiement Admin Central..."
    
    # Exécuter depuis le bon répertoire
    cd admin-central
    
    if ./scripts/deploy-admin.sh --build; then
        info "✅ Déploiement Admin Central terminé"
    else
        error "❌ Échec du déploiement Admin Central"
    fi
    
    cd ..
else
    info "⏭️  Déploiement Admin Central ignoré (--reboul spécifié)"
fi

# Vérifications post-déploiement
section "✅ Vérifications Post-Déploiement"

info "Vérification du statut de tous les containers..."

# Utiliser le CLI pour vérifier le statut
if command -v ./rcli &> /dev/null; then
    ./rcli server status --all
else
    warn "⚠️  CLI non disponible, vérification manuelle nécessaire"
    info "Vérifiez manuellement avec: ssh $DEPLOY_HOST 'docker ps | grep -E \"(reboulstore|admin-central)\"'"
fi

# Purge cache Cloudflare (si configuré)
if [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    section "🌐 Purge Cache Cloudflare"
    
    info "Purging du cache Cloudflare..."
    
    if ./scripts/cloudflare-purge.sh; then
        info "✅ Cache Cloudflare purgé"
    else
        warn "⚠️  Échec de la purge Cloudflare (le site fonctionne toujours)"
    fi
elif [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    info "ℹ️  Purge Cloudflare ignorée (CLOUDFLARE_ZONE_ID non défini)"
fi

section "🎉 Déploiement Terminé"

info "🌐 Reboul Store: https://www.reboulstore.com"
info "🌐 Admin Central: https://admin.reboulstore.com"
info ""
info "📊 Pour vérifier le statut: ./rcli server status --all"
info "📋 Pour voir les logs: ./rcli server logs"

