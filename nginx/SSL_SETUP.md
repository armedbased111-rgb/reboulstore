# 🔐 Configuration SSL/TLS avec Let's Encrypt

## Prérequis

- Domaines configurés et pointant vers le serveur
- Ports 80 et 443 ouverts dans le firewall
- Certbot installé sur le serveur

## Installation Certbot

```bash
# Sur Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot

# Sur Alpine (dans le container)
apk add certbot
```

## Génération des certificats

### Pour Reboul Store

```bash
# Générer le certificat
sudo certbot certonly --standalone -d reboulstore.com -d www.reboulstore.com

# Les certificats seront dans :
# /etc/letsencrypt/live/reboulstore.com/fullchain.pem
# /etc/letsencrypt/live/reboulstore.com/privkey.pem
```

### Pour Admin Central

```bash
# Générer le certificat
sudo certbot certonly --standalone -d admin.reboulstore.com

# Les certificats seront dans :
# /etc/letsencrypt/live/admin.reboulstore.com/fullchain.pem
# /etc/letsencrypt/live/admin.reboulstore.com/privkey.pem
```

## Copier les certificats dans les dossiers Nginx

### Reboul Store

```bash
# Créer les dossiers si nécessaire
mkdir -p nginx/ssl

# Copier les certificats
sudo cp /etc/letsencrypt/live/reboulstore.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/reboulstore.com/privkey.pem nginx/ssl/

# Ajuster les permissions
sudo chmod 644 nginx/ssl/fullchain.pem
sudo chmod 600 nginx/ssl/privkey.pem
```

### Admin Central

```bash
# Créer les dossiers si nécessaire
mkdir -p admin-central/nginx/ssl

# Copier les certificats
sudo cp /etc/letsencrypt/live/admin.reboulstore.com/fullchain.pem admin-central/nginx/ssl/
sudo cp /etc/letsencrypt/live/admin.reboulstore.com/privkey.pem admin-central/nginx/ssl/

# Ajuster les permissions
sudo chmod 644 admin-central/nginx/ssl/fullchain.pem
sudo chmod 600 admin-central/nginx/ssl/privkey.pem
```

## Activer HTTPS dans Nginx

### Reboul Store

1. Décommenter les lignes SSL dans `nginx/conf.d/reboulstore.conf`
2. Décommenter le server block de redirection HTTP → HTTPS
3. Redémarrer Nginx

### Admin Central

1. Décommenter les lignes SSL dans `admin-central/nginx/conf.d/admin.conf`
2. Décommenter le server block de redirection HTTP → HTTPS
3. Redémarrer Nginx

## Renouvellement automatique

Let's Encrypt expire après 90 jours. Configurer le renouvellement automatique :

```bash
# Créer un cron job pour renouveler automatiquement
sudo crontab -e

# Ajouter cette ligne (renouvelle tous les jours à 3h du matin)
0 3 * * * certbot renew --quiet --deploy-hook "docker compose -f docker-compose.prod.yml restart nginx"
```

## Vérification

```bash
# Vérifier que le certificat est valide
openssl s_client -connect reboulstore.com:443 -servername reboulstore.com

# Tester avec SSL Labs
# https://www.ssllabs.com/ssltest/analyze.html?d=reboulstore.com
```
