# 🔌 Connexion Base de Données Production en Développement

## 📋 Vue d'ensemble

Ce guide explique comment connecter votre environnement de développement local à la base de données de production via un tunnel SSH sécurisé.

**Pourquoi ?** Utiliser la même base de données en développement et en production permet de :
- ✅ Travailler avec des données réelles
- ✅ Tester avec les mêmes données que la production
- ✅ Éviter les différences de structure de données

## 🔐 Sécurité

**⚠️ IMPORTANT** : La connexion se fait via un tunnel SSH, ce qui garantit :
- ✅ Connexion chiffrée (SSH)
- ✅ Pas d'exposition directe de PostgreSQL sur Internet
- ✅ Authentification via clés SSH

## 🚀 Configuration

### 1. Créer le fichier `.env.local`

Copier le fichier `.env.local.example` vers `.env.local` :

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` avec vos valeurs :

```bash
# Configuration SSH pour le tunnel
DB_SSH_HOST=152.228.218.35
DB_SSH_USER=deploy
DB_SSH_KEY=~/.ssh/id_ed25519

# Configuration du tunnel (ports)
DB_TUNNEL_LOCAL_PORT=5433
DB_TUNNEL_REMOTE_PORT=5432

# Configuration de connexion à la base de données
DB_HOST=host.docker.internal
DB_PORT=5433
DB_USERNAME=reboulstore
DB_PASSWORD=reboulstore_password
DB_DATABASE=reboulstore_db
```

**Note** : Le fichier `.env.local` est déjà dans `.gitignore`, il ne sera pas commité.

### 2. Démarrer le tunnel SSH

Utiliser le script `db-tunnel.sh` pour gérer le tunnel :

```bash
# Démarrer le tunnel
./scripts/db-tunnel.sh start

# Vérifier le statut
./scripts/db-tunnel.sh status

# Arrêter le tunnel
./scripts/db-tunnel.sh stop
```

### 3. Configurer Docker Compose

Le fichier `docker-compose.yml` est déjà configuré pour supporter la connexion distante.

**Utiliser DB distante** :
1. **Démarrer le proxy PostgreSQL sur le serveur** : `./scripts/db-proxy-server.sh start`
   - Ce proxy expose PostgreSQL sur `localhost:5432` du serveur (via container socat)
   - Nécessaire car PostgreSQL dans Docker n'est pas directement accessible depuis localhost du serveur
2. Démarrer le tunnel SSH : `./scripts/db-tunnel.sh start`
3. Charger les variables d'environnement depuis `.env.local` :
   ```bash
   # Charger les variables (méthode recommandée)
   set -a
   source .env.local
   set +a
   
   # Démarrer seulement backend et frontend (pas postgres)
   docker compose up backend frontend
   ```

**Utiliser DB locale** (défaut) :
```bash
# Ne pas charger .env.local, utiliser les valeurs par défaut
# Démarrer tous les services (y compris postgres)
docker compose up
```

### 4. Vérifier la connexion

Une fois le backend démarré, vérifier les logs :

```bash
docker compose logs backend | grep -i "database\|postgres\|connected"
```

Vous devriez voir des messages de connexion réussie.

## 📝 Workflow de développement

### Démarrer avec DB distante

```bash
# 1. Démarrer le tunnel SSH
./scripts/db-tunnel.sh start

# 2. Charger les variables d'environnement
set -a
source .env.local
set +a

# 3. Démarrer les services (sans postgres)
docker compose up backend frontend
```

### Démarrer avec DB locale

```bash
# 1. S'assurer que le tunnel n'est pas actif
./scripts/db-tunnel.sh stop

# 2. Démarrer tous les services (avec postgres local)
docker compose up
```

### Arrêter le tunnel

```bash
./scripts/db-tunnel.sh stop
```

## 🔧 Dépannage

### Le tunnel ne démarre pas

```bash
# Vérifier la connexion SSH
ssh deploy@152.228.218.35

# Vérifier que le port 5433 n'est pas utilisé
lsof -i :5433

# Vérifier les permissions de la clé SSH
chmod 600 ~/.ssh/id_ed25519
```

### Le backend ne peut pas se connecter

1. **Vérifier que le proxy est actif sur le serveur** :
   ```bash
   ./scripts/db-proxy-server.sh status
   ```

2. **Vérifier que le tunnel est actif** :
   ```bash
   ./scripts/db-tunnel.sh status
   ```

3. **Vérifier depuis l'hôte** :
   ```bash
   # Devrait fonctionner depuis votre machine
   psql -h localhost -p 5433 -U reboulstore -d reboulstore_db
   ```

4. **Vérifier depuis le container** :
   ```bash
   docker compose exec backend sh -c "nc -zv host.docker.internal 5433"
   ```

### Le backend utilise toujours la DB locale

Vérifier que les variables d'environnement sont bien chargées :

```bash
# Vérifier les variables dans le container
docker compose exec backend env | grep DB_
```

Elles doivent correspondre à `.env.local`, pas aux valeurs par défaut.

## ⚠️ Précautions

1. **Ne pas modifier la base de données de production directement** :
   - Utiliser uniquement en lecture dans la mesure du possible
   - Pour les tests, créer des données de test spécifiques
   - Toujours avoir un backup avant toute modification

2. **Performance** :
   - La connexion via tunnel SSH peut être plus lente que locale
   - Pour des tests de performance, utiliser la DB locale

3. **Données sensibles** :
   - Ne jamais commiter `.env.local`
   - Ne jamais partager les credentials de production

## 📚 Références

- Script proxy serveur : `scripts/db-proxy-server.sh`
- Script tunnel : `scripts/db-tunnel.sh`
- Configuration exemple : `.env.local.example`
- Docker Compose : `docker-compose.yml`

