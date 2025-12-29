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
# Dans GitHub Actions, on peut utiliser un fichier SSH ou l'agent SSH
# Si DEPLOY_SSH_KEY est défini et pointe vers un fichier, on l'utilise
# Sinon, on utilise l'agent SSH si GITHUB_ACTIONS est défini
if [ -n "$DEPLOY_SSH_KEY" ] && [ -f "$DEPLOY_SSH_KEY" ]; then
    USE_SSH_AGENT="false"  # On a un fichier, on l'utilise
elif [ -n "${GITHUB_ACTIONS:-}" ]; then
    USE_SSH_AGENT="true"   # GitHub Actions sans fichier = agent SSH
else
    USE_SSH_AGENT="false"  # Local = fichier SSH
fi
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

# Options SSH communes (pour éviter host key verification)
get_ssh_opts() {
    echo "-o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"
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
    
    # Options SSH pour éviter les problèmes de host key verification
    SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"
    
    # Test de connexion avec debug
    info "Tentative de connexion à $SERVER_USER@$SERVER_HOST..."
    SSH_OUTPUT=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST 'echo \"Connexion OK\"'" 2>&1)
    SSH_EXIT_CODE=$?
    
    if [ $SSH_EXIT_CODE -eq 0 ]; then
        info "✅ Connexion SSH réussie"
    else
        error "❌ Impossible de se connecter au serveur (code: $SSH_EXIT_CODE)"
        if [ "$VERBOSE" = true ] || [ "$USE_SSH_AGENT" = "true" ]; then
            error "Détails de l'erreur SSH:"
            echo "$SSH_OUTPUT" | while IFS= read -r line; do
                error "   $line"
            done
        fi
        error ""
        error "Vérifiez:"
        error "   - L'adresse du serveur: $SERVER_HOST"
        error "   - L'utilisateur: $SERVER_USER"
        if [ "$USE_SSH_AGENT" != "true" ]; then
            error "   - La clé SSH: $SSH_KEY"
            error "   - La clé SSH est autorisée sur le serveur: ssh-copy-id $SERVER_USER@$SERVER_HOST"
        else
            error "   - La clé SSH dans GitHub Secrets (DEPLOY_SSH_KEY) est correcte"
            error "   - La clé SSH publique correspondante est dans ~/.ssh/authorized_keys sur le serveur"
        fi
        exit 1
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
    SSH_OPTS=$(get_ssh_opts)
    RSYNC_CMD="rsync -avz --delete --exclude-from=$EXCLUDE_FILE"
    RSYNC_CMD="$RSYNC_CMD -e \"$SSH_CMD $SSH_OPTS\""
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

# Création de .env.production sur le serveur (si nécessaire)
section "📝 Configuration .env.production sur le serveur"

if [ "$DRY_RUN" = false ]; then
    info "Création de .env.production sur le serveur avec les variables d'environnement..."
    
    # Créer le fichier .env.production localement d'abord
    ENV_FILE=$(mktemp)
    cat > "$ENV_FILE" <<EOF
# Variables d'environnement PRODUCTION
# Généré automatiquement par deploy-prod.sh

# BASE DE DONNÉES PostgreSQL
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_DATABASE}
DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}

# BACKEND - JWT & Authentification
JWT_SECRET=${JWT_SECRET}

# STRIPE - Paiements
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}

# CLOUDINARY - Images
CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# FRONTEND - URLs
FRONTEND_URL=${FRONTEND_URL:-https://www.reboulstore.com}
VITE_API_URL=${VITE_API_URL:-https://www.reboulstore.com/api}

# ADMIN CENTRAL
REBOUL_DB_USER=${DB_USERNAME}
REBOUL_DB_PASSWORD=${DB_PASSWORD}
REBOUL_DB_NAME=${DB_DATABASE}
EOF
    
    # Upload .env.production sur le serveur avec scp
    SSH_CMD=$(build_ssh_cmd)
    SSH_OPTS=$(get_ssh_opts)
    
    # Utiliser scp pour uploader le fichier
    if [ "$USE_SSH_AGENT" = "true" ]; then
        # Dans GitHub Actions avec agent SSH, utiliser scp sans -i
        if scp $SSH_OPTS "$ENV_FILE" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/.env.production"; then
            info "✅ .env.production créé sur le serveur"
        else
            warn "⚠️  Échec de l'upload de .env.production, essai avec SSH..."
            # Fallback : utiliser SSH avec cat
            if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"cat > $SERVER_PATH/.env.production\"" < "$ENV_FILE"; then
                info "✅ .env.production créé sur le serveur (via SSH)"
            else
                warn "⚠️  Échec de la création de .env.production, continuation..."
            fi
        fi
    else
        # En local, utiliser scp avec -i
        if scp -i "$SSH_KEY" $SSH_OPTS "$ENV_FILE" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/.env.production"; then
            info "✅ .env.production créé sur le serveur"
        else
            warn "⚠️  Échec de l'upload de .env.production, essai avec SSH..."
            # Fallback : utiliser SSH avec cat
            if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"cat > $SERVER_PATH/.env.production\"" < "$ENV_FILE"; then
                info "✅ .env.production créé sur le serveur (via SSH)"
            else
                warn "⚠️  Échec de la création de .env.production, continuation..."
            fi
        fi
    fi
    
    rm "$ENV_FILE"
else
    info "✅ Création .env.production (simulation)"
fi

# Redémarrage des services Docker sur le serveur
section "🔄 Redémarrage des services Docker"

if [ "$DRY_RUN" = false ]; then
    info "Redémarrage des services sur le serveur..."
    
    RESTART_CMD="cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production down && docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
    
    SSH_CMD=$(build_ssh_cmd)
    SSH_OPTS=$(get_ssh_opts)
    if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$RESTART_CMD\""; then
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
        SSH_CMD=$(build_ssh_cmd)
        if [ "$USE_SSH_AGENT" = "true" ]; then
            warn "⚠️  Vérifiez manuellement: $SSH_CMD $SERVER_USER@$SERVER_HOST"
        else
            warn "⚠️  Vérifiez manuellement: $SSH_CMD $SERVER_USER@$SERVER_HOST"
        fi
    fi
else
    info "✅ Vérification healthcheck (simulation)"
fi

# Résumé final
section "✅ Déploiement terminé"

info "🌐 Site accessible sur: http://$SERVER_HOST"
SSH_CMD=$(build_ssh_cmd)
info "🔍 Vérifier les logs: $SSH_CMD $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml logs -f'"
info "📊 Statut: $SSH_CMD $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml ps'"

if [ "$BACKEND_READY" = false ] && [ "$DRY_RUN" = false ]; then
    warn "⚠️  Attention: Le backend n'a pas répondu au healthcheck"
    warn "⚠️  Vérifiez manuellement que tout fonctionne correctement"
fi

