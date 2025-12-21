# Guide complet : Configuration HTTPS avec Let's Encrypt

## 🎯 Objectif

Configurer HTTPS pour `www.reboulstore.com`, `reboulstore.com` et `admin.reboulstore.com` avec des certificats SSL gratuits de Let's Encrypt.

---

## ⚠️ Prérequis

1. **DNS configuré correctement**
   - `www.reboulstore.com` → `152.228.218.35` ✅
   - `admin.reboulstore.com` → `152.228.218.35` ✅
   - `reboulstore.com` → `152.228.218.35` (en cours de propagation)

2. **Port 80 accessible** (pour validation Let's Encrypt)

3. **Accès SSH au serveur**

---

## 🚀 Installation automatique (Recommandé)

### Utiliser le script automatique

```bash
ssh deploy@152.228.218.35
cd /opt/reboulstore
./scripts/setup-https.sh
```

Le script fait automatiquement :
- ✅ Installation de certbot
- ✅ Génération des certificats SSL
- ✅ Copie des certificats dans nginx/ssl/
- ✅ Activation HTTPS dans nginx
- ✅ Configuration du renouvellement automatique
- ✅ Redémarrage de nginx

**Temps estimé** : 5-10 minutes

---

## 📋 Installation manuelle (si besoin)

### Étape 1 : Installer Certbot

```bash
ssh deploy@152.228.218.35
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### Étape 2 : Arrêter nginx temporairement

```bash
cd /opt/reboulstore
docker compose -f docker-compose.prod.yml stop nginx
```

### Étape 3 : Générer les certificats

```bash
# Générer les certificats pour tous les domaines
sudo certbot certonly --standalone \
  --preferred-challenges http \
  -d reboulstore.com \
  -d www.reboulstore.com \
  -d admin.reboulstore.com \
  --email admin@reboulstore.com \
  --agree-tos \
  --non-interactive
```

### Étape 4 : Copier les certificats

```bash
cd /opt/reboulstore

# Créer les dossiers ssl s'ils n'existent pas
mkdir -p nginx/ssl
mkdir -p admin-central/nginx/ssl

# Copier les certificats
sudo cp /etc/letsencrypt/live/reboulstore.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/reboulstore.com/privkey.pem nginx/ssl/

# Copier pour Admin Central aussi (même certificat ou séparé)
sudo cp /etc/letsencrypt/live/reboulstore.com/fullchain.pem admin-central/nginx/ssl/
sudo cp /etc/letsencrypt/live/reboulstore.com/privkey.pem admin-central/nginx/ssl/

# Ajuster les permissions
sudo chmod 644 nginx/ssl/*.pem
sudo chmod 600 nginx/ssl/privkey.pem
sudo chown $(whoami):$(whoami) nginx/ssl/*.pem
sudo chown $(whoami):$(whoami) admin-central/nginx/ssl/*.pem
```

### Étape 5 : Activer HTTPS dans nginx

#### Reboul Store (`nginx/conf.d/reboulstore.conf`)

Décommenter les lignes suivantes :

```nginx
# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name reboulstore.com www.reboulstore.com;
    return 301 https://$server_name$request_uri;
}

# Configuration principale HTTPS
server {
    listen 443 ssl http2;
    server_name www.reboulstore.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # ... reste de la configuration ...
}
```

#### Admin Central (`admin-central/nginx/conf.d/admin.conf`)

Décommenter les lignes SSL similaires.

### Étape 6 : Redémarrer nginx

```bash
# Reboul Store
cd /opt/reboulstore
docker compose -f docker-compose.prod.yml restart nginx

# Admin Central
cd /opt/reboulstore/admin-central
docker compose -f docker-compose.prod.yml restart nginx
```

---

## 🔄 Renouvellement automatique

### Configurer le renouvellement (déjà fait par le script)

Le script `setup-https.sh` configure automatiquement :

1. **Hook de renouvellement** (`/etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh`)
   - Copie les nouveaux certificats vers nginx/ssl/
   - Redémarre nginx

2. **Cron job** (quotidien à 3h du matin)
   ```bash
   0 3 * * * certbot renew --quiet --deploy-hook /etc/letsencrypt/renewal-hooks/deploy/copy-certs.sh
   ```

### Vérifier le renouvellement

```bash
# Test du renouvellement (dry-run)
sudo certbot renew --dry-run

# Voir les certificats
sudo certbot certificates
```

---

## ✅ Vérification

### 1. Vérifier que HTTPS fonctionne

```bash
# Test depuis local
curl -I https://www.reboulstore.com
curl -I https://admin.reboulstore.com
```

### 2. Vérifier la redirection HTTP → HTTPS

```bash
curl -I http://www.reboulstore.com
# Devrait retourner 301 Permanent Redirect vers https://
```

### 3. Tester avec SSL Labs

- Aller sur https://www.ssllabs.com/ssltest/
- Entrer `www.reboulstore.com`
- Vérifier le score (devrait être A ou A+)

---

## 🔧 Troubleshooting

### Certbot ne peut pas valider (port 80 occupé)

**Solution** : Arrêter nginx temporairement avant de lancer certbot

```bash
docker compose -f docker-compose.prod.yml stop nginx
# Lancer certbot
docker compose -f docker-compose.prod.yml start nginx
```

### Certificats expirés

**Vérifier** :
```bash
sudo certbot certificates
```

**Renouveler manuellement** :
```bash
sudo certbot renew --force-renewal
```

### Erreur "Certificate not found"

**Vérifier le chemin** :
```bash
sudo ls -la /etc/letsencrypt/live/
```

**Copier à nouveau** :
```bash
sudo cp /etc/letsencrypt/live/reboulstore.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/reboulstore.com/privkey.pem nginx/ssl/
```

### Nginx ne démarre pas après activation HTTPS

**Vérifier la configuration** :
```bash
docker compose -f docker-compose.prod.yml run --rm nginx nginx -t
```

**Vérifier que les certificats existent** :
```bash
ls -la nginx/ssl/
```

---

## 📝 Notes importantes

1. **Let's Encrypt expire après 90 jours** - Le renouvellement automatique est configuré
2. **Limite de 5 certificats par semaine** pour le même domaine
3. **Validation par HTTP-01** - Nécessite que le port 80 soit accessible depuis l'extérieur
4. **Certificats wildcard** - Non supporté avec `--standalone`, nécessite DNS-01 challenge

---

## 🎉 Résultat attendu

Après configuration :
- ✅ `http://www.reboulstore.com` → redirige vers `https://www.reboulstore.com`
- ✅ `https://www.reboulstore.com` → fonctionne avec certificat valide
- ✅ `https://admin.reboulstore.com` → fonctionne avec certificat valide
- ✅ Cadenas vert dans le navigateur
- ✅ Score SSL Labs A ou A+

---

## 🔗 Ressources

- [Documentation Let's Encrypt](https://letsencrypt.org/docs/)
- [Documentation Certbot](https://eff-certbot.readthedocs.io/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
