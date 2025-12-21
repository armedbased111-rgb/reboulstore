#!/bin/bash

# Script d'installation HTTPS avec Let's Encrypt (certbot)
# Usage: ./scripts/setup-https.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

error() {
    echo -e "${RED}[✗]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo "🔒 Configuration HTTPS avec Let's Encrypt"
echo "=========================================="
echo ""

# Vérifier qu'on est sur le serveur
if [ ! -f "/opt/reboulstore/docker-compose.prod.yml" ]; then
    error "Ce script doit être exécuté sur le serveur OVH (/opt/reboulstore)"
fi

cd /opt/reboulstore

# Domaines
DOMAIN_MAIN="www.reboulstore.com"
DOMAIN_ROOT="reboulstore.com"
DOMAIN_ADMIN="admin.reboulstore.com"
EMAIL="${LETSENCRYPT_EMAIL:-admin@reboulstore.com}"

info "Domaines à certifier :"
info "  - $DOMAIN_ROOT"
info "  - $DOMAIN_MAIN"
info "  - $DOMAIN_ADMIN"
info ""
info "Email : $EMAIL"
echo ""

# Vérifier que les domaines pointent vers ce serveur
warn "⚠️  IMPORTANT : Assure-toi que les domaines pointent vers ce serveur (152.228.218.35)"
read -p "Continuer ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Annulé"
fi

# Installer certbot si pas déjà installé
if ! command -v certbot &> /dev/null; then
    info "Installation de certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
    success "Certbot installé"
else
    success "Certbot déjà installé"
fi

# Arrêter temporairement nginx (certbot a besoin d'accéder au port 80)
info "Arrêt temporaire de nginx pour validation..."
docker compose -f docker-compose.prod.yml stop nginx || true

# Créer un serveur nginx temporaire pour la validation
info "Création serveur nginx temporaire pour validation..."
docker run -d --name certbot-nginx-temp \
    -p 80:80 \
    -v "$(pwd)/nginx/conf.d:/etc/nginx/conf.d:ro" \
    -v "$(pwd)/nginx/ssl:/etc/nginx/ssl" \
    nginx:alpine || true

sleep 2

# Générer les certificats
info "Génération des certificats SSL..."
sudo certbot certonly --standalone \
    --preferred-challenges http \
    -d "$DOMAIN_ROOT" \
    -d "$DOMAIN_MAIN" \
    -d "$DOMAIN_ADMIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive \
    --keep-until-expiring || error "Échec génération certificats"

success "Certificats générés"

# Arrêter le serveur nginx temporaire
docker stop certbot-nginx-temp || true
docker rm certbot-nginx-temp || true

# Copier les certificats dans le répertoire nginx/ssl
info "Copie des certificats..."
sudo mkdir -p "$(pwd)/nginx/ssl"
sudo cp /etc/letsencrypt/live/$DOMAIN_ROOT/fullchain.pem "$(pwd)/nginx/ssl/fullchain.pem"
sudo cp /etc/letsencrypt/live/$DOMAIN_ROOT/privkey.pem "$(pwd)/nginx/ssl/privkey.pem"
sudo chmod 644 "$(pwd)/nginx/ssl/fullchain.pem"
sudo chmod 600 "$(pwd)/nginx/ssl/privkey.pem"
sudo chown $(whoami):$(whoami) "$(pwd)/nginx/ssl/fullchain.pem"
sudo chown $(whoami):$(whoami) "$(pwd)/nginx/ssl/privkey.pem"
success "Certificats copiés dans nginx/ssl"

# Créer un lien symbolique pour le renouvellement automatique
info "Configuration renouvellement automatique..."
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh > /dev/null <<EOF
#!/bin/bash
# Copier les nouveaux certificats vers nginx/ssl après renouvellement
cp /etc/letsencrypt/live/$DOMAIN_ROOT/fullchain.pem /opt/reboulstore/nginx/ssl/fullchain.pem
cp /etc/letsencrypt/live/$DOMAIN_ROOT/privkey.pem /opt/reboulstore/nginx/ssl/privkey.pem
chmod 644 /opt/reboulstore/nginx/ssl/fullchain.pem
chmod 600 /opt/reboulstore/nginx/ssl/privkey.pem
docker compose -f /opt/reboulstore/docker-compose.prod.yml restart nginx
EOF
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh
success "Renouvellement automatique configuré"

# Activer HTTPS dans nginx (décommenter les lignes SSL)
info "Activation HTTPS dans nginx..."
sed -i.bak 's/# listen 443 ssl http2;/listen 443 ssl http2;/' nginx/conf.d/reboulstore.conf
sed -i.bak 's/# ssl_certificate/ssl_certificate/' nginx/conf.d/reboulstore.conf
sed -i.bak 's/# ssl_certificate_key/ssl_certificate_key/' nginx/conf.d/reboulstore.conf
sed -i.bak 's/# ssl_protocols/ssl_protocols/' nginx/conf.d/reboulstore.conf
sed -i.bak 's/# ssl_ciphers/ssl_ciphers/' nginx/conf.d/reboulstore.conf
sed -i.bak 's/# ssl_prefer_server_ciphers/ssl_prefer_server_ciphers/' nginx/conf.d/reboulstore.conf

# Décommenter la redirection HTTP → HTTPS
sed -i.bak 's|# server {|server {|' nginx/conf.d/reboulstore.conf
sed -i.bak 's|#     listen 80;|    listen 80;|' nginx/conf.d/reboulstore.conf
sed -i.bak 's|#     server_name|    server_name|' nginx/conf.d/reboulstore.conf
sed -i.bak 's|#     return 301|    return 301|' nginx/conf.d/reboulstore.conf
sed -i.bak 's|# }|}|' nginx/conf.d/reboulstore.conf

success "Configuration HTTPS activée dans nginx"

# Vérifier la configuration nginx
info "Vérification configuration nginx..."
docker compose -f docker-compose.prod.yml run --rm nginx nginx -t || error "Erreur configuration nginx"

# Redémarrer nginx
info "Redémarrage de nginx..."
docker compose -f docker-compose.prod.yml up -d nginx
sleep 3

# Tester HTTPS
info "Test HTTPS..."
if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN_MAIN | grep -q "200\|301\|302"; then
    success "HTTPS fonctionne pour $DOMAIN_MAIN"
else
    warn "HTTPS peut ne pas fonctionner encore (propagation DNS nécessaire)"
fi

# Configurer renouvellement automatique (cron)
info "Configuration renouvellement automatique (cron)..."
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "0 3 * * * certbot renew --quiet --deploy-hook /etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh") | crontab -
success "Renouvellement automatique configuré (tous les jours à 3h)"

echo ""
success "✅ HTTPS configuré avec succès !"
echo ""
info "📝 Prochaines étapes :"
info "  1. Vérifier que https://$DOMAIN_MAIN fonctionne"
info "  2. Vérifier que https://$DOMAIN_ADMIN fonctionne"
info "  3. Les certificats se renouvellent automatiquement (cron configuré)"
info ""
info "🔗 Documentation : docs/PRODUCTION_SECURITY.md"
