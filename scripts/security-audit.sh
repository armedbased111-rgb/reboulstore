#!/bin/bash

# Script d'audit de sécurité complet
# Usage: ./scripts/security-audit.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cd "$PROJECT_ROOT"

echo "🔍 Audit de sécurité - Reboul Store"
echo ""

# 1. Audit NPM Backend
info "1. Audit NPM (Backend)"
cd backend
if npm audit --audit-level=moderate 2>&1 | grep -q "found [1-9]"; then
    warn "Vulnérabilités trouvées dans le backend"
    npm audit --audit-level=moderate
else
    info "✅ Aucune vulnérabilité modérée ou critique dans le backend"
fi
cd ..

# 2. Audit NPM Frontend
info ""
info "2. Audit NPM (Frontend)"
cd frontend
if npm audit --audit-level=moderate 2>&1 | grep -q "found [1-9]"; then
    warn "Vulnérabilités trouvées dans le frontend"
    npm audit --audit-level=moderate
else
    info "✅ Aucune vulnérabilité modérée ou critique dans le frontend"
fi
cd ..

# 3. Audit NPM Admin Central Frontend
info ""
info "3. Audit NPM (Admin Central Frontend)"
cd admin-central/frontend
if npm audit --audit-level=moderate 2>&1 | grep -q "found [1-9]"; then
    warn "Vulnérabilités trouvées dans l'admin central frontend"
    npm audit --audit-level=moderate
else
    info "✅ Aucune vulnérabilité modérée ou critique dans l'admin central frontend"
fi
cd ../..

# 4. Vérification des fichiers sensibles
info ""
info "4. Vérification des fichiers sensibles"
SENSITIVE_FILES=(
    ".env.production"
    ".secrets.production.local"
    "*.pem"
    "*.key"
    "*.crt"
)

for pattern in "${SENSITIVE_FILES[@]}"; do
    if git ls-files | grep -q "$pattern"; then
        error "⚠️  Fichier sensible trouvé dans Git: $pattern"
    fi
done

# 5. Vérification des headers de sécurité (si serveur accessible)
info ""
info "5. Vérification des headers de sécurité"
if command -v curl &> /dev/null; then
    info "Vérification www.reboulstore.com..."
    HEADERS=$(curl -sI http://www.reboulstore.com 2>/dev/null || echo "")
    if echo "$HEADERS" | grep -q "X-Frame-Options"; then
        info "✅ X-Frame-Options présent"
    else
        warn "⚠️  X-Frame-Options manquant"
    fi
    if echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
        info "✅ X-Content-Type-Options présent"
    else
        warn "⚠️  X-Content-Type-Options manquant"
    fi
else
    warn "curl non disponible - impossible de vérifier les headers"
fi

info ""
info "✅ Audit terminé"
echo ""
info "💡 Pour corriger automatiquement les vulnérabilités: npm audit fix"
info "💡 Pour un monitoring continu: installer Snyk (snyk monitor)"
