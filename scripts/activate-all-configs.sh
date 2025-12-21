#!/bin/bash

# Script d'activation des 3 configurations optionnelles
# Usage: ./scripts/activate-all-configs.sh [https|ga4|cloudflare|all]

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

CONFIG=${1:-all}

echo "🚀 Activation des configurations optionnelles"
echo "=============================================="
echo ""

# Vérifier qu'on est sur le serveur
if [ ! -f "/opt/reboulstore/docker-compose.prod.yml" ]; then
    error "Ce script doit être exécuté sur le serveur OVH (/opt/reboulstore)"
    exit 1
fi

cd /opt/reboulstore

# HTTPS
if [ "$CONFIG" = "https" ] || [ "$CONFIG" = "all" ]; then
    echo "🔒 1. Activation HTTPS (Let's Encrypt)"
    echo "--------------------------------------"
    
    if [ -f "scripts/setup-https.sh" ]; then
        info "Exécution du script setup-https.sh..."
        ./scripts/setup-https.sh
        success "HTTPS activé"
    else
        error "Script setup-https.sh non trouvé"
    fi
    echo ""
fi

# GA4
if [ "$CONFIG" = "ga4" ] || [ "$CONFIG" = "all" ]; then
    echo "📊 2. Activation Google Analytics 4"
    echo "-----------------------------------"
    
    if [ -z "$GA_MEASUREMENT_ID" ]; then
        warn "Variable GA_MEASUREMENT_ID non définie"
        read -p "Entrer le Measurement ID GA4 (G-XXXXXXXXXX) : " GA_MEASUREMENT_ID
    fi
    
    if [ -n "$GA_MEASUREMENT_ID" ]; then
        info "Ajout de VITE_GA_MEASUREMENT_ID dans .env.production..."
        
        # Reboul Store
        if ! grep -q "VITE_GA_MEASUREMENT_ID" frontend/.env.production 2>/dev/null; then
            echo "VITE_GA_MEASUREMENT_ID=$GA_MEASUREMENT_ID" >> frontend/.env.production
            success "VITE_GA_MEASUREMENT_ID ajouté pour Reboul Store"
        else
            warn "VITE_GA_MEASUREMENT_ID existe déjà pour Reboul Store"
        fi
        
        # Admin Central
        if ! grep -q "VITE_GA_MEASUREMENT_ID" admin-central/frontend/.env.production 2>/dev/null; then
            echo "VITE_GA_MEASUREMENT_ID=$GA_MEASUREMENT_ID" >> admin-central/frontend/.env.production
            success "VITE_GA_MEASUREMENT_ID ajouté pour Admin Central"
        else
            warn "VITE_GA_MEASUREMENT_ID existe déjà pour Admin Central"
        fi
        
        info "Rebuild et redéploiement des frontends..."
        docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build frontend
        cd admin-central
        docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build frontend
        cd ..
        
        success "GA4 activé (rebuild nécessaire pour prendre effet)"
    else
        error "Measurement ID non fourni"
    fi
    echo ""
fi

# Cloudflare (guide seulement)
if [ "$CONFIG" = "cloudflare" ] || [ "$CONFIG" = "all" ]; then
    echo "☁️  3. Configuration Cloudflare CDN"
    echo "-----------------------------------"
    warn "Cloudflare nécessite une configuration manuelle"
    info "Suivre le guide : docs/CLOUDFLARE_SETUP_COMPLETE.md"
    info ""
    info "Étapes principales :"
    info "  1. Créer compte sur https://dash.cloudflare.com"
    info "  2. Ajouter le domaine reboulstore.com"
    info "  3. Configurer les DNS records (proxy activé)"
    info "  4. Changer les nameservers chez le registrar"
    info "  5. Configurer SSL/TLS, Cache, WAF dans Cloudflare"
    echo ""
fi

success "✅ Activation terminée !"
echo ""
info "📝 Prochaines étapes :"
if [ "$CONFIG" = "https" ] || [ "$CONFIG" = "all" ]; then
    info "  - Vérifier https://www.reboulstore.com fonctionne"
fi
if [ "$CONFIG" = "ga4" ] || [ "$CONFIG" = "all" ]; then
    info "  - Vérifier dans GA4 Realtime que les événements arrivent"
fi
if [ "$CONFIG" = "cloudflare" ] || [ "$CONFIG" = "all" ]; then
    info "  - Suivre docs/CLOUDFLARE_SETUP_COMPLETE.md pour finaliser"
fi
