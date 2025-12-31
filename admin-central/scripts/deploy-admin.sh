#!/bin/bash

# Script de déploiement Admin Central en production
# Usage: ./admin-central/scripts/deploy-admin.sh [--build] [--restart]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Détecter automatiquement le répertoire
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ADMIN_DIR="$PROJECT_ROOT/admin-central"

# Si on est dans admin-central/, utiliser le répertoire courant
if [ -f "docker-compose.prod.yml" ] && [ -d "frontend" ] && [ -d "backend" ]; then
    ADMIN_DIR="$(pwd)"
    info "✅ Répertoire détecté: $(pwd)"
# Sinon, essayer depuis la racine du projet
elif [ -d "$ADMIN_DIR" ] && [ -f "$ADMIN_DIR/docker-compose.prod.yml" ]; then
    info "✅ Répertoire détecté: $ADMIN_DIR"
    cd "$ADMIN_DIR"
else
    error "❌ Impossible de trouver le répertoire admin-central/"
    error "   Cherché dans: $(pwd)"
    error "   Cherché dans: $ADMIN_DIR"
    error "   Ce script doit être exécuté depuis admin-central/ ou depuis la racine du projet"
fi

# Protection : Vérifier qu'on ne va pas arrêter les containers Reboul Store
if docker ps --format '{{.Names}}' | grep -q "^reboulstore-"; then
    warn "⚠️  Containers Reboul Store détectés"
    warn "   Ce script ne doit JAMAIS arrêter les containers Reboul Store"
    warn "   Vérification que docker-compose.prod.yml est bien celui d'Admin Central..."
    
    if ! grep -q "admin-central" "$ADMIN_DIR/docker-compose.prod.yml" 2>/dev/null; then
        error "❌ ERREUR CRITIQUE: Le fichier docker-compose.prod.yml ne semble pas être celui d'Admin Central"
        error "   Ne pas continuer pour éviter d'arrêter les containers Reboul Store"
    fi
fi

# Vérifier que .env.production existe (dans le répertoire admin-central)
if [ ! -f "$ADMIN_DIR/.env.production" ]; then
    warn "⚠️  Le fichier .env.production n'existe pas dans $ADMIN_DIR"
    warn "   Le déploiement peut échouer si les variables d'environnement ne sont pas définies"
    warn "   Créez-le à partir de env.production.example si nécessaire"
fi

# Vérifier que le réseau Docker existe (créé par reboulstore)
if ! docker network ls | grep -q "reboulstore-network"; then
    error "Le réseau reboulstore-network n'existe pas. Déployez d'abord Reboul Store."
fi

# Options
BUILD=false
RESTART=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD=true
            shift
            ;;
        --restart)
            RESTART=true
            shift
            ;;
        *)
            error "Option inconnue: $1"
            ;;
    esac
done

info "🚀 Déploiement Admin Central en production"

# S'assurer qu'on est dans le bon répertoire
cd "$ADMIN_DIR"

# Build des images si demandé
if [ "$BUILD" = true ]; then
    info "📦 Build des images Docker..."
    docker compose -f docker-compose.prod.yml build --no-cache
    info "✅ Build terminé"
fi

# Arrêter UNIQUEMENT les containers Admin Central
info "🛑 Arrêt des containers Admin Central existants..."
info "   Vérification que seuls les containers admin-central-* seront arrêtés..."
if docker ps --format '{{.Names}}' | grep -q "^admin-central-"; then
    docker compose -f docker-compose.prod.yml down
    info "✅ Containers Admin Central arrêtés"
else
    info "ℹ️  Aucun container Admin Central en cours d'exécution"
fi

# Démarrer les containers
info "▶️  Démarrage des containers Admin Central..."
docker compose -f docker-compose.prod.yml up -d

# Attendre que les services soient prêts
info "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier le healthcheck
info "🏥 Vérification du healthcheck backend..."
for i in {1..30}; do
    if curl -f http://localhost:4001/health > /dev/null 2>&1; then
        info "✅ Backend Admin est prêt"
        break
    fi
    if [ $i -eq 30 ]; then
        warn "⚠️  Le backend Admin ne répond pas après 30 tentatives"
    fi
    sleep 2
done

# Afficher les logs récents
info "📋 Logs récents:"
docker compose -f docker-compose.prod.yml logs --tail=20

# Afficher le statut
info "📊 Statut des containers:"
docker compose -f docker-compose.prod.yml ps

info "✅ Déploiement terminé !"
info "🌐 Admin accessible sur: http://localhost:4000 (ou votre domaine configuré)"
info "🔍 Vérifier les logs: docker compose -f docker-compose.prod.yml logs -f"
