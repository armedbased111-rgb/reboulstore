#!/bin/bash

# Script de backup PostgreSQL - Reboul Store
# Usage: ./scripts/backup-db.sh [--restore BACKUP_FILE]

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

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="reboulstore-postgres-prod"
DB_NAME="${DB_DATABASE:-reboulstore_db}"
DB_USER="${DB_USERNAME:-reboulstore}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/reboulstore_db_${TIMESTAMP}.sql"

# Créer le dossier de backup s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Fonction de backup
backup() {
    info "💾 Création du backup de la base de données..."
    
    # Vérifier que le container existe
    if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        error "Le container ${CONTAINER_NAME} n'existe pas"
    fi
    
    # Vérifier que le container est en cours d'exécution
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        error "Le container ${CONTAINER_NAME} n'est pas en cours d'exécution"
    fi
    
    # Créer le backup
    docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" > "${BACKUP_FILE}"
    
    # Compresser le backup
    gzip "${BACKUP_FILE}"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    info "✅ Backup créé: ${BACKUP_FILE}"
    
    # Afficher la taille
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    info "📦 Taille: ${SIZE}"
    
    # Garder seulement les 30 derniers backups
    info "🧹 Nettoyage des anciens backups (garde les 30 derniers)..."
    ls -t "${BACKUP_DIR}"/reboulstore_db_*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm -f
    
    info "✅ Backup terminé"
}

# Fonction de restauration
restore() {
    local RESTORE_FILE=$1
    
    if [ -z "$RESTORE_FILE" ]; then
        error "Fichier de backup non spécifié"
    fi
    
    if [ ! -f "$RESTORE_FILE" ]; then
        error "Le fichier de backup n'existe pas: $RESTORE_FILE"
    fi
    
    warn "⚠️  ATTENTION: Cette opération va écraser la base de données actuelle !"
    read -p "Êtes-vous sûr de vouloir continuer ? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        info "Restauration annulée"
        exit 0
    fi
    
    info "🔄 Restauration de la base de données depuis: $RESTORE_FILE"
    
    # Décompresser si nécessaire
    if [[ "$RESTORE_FILE" == *.gz ]]; then
        TEMP_FILE=$(mktemp)
        gunzip -c "$RESTORE_FILE" > "$TEMP_FILE"
        RESTORE_FILE="$TEMP_FILE"
    fi
    
    # Restaurer
    docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}" < "$RESTORE_FILE"
    
    # Nettoyer le fichier temporaire si créé
    [ -n "$TEMP_FILE" ] && rm -f "$TEMP_FILE"
    
    info "✅ Restauration terminée"
}

# Parser les arguments
if [ "$1" = "--restore" ]; then
    restore "$2"
else
    backup
fi
