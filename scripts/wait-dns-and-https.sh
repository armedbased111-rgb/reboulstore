#!/bin/bash

# Script qui attend que les DNS soient corrects, puis lance le setup HTTPS
# Usage: ./scripts/wait-dns-and-https.sh

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
    exit 1
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

EXPECTED_IP="152.228.218.35"
DOMAIN="reboulstore.com"
MAX_ATTEMPTS=60  # 60 tentatives (1 toutes les 30 secondes = 30 minutes max)
CHECK_INTERVAL=30  # Vérifier toutes les 30 secondes

info "Vérification DNS pour $DOMAIN"
info "IP attendue : $EXPECTED_IP"
info "Vérification toutes les $CHECK_INTERVAL secondes (max $MAX_ATTEMPTS tentatives = ~$((MAX_ATTEMPTS * CHECK_INTERVAL / 60)) minutes)"
echo ""

attempt=1

while [ $attempt -le $MAX_ATTEMPTS ]; do
    current_ip=$(dig +short $DOMAIN | head -n 1)
    
    if [ "$current_ip" == "$EXPECTED_IP" ]; then
        success "DNS corrigé ! $DOMAIN pointe maintenant vers $EXPECTED_IP"
        echo ""
        info "Lancement du script HTTPS..."
        echo ""
        
        # Lancer le script HTTPS
        cd /opt/reboulstore
        ./scripts/setup-https.sh
        
        exit 0
    else
        warn "Tentative $attempt/$MAX_ATTEMPTS : $DOMAIN pointe vers $current_ip (attendu: $EXPECTED_IP)"
        
        if [ $attempt -lt $MAX_ATTEMPTS ]; then
            info "Nouvelle vérification dans $CHECK_INTERVAL secondes..."
            sleep $CHECK_INTERVAL
        fi
    fi
    
    attempt=$((attempt + 1))
done

error "Timeout : Les DNS ne pointent pas encore vers $EXPECTED_IP après $MAX_ATTEMPTS tentatives"
error "Vérifie que tu as bien modifié les DNS dans ton registrar"
