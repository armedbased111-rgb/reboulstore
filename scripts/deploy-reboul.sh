#!/bin/bash

# Script de déploiement Reboul Store en production
# Usage: ./scripts/deploy-reboul.sh [--build] [--restart]

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
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

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "docker-compose.prod.yml" ]; then
    error "Ce script doit être exécuté depuis la racine du projet"
fi

# Vérifier que .env.production existe
if [ ! -f ".env.production" ]; then
    error "Le fichier .env.production n'existe pas. Créez-le à partir de env.production.example"
fi

# Options
BUILD=false
RESTART=false

# Parser les arguments
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

info "🚀 Déploiement Reboul Store en production"

# Build des images si demandé
if [ "$BUILD" = true ]; then
    info "📦 Build des images Docker..."
    docker compose -f docker-compose.prod.yml build --no-cache
    info "✅ Build terminé"
fi

# Arrêter les containers existants
info "🛑 Arrêt des containers existants..."
docker compose -f docker-compose.prod.yml down

# Démarrer les containers
info "▶️  Démarrage des containers..."
docker compose -f docker-compose.prod.yml up -d

# Attendre que les services soient prêts
info "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier le healthcheck
info "🏥 Vérification du healthcheck backend..."
for i in {1..30}; do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        info "✅ Backend est prêt"
        break
    fi
    if [ $i -eq 30 ]; then
        warn "⚠️  Le backend ne répond pas après 30 tentatives"
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
info "🌐 Site accessible sur: http://localhost (ou votre domaine configuré)"
info "🔍 Vérifier les logs: docker compose -f docker-compose.prod.yml logs -f"
