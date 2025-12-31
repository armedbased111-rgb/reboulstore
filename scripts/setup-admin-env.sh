#!/bin/bash

# Script pour créer/configurer .env.production pour Admin Central sur le serveur
# Usage: ./scripts/setup-admin-env.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Variables
DEPLOY_HOST="${DEPLOY_HOST:-deploy@152.228.218.35}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/reboulstore}"
ADMIN_PATH="$DEPLOY_PATH/admin-central"

info "🔧 Configuration .env.production pour Admin Central"
info "Serveur: $DEPLOY_HOST"
info "Chemin: $ADMIN_PATH"

# Vérifier si le fichier existe déjà
info "Vérification si .env.production existe déjà..."
EXISTS=$(ssh "$DEPLOY_HOST" "test -f $ADMIN_PATH/.env.production && echo 'yes' || echo 'no'")

if [ "$EXISTS" = "yes" ]; then
    warn "⚠️  Le fichier .env.production existe déjà sur le serveur"
    read -p "Voulez-vous le remplacer ? (o/n) " REPLACE
    if [ "$REPLACE" != "o" ] && [ "$REPLACE" != "O" ]; then
        info "Configuration annulée"
        exit 0
    fi
fi

# Lire les valeurs depuis Reboul Store .env.production (si disponible)
info "Récupération des valeurs depuis Reboul Store .env.production..."

# Essayer de récupérer les valeurs depuis le serveur
DB_PASSWORD=$(ssh "$DEPLOY_HOST" "grep 'DB_PASSWORD=' $DEPLOY_PATH/.env.production 2>/dev/null | cut -d'=' -f2 | tr -d '\"' || echo ''")
JWT_SECRET=$(ssh "$DEPLOY_HOST" "grep 'JWT_SECRET=' $DEPLOY_PATH/.env.production 2>/dev/null | cut -d'=' -f2 | tr -d '\"' || echo ''")
CLOUDINARY_CLOUD_NAME=$(ssh "$DEPLOY_HOST" "grep 'CLOUDINARY_CLOUD_NAME=' $DEPLOY_PATH/.env.production 2>/dev/null | cut -d'=' -f2 | tr -d '\"' || echo ''")
CLOUDINARY_API_KEY=$(ssh "$DEPLOY_HOST" "grep 'CLOUDINARY_API_KEY=' $DEPLOY_PATH/.env.production 2>/dev/null | cut -d'=' -f2 | tr -d '\"' || echo ''")
CLOUDINARY_API_SECRET=$(ssh "$DEPLOY_HOST" "grep 'CLOUDINARY_API_SECRET=' $DEPLOY_PATH/.env.production 2>/dev/null | cut -d'=' -f2 | tr -d '\"' || echo ''")

# Si les valeurs ne sont pas trouvées, demander à l'utilisateur
if [ -z "$DB_PASSWORD" ]; then
    warn "⚠️  Impossible de récupérer DB_PASSWORD depuis Reboul Store"
    read -p "Entrez le mot de passe de la base de données Reboul : " DB_PASSWORD
fi

if [ -z "$JWT_SECRET" ]; then
    warn "⚠️  Impossible de récupérer JWT_SECRET depuis Reboul Store"
    read -p "Entrez le JWT_SECRET (ou appuyez sur Entrée pour générer un nouveau) : " JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        # Générer un JWT_SECRET aléatoire
        JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
        info "✅ JWT_SECRET généré automatiquement"
    fi
fi

if [ -z "$CLOUDINARY_CLOUD_NAME" ]; then
    warn "⚠️  Impossible de récupérer CLOUDINARY_CLOUD_NAME"
    read -p "Entrez CLOUDINARY_CLOUD_NAME : " CLOUDINARY_CLOUD_NAME
fi

if [ -z "$CLOUDINARY_API_KEY" ]; then
    warn "⚠️  Impossible de récupérer CLOUDINARY_API_KEY"
    read -p "Entrez CLOUDINARY_API_KEY : " CLOUDINARY_API_KEY
fi

if [ -z "$CLOUDINARY_API_SECRET" ]; then
    warn "⚠️  Impossible de récupérer CLOUDINARY_API_SECRET"
    read -p "Entrez CLOUDINARY_API_SECRET : " CLOUDINARY_API_SECRET
fi

# Créer le fichier .env.production
info "Création du fichier .env.production sur le serveur..."

cat > /tmp/admin-env-production.txt <<EOF
# ============================================
# Variables d'environnement PRODUCTION - Admin Central
# ============================================
# Généré le $(date '+%Y-%m-%d %H:%M:%S')

# ============================================
# BACKEND ADMIN - Port & URLs
# ============================================
PORT=4001
FRONTEND_URL=https://admin.reboulstore.com
VITE_API_URL=https://admin.reboulstore.com/api

# ============================================
# JWT & Authentification Admin
# ============================================
JWT_SECRET=$JWT_SECRET

# ============================================
# CONNEXION BASE DE DONNÉES REBOUL
# ============================================
REBOUL_DB_USER=reboulstore
REBOUL_DB_PASSWORD=$DB_PASSWORD
REBOUL_DB_NAME=reboulstore_db

# ============================================
# CLOUDINARY - Images
# ============================================
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
EOF

# Copier le fichier sur le serveur
scp /tmp/admin-env-production.txt "$DEPLOY_HOST:$ADMIN_PATH/.env.production"
rm /tmp/admin-env-production.txt

info "✅ Fichier .env.production créé sur le serveur"
info "📍 Chemin: $ADMIN_PATH/.env.production"

# Vérifier que le fichier a bien été créé
info "Vérification..."
ssh "$DEPLOY_HOST" "test -f $ADMIN_PATH/.env.production && echo '✅ Fichier créé avec succès' || echo '❌ Erreur lors de la création'"

info ""
info "🎉 Configuration terminée !"
info ""
info "Prochaine étape : Déployer Admin Central"
info "  ./scripts/deploy-all.sh --admin"
info "  OU"
info "  cd admin-central && ./scripts/deploy-admin.sh --build"

