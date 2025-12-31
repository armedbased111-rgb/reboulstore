#!/bin/bash

# Script pour protéger et sauvegarder les fichiers .env.production
# Usage: ./scripts/protect-env-files.sh [--backup] [--restore] [--check]

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Variables
DEPLOY_HOST="${DEPLOY_HOST:-deploy@152.228.218.35}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/reboulstore}"
REBOUL_ENV="$DEPLOY_PATH/.env.production"
ADMIN_ENV="$DEPLOY_PATH/admin-central/.env.production"
BACKUP_DIR="$DEPLOY_PATH/.env-backups"

# Fonction pour créer un backup
backup_env_files() {
    info "💾 Sauvegarde des fichiers .env.production..."
    
    # Créer le répertoire de backup
    ssh "$DEPLOY_HOST" "mkdir -p $BACKUP_DIR"
    
    # Backup Reboul Store
    if ssh "$DEPLOY_HOST" "test -f $REBOUL_ENV"; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        ssh "$DEPLOY_HOST" "cp $REBOUL_ENV $BACKUP_DIR/reboul.env.production.$TIMESTAMP"
        info "✅ Backup Reboul Store créé: reboul.env.production.$TIMESTAMP"
    else
        warn "⚠️  Fichier Reboul Store .env.production non trouvé"
    fi
    
    # Backup Admin Central
    if ssh "$DEPLOY_HOST" "test -f $ADMIN_ENV"; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        ssh "$DEPLOY_HOST" "cp $ADMIN_ENV $BACKUP_DIR/admin.env.production.$TIMESTAMP"
        info "✅ Backup Admin Central créé: admin.env.production.$TIMESTAMP"
    else
        warn "⚠️  Fichier Admin Central .env.production non trouvé"
    fi
    
    # Garder seulement les 10 derniers backups
    ssh "$DEPLOY_HOST" "cd $BACKUP_DIR && ls -t reboul.env.production.* 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true"
    ssh "$DEPLOY_HOST" "cd $BACKUP_DIR && ls -t admin.env.production.* 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true"
}

# Fonction pour restaurer depuis backup
restore_env_files() {
    info "🔄 Restauration des fichiers .env.production depuis backup..."
    
    # Restaurer Reboul Store
    LATEST_REBOUL=$(ssh "$DEPLOY_HOST" "ls -t $BACKUP_DIR/reboul.env.production.* 2>/dev/null | head -1")
    if [ -n "$LATEST_REBOUL" ]; then
        ssh "$DEPLOY_HOST" "cp $LATEST_REBOUL $REBOUL_ENV"
        info "✅ Reboul Store restauré depuis: $(basename $LATEST_REBOUL)"
    else
        warn "⚠️  Aucun backup Reboul Store trouvé"
    fi
    
    # Restaurer Admin Central
    LATEST_ADMIN=$(ssh "$DEPLOY_HOST" "ls -t $BACKUP_DIR/admin.env.production.* 2>/dev/null | head -1")
    if [ -n "$LATEST_ADMIN" ]; then
        ssh "$DEPLOY_HOST" "cp $LATEST_ADMIN $ADMIN_ENV"
        info "✅ Admin Central restauré depuis: $(basename $LATEST_ADMIN)"
    else
        warn "⚠️  Aucun backup Admin Central trouvé"
    fi
}

# Fonction pour vérifier les fichiers
check_env_files() {
    info "🔍 Vérification des fichiers .env.production..."
    
    MISSING=0
    
    # Vérifier Reboul Store
    if ssh "$DEPLOY_HOST" "test -f $REBOUL_ENV"; then
        info "✅ Reboul Store: $REBOUL_ENV existe"
    else
        error "❌ Reboul Store: $REBOUL_ENV MANQUANT"
        MISSING=1
    fi
    
    # Vérifier Admin Central
    if ssh "$DEPLOY_HOST" "test -f $ADMIN_ENV"; then
        info "✅ Admin Central: $ADMIN_ENV existe"
    else
        warn "⚠️  Admin Central: $ADMIN_ENV MANQUANT"
        MISSING=1
    fi
    
    if [ $MISSING -eq 1 ]; then
        warn "⚠️  Certains fichiers .env.production sont manquants"
        warn "💡 Utilisez --restore pour restaurer depuis backup"
        warn "💡 OU utilisez ./scripts/setup-admin-env.sh pour créer Admin Central"
        return 1
    fi
    
    return 0
}

# Fonction pour créer Admin Central .env.production automatiquement
auto_create_admin_env() {
    info "🔧 Création automatique du .env.production Admin Central..."
    
    if ssh "$DEPLOY_HOST" "test -f $ADMIN_ENV"; then
        info "✅ Fichier existe déjà, pas besoin de le créer"
        return 0
    fi
    
    # Utiliser le script setup-admin-env.sh
    if [ -f "./scripts/setup-admin-env.sh" ]; then
        info "Utilisation de setup-admin-env.sh..."
        ./scripts/setup-admin-env.sh
    else
        warn "⚠️  Script setup-admin-env.sh non trouvé"
        return 1
    fi
}

# Parser les arguments
case "${1:-check}" in
    --backup)
        backup_env_files
        ;;
    --restore)
        restore_env_files
        ;;
    --check)
        check_env_files
        ;;
    --auto-create-admin)
        auto_create_admin_env
        ;;
    *)
        echo "Usage: $0 [--backup|--restore|--check|--auto-create-admin]"
        echo ""
        echo "Options:"
        echo "  --backup            Sauvegarder les fichiers .env.production"
        echo "  --restore           Restaurer depuis le dernier backup"
        echo "  --check             Vérifier que les fichiers existent"
        echo "  --auto-create-admin Créer automatiquement Admin Central .env.production"
        exit 0
        ;;
esac

