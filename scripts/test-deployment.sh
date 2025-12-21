#!/bin/bash

# Script de test complet du déploiement
# Usage: ./scripts/test-deployment.sh

# Ne pas s'arrêter en cas d'erreur pour pouvoir afficher tous les tests
set +e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((PASSED++))
}

error() {
    echo -e "${RED}[✗]${NC} $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

test_url() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    info "Test: $description"
    info "  URL: $url"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "$expected_status" ]; then
        success "$description (HTTP $HTTP_CODE)"
        return 0
    else
        error "$description - Attendu: HTTP $expected_status, Reçu: HTTP $HTTP_CODE"
        return 1
    fi
}

test_json_response() {
    local url=$1
    local description=$2
    local json_key=$3
    
    info "Test JSON: $description"
    info "  URL: $url"
    info "  Clé JSON: $json_key"
    
    RESPONSE=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")
    
    if [ -z "$RESPONSE" ]; then
        error "$description - Aucune réponse reçue"
        return 1
    fi
    
    if echo "$RESPONSE" | grep -q "\"$json_key\""; then
        success "$description (JSON valide avec clé '$json_key')"
        return 0
    else
        error "$description - Réponse JSON invalide ou clé '$json_key' absente"
        return 1
    fi
}

echo "🧪 Tests de déploiement - Reboul Store"
echo "======================================"
echo ""

# Configuration
REBOUL_STORE_URL="${REBOUL_STORE_URL:-http://www.reboulstore.com}"
ADMIN_CENTRAL_URL="${ADMIN_CENTRAL_URL:-http://admin.reboulstore.com}"

echo "📋 Configuration:"
echo "  Reboul Store: $REBOUL_STORE_URL"
echo "  Admin Central: $ADMIN_CENTRAL_URL"
echo ""

# Tests Reboul Store
echo "🏪 Tests Reboul Store"
echo "-------------------"

# Frontend
test_url "$REBOUL_STORE_URL" "Frontend accessible" 200

# Backend Healthcheck
test_url "$REBOUL_STORE_URL/health" "Backend healthcheck" 200
test_json_response "$REBOUL_STORE_URL/health" "Healthcheck retourne JSON valide" "status"

# API Products
test_url "$REBOUL_STORE_URL/api/products" "API Products accessible" 200
test_json_response "$REBOUL_STORE_URL/api/products" "API Products retourne JSON valide" "products"

# API Categories
test_url "$REBOUL_STORE_URL/api/categories" "API Categories accessible" 200
test_json_response "$REBOUL_STORE_URL/api/categories" "API Categories retourne JSON valide" "categories"

# Tests Admin Central
echo ""
echo "🔧 Tests Admin Central"
echo "-------------------"

# Frontend Admin
test_url "$ADMIN_CENTRAL_URL" "Frontend Admin accessible" 200

# Backend Admin Healthcheck
test_url "$ADMIN_CENTRAL_URL/health" "Backend Admin healthcheck" 200
test_json_response "$ADMIN_CENTRAL_URL/health" "Healthcheck Admin retourne JSON valide" "status"

# Tests Headers de sécurité
echo ""
echo "🔒 Tests Headers de sécurité"
echo "-------------------------"

info "Test: Headers de sécurité Reboul Store"
SECURITY_HEADERS=$(curl -sI --max-time 10 "$REBOUL_STORE_URL" 2>/dev/null || echo "")

if echo "$SECURITY_HEADERS" | grep -q "X-Frame-Options"; then
    success "X-Frame-Options présent"
else
    error "X-Frame-Options manquant"
fi

if echo "$SECURITY_HEADERS" | grep -q "X-Content-Type-Options"; then
    success "X-Content-Type-Options présent"
else
    error "X-Content-Type-Options manquant"
fi

if echo "$SECURITY_HEADERS" | grep -q "X-XSS-Protection"; then
    success "X-XSS-Protection présent"
else
    error "X-XSS-Protection manquant"
fi

# Tests Headers de cache
echo ""
echo "💾 Tests Headers de cache"
echo "----------------------"

info "Test: Cache headers pour assets"
ASSET_URL=$(curl -s --max-time 10 "$REBOUL_STORE_URL" 2>/dev/null | grep -oE 'src="/assets/[^"]+' | head -1 | sed 's|src="|/|' || echo "")
if [ -n "$ASSET_URL" ]; then
    FULL_ASSET_URL="$REBOUL_STORE_URL$ASSET_URL"
    info "  Asset trouvé: $FULL_ASSET_URL"
    CACHE_HEADERS=$(curl -sI --max-time 10 "$FULL_ASSET_URL" 2>/dev/null || echo "")
    if echo "$CACHE_HEADERS" | grep -qi "cache-control.*public.*immutable"; then
        success "Cache-Control: public, immutable présent pour assets"
    else
        warn "Cache-Control: public, immutable non trouvé pour assets (peut être normal si asset inexistant)"
    fi
else
    warn "Aucun asset trouvé dans le HTML pour tester les headers de cache"
fi

# Résumé
echo ""
echo "======================================"
echo "📊 Résumé des tests"
echo "======================================"
echo -e "${GREEN}✓ Tests réussis: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Tests échoués: $FAILED${NC}"
    echo ""
    echo "⚠️  Certains tests ont échoué. Vérifier les erreurs ci-dessus."
    exit 1
else
    echo -e "${RED}✗ Tests échoués: $FAILED${NC}"
    echo ""
    success "✅ Tous les tests sont passés ! Le déploiement fonctionne correctement."
    exit 0
fi
