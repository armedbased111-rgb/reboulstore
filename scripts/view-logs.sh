#!/bin/bash

# Script pour visualiser les logs centralisés de tous les services
# Usage: ./scripts/view-logs.sh [service_name] [--tail N] [--follow]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

SERVICE="${1:-}"
TAIL="${2:-100}"
FOLLOW="${3:-}"

# Vérifier que docker-compose existe
if ! command -v docker compose &> /dev/null; then
    echo "❌ docker compose n'est pas installé"
    exit 1
fi

# Fonction pour afficher les logs
show_logs() {
    local service=$1
    local tail_count=$2
    local follow_flag=$3
    
    if [ -n "$service" ]; then
        echo "📋 Logs du service: $service"
        if [ "$follow_flag" = "--follow" ]; then
            docker compose -f docker-compose.prod.yml --env-file .env.production logs --tail="$tail_count" --follow "$service"
        else
            docker compose -f docker-compose.prod.yml --env-file .env.production logs --tail="$tail_count" "$service"
        fi
    else
        echo "📋 Logs de tous les services"
        if [ "$follow_flag" = "--follow" ]; then
            docker compose -f docker-compose.prod.yml --env-file .env.production logs --tail="$tail_count" --follow
        else
            docker compose -f docker-compose.prod.yml --env-file .env.production logs --tail="$tail_count"
        fi
    fi
}

# Parser les arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [service_name] [--tail N] [--follow]"
    echo ""
    echo "Exemples:"
    echo "  $0                    # Affiche les 100 dernières lignes de tous les services"
    echo "  $0 backend            # Affiche les 100 dernières lignes du backend"
    echo "  $0 backend --tail 50  # Affiche les 50 dernières lignes du backend"
    echo "  $0 backend --follow   # Suit les logs en temps réel du backend"
    echo ""
    echo "Services disponibles:"
    echo "  - backend"
    echo "  - frontend"
    echo "  - nginx"
    echo "  - postgres"
    exit 0
fi

# Parser --tail
if [[ "$*" == *"--tail"* ]]; then
    TAIL=$(echo "$*" | grep -oP '--tail \K\d+')
fi

# Parser --follow
if [[ "$*" == *"--follow"* ]] || [[ "$*" == *"-f"* ]]; then
    FOLLOW="--follow"
fi

# Extraire le nom du service (premier argument qui n'est pas une option)
for arg in "$@"; do
    if [[ ! "$arg" =~ ^-- ]]; then
        if [ -z "$SERVICE" ] || [ "$SERVICE" = "$arg" ]; then
            SERVICE="$arg"
        fi
    fi
done

# Afficher les logs
show_logs "$SERVICE" "$TAIL" "$FOLLOW"
