# CLI VPS - Commandes disponibles

## 🚀 Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

## 📋 Commandes disponibles

### 🖥️ Gestion Serveur (`server`)

#### `server status`
Affiche l'état de tous les containers

```bash
python main.py server status
python main.py server status --service backend
python main.py server status --admin  # Admin Central
```

#### `server logs`
Affiche les logs d'un service ou tous les services

```bash
python main.py server logs
python main.py server logs backend
python main.py server logs backend --tail 50
python main.py server logs backend --follow  # Suivre en temps réel
python main.py server logs --errors  # Filtrer uniquement les erreurs
python main.py server logs --admin  # Admin Central
```

#### `server restart`
Redémarre un service ou tous les services

```bash
python main.py server restart
python main.py server restart backend
python main.py server restart --admin
```

#### `server ps`
Liste les containers avec détails

```bash
python main.py server ps
python main.py server ps --admin
```

#### `server resources`
Affiche l'utilisation des ressources (CPU, RAM, disque, réseau)

```bash
python main.py server resources
```

#### `server cleanup`
Nettoie les ressources Docker inutilisées

```bash
python main.py server cleanup --volumes
python main.py server cleanup --images
python main.py server cleanup --all
python main.py server cleanup --all --yes  # Sans confirmation
```

#### `server env`
Gère les variables d'environnement

```bash
python main.py server env --check  # Vérifier les fichiers .env
python main.py server env --backup  # Backup des fichiers .env
```

---

### 🚀 Déploiement (`deploy`)

#### `deploy check`
Vérifie que le déploiement fonctionne

```bash
python main.py deploy check
python main.py deploy check --service reboul
python main.py deploy check --service admin
```

#### `deploy deploy`
Déploie les services sur le serveur

```bash
python main.py deploy deploy
python main.py deploy deploy --service reboul
python main.py deploy deploy --service admin
python main.py deploy deploy --build  # Rebuild les images
python main.py deploy deploy --pull  # Pull git avant déploiement
```

#### `deploy update`
Met à jour le code depuis git et redémarre

```bash
python main.py deploy update
python main.py deploy update --pull
python main.py deploy update --rebuild
```

---

### 🏥 Health Check (`health`)

#### `health check`
Vérifie la santé de tous les services

```bash
python main.py health check
python main.py health check --service reboul
python main.py health check --service admin
```

#### `health containers`
Vérifie l'état des containers Docker

```bash
python main.py health containers
```

---

### 📊 Logs (`logs`)

#### `logs errors`
Filtre et affiche uniquement les erreurs

```bash
python main.py logs errors
python main.py logs errors --service backend
python main.py logs errors --last 24h
python main.py logs errors --admin
```

#### `logs search`
Recherche dans les logs

```bash
python main.py logs search "ERROR"
python main.py logs search "database" --service backend
python main.py logs search "exception" --last 1h
python main.py logs search "failed" --admin
```

---

### 💾 Base de données (`db`)

#### `db backup-server`
Crée un backup de la base de données sur le serveur

```bash
python main.py db backup-server
python main.py db backup-server --output /path/to/backup.sql
```

---

## 🔧 Configuration

Les commandes utilisent les variables d'environnement suivantes (optionnelles) :

```bash
export VPS_HOST=152.228.218.35
export VPS_USER=deploy
export VPS_SSH_KEY=~/.ssh/id_rsa
```

Par défaut :
- Host: `152.228.218.35`
- User: `deploy`
- SSH Key: `~/.ssh/id_rsa`

---

## 📝 Exemples d'utilisation

### Vérifier que tout fonctionne après un déploiement

```bash
python main.py deploy check
python main.py health check
python main.py server status
```

### Debugger un problème

```bash
# Voir les erreurs récentes
python main.py logs errors --last 1h

# Chercher un pattern spécifique
python main.py logs search "database connection" --service backend

# Voir les logs en temps réel
python main.py server logs backend --follow
```

### Mettre à jour le serveur

```bash
# Pull et redéployer
python main.py deploy update --pull --rebuild

# Vérifier que tout fonctionne
python main.py deploy check
```

### Gérer les ressources

```bash
# Voir l'utilisation
python main.py server resources

# Nettoyer si nécessaire
python main.py server cleanup --all
```

---

## 🎯 Workflow recommandé

### Après un déploiement

```bash
python main.py deploy check
python main.py health check
python main.py server status
```

### Monitoring quotidien

```bash
python main.py server status
python main.py health check
python main.py logs errors --last 24h
```

### Avant/après maintenance

```bash
# Backup avant
python main.py db backup-server

# Vérification après
python main.py deploy check
python main.py health check
```
