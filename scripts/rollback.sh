#!/bin/bash

# Script de rollback - Retour à une version précédente
# Usage: ./scripts/rollback.sh [TAG_OU_COMMIT]

set -e

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
    exit 1
}

# Vérifier qu'on est dans un repo Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Ce script doit être exécuté dans un repository Git"
fi

TARGET=$1

if [ -z "$TARGET" ]; then
    # Afficher les tags récents
    info "📋 Tags disponibles:"
    git tag -l --sort=-creatordate | head -10
    echo ""
    read -p "Entrez le tag ou commit à restaurer: " TARGET
fi

# Vérifier que le tag/commit existe
if ! git rev-parse "$TARGET" > /dev/null 2>&1; then
    error "Le tag ou commit '$TARGET' n'existe pas"
fi

warn "⚠️  ATTENTION: Cette opération va restaurer le code à la version $TARGET"
warn "⚠️  Les containers seront reconstruits et redémarrés"
read -p "Êtes-vous sûr de vouloir continuer ? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    info "Rollback annulé"
    exit 0
fi

info "🔄 Rollback vers: $TARGET"

# Sauvegarder l'état actuel
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
CURRENT_COMMIT=$(git rev-parse HEAD)

info "📍 État actuel: $CURRENT_BRANCH @ $CURRENT_COMMIT"

# Créer un backup de la base de données avant rollback
info "💾 Backup de la base de données avant rollback..."
./scripts/backup-db.sh || warn "⚠️  Échec du backup (continuer quand même)"

# Checkout la version cible
info "📥 Checkout de la version $TARGET..."
git checkout "$TARGET"

# Rebuild et redémarrage
info "🔨 Rebuild des images..."
docker compose -f docker-compose.prod.yml build --no-cache

info "🔄 Redémarrage des containers..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

info "✅ Rollback terminé vers: $TARGET"
warn "⚠️  Vous êtes maintenant sur le commit: $(git rev-parse HEAD)"
warn "⚠️  Pour revenir à votre branche: git checkout $CURRENT_BRANCH"
