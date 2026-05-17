#!/bin/bash
# Installe logrotate pour /var/log/reboulstore-backup.log (cron backup DB)
# Usage (sur le VPS, user deploy avec sudo) : ./scripts/setup-logrotate-backup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE="$PROJECT_ROOT/config/logrotate/reboulstore-backup"
TARGET="/etc/logrotate.d/reboulstore-backup"

if [ ! -f "$SOURCE" ]; then
  echo "❌ Fichier source introuvable: $SOURCE"
  exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
  echo "🔐 Installation via sudo..."
  exec sudo "$0" "$@"
fi

cp "$SOURCE" "$TARGET"
chmod 644 "$TARGET"

echo "✅ Logrotate installé: $TARGET"
echo "   Rétention: 30 jours, compression, copytruncate"
logrotate -d "$TARGET" 2>&1 | head -5 || true
echo "💡 Test forcé (optionnel): sudo logrotate -f $TARGET"
