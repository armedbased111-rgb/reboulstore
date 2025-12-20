#!/bin/bash

# Script pour configurer les backups automatiques quotidiens de la base de données
# Usage: ./scripts/setup-backup-cron.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_SCRIPT="$PROJECT_ROOT/scripts/backup-db.sh"

# Vérifier que le script de backup existe
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "❌ Erreur: Le script backup-db.sh n'existe pas: $BACKUP_SCRIPT"
    exit 1
fi

# Rendre le script exécutable
chmod +x "$BACKUP_SCRIPT"

# Créer la commande cron (backup quotidien à 2h du matin)
CRON_CMD="0 2 * * * cd $PROJECT_ROOT && $BACKUP_SCRIPT >> /var/log/reboulstore-backup.log 2>&1"

# Vérifier si le cron job existe déjà
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo "⚠️  Le cron job de backup existe déjà"
    echo "Pour le modifier, utilisez: crontab -e"
else
    # Ajouter le cron job
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
    echo "✅ Cron job de backup configuré avec succès"
    echo "📋 Backup quotidien programmé à 2h du matin"
fi

# Afficher les cron jobs actuels
echo ""
echo "📋 Cron jobs configurés:"
crontab -l | grep -E "(backup-db|reboulstore)" || echo "Aucun cron job trouvé"

echo ""
echo "✅ Configuration terminée"
echo "💡 Les backups seront créés dans: $PROJECT_ROOT/backups/"
