#!/bin/bash
# Démarre Loki + Promtail + Grafana (Phase 3 logs)
# Sur le VPS : cd /var/www/reboulstore && ./scripts/setup-observability.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.observability"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.observability.yml"

cd "$PROJECT_ROOT"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Créer $ENV_FILE depuis .env.observability.example"
  exit 1
fi

if ! docker network inspect reboulstore-network >/dev/null 2>&1; then
  echo "❌ Réseau reboulstore-network absent — lancer d'abord la stack prod"
  exit 1
fi

echo "🚀 Démarrage observability (Loki + Promtail + Grafana)..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

echo ""
echo "✅ Stack observability démarrée"
echo "   Grafana : http://127.0.0.1:3030 (sur le VPS)"
echo "   Tunnel local : ssh -L 3030:127.0.0.1:3030 deploy@152.228.218.35 -N"
echo "   Puis ouvrir http://localhost:3030"
echo ""
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
