#!/bin/bash

# Script de déploiement sur serveur de production
# Usage: ./scripts/deploy-prod.sh [--skip-check] [--skip-backup] [--dry-run]

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables (à configurer selon votre serveur)
# Parser DEPLOY_HOST qui peut être au format "user@host" ou juste "host"
if [[ "$DEPLOY_HOST" == *"@"* ]]; then
    SERVER_USER="${DEPLOY_HOST%%@*}"
    SERVER_HOST="${DEPLOY_HOST#*@}"
else
    SERVER_USER="${DEPLOY_USER:-root}"
    SERVER_HOST="${DEPLOY_HOST:-}"
fi
SERVER_PATH="${DEPLOY_PATH:-/var/www/reboulstore}"
SSH_KEY="${DEPLOY_SSH_KEY:-~/.ssh/id_rsa}"
# Dans GitHub Actions, la clé SSH est dans l'agent SSH, pas dans un fichier
USE_SSH_AGENT="${GITHUB_ACTIONS:-false}"
SKIP_CHECK=false

# Fonction pour construire la commande SSH
build_ssh_cmd() {
    if [ "$USE_SSH_AGENT" = "true" ]; then
        # Dans GitHub Actions, utiliser l'agent SSH (clé déjà chargée)
        echo "ssh"
    else
        # En local, utiliser la clé SSH spécifiée
        echo "ssh -i \"$SSH_KEY\""
    fi
}
SKIP_BACKUP=false
DRY_RUN=false

# Fonction pour afficher les messages
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

section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Fonction d'aide
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Variables d'environnement requises:"
    echo "  DEPLOY_HOST      Adresse du serveur (ex: example.com)"
    echo "  DEPLOY_USER      Utilisateur SSH (défaut: root)"
    echo "  DEPLOY_PATH      Chemin sur le serveur (défaut: /var/www/reboulstore)"
    echo "  DEPLOY_SSH_KEY   Chemin vers la clé SSH (défaut: ~/.ssh/id_rsa)"
    echo ""
    echo "Options:"
    echo "  --skip-check     Déployer sans vérification préalable"
    echo "  --skip-backup     Déployer sans backup de la base de données"
    echo "  --dry-run         Simuler le déploiement sans rien faire"
    echo "  --help            Afficher cette aide"
    echo ""
    echo "Exemple:"
    echo "  DEPLOY_HOST=example.com DEPLOY_USER=deploy DEPLOY_PATH=/var/www/reboulstore $0"
}

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-check)
            SKIP_CHECK=true
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Option inconnue: $1\nUtilisez --help pour voir les options disponibles"
            ;;
    esac
done

section "🚀 Déploiement sur Serveur de Production"

# Vérifier les variables d'environnement
if [ -z "$SERVER_HOST" ]; then
    error "DEPLOY_HOST n'est pas défini. Utilisez: DEPLOY_HOST=example.com $0"
fi

info "Configuration:"
info "  Serveur: $SERVER_USER@$SERVER_HOST"
info "  Chemin: $SERVER_PATH"
info "  Clé SSH: $SSH_KEY"

if [ "$DRY_RUN" = true ]; then
    warn "⚠️  Mode DRY-RUN activé (simulation uniquement)"
fi

# Vérification de build (sauf si --skip-check)
if [ "$SKIP_CHECK" = false ]; then
    section "🔍 Vérification préalable du build"
    
    if [ -f "scripts/check-build.sh" ]; then
        info "Exécution de check-build.sh..."
        if ./scripts/check-build.sh; then
            info "✅ Vérification réussie"
        else
            error "❌ Vérification échouée. Corrigez les erreurs avant de déployer."
        fi
    else
        warn "⚠️  Script check-build.sh non trouvé, vérification ignorée"
    fi
fi

# Vérifier la connexion SSH
section "🔐 Vérification de la connexion SSH"

if [ "$DRY_RUN" = false ]; then
    info "Test de connexion SSH..."
    SSH_CMD=$(build_ssh_cmd)
    if [ "$USE_SSH_AGENT" = "true" ]; then
        info "Mode GitHub Actions : utilisation de l'agent SSH"
    else
        info "Mode local : utilisation de la clé SSH: $SSH_KEY"
    fi
    if eval "$SSH_CMD -o ConnectTimeout=5 $SERVER_USER@$SERVER_HOST 'echo \"Connexion OK\"'" > /dev/null 2>&1; then
        info "✅ Connexion SSH réussie"
    else
        error "❌ Impossible de se connecter au serveur. Vérifiez:"
        error "   - L'adresse du serveur: $SERVER_HOST"
        error "   - L'utilisateur: $SERVER_USER"
        if [ "$USE_SSH_AGENT" != "true" ]; then
            error "   - La clé SSH: $SSH_KEY"
        else
            error "   - La clé SSH dans GitHub Secrets (DEPLOY_SSH_KEY)"
        fi
    fi
else
    info "✅ Connexion SSH (simulation)"
fi

# Backup de la base de données (sauf si --skip-backup)
if [ "$SKIP_BACKUP" = false ]; then
    section "💾 Backup de la base de données"
    
    if [ "$DRY_RUN" = false ]; then
        info "Création d'un backup sur le serveur..."
        BACKUP_CMD="cd $SERVER_PATH && ./scripts/backup-db.sh"
        
        SSH_CMD=$(build_ssh_cmd)
        if eval "$SSH_CMD $SERVER_USER@$SERVER_HOST \"$BACKUP_CMD\""; then
            info "✅ Backup créé"
        else
            warn "⚠️  Échec du backup, continuation du déploiement"
        fi
    else
        info "✅ Backup (simulation)"
    fi
fi

# Build local des fichiers de production
section "📦 Build local"

info "Build frontend..."
if [ "$DRY_RUN" = false ]; then
    cd frontend
    if npm run build; then
        info "✅ Build frontend réussi"
    else
        error "❌ Échec build frontend"
    fi
    cd ..
else
    info "✅ Build frontend (simulation)"
fi

info "Build backend..."
if [ "$DRY_RUN" = false ]; then
    cd backend
    if npm run build; then
        info "✅ Build backend réussi"
    else
        error "❌ Échec build backend"
    fi
    cd ..
else
    info "✅ Build backend (simulation)"
fi

# Upload des fichiers sur le serveur
section "📤 Upload des fichiers sur le serveur"

if [ "$DRY_RUN" = false ]; then
    info "Upload des fichiers avec rsync..."
    
    # Exclure les fichiers inutiles
    EXCLUDE_FILE=$(mktemp)
    cat > "$EXCLUDE_FILE" <<EOF
node_modules/
.git/
.env.local
.env.development
*.log
.DS_Store
dist/
EOF
    
    # Upload avec rsync
    SSH_CMD=$(build_ssh_cmd)
    RSYNC_CMD="rsync -avz --delete --exclude-from=$EXCLUDE_FILE"
    RSYNC_CMD="$RSYNC_CMD -e \"$SSH_CMD\""
    RSYNC_CMD="$RSYNC_CMD ./ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/"
    
    if eval "$RSYNC_CMD"; then
        info "✅ Upload réussi"
    else
        error "❌ Échec de l'upload"
    fi
    
    rm "$EXCLUDE_FILE"
else
    info "✅ Upload (simulation)"
fi

# Redémarrage des services Docker sur le serveur
section "🔄 Redémarrage des services Docker"

if [ "$DRY_RUN" = false ]; then
    info "Redémarrage des services sur le serveur..."
    
    RESTART_CMD="cd $SERVER_PATH && docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up -d"
    
    SSH_CMD=$(build_ssh_cmd)
    if eval "$SSH_CMD $SERVER_USER@$SERVER_HOST \"$RESTART_CMD\""; then
        info "✅ Services redémarrés"
    else
        error "❌ Échec du redémarrage des services"
    fi
else
    info "✅ Redémarrage (simulation)"
fi

# Attendre que les services soient prêts
section "⏳ Attente du démarrage des services"

if [ "$DRY_RUN" = false ]; then
    info "Attente de 15 secondes..."
    sleep 15
    
    # Vérifier le healthcheck
    info "Vérification du healthcheck..."
    
    MAX_RETRIES=30
    RETRY_COUNT=0
    BACKEND_READY=false
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        HEALTH_URL="http://$SERVER_HOST:3001/health"
        if curl -f "$HEALTH_URL" > /dev/null 2>&1; then
            info "✅ Backend est prêt"
            BACKEND_READY=true
            break
        fi
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo -n "."
            sleep 2
        fi
    done
    
    echo ""
    
    if [ "$BACKEND_READY" = false ]; then
        warn "⚠️  Le backend ne répond pas après $MAX_RETRIES tentatives"
        warn "⚠️  Vérifiez manuellement: ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST"
    fi
else
    info "✅ Vérification healthcheck (simulation)"
fi

# Résumé final
section "✅ Déploiement terminé"

info "🌐 Site accessible sur: http://$SERVER_HOST"
info "🔍 Vérifier les logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml logs -f'"
info "📊 Statut: ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml ps'"

if [ "$BACKEND_READY" = false ] && [ "$DRY_RUN" = false ]; then
    warn "⚠️  Attention: Le backend n'a pas répondu au healthcheck"
    warn "⚠️  Vérifiez manuellement que tout fonctionne correctement"
fi

