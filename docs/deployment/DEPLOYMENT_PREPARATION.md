# 🚀 Phase 17.11.5.5 : Préparation Déploiement

**État** : ⏳ En cours  
**Date** : $(date)

## 📋 Checklist

- [ ] Cloner le repository sur le serveur
- [x] Générer les secrets (JWT_SECRET, DB_PASSWORD, etc.) ✅
- [ ] Créer les fichiers `.env.production` (Reboul + Admin)
- [ ] Vérifier que les ports sont disponibles (80, 443)
- [x] Tester la connexion SSH depuis la machine locale ✅
- [ ] Préparer les scripts de déploiement sur le serveur

---

## 🔐 Secrets Générés

Les secrets doivent être générés et stockés localement dans `.secrets.production.local` (fichier local, non commité).

**⚠️ Important** : Ne jamais exposer les valeurs des secrets dans la documentation, les commits ou les captures.

**Secrets attendus** :
- `JWT_SECRET_REBOUL` : `<generate_secure_value>`
- `JWT_SECRET_ADMIN` : `<generate_secure_value>`
- `DB_PASSWORD` : `<generate_secure_value>`

---

## 📝 Étape 1 : Cloner le Repository sur le Serveur

### Connexion SSH

```bash
ssh <deploy_user>@<server_host>
```

### Cloner le Repository

```bash
# Créer le répertoire
sudo mkdir -p /opt/reboulstore
sudo chown deploy:deploy /opt/reboulstore
cd /opt/reboulstore

# Cloner le repository (utiliser SSH pour repository privé)
git clone git@github.com:armedbased111-rgb/reboulstore.git .

# OU si SSH key n'est pas configurée sur le serveur, utiliser HTTPS :
# git clone https://github.com/armedbased111-rgb/reboulstore.git .
```

**📝 Note** : Si le repository est privé et que la clé SSH n'est pas configurée sur le serveur, il faudra soit :
1. Ajouter la clé SSH publique du serveur sur GitHub (Settings → SSH and GPG keys)
2. Ou utiliser un Personal Access Token avec HTTPS

---

## 📝 Étape 2 : Créer les Fichiers .env.production

### Sur le serveur, après clonage

#### Reboul Store

```bash
cd /opt/reboulstore

# Copier le template
cp env.production.example .env.production

# Éditer avec nano ou vim
nano .env.production
```

**Variables à configurer** : copier depuis la racine du repo **`env.production.example`** → `.env.production`, puis éditer. Ce fichier inclut notamment :

- **DB_***, **JWT_SECRET**, **Stripe**, **Cloudinary**
- **`FRONTEND_URL`** : URL **HTTPS** canonique du site (même host que dans le navigateur) — liens e-mails, Stripe, CORS ; pas de `localhost` en prod.
- **SMTP_*** : obligatoire pour les e-mails transactionnels (commandes, inscription, **newsletter**, alertes stock). Mot de passe d’application si compte Gmail.
- **`EMAIL_LOGO_URL`** (optionnel) : PNG/JPG pour l’en-tête mail ; sinon défaut Cloudinary dans le code (ratio conservé).
- **`NODE_ENV=production`**

**E-mails & newsletter (prod)** :

1. Renseigner **SMTP_*** dans `.env.production`.
2. Vérifier **FRONTEND_URL** (HTTPS).
3. Après backup DB : appliquer la migration **`newsletter_subscriptions`** si pas encore faite (`AddNewsletterSubscriptions` dans `backend/src/migrations/`).
4. Déployer le backend pour embarquer les templates Handlebars (`dist/templates/...`).

**Docker Compose** : lancer avec  
`docker compose -f docker-compose.prod.yml --env-file .env.production up -d`  
pour que les variables du fichier servent aussi à l’interpolation `${...}` du compose.

#### Admin Central

```bash
cd /opt/reboulstore/admin-central

# Copier le template
cp env.production.example .env.production

# Éditer avec nano ou vim
nano .env.production
```

**Variables à configurer** :
```env
# Port
PORT=4001

# URLs
FRONTEND_URL=https://admin.reboulstore.com
VITE_API_URL=https://admin.reboulstore.com/api

# JWT
JWT_SECRET=<jwt_secret_admin>

# Connexion Reboul Database (via réseau Docker)
REBOUL_DB_USER=reboulstore
REBOUL_DB_PASSWORD=<db_password>
REBOUL_DB_NAME=reboulstore_db
REBOUL_DB_HOST=reboulstore-postgres-prod
REBOUL_DB_PORT=5432

# Cloudinary (mêmes clés que Reboul Store)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Node Environment
NODE_ENV=production
```

---

## 📝 Étape 3 : Vérifier les Ports Disponibles

```bash
# Vérifier que les ports 80 et 443 sont libres
sudo netstat -tulpn | grep -E ':(80|443) '

# OU avec ss
sudo ss -tulpn | grep -E ':(80|443) '

# Si des services utilisent ces ports, les arrêter ou reconfigurer
```

**Résultat attendu** : Aucun service ne devrait utiliser ces ports (Nginx Docker les utilisera).

---

## 📝 Étape 4 : Vérifier Docker et Docker Compose

```bash
# Vérifier que Docker est installé
docker --version
docker compose version

# Si non installé, installer Docker (voir OVH_SERVER_SETUP.md)
```

---

## 📝 Étape 5 : Vérifier le Script de Déploiement Canonique

Le script de déploiement de référence est :
- `/opt/reboulstore/scripts/deploy-prod.sh`

**Vérifier les permissions** :
```bash
cd /opt/reboulstore
chmod +x scripts/deploy-prod.sh
chmod +x scripts/check-build.sh
```

---

## ✅ Validation

Une fois toutes les étapes complétées :

1. ✅ Repository cloné dans `/opt/reboulstore`
2. ✅ Fichiers `.env.production` créés avec tous les secrets
3. ✅ Ports 80 et 443 disponibles
4. ✅ Docker et Docker Compose installés
5. ✅ Scripts de déploiement exécutables

**Prochaine étape** : Phase 17.11.6 (Déploiement Effectif) ou Phase 23 (Déploiement & Production)

---

## 🔐 Sécurité

**⚠️ Important** :
- Ne jamais commiter les fichiers `.env.production` dans Git
- Ne jamais partager les secrets publiquement
- Utiliser des mots de passe forts et uniques
- Supprimer `.secrets.production.local` après configuration du serveur
