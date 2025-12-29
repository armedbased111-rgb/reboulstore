# 🚀 Guide de Déploiement Production

## 📋 Prérequis

- ✅ **Phase 17.11.5 complétée** : Serveur OVH acheté et configuré
  - Voir `docs/OVH_SERVER_SETUP.md` pour la configuration initiale
- Docker et Docker Compose installés sur le serveur
- Accès SSH au serveur de production
- Variables d'environnement configurées (`.env.production`)
- DNS configuré (reboulstore.com, admin.reboulstore.com → IP serveur)

## 🔧 Configuration Initiale

### 1. Créer les fichiers d'environnement

```bash
# Pour Reboul Store
cp env.production.example .env.production
# Éditer .env.production avec tes vraies valeurs

# Pour Admin Central
cd admin-central
cp env.production.example .env.production
# Éditer .env.production avec tes vraies valeurs
cd ..
```

### 2. Générer des secrets sécurisés

```bash
# Générer un JWT_SECRET aléatoire
openssl rand -base64 32

# Générer un mot de passe DB fort
openssl rand -base64 24
```

## 🏗️ Build des Images Docker

### ⚠️ RÈGLE CRITIQUE : Suppression avant build (UNIQUEMENT sur le serveur)

**RÈGLE OBLIGATOIRE** : Toujours supprimer les anciennes images Docker **AVANT** de builder les nouvelles.

**⚠️ IMPORTANT** :
- ✅ Suppression **UNIQUEMENT sur le serveur** (via SSH)
- ❌ **JAMAIS** supprimer les images Docker locales
- ❌ **JAMAIS** exécuter `docker rmi` en local sur votre machine
- ✅ Vos images locales restent intactes pour vos tests locaux
- ✅ Le script `deploy-prod.sh` exécute toutes les suppressions via SSH sur le serveur

**Pourquoi ?**
- ✅ **Plus rapide** : Libère l'espace disque immédiatement
- ✅ **Évite les conflits** : Pas de problèmes de tags Docker
- ✅ **Build propre** : Garantit un build frais sans cache

**Cette règle s'applique à :**
- ✅ **Reboul Store** : `reboulstore-frontend`, `reboulstore-backend`
- ✅ **Admin Central** : `admin-central-frontend`, `admin-central-backend`

### Workflow de build (automatique via script)

Le script `deploy-prod.sh` applique automatiquement cette règle :

1. **Arrêt des services**
2. **Suppression des anciennes images** (AVANT build)
3. **Suppression des volumes de build** (frontend_build)
4. **Build avec --no-cache** (build propre)
5. **Démarrage des services**

### Build manuel

Si vous devez builder manuellement, suivez ce workflow :

#### Reboul Store

```bash
# 1. Arrêter les services
docker compose -f docker-compose.prod.yml --env-file .env.production down

# 2. Supprimer les anciennes images (AVANT build)
docker rmi -f reboulstore-frontend:latest reboulstore-backend:latest

# 3. Supprimer le volume de build
docker volume rm reboulstore_frontend_build

# 4. Builder avec --no-cache
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend

# 5. Démarrer
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

#### Admin Central

**⚠️ Ces commandes sont à exécuter sur le serveur via SSH, pas en local !**

```bash
# Se connecter au serveur (si pas déjà connecté)
ssh deploy@votre-serveur.com
cd /var/www/reboulstore/admin-central

# 1. Arrêter les services
docker compose -f docker-compose.prod.yml --env-file .env.production down

# 2. Supprimer les anciennes images (AVANT build) - UNIQUEMENT sur le serveur
docker rmi -f admin-central-frontend:latest admin-central-backend:latest

# 3. Supprimer le volume de build
docker volume rm admin_central_frontend_build

# 4. Builder avec --no-cache
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend

# 5. Démarrer
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

## 🚀 Démarrage en Production

### Ordre de démarrage

1. **D'abord Reboul Store** (crée le réseau Docker)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

2. **Ensuite Admin Central** (utilise le réseau existant)
```bash
cd admin-central
docker-compose -f docker-compose.prod.yml up -d
cd ..
```

## ✅ Vérification

### Vérifier que tout fonctionne

```bash
# Vérifier les containers
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f

# Vérifier le healthcheck backend
curl http://localhost:3001/health
```

### Vérifier Admin Central

```bash
cd admin-central
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
curl http://localhost:4001/health
cd ..
```

## 🔄 Workflow de Déploiement (Script Automatique)

### Déploiement avec le script (RECOMMANDÉ)

Le script `scripts/deploy-prod.sh` automatise tout le processus :

```bash
# Déploiement complet (avec vérifications)
DEPLOY_HOST=deploy@152.228.218.35 DEPLOY_PATH=/var/www/reboulstore ./scripts/deploy-prod.sh

# Déploiement sans vérifications préalables (plus rapide)
DEPLOY_HOST=deploy@152.228.218.35 DEPLOY_PATH=/var/www/reboulstore ./scripts/deploy-prod.sh --skip-check
```

**Ce que fait le script automatiquement :**
1. ✅ **Build local** : Compilation TypeScript/React uniquement (pour vérifier que le code compile)
   - ⚠️ **PAS d'images Docker locales** : Vos images Docker locales ne sont jamais touchées
2. ✅ **Upload** : Transfert des fichiers sources sur le serveur (rsync)
3. ✅ **Arrêt des services Docker** sur le serveur
4. ✅ **Suppression des anciennes images Docker** sur le serveur uniquement (`reboulstore-frontend:latest`, `reboulstore-backend:latest`)
5. ✅ **Nettoyage des images orphelines** sur le serveur
6. ✅ **Suppression du volume `frontend_build`** sur le serveur (garantit un build propre)
7. ✅ **Rebuild complet avec `--no-cache`** sur le serveur (frontend + backend)
8. ✅ **Démarrage des services** avec les nouvelles images sur le serveur
9. ✅ **Vérification** du healthcheck backend

**⚠️ IMPORTANT** :
- Le volume `postgres_data_prod` n'est **JAMAIS** supprimé pour préserver la base de données
- Les images Docker sont buildées **UNIQUEMENT sur le serveur**, jamais en local
- Vos images Docker locales ne sont **JAMAIS** supprimées ou modifiées
- Les anciennes images Docker sur le serveur sont supprimées avant le rebuild pour éviter l'accumulation d'images inutilisées

## 🔄 Commandes Utiles (Manuelles)

### Arrêter les services

```bash
# Reboul Store
docker compose -f docker-compose.prod.yml --env-file .env.production down

# Admin Central
cd admin-central
docker compose -f docker-compose.prod.yml --env-file .env.production down
cd ..
```

### Redémarrer un service spécifique

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production restart backend
```

### Voir les logs d'un service

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f backend
```

### Rebuild complet manuel (si nécessaire)

**⚠️ IMPORTANT** : Ces commandes doivent être exécutées **sur le serveur** via SSH, pas en local !

```bash
# Se connecter au serveur
ssh deploy@votre-serveur.com

# 1. Arrêter les services
cd /var/www/reboulstore
docker compose -f docker-compose.prod.yml --env-file .env.production down

# 2. Supprimer les anciennes images Docker (sur le serveur uniquement)
docker rmi -f reboulstore-frontend:latest reboulstore-backend:latest
docker rmi -f admin-central-frontend:latest admin-central-backend:latest 2>/dev/null || true

# 3. Nettoyage des images orphelines
docker image prune -f

# 4. Supprimer les volumes de build
docker volume rm reboulstore_frontend_build admin_central_frontend_build 2>/dev/null || true

# 5. Rebuild avec --no-cache (Reboul Store)
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend

# 6. Rebuild Admin Central (si configuré)
cd admin-central
docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache frontend backend
cd ..

# 7. Redémarrer
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
cd admin-central && docker compose -f docker-compose.prod.yml --env-file .env.production up -d && cd ..
```

**Rappel** : ❌ Ne jamais exécuter `docker rmi` en local - vos images locales ne doivent JAMAIS être supprimées !

## ⚠️ Notes Importantes

- **Ne jamais commiter** `.env.production` dans Git
- Les mots de passe doivent être **forts et uniques**
- Le réseau Docker `reboulstore-network` est partagé entre Reboul et Admin
- **Le volume `postgres_data_prod` est préservé** à chaque déploiement (base de données)
- **Le volume `frontend_build` est supprimé** à chaque déploiement pour garantir un build propre
- Les images Docker sont rebuildées avec `--no-cache` à chaque déploiement
- Les healthchecks vérifient automatiquement l'état des services

## 🔄 Workflow de Déploiement Automatique

Le script `scripts/deploy-prod.sh` suit un workflow logique pour garantir un déploiement propre :

1. **Build local** : Compilation TypeScript/React uniquement (pas d'images Docker locales)
2. **Upload** : Transfert des fichiers sources sur le serveur (rsync)
3. **Arrêt des services** : Arrêt de tous les containers sur le serveur
4. **Suppression des anciennes images** : Suppression des images Docker `reboulstore-frontend:latest` et `reboulstore-backend:latest` sur le serveur uniquement
5. **Nettoyage** : Suppression du volume `frontend_build` et des images orphelines sur le serveur
6. **Rebuild complet** : Build des images Docker avec `--no-cache` **sur le serveur uniquement** (garantit un build frais)
7. **Démarrage** : Démarrage des services avec les nouvelles images sur le serveur
8. **Vérification** : Healthcheck du backend

**⚠️ IMPORTANT** :
- Le volume `postgres_data_prod` n'est **JAMAIS** supprimé pour préserver la base de données
- Les images Docker sont buildées **UNIQUEMENT sur le serveur**, jamais en local
- Vos images Docker locales ne sont **JAMAIS** supprimées ou modifiées

## 🔑 Subtilité CRITIQUE : Variables d'environnement avec Docker Compose

### ⚠️ PROBLÈME COMMUN

**Docker Compose ne charge PAS automatiquement `.env.production` !**

Par défaut, Docker Compose charge uniquement le fichier `.env` (sans suffixe). Pour utiliser `.env.production`, il **FAUT** utiliser l'option `--env-file`.

### ✅ SOLUTION : Toujours utiliser `--env-file`

**TOUJOURS** utiliser `--env-file .env.production` avec toutes les commandes Docker Compose :

```bash
# ❌ INCORRECT - Les variables ne seront PAS chargées
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml restart backend

# ✅ CORRECT - Les variables seront chargées
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
docker compose -f docker-compose.prod.yml --env-file .env.production restart backend
docker compose -f docker-compose.prod.yml --env-file .env.production down
docker compose -f docker-compose.prod.yml --env-file .env.production logs backend
docker compose -f docker-compose.prod.yml --env-file .env.production ps
```

### 🔍 Comment vérifier que les variables sont chargées ?

```bash
# Vérifier la configuration résolue (les variables sont remplacées)
docker compose -f docker-compose.prod.yml --env-file .env.production config

# Vérifier les variables dans un container existant
docker inspect reboulstore-backend-prod | grep -A 30 "Env"
```

### 🚨 Symptômes du problème

Si les variables ne sont pas chargées, vous verrez :
- `DB_PASSWORD` vide ou `""` dans les containers
- Erreur : `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
- Le backend ne peut pas se connecter à la base de données
- Variables d'environnement vides dans `docker inspect`

### ✅ Correction

Si les containers ont été créés sans `--env-file`, il faut les **recréer** :

```bash
# Arrêter et supprimer les containers
docker compose -f docker-compose.prod.yml --env-file .env.production down

# Recréer avec les bonnes variables
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

### 📝 Script de déploiement

Le script `scripts/deploy-prod.sh` utilise déjà `--env-file .env.production` automatiquement. 
**Ne jamais utiliser Docker Compose directement sur le serveur sans cette option !**

## 🔧 Troubleshooting

### Frontend appelle toujours `localhost:3001` en production

**Symptôme** : Le frontend en production essaie toujours de se connecter à `http://localhost:3001` au lieu de `/api`.

**Cause** : Les variables d'environnement Vite (`VITE_API_URL`, `VITE_API_BASE_URL`) ne sont pas passées au moment du build, seulement au runtime. Vite remplace `import.meta.env.VITE_API_URL` **au moment du build**, pas au runtime.

**Solution** :
1. Vérifier que `docker-compose.prod.yml` passe les variables via `build.args` :
   ```yaml
   frontend:
     build:
       context: ./frontend
       dockerfile: Dockerfile.prod
       args:
         VITE_API_URL: /api
         VITE_API_BASE_URL: /api
   ```

2. Vérifier que `frontend/Dockerfile.prod` définit ces variables :
   ```dockerfile
   ARG VITE_API_URL
   ARG VITE_API_BASE_URL
   ENV VITE_API_URL=$VITE_API_URL
   ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
   ```

3. Rebuild complet : `./scripts/deploy-prod.sh --skip-check`

4. Sur l'autre ordinateur, faire un hard refresh (`Ctrl+Shift+R` ou `Cmd+Shift+R`) pour vider le cache du navigateur.

**Date de correction** : 29/12/2024

### Frontend ne charge pas / erreurs 404

**Vérifier** :
1. Que les containers sont démarrés : `docker compose -f docker-compose.prod.yml --env-file .env.production ps`
2. Que Nginx est accessible : `curl http://localhost`
3. Les logs Nginx : `docker compose -f docker-compose.prod.yml --env-file .env.production logs nginx`

### Backend ne se connecte pas à la base de données

**Vérifier** :
1. Que PostgreSQL est démarré : `docker compose -f docker-compose.prod.yml --env-file .env.production ps postgres`
2. Que les variables d'environnement sont chargées (voir section "Subtilité CRITIQUE")
3. Les logs backend : `docker compose -f docker-compose.prod.yml --env-file .env.production logs backend`

## 🔐 Sécurité

- Utiliser HTTPS en production (SSL/TLS)
- Configurer un firewall
- Limiter l'accès aux ports Docker
- Utiliser des secrets managés (Docker Secrets, Vault, etc.)

## 📝 Prochaines Étapes

Une fois que tout fonctionne :
1. Configurer Nginx (Phase 17.11.2)
2. Configurer SSL/TLS (Let's Encrypt)
3. Créer les scripts de déploiement (Phase 17.11.3)
4. Configurer le monitoring (Phase 17.11.4)
