#!/bin/bash

# Script de monitoring uptime simple
# Usage: Ajouter dans crontab pour vérification périodique
# Exemple: */5 * * * * /opt/reboulstore/scripts/monitor-uptime.sh

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
REBOUL_HEALTH_URL="${REBOUL_HEALTH_URL:-http://localhost:3001/health}"
ADMIN_HEALTH_URL="${ADMIN_HEALTH_URL:-http://localhost:4001/health}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@reboulstore.com}"

# Fonction pour vérifier un endpoint
check_health() {
    local url=$1
    local service=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅${NC} $service is UP (HTTP $response)"
        return 0
    else
        echo -e "${RED}❌${NC} $service is DOWN (HTTP $response)"
        return 1
    fi
}

# Vérifier Reboul Store
echo "🔍 Checking Reboul Store..."
if ! check_health "$REBOUL_HEALTH_URL" "Reboul Store"; then
    # Envoyer une alerte (à configurer selon vos besoins)
    echo "⚠️  ALERT: Reboul Store is down!" | mail -s "ALERT: Reboul Store Down" "$ALERT_EMAIL" 2>/dev/null || true
fi

# Vérifier Admin Central
echo "🔍 Checking Admin Central..."
if ! check_health "$ADMIN_HEALTH_URL" "Admin Central"; then
    # Envoyer une alerte
    echo "⚠️  ALERT: Admin Central is down!" | mail -s "ALERT: Admin Central Down" "$ALERT_EMAIL" 2>/dev/null || true
fi
