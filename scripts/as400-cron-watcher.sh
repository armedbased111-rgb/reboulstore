#!/usr/bin/env bash
# Surveille le cron AS400 sortant (~1h). Usage: ./scripts/as400-cron-watcher.sh
set -euo pipefail

DURATION_SEC="${1:-3600}"
INTERVAL_SEC="${2:-120}"
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/id_ed25519}"
HOST="${DEPLOY_HOST:-deploy@152.228.218.35}"
LOG_FILE="${LOG_FILE:-/tmp/as400-cron-watcher.log}"
TEST_SKU="${TEST_SKU:-099T-BLACK-L}"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== AS400 cron watcher — $(date -u '+%Y-%m-%d %H:%M:%S UTC') ==="
echo "Duration: ${DURATION_SEC}s | Interval: ${INTERVAL_SEC}s | SKU test: ${TEST_SKU}"
echo "Log file: ${LOG_FILE}"

check_once() {
  local ts
  ts=$(date -u '+%H:%M:%S UTC')
  echo ""
  echo "--- Poll ${ts} ---"

  ssh -i "$SSH_KEY" -o ConnectTimeout=15 -o StrictHostKeyChecking=no "$HOST" bash -s <<REMOTE
set -e
echo "Backend cron logs (last 3):"
docker logs reboulstore-backend-prod 2>&1 | grep -E 'Cron job: AS400|AS400 cron export' | tail -3 || echo "(none yet)"

echo "CSV file:"
docker exec reboulstore-backend-prod stat -c 'mtime=%y size=%s' /var/sftp/as400/sortant/produits_reboul.csv 2>/dev/null || echo "missing"

echo "CSV lines:"
docker exec reboulstore-backend-prod wc -l /var/sftp/as400/sortant/produits_reboul.csv 2>/dev/null || true

echo "Header:"
docker exec reboulstore-backend-prod head -1 /var/sftp/as400/sortant/produits_reboul.csv 2>/dev/null || true

echo "Test SKU lines:"
docker exec reboulstore-backend-prod grep '${TEST_SKU}' /var/sftp/as400/sortant/produits_reboul.csv 2>/dev/null || echo "(SKU not in file)"

lines=\$(docker exec reboulstore-backend-prod wc -l < /var/sftp/as400/sortant/produits_reboul.csv 2>/dev/null || echo 0)
hdr=\$(docker exec reboulstore-backend-prod head -1 /var/sftp/as400/sortant/produits_reboul.csv 2>/dev/null || true)
if [ "\$lines" -le 2 ] || echo "\$hdr" | grep -q '^change_type'; then
  echo "ALERT: CSV sortant invalide - relancer export full"
else
  echo "OK: full catalog present, \$lines lines"
fi
REMOTE
}

end=$((SECONDS + DURATION_SEC))
while (( SECONDS < end )); do
  check_once
  remain=$((end - SECONDS))
  if (( remain <= 0 )); then
    break
  fi
  sleep_sec=$INTERVAL_SEC
  if (( remain < sleep_sec )); then
    sleep_sec=$remain
  fi
  sleep "$sleep_sec"
done

echo ""
echo "=== Watcher finished — $(date -u '+%Y-%m-%d %H:%M:%S UTC') ==="
