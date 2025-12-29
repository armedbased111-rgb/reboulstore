#!/bin/bash

# Script pour créer/gérer un proxy socat sur le serveur qui expose PostgreSQL sur localhost
# Usage: ./scripts/db-proxy-server.sh {start|stop|status}

set -e

# Charger les variables d'environnement depuis .env.local si disponible
if [ -f .env.local ]; then
    set -a
    source .env.local
    set +a
fi

# Configuration SSH (depuis .env.local ou valeurs par défaut)
SSH_HOST="${DB_SSH_HOST:-152.228.218.35}"
SSH_USER="${DB_SSH_USER:-deploy}"
SSH_KEY="${DB_SSH_KEY:-~/.ssh/id_ed25519}"
SSH_PORT="${DB_SSH_PORT:-22}"

# Nom du container proxy
PROXY_CONTAINER="reboulstore-db-forward"
POSTGRES_CONTAINER="reboulstore-postgres-prod"
NETWORK="reboulstore-network"

# Fonction pour exécuter une commande SSH
ssh_exec() {
    local command="$1"
    local key_file=$(eval echo "$SSH_KEY") # Expand ~
    
    if [ -f "$key_file" ]; then
        ssh -i "$key_file" -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$command"
    else
        ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$command"
    fi
}

# Démarrer le proxy
start_proxy() {
    echo "🚀 Démarrage du proxy PostgreSQL sur le serveur..."
    
    # Vérifier si le container existe déjà
    if ssh_exec "docker ps -a --format '{{.Names}}' | grep -q '^${PROXY_CONTAINER}$'" > /dev/null 2>&1; then
        echo "⚠️  Le container proxy existe déjà. Arrêt et suppression..."
        ssh_exec "docker stop $PROXY_CONTAINER 2>/dev/null || true"
        ssh_exec "docker rm $PROXY_CONTAINER 2>/dev/null || true"
    fi
    
    # Vérifier si le container PostgreSQL existe
    if ! ssh_exec "docker ps --format '{{.Names}}' | grep -q '^${POSTGRES_CONTAINER}$'" > /dev/null 2>&1; then
        echo "❌ Erreur: Le container PostgreSQL ($POSTGRES_CONTAINER) n'est pas en cours d'exécution."
        return 1
    fi
    
    # Créer le container proxy socat
    ssh_exec "docker run -d \
        --name $PROXY_CONTAINER \
        --network $NETWORK \
        -p 127.0.0.1:5432:5432 \
        --restart unless-stopped \
        alpine/socat \
        tcp-listen:5432,fork,reuseaddr tcp-connect:$POSTGRES_CONTAINER:5432" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Proxy PostgreSQL démarré avec succès"
        echo "   localhost:5432 -> $POSTGRES_CONTAINER:5432"
    else
        echo "❌ Échec du démarrage du proxy"
        return 1
    fi
}

# Arrêter le proxy
stop_proxy() {
    echo "🛑 Arrêt du proxy PostgreSQL..."
    
    if ssh_exec "docker ps --format '{{.Names}}' | grep -q '^${PROXY_CONTAINER}$'" > /dev/null 2>&1; then
        ssh_exec "docker stop $PROXY_CONTAINER"
        ssh_exec "docker rm $PROXY_CONTAINER"
        echo "✅ Proxy arrêté et supprimé"
    else
        echo "⚠️  Le proxy n'est pas en cours d'exécution"
    fi
}

# Statut du proxy
status_proxy() {
    echo "📊 Statut du proxy PostgreSQL sur le serveur:"
    
    if ssh_exec "docker ps --format '{{.Names}}' | grep -q '^${PROXY_CONTAINER}$'" > /dev/null 2>&1; then
        echo "✅ Proxy actif ($PROXY_CONTAINER)"
        ssh_exec "docker ps --filter name=$PROXY_CONTAINER --format '   {{.Status}}'"
    else
        echo "❌ Proxy inactif"
    fi
}

# Aide
show_help() {
    echo "Usage: $0 {start|stop|status}"
    echo ""
    echo "Gère le proxy socat qui expose PostgreSQL sur localhost du serveur"
    echo "pour permettre les connexions via tunnel SSH."
    echo ""
    echo "Commandes:"
    echo "  start   - Démarrer le proxy"
    echo "  stop    - Arrêter le proxy"
    echo "  status  - Afficher le statut"
}

# Main
case "${1:-}" in
    start)
        start_proxy
        ;;
    stop)
        stop_proxy
        ;;
    status)
        status_proxy
        ;;
    *)
        show_help
        exit 1
        ;;
esac

