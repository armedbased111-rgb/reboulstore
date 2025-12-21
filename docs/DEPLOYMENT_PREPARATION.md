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

Les secrets ont été générés et stockés dans `.secrets.production.local` (local, non commité).

**⚠️ Important** : Ces secrets doivent être copiés dans les fichiers `.env.production` sur le serveur.

**Secrets générés** :
- `JWT_SECRET_REBOUL` : vB7bs5kgqJI9HZkyGs2FZJnLZ91+MgxnKxgH6F+ybGM=
- `JWT_SECRET_ADMIN` : /sYZaXhqg41LjU4TQjIhywytG9FH7CqvtE1k+JA8SfM=
- `DB_PASSWORD` : G/7gmqndFFm9qKEDaN3+Ldpf/ztt84Jx

---

## 📝 Étape 1 : Cloner le Repository sur le Serveur

### Connexion SSH

```bash
ssh deploy@152.228.218.35
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

**Variables à configurer** :
```env
# Database
DB_USERNAME=reboulstore
DB_PASSWORD=G/7gmqndFFm9qKEDaN3+Ldpf/ztt84Jx
DB_DATABASE=reboulstore_db
DB_HOST=reboulstore-postgres-prod
DB_PORT=5432

# JWT
JWT_SECRET=vB7bs5kgqJI9HZkyGs2FZJnLZ91+MgxnKxgH6F+ybGM=

# Stripe (à remplir avec tes vraies clés depuis Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (à remplir avec tes vraies clés depuis Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# URLs
FRONTEND_URL=https://www.reboulstore.com
VITE_API_URL=https://www.reboulstore.com/api

# Node Environment
NODE_ENV=production
```

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
JWT_SECRET=/sYZaXhqg41LjU4TQjIhywytG9FH7CqvtE1k+JA8SfM=

# Connexion Reboul Database (via réseau Docker)
REBOUL_DB_USER=reboulstore
REBOUL_DB_PASSWORD=G/7gmqndFFm9qKEDaN3+Ldpf/ztt84Jx
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

## 📝 Étape 5 : Vérifier les Scripts de Déploiement

Les scripts de déploiement sont déjà dans le repository :
- `/opt/reboulstore/scripts/deploy-reboul.sh`
- `/opt/reboulstore/admin-central/scripts/deploy-admin.sh`

**Vérifier les permissions** :
```bash
cd /opt/reboulstore
chmod +x scripts/deploy-reboul.sh
chmod +x scripts/backup-db.sh
chmod +x scripts/rollback.sh

cd admin-central
chmod +x scripts/deploy-admin.sh
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
