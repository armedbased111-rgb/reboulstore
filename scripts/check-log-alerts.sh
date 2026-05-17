#!/bin/bash
# Vérifie pics 5xx, stack observability, silence logs — envoie email si alerte
# Cron recommandé : */15 * * * *
set -euo pipefail

ROOT="${REBOUL_ROOT:-/var/www/reboulstore}"
cd "$ROOT"

# shellcheck source=/dev/null
[ -f .env.observability ] && set -a && source .env.observability && set +a

THRESHOLD="${LOG_ALERT_5XX_THRESHOLD:-5}"
WINDOW_MIN="${LOG_ALERT_WINDOW_MIN:-15}"
SILENCE_HOURS="${LOG_ALERT_SILENCE_HOURS:-6}"
BACKEND="${LOG_ALERT_BACKEND_CONTAINER:-reboulstore-backend-prod}"

ALERTS=()
COUNT_5XX=0

if docker ps --format '{{.Names}}' | grep -q "^${BACKEND}$"; then
  COUNT_5XX=$(docker logs "$BACKEND" --since "${WINDOW_MIN}m" 2>&1 | grep -c 'http_5xx' || true)
  if [ "$COUNT_5XX" -ge "$THRESHOLD" ]; then
    ALERTS+=("Pic http_5xx: ${COUNT_5XX} events sur ${WINDOW_MIN} min (seuil ${THRESHOLD})")
  fi

  if docker exec "$BACKEND" test -f /app/logs/combined.log 2>/dev/null; then
    MTIME=$(docker exec "$BACKEND" stat -c %Y /app/logs/combined.log 2>/dev/null || echo 0)
    NOW=$(date +%s)
    AGE_H=$(( (NOW - MTIME) / 3600 ))
    if [ "$AGE_H" -ge "$SILENCE_HOURS" ]; then
      ALERTS+=("Silence logs Winston: combined.log inchangé depuis ${AGE_H}h (seuil ${SILENCE_HOURS}h)")
    fi
  fi
else
  ALERTS+=("Container backend absent: ${BACKEND}")
fi

for c in reboulstore-loki reboulstore-promtail reboulstore-grafana; do
  if ! docker ps --format '{{.Names}}' | grep -q "^${c}$"; then
    ALERTS+=("Container observability down: ${c}")
  fi
done

if [ "${#ALERTS[@]}" -eq 0 ]; then
  exit 0
fi

SUBJECT="[Reboul Store] Alerte logs ($(date +%Y-%m-%d\ %H:%M))"
BODY="Alertes détectées sur le VPS Reboul Store:

$(printf '- %s\n' "${ALERTS[@]}")

Actions:
- Grafana (tunnel SSH): http://localhost:3030 → dashboard Reboul Store — Logs
- Docker live: ./rcli server logs backend --errors --tail 100
- Events: ./rcli logs events --last 1h

Doc: obsidian-vault/Architecture/grafana.md
"

if [ -x "$ROOT/scripts/send-log-alert.py" ]; then
  echo "$BODY" | REBOUL_ROOT="$ROOT" python3 "$ROOT/scripts/send-log-alert.py" "$SUBJECT" \
    || echo "$BODY" >> /var/log/reboulstore-log-alerts.log
else
  echo "$(date -Iseconds) $SUBJECT" >> /var/log/reboulstore-log-alerts.log
  echo "$BODY" >> /var/log/reboulstore-log-alerts.log
fi
