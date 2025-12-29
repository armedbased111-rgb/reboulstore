#!/bin/bash

# Script de gestion du tunnel SSH pour la base de données de production
# Usage: ./scripts/db-tunnel.sh [start|stop|status|restart]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (peut être surchargée par .env.local)
SSH_HOST="${DB_SSH_HOST:-152.228.218.35}"
SSH_USER="${DB_SSH_USER:-deploy}"
SSH_KEY="${DB_SSH_KEY:-~/.ssh/id_ed25519}"
SSH_PORT="${DB_SSH_PORT:-22}"
LOCAL_PORT="${DB_TUNNEL_LOCAL_PORT:-5433}"
REMOTE_PORT="${DB_TUNNEL_REMOTE_PORT:-5432}"

# PID file pour le tunnel
PID_FILE="/tmp/reboulstore-db-tunnel.pid"

# Fonction pour afficher les messages
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Vérifier si le tunnel est actif
is_tunnel_active() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Démarrer le tunnel
start_tunnel() {
    if is_tunnel_active; then
        warn "Tunnel SSH déjà actif (PID: $(cat $PID_FILE))"
        return 0
    fi

    info "Démarrage du tunnel SSH..."
    info "  Serveur: $SSH_USER@$SSH_HOST"
    info "  Port local: $LOCAL_PORT → Port distant: $REMOTE_PORT"

    # Construire la commande SSH
    # Important: On fait un tunnel vers localhost:5432 sur le serveur, puis Docker route vers le container
    # Mais PostgreSQL dans Docker écoute sur son propre réseau Docker, pas sur localhost
    # On doit donc créer un tunnel vers le container directement via Docker
    # Méthode: On crée un port-forward Docker depuis le serveur vers localhost, puis on tunnel vers ce port-forward
    # OU on fait un tunnel SSH qui expose directement le réseau Docker
    
    # Option 1: Tunnel vers localhost:5432 (nécessite que PostgreSQL soit accessible depuis localhost sur le serveur)
    # Option 2: Utiliser socat ou un autre outil pour exposer le container
    # Pour l'instant, on essaie localhost - si ça ne marche pas, il faudra modifier
    
    SSH_CMD="ssh -f -N -L $LOCAL_PORT:localhost:$REMOTE_PORT"
    
    # Ajouter la clé SSH si spécifiée
    if [ -n "$SSH_KEY" ] && [ "$SSH_KEY" != "~/.ssh/id_ed25519" ]; then
        SSH_CMD="$SSH_CMD -i $SSH_KEY"
    fi
    
    SSH_CMD="$SSH_CMD $SSH_USER@$SSH_HOST"

    # Démarrer le tunnel en arrière-plan
    if eval "$SSH_CMD"; then
        # Trouver le PID du processus SSH
        sleep 1
        PID=$(pgrep -f "ssh.*-L $LOCAL_PORT:localhost:$REMOTE_PORT.*$SSH_USER@$SSH_HOST" | head -1)
        if [ -n "$PID" ]; then
            echo "$PID" > "$PID_FILE"
            success "Tunnel SSH démarré avec succès (PID: $PID)"
            info "Base de données accessible sur localhost:$LOCAL_PORT"
            info "Pour arrêter le tunnel: ./scripts/db-tunnel.sh stop"
        else
            error "Impossible de trouver le PID du tunnel SSH"
            return 1
        fi
    else
        error "Échec du démarrage du tunnel SSH"
        return 1
    fi
}

# Arrêter le tunnel
stop_tunnel() {
    if ! is_tunnel_active; then
        warn "Tunnel SSH non actif"
        return 0
    fi

    PID=$(cat "$PID_FILE")
    info "Arrêt du tunnel SSH (PID: $PID)..."

    if kill "$PID" 2>/dev/null; then
        rm -f "$PID_FILE"
        success "Tunnel SSH arrêté avec succès"
    else
        error "Impossible d'arrêter le tunnel SSH (processus peut-être déjà terminé)"
        rm -f "$PID_FILE"
        return 1
    fi
}

# Statut du tunnel
status_tunnel() {
    if is_tunnel_active; then
        PID=$(cat "$PID_FILE")
        success "Tunnel SSH actif (PID: $PID)"
        info "  Serveur: $SSH_USER@$SSH_HOST"
        info "  Port local: $LOCAL_PORT → Port distant: $REMOTE_PORT"
        echo ""
        info "Pour arrêter: ./scripts/db-tunnel.sh stop"
        return 0
    else
        warn "Tunnel SSH non actif"
        info "Pour démarrer: ./scripts/db-tunnel.sh start"
        return 1
    fi
}

# Redémarrer le tunnel
restart_tunnel() {
    stop_tunnel
    sleep 1
    start_tunnel
}

# Aide
show_help() {
    echo "Usage: $0 [start|stop|status|restart]"
    echo ""
    echo "Gestion du tunnel SSH pour la base de données de production"
    echo ""
    echo "Commandes:"
    echo "  start    - Démarrer le tunnel SSH"
    echo "  stop     - Arrêter le tunnel SSH"
    echo "  status   - Afficher le statut du tunnel"
    echo "  restart  - Redémarrer le tunnel SSH"
    echo ""
    echo "Variables d'environnement (optionnelles):"
    echo "  DB_SSH_HOST              - Adresse du serveur (défaut: 152.228.218.35)"
    echo "  DB_SSH_USER              - Utilisateur SSH (défaut: deploy)"
    echo "  DB_SSH_KEY               - Chemin vers la clé SSH (défaut: ~/.ssh/id_ed25519)"
    echo "  DB_TUNNEL_LOCAL_PORT     - Port local (défaut: 5433)"
    echo "  DB_TUNNEL_REMOTE_PORT    - Port distant (défaut: 5432)"
    echo ""
    echo "Exemple:"
    echo "  $0 start"
    echo "  $0 status"
    echo "  $0 stop"
}

# Main
case "${1:-}" in
    start)
        start_tunnel
        ;;
    stop)
        stop_tunnel
        ;;
    status)
        status_tunnel
        ;;
    restart)
        restart_tunnel
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            status_tunnel
        else
            error "Commande inconnue: $1"
            echo ""
            show_help
            exit 1
        fi
        ;;
esac

