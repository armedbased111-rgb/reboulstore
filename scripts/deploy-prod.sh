#!/bin/bash

# Script de déploiement sur serveur de production
# Usage: ./scripts/deploy-prod.sh [--skip-check] [--skip-backup] [--dry-run]
#
# RÈGLES DE BUILD :
# - Supprime TOUJOURS les anciennes images Docker AVANT de builder (plus rapide)
# - S'applique à Reboul Store ET Admin Central
# - Supprime les volumes de build pour garantir un build propre
# - Utilise --no-cache pour éviter les problèmes de cache
#
# ⚠️ RÈGLE CRITIQUE : Suppression UNIQUEMENT sur le serveur
# - Les images Docker locales ne sont JAMAIS supprimées
# - Toutes les commandes docker rmi sont exécutées via SSH sur le serveur distant
# - Vos images locales restent intactes pour vos tests locaux

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

# Protection des fichiers .env.production (AVANT tout) - OBLIGATOIRE
section "🔒 Protection des fichiers .env.production (OBLIGATOIRE)"

if [ "$DRY_RUN" = false ]; then
    # 1. Sauvegarder les fichiers existants
    info "Sauvegarde des fichiers .env.production avant déploiement..."
    if ./scripts/protect-env-files.sh --backup; then
        info "✅ Fichiers .env.production sauvegardés"
    else
        warn "⚠️  Échec de la sauvegarde des fichiers .env.production"
    fi
    
    # 2. Vérifier OBLIGATOIREMENT que les fichiers existent
    info "Vérification OBLIGATOIRE des fichiers .env.production..."
    
    # Vérifier Reboul Store (OBLIGATOIRE)
    REBOUL_ENV_CHECK="test -f $SERVER_PATH/.env.production && echo 'exists' || echo 'missing'"
    REBOUL_ENV_STATUS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$REBOUL_ENV_CHECK\"")
    
    if echo "$REBOUL_ENV_STATUS" | grep -q "missing"; then
        error "❌ ERREUR CRITIQUE: Reboul Store .env.production MANQUANT"
        error "❌ Le build est INTERDIT sans ce fichier"
        error "❌ Restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
        error "❌ OU créez le fichier manuellement sur le serveur"
        exit 1
    fi
    
    # Vérifier que le fichier Reboul Store n'est pas vide
    REBOUL_ENV_SIZE=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"wc -c < $SERVER_PATH/.env.production\"")
    if [ "$REBOUL_ENV_SIZE" -eq 0 ]; then
        error "❌ ERREUR CRITIQUE: Reboul Store .env.production est VIDE"
        error "❌ Le build est INTERDIT avec un fichier vide"
        error "❌ Restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
        exit 1
    fi
    
    info "✅ Reboul Store .env.production présent et valide"
    
    # Vérifier Admin Central (si configuré)
    ADMIN_CHECK_CMD="test -d $SERVER_PATH/admin-central && test -f $SERVER_PATH/admin-central/docker-compose.prod.yml && echo 'exists' || echo 'not_found'"
    ADMIN_EXISTS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$ADMIN_CHECK_CMD\"")
    
    if echo "$ADMIN_EXISTS" | grep -q "exists"; then
        ADMIN_ENV_CHECK="test -f $SERVER_PATH/admin-central/.env.production && echo 'exists' || echo 'missing'"
        ADMIN_ENV_STATUS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$ADMIN_ENV_CHECK\"")
        
        if echo "$ADMIN_ENV_STATUS" | grep -q "missing"; then
            warn "⚠️  Admin Central .env.production manquant, tentative de création automatique..."
            if ./scripts/protect-env-files.sh --auto-create-admin; then
                info "✅ Admin Central .env.production créé automatiquement"
            else
                error "❌ ERREUR CRITIQUE: Impossible de créer Admin Central .env.production"
                error "❌ Le build est INTERDIT sans ce fichier"
                error "❌ Utilisez: ./scripts/setup-admin-env.sh"
                exit 1
            fi
        else
            # Vérifier que le fichier Admin Central n'est pas vide
            ADMIN_ENV_SIZE=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"wc -c < $SERVER_PATH/admin-central/.env.production\"")
            if [ "$ADMIN_ENV_SIZE" -eq 0 ]; then
                error "❌ ERREUR CRITIQUE: Admin Central .env.production est VIDE"
                error "❌ Le build est INTERDIT avec un fichier vide"
                error "❌ Restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
                exit 1
            fi
            info "✅ Admin Central .env.production présent et valide"
        fi
    else
        info "ℹ️  Admin Central non configuré, ignoré"
    fi
    
    info "✅ Tous les fichiers .env.production requis sont présents et valides"
else
    info "✅ Protection .env.production (simulation)"
fi

# Backup de la base de données (sauf si --skip-backup)
if [ "$SKIP_BACKUP" = false ]; then
    section "💾 Backup de la base de données"
    
    if [ "$DRY_RUN" = false ]; then
        info "Création d'un backup sur le serveur..."
        BACKUP_CMD="cd $SERVER_PATH && ./scripts/backup-db.sh"
        
        SSH_CMD=$(build_ssh_cmd)
        SSH_OPTS=$(get_ssh_opts)
        if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$BACKUP_CMD\""; then
            info "✅ Backup créé"
            
            # Vérifier que le backup contient des données
            info "Vérification du contenu du backup..."
            LATEST_BACKUP_CMD="ls -t $SERVER_PATH/backups/reboulstore_db_*.sql.gz 2>/dev/null | head -1"
            LATEST_BACKUP=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$LATEST_BACKUP_CMD\"")
            
            if [ -n "$LATEST_BACKUP" ]; then
                # Vérifier la taille du backup
                BACKUP_SIZE_CMD="du -h $LATEST_BACKUP | cut -f1"
                BACKUP_SIZE=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$BACKUP_SIZE_CMD\"")
                
                # Vérifier qu'il contient des INSERT (données)
                BACKUP_CONTENT_CMD="zcat $LATEST_BACKUP | grep -c 'INSERT INTO' || echo '0'"
                INSERT_COUNT=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$BACKUP_CONTENT_CMD\"")
                
                info "  📊 Taille: $BACKUP_SIZE"
                info "  📊 INSERT statements: $INSERT_COUNT"
                
                if [ "$INSERT_COUNT" -eq "0" ]; then
                    warn "⚠️  Le backup semble vide (0 INSERT). La base de données était peut-être vide."
                else
                    info "✅ Backup valide avec $INSERT_COUNT INSERT statements"
                fi
            else
                warn "⚠️  Aucun backup trouvé (peut-être première installation)"
            fi
        else
            warn "⚠️  Échec du backup, continuation du déploiement"
        fi
    else
        info "✅ Backup (simulation)"
    fi
fi

# Build local des fichiers de production (compilation TypeScript/React + test Docker)
section "📦 Build local (compilation + test Docker)"

info "⚠️  IMPORTANT : On teste d'abord que le code compile ET que les images Docker se buildent correctement."
info "⚠️  Les images Docker seront rebuildées sur le serveur, mais on vérifie qu'elles fonctionnent en local d'abord."

info "Build frontend (compilation TypeScript/React)..."
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

info "Build backend (compilation TypeScript/NestJS)..."
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

# Test des builds Docker localement (optionnel mais recommandé)
info "Test des builds Docker localement (vérification que les Dockerfiles fonctionnent)..."
if [ "$DRY_RUN" = false ]; then
    info "  → Build test frontend Docker..."
    if docker build -t reboulstore-frontend-test --target builder ./frontend -f ./frontend/Dockerfile.prod > /dev/null 2>&1; then
        info "✅ Build Docker frontend test réussi"
        docker rmi reboulstore-frontend-test > /dev/null 2>&1 || true
    else
        warn "⚠️  Build Docker frontend test échoué (peut-être normal si Docker n'est pas disponible localement)"
    fi
    
    info "  → Build test backend Docker..."
    if docker build -t reboulstore-backend-test ./backend -f ./backend/Dockerfile.prod > /dev/null 2>&1; then
        info "✅ Build Docker backend test réussi"
        docker rmi reboulstore-backend-test > /dev/null 2>&1 || true
    else
        warn "⚠️  Build Docker backend test échoué (peut-être normal si Docker n'est pas disponible localement)"
    fi
else
    info "✅ Test Docker (simulation)"
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
nginx/ssl/*.pem
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

# Vérification de .env.production sur le serveur
section "📝 Configuration .env.production sur le serveur"

if [ "$DRY_RUN" = false ]; then
    SSH_CMD=$(build_ssh_cmd)
    SSH_OPTS=$(get_ssh_opts)
    
    # Vérifier si .env.production existe déjà sur le serveur
    if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST '[ -f $SERVER_PATH/.env.production ]'"; then
        info "✅ .env.production existe déjà sur le serveur, conservation du fichier existant"
        info "⚠️  Pour modifier .env.production, éditez-le directement sur le serveur ou utilisez votre fichier local .env.production"
    else
        warn "⚠️  .env.production n'existe pas sur le serveur"
        warn "⚠️  Veuillez créer ce fichier manuellement avec toutes les variables nécessaires"
        warn "⚠️  Voir env.production.example pour un exemple"
            fi
else
    info "✅ Vérification .env.production (simulation)"
fi

# Redémarrage des services Docker sur le serveur
section "🔄 Redémarrage des services Docker sur le serveur"

info "⚠️  IMPORTANT : Les images Docker sont buildées UNIQUEMENT sur le serveur."
info "⚠️  Vos images Docker locales ne sont PAS touchées."

if [ "$DRY_RUN" = false ]; then
    info "Arrêt des services et nettoyage sur le serveur..."
    
    SSH_CMD=$(build_ssh_cmd)
    SSH_OPTS=$(get_ssh_opts)
    
    # 1. Arrêter tous les services sur le serveur
    DOWN_CMD="cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production down"
    if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$DOWN_CMD\""; then
        info "✅ Services arrêtés"
    else
        warn "⚠️  Échec de l'arrêt des services (peut-être déjà arrêtés)"
    fi
    
    # 2. Supprimer les anciennes images Docker AVANT de builder (plus rapide et libère l'espace)
    # RÈGLE CRITIQUE : On supprime TOUJOURS les anciennes images avant de builder pour :
    # - Libérer l'espace disque immédiatement
    # - Éviter les conflits de tags
    # - Accélérer le processus de build
    # ⚠️ IMPORTANT : Suppression UNIQUEMENT sur le serveur (via SSH), JAMAIS les images locales !
    
    info "Suppression des anciennes images Docker sur le serveur (AVANT build)..."
    info "  ⚠️  UNIQUEMENT sur le serveur - Les images locales ne sont PAS touchées"
    info "  → Reboul Store: reboulstore-frontend, reboulstore-backend"
    info "  → Admin Central: admin-central-frontend, admin-central-backend"
    
    # Supprimer les images Reboul Store (COMMANDE EXÉCUTÉE SUR LE SERVEUR via SSH)
    REBOUL_IMAGES="reboulstore-frontend:latest reboulstore-backend:latest"
    # Supprimer les images Admin Central (si elles existent)
    ADMIN_IMAGES="admin-central-frontend:latest admin-central-backend:latest"
    
    # Exécution sur le serveur uniquement (via SSH)
    IMAGE_RM_CMD="docker rmi -f $REBOUL_IMAGES $ADMIN_IMAGES 2>/dev/null || true"
    eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$IMAGE_RM_CMD\"" || true
    info "✅ Anciennes images supprimées sur le serveur (ou n'existaient pas)"
    
    # Nettoyage des images Docker orphelines (dangling images)
    info "Nettoyage des images Docker orphelines sur le serveur..."
    CLEANUP_CMD="docker image prune -f 2>/dev/null || true"
    eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$CLEANUP_CMD\"" || true
    
    # 3. Supprimer les volumes de build pour garantir un build propre
    # ⚠️ CRITIQUE : On supprime les volumes AVANT de builder pour que :
    # - Le volume soit créé vide au démarrage
    # - Le script d'init du Dockerfile copie les fichiers depuis l'image vers le volume
    # - On évite que l'ancien volume écrase les nouveaux fichiers
    # ⚠️⚠️⚠️ PROTECTION BASES DE DONNÉES : On ne supprime JAMAIS les volumes de base de données
    info "Suppression des volumes de build (frontend_build) pour garantir un build frais..."
    info "  → Reboul Store: reboulstore_frontend_build"
    info "  → Admin Central: admin_central_frontend_build"
    info "  ⚠️  IMPORTANT : Les volumes seront recréés vides au démarrage, et les fichiers seront copiés depuis l'image"
    info "  🔒 PROTECTION : Les volumes de base de données (postgres_data_prod) sont TOUJOURS préservés"
    
    # Arrêter les services SANS supprimer les volumes (pour préserver les bases de données)
    info "  → Arrêt des services (sans supprimer les volumes de base de données)..."
    DOWN_CMD="cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production down"
    eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$DOWN_CMD\"" || true
    
    # Supprimer UNIQUEMENT les volumes de build frontend (PAS les bases de données)
    # Liste des volumes à NE JAMAIS SUPPRIMER :
    # - reboulstore_postgres_prod (base de données Reboul Store)
    # - postgres_data_prod (si nommé différemment)
    # - Tous les volumes contenant "postgres" ou "db" ou "database"
    info "  → Suppression UNIQUEMENT des volumes de build frontend..."
    VOLUME_RM_CMD="docker volume rm reboulstore_frontend_build admin_central_frontend_build 2>/dev/null || true"
    eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$VOLUME_RM_CMD\"" || true
    info "✅ Volumes de build supprimés (ou n'existaient pas)"
    
    # Vérification que les volumes de base de données sont toujours présents
    info "Vérification que les volumes de base de données sont préservés..."
    DB_VOLUMES_CHECK="docker volume ls | grep -E '(postgres|db|database)' || echo 'Aucun volume de base de données trouvé (normal si première installation)'"
    DB_VOLUMES=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$DB_VOLUMES_CHECK\"")
    if echo "$DB_VOLUMES" | grep -q "postgres\|db\|database"; then
        info "✅ Volumes de base de données préservés :"
        echo "$DB_VOLUMES" | while read line; do
            info "    → $line"
        done
    else
        info "ℹ️  Aucun volume de base de données existant (première installation ou nom différent)"
    fi
    
    # 4. Rebuild TOUT (frontend ET backend) avec --no-cache pour garantir un build propre
    # ⚠️ OBLIGATOIRE: Vérifier que .env.production existe AVANT de builder
    info "Vérification finale que .env.production existe avant build Reboul Store..."
    REBOUL_ENV_FINAL_CHECK="test -f $SERVER_PATH/.env.production && echo 'exists' || echo 'missing'"
    REBOUL_ENV_FINAL_STATUS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$REBOUL_ENV_FINAL_CHECK\"")
    
    if echo "$REBOUL_ENV_FINAL_STATUS" | grep -q "missing"; then
        error "❌ ERREUR CRITIQUE: Reboul Store .env.production MANQUANT avant build"
        error "❌ Le build est INTERDIT sans ce fichier"
        error "❌ Restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
        error "❌ OU créez le fichier manuellement sur le serveur"
        exit 1
    fi
    
    # Vérifier que le fichier n'est pas vide
    REBOUL_ENV_SIZE=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"wc -c < $SERVER_PATH/.env.production\"")
    if [ "$REBOUL_ENV_SIZE" -eq 0 ]; then
        error "❌ ERREUR CRITIQUE: Reboul Store .env.production est VIDE"
        error "❌ Le build est INTERDIT avec un fichier vide"
        error "❌ Restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
        exit 1
    fi
    
    info "Rebuild complet des services Reboul Store (frontend + backend) avec --no-cache..."
    REBUILD_CMD="cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend"
    
    if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$REBUILD_CMD\""; then
        info "✅ Services Reboul Store rebuild réussis"
    else
        error "❌ Échec du rebuild Reboul Store"
        error "❌ Vérifiez les logs pour identifier l'erreur"
        error "❌ Vérifiez que .env.production contient toutes les variables nécessaires"
        exit 1
    fi
    
    # 5. Rebuild Admin Central si le répertoire existe
    info "Vérification et rebuild Admin Central (si configuré)..."
    ADMIN_CHECK_CMD="test -d $SERVER_PATH/admin-central && test -f $SERVER_PATH/admin-central/docker-compose.prod.yml && echo 'exists' || echo 'not_found'"
    ADMIN_EXISTS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$ADMIN_CHECK_CMD\"")
    
    if echo "$ADMIN_EXISTS" | grep -q "exists"; then
        # Vérifier que .env.production existe AVANT de builder
        ADMIN_ENV_CHECK="test -f $SERVER_PATH/admin-central/.env.production && echo 'exists' || echo 'missing'"
        ADMIN_ENV_STATUS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$ADMIN_ENV_CHECK\"")
        
        if echo "$ADMIN_ENV_STATUS" | grep -q "missing"; then
            error "❌ ERREUR CRITIQUE: Admin Central .env.production MANQUANT avant build"
            error "❌ Le build est INTERDIT sans ce fichier"
            error "❌ Utilisez: ./scripts/setup-admin-env.sh"
            error "❌ OU restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
            exit 1
        fi
        
        # Vérifier que le fichier n'est pas vide
        ADMIN_ENV_SIZE=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"wc -c < $SERVER_PATH/admin-central/.env.production\"")
        if [ "$ADMIN_ENV_SIZE" -eq 0 ]; then
            error "❌ ERREUR CRITIQUE: Admin Central .env.production est VIDE avant build"
            error "❌ Le build est INTERDIT avec un fichier vide"
            error "❌ Restaurez depuis backup: ./scripts/protect-env-files.sh --restore"
            exit 1
        fi
        
        info "  → Admin Central trouvé, .env.production présent et valide, rebuild en cours..."
        ADMIN_REBUILD_CMD="cd $SERVER_PATH/admin-central && docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend"
        if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$ADMIN_REBUILD_CMD\""; then
            info "✅ Services Admin Central rebuild réussis"
        else
            error "❌ Échec du rebuild Admin Central"
            error "❌ Vérifiez les logs pour identifier l'erreur"
            error "❌ Vérifiez que .env.production contient toutes les variables nécessaires"
            exit 1
        fi
    else
        info "  → Admin Central non trouvé, ignoré"
    fi
    
    # 6. Démarrer tous les services avec les nouvelles images
    # ⚠️ IMPORTANT : Les volumes sont créés vides au démarrage
    # Le script d'init dans le Dockerfile copie les fichiers depuis /app/build vers /usr/share/nginx/html
    info "Démarrage des services Reboul Store avec les nouvelles images..."
    info "  → Les volumes seront créés vides, le script d'init copiera les fichiers depuis l'image"
    UP_CMD="cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
    
    if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$UP_CMD\""; then
        info "✅ Services Reboul Store redémarrés avec les nouvelles images"
        
        # Vérifier que les fichiers ont bien été copiés dans le volume
        info "Vérification que les fichiers frontend ont été copiés dans le volume..."
        sleep 3  # Attendre que le script d'init s'exécute
        CHECK_FILES_CMD="docker exec reboulstore-frontend-prod ls -la /usr/share/nginx/html/index.html 2>/dev/null && echo 'OK' || echo 'MISSING'"
        FILES_STATUS=$(eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$CHECK_FILES_CMD\"")
        if echo "$FILES_STATUS" | grep -q "OK"; then
            info "✅ Fichiers frontend copiés correctement dans le volume"
        else
            warn "⚠️  Les fichiers frontend ne semblent pas être présents (vérifier les logs du container)"
        fi
    else
        error "❌ Échec du démarrage des services Reboul Store"
    fi
    
    # 7. Démarrer Admin Central si configuré
    if echo "$ADMIN_EXISTS" | grep -q "exists"; then
        info "Démarrage des services Admin Central avec les nouvelles images..."
        ADMIN_UP_CMD="cd $SERVER_PATH/admin-central && docker compose -f docker-compose.prod.yml --env-file .env.production up -d"
        if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$ADMIN_UP_CMD\""; then
            info "✅ Services Admin Central redémarrés avec les nouvelles images"
    else
            warn "⚠️  Échec du démarrage Admin Central"
        fi
    fi
else
    info "✅ Redémarrage (simulation)"
fi

# Attendre que les services soient prêts
section "⏳ Attente du démarrage des services"

if [ "$DRY_RUN" = false ]; then
    info "Attente de 15 secondes..."
    sleep 15
    
    # Vérifier le healthcheck directement sur le serveur (plus fiable)
    info "Vérification du healthcheck..."
    
    MAX_RETRIES=20  # Réduit de 30 à 20 (40 secondes max au lieu de 60)
    RETRY_COUNT=0
    BACKEND_READY=false
    
    SSH_CMD=$(build_ssh_cmd)
    SSH_OPTS=$(get_ssh_opts)
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        # Vérifier directement depuis le serveur (plus fiable que depuis l'extérieur)
        HEALTH_CHECK_CMD="curl -f http://localhost:3001/health > /dev/null 2>&1 || curl -f http://backend:3001/health > /dev/null 2>&1"
        
        if eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST \"$HEALTH_CHECK_CMD\""; then
            info "✅ Backend est prêt"
            BACKEND_READY=true
            break
        fi
        
        # Afficher le statut des containers pour debug
        if [ $((RETRY_COUNT % 5)) -eq 0 ]; then
            info "Tentative $((RETRY_COUNT+1))/$MAX_RETRIES - Vérification des containers..."
            eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production ps'" || true
        fi
        
        echo -n "."
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT+1))
    done
    
    echo ""
    
    if [ "$BACKEND_READY" = false ]; then
        warn "⚠️  Le backend ne répond pas après $MAX_RETRIES tentatives."
        warn "Vérification des logs backend..."
        eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production logs backend --tail=50'" || true
        warn "Vérification du statut des containers..."
        eval "$SSH_CMD $SSH_OPTS $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production ps'" || true
    fi
else
    info "✅ Vérification healthcheck (simulation)"
fi

# Résumé final
section "✅ Déploiement terminé"

info "🌐 Site accessible sur: http://$SERVER_HOST"
SSH_CMD=$(build_ssh_cmd)
info "🔍 Vérifier les logs: $SSH_CMD $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production logs -f'"
info "📊 Statut: $SSH_CMD $SERVER_USER@$SERVER_HOST 'cd $SERVER_PATH && docker compose -f docker-compose.prod.yml --env-file .env.production ps'"

if [ "$BACKEND_READY" = false ] && [ "$DRY_RUN" = false ]; then
    warn "⚠️  Attention: Le backend n'a pas répondu au healthcheck"
    warn "⚠️  Vérifiez manuellement que tout fonctionne correctement"
fi

# Purge cache Cloudflare (si configuré)
if [ "$DRY_RUN" = false ] && [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
    section "🌐 Purge Cache Cloudflare"
    
    info "Purging du cache Cloudflare..."
    
    if ./scripts/cloudflare-purge.sh; then
        info "✅ Cache Cloudflare purgé"
    else
        warn "⚠️  Échec de la purge Cloudflare (le site fonctionne toujours)"
    fi
elif [ "$DRY_RUN" = false ] && [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    info "ℹ️  Purge Cloudflare ignorée (CLOUDFLARE_ZONE_ID non défini)"
fi

# Afficher les liens d'accès
info ""
info "🌐 Liens d'accès:"
info "   - Reboul Store: https://www.reboulstore.com"
info "   - Admin Central: https://admin.reboulstore.com"
info ""
info "💡 Pour purger le cache navigateur: Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows/Linux)"

