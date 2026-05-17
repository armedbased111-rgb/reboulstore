#!/bin/bash
# Cron alertes logs (toutes les 15 min)
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CHECK="$ROOT/scripts/check-log-alerts.sh"
CRON_LINE="*/15 * * * * cd $ROOT && $CHECK >> /var/log/reboulstore-log-alerts.log 2>&1"

chmod +x "$CHECK" "$ROOT/scripts/send-log-alert.py" 2>/dev/null || true

if ! grep -q "check-log-alerts.sh" <(crontab -l 2>/dev/null || true); then
  (crontab -l 2>/dev/null; echo "$CRON_LINE") | crontab -
  echo "✅ Cron alertes logs ajouté (*/15)"
else
  echo "⚠️  Cron alertes logs déjà présent"
fi

echo "📋 Vérifier LOG_ALERT_EMAIL dans .env.observability (ou SMTP_USER)"
echo "🧪 Test manuel: $CHECK"
