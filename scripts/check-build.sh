#!/bin/bash

# Script de vérification de build avant déploiement
# Usage: ./scripts/check-build.sh [--verbose] [--skip-audit]

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
VERBOSE=false
SKIP_AUDIT=false
ERRORS=0
WARNINGS=0

# Fonction pour afficher les messages
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ERRORS=$((ERRORS + 1))
}

section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --verbose)
            VERBOSE=true
            shift
            ;;
        --skip-audit)
            SKIP_AUDIT=true
            shift
            ;;
        *)
            echo "Usage: $0 [--verbose] [--skip-audit]"
            exit 1
            ;;
    esac
done

section "🔍 Vérification de Build - Reboul Store"

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    error "Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# 1. Vérifier les fichiers nécessaires
section "📁 Vérification des fichiers nécessaires"

REQUIRED_FILES=(
    "docker-compose.prod.yml"
    "frontend/package.json"
    "backend/package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        info "✅ $file existe"
    else
        error "❌ $file manquant"
    fi
done

# .env.production est optionnel si les variables d'environnement sont déjà définies
if [ -f ".env.production" ]; then
    info "✅ .env.production existe"
else
    warn "⚠️  .env.production non trouvé (normal dans CI/CD si variables d'env sont définies)"
fi

# 2. Vérifier les variables d'environnement critiques
section "🔐 Vérification des variables d'environnement"

# Charger .env.production si disponible (optionnel dans CI/CD)
if [ -f ".env.production" ]; then
    source .env.production 2>/dev/null || true

REQUIRED_VARS=(
    "DB_HOST"
    "DB_PORT"
    "DB_USERNAME"
    "DB_PASSWORD"
    "DB_DATABASE"
    "JWT_SECRET"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        warn "⚠️  Variable $var non définie (peut être normal dans CI/CD si définie ailleurs)"
    else
        if [ "$VERBOSE" = true ]; then
            info "✅ $var est définie"
        fi
    fi
done
else
    warn "⚠️  .env.production non trouvé, certaines vérifications seront ignorées"
fi

# 3. Vérifier les dépendances frontend
section "📦 Vérification Frontend"

if [ -d "frontend" ]; then
    cd frontend
    
    info "Installation des dépendances frontend..."
    if npm install --legacy-peer-deps > /dev/null 2>&1; then
        info "✅ Dépendances frontend installées"
    else
        error "❌ Échec installation dépendances frontend"
    fi
    
    info "Vérification TypeScript frontend..."
    if npm run build --dry-run 2>&1 | grep -q "error" || [ $? -ne 0 ]; then
        if tsc --noEmit > /tmp/frontend-ts-errors.log 2>&1; then
            info "✅ TypeScript frontend: aucune erreur"
        else
            error "❌ Erreurs TypeScript frontend détectées"
            if [ "$VERBOSE" = true ]; then
                cat /tmp/frontend-ts-errors.log
            fi
        fi
    fi
    
    info "Linting frontend..."
    if npm run lint > /tmp/frontend-lint.log 2>&1; then
        info "✅ Linting frontend: OK"
    else
        warn "⚠️  Avertissements linting frontend"
        if [ "$VERBOSE" = true ]; then
            cat /tmp/frontend-lint.log
        fi
    fi
    
    info "Build frontend..."
    if npm run build > /tmp/frontend-build.log 2>&1; then
        info "✅ Build frontend réussi"
        
        # Vérifier la taille du bundle
        if [ -d "dist" ]; then
            BUNDLE_SIZE=$(du -sh dist | cut -f1)
            info "📊 Taille du bundle: $BUNDLE_SIZE"
            
            # Avertir si le bundle est trop gros (> 5MB)
            if du -sb dist > /dev/null 2>&1; then
                BUNDLE_SIZE_BYTES=$(du -sb dist | cut -f1)
            else
                # macOS/BSD fallback (du -sk disponible partout)
                BUNDLE_SIZE_BYTES=$(( $(du -sk dist | cut -f1) * 1024 ))
            fi
            if [ "${BUNDLE_SIZE_BYTES:-0}" -gt 5242880 ]; then
                warn "⚠️  Bundle frontend > 5MB, considérer l'optimisation"
            fi
        fi
    else
        error "❌ Échec build frontend"
        if [ "$VERBOSE" = true ]; then
            cat /tmp/frontend-build.log
        fi
    fi
    
    if [ "$SKIP_AUDIT" = false ]; then
        info "Audit sécurité npm frontend..."
        if npm audit --audit-level=moderate > /tmp/frontend-audit.log 2>&1; then
            info "✅ Audit sécurité frontend: OK"
        else
            warn "⚠️  Vulnérabilités détectées dans les dépendances frontend"
            if [ "$VERBOSE" = true ]; then
                cat /tmp/frontend-audit.log
            fi
        fi
    fi
    
    cd ..
else
    error "❌ Répertoire frontend non trouvé"
fi

# 4. Vérifier les dépendances backend
section "📦 Vérification Backend"

if [ -d "backend" ]; then
    cd backend
    
    info "Installation des dépendances backend..."
    if npm install --legacy-peer-deps > /dev/null 2>&1; then
        info "✅ Dépendances backend installées"
    else
        error "❌ Échec installation dépendances backend"
    fi
    
    info "Vérification TypeScript backend..."
    if npx tsc --noEmit > /tmp/backend-ts-errors.log 2>&1; then
        info "✅ TypeScript backend: aucune erreur"
    else
        error "❌ Erreurs TypeScript backend détectées"
        if [ "$VERBOSE" = true ]; then
            cat /tmp/backend-ts-errors.log
        fi
    fi
    
    info "Linting backend..."
    if npm run lint > /tmp/backend-lint.log 2>&1; then
        info "✅ Linting backend: OK"
    else
        warn "⚠️  Avertissements linting backend"
        if [ "$VERBOSE" = true ]; then
            cat /tmp/backend-lint.log
        fi
    fi
    
    info "Build backend..."
    if npm run build > /tmp/backend-build.log 2>&1; then
        info "✅ Build backend réussi"
        
        # Vérifier que dist/ existe
        if [ -d "dist" ]; then
            info "✅ Répertoire dist/ créé"
        else
            error "❌ Répertoire dist/ manquant après build"
        fi
    else
        error "❌ Échec build backend"
        if [ "$VERBOSE" = true ]; then
            cat /tmp/backend-build.log
        fi
    fi
    
    if [ "$SKIP_AUDIT" = false ]; then
        info "Audit sécurité npm backend..."
        if npm audit --audit-level=moderate > /tmp/backend-audit.log 2>&1; then
            info "✅ Audit sécurité backend: OK"
        else
            warn "⚠️  Vulnérabilités détectées dans les dépendances backend"
            if [ "$VERBOSE" = true ]; then
                cat /tmp/backend-audit.log
            fi
        fi
    fi
    
    cd ..
else
    error "❌ Répertoire backend non trouvé"
fi

# 5. Vérifier Docker
section "🐳 Vérification Docker"

if command -v docker > /dev/null 2>&1; then
    info "✅ Docker installé"
    
    if [ -f "docker-compose.prod.yml" ]; then
        info "Vérification syntaxe docker-compose.prod.yml..."
        if docker compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
            info "✅ docker-compose.prod.yml valide"
        else
            error "❌ Erreur dans docker-compose.prod.yml"
        fi
    else
        warn "⚠️  docker-compose.prod.yml non trouvé"
    fi
else
    error "❌ Docker non installé"
fi

# 6. Rapport final
section "📊 Rapport Final"

echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    info "✅ Toutes les vérifications sont passées avec succès !"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    warn "⚠️  Vérification terminée avec $WARNINGS avertissement(s)"
    echo ""
    exit 0
else
    error "❌ Vérification échouée avec $ERRORS erreur(s) et $WARNINGS avertissement(s)"
    echo ""
    exit 1
fi

