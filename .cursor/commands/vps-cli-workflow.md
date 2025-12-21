# 🖥️ VPS CLI Workflow - Commandes de gestion serveur

## 📋 Vue d'ensemble

Le CLI Python dispose maintenant de commandes complètes pour gérer le serveur VPS OVH directement depuis la machine locale, sans avoir à se connecter en SSH manuellement.

## 🚀 Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

**Dépendance requise** : `paramiko>=3.0.0` (pour SSH - déjà dans requirements.txt)

## 🔧 Configuration (optionnelle)

Par défaut, le CLI utilise :
- Host: `152.228.218.35`
- User: `deploy`
- SSH Key: `~/.ssh/id_rsa`

Pour changer la configuration, utiliser des variables d'environnement :
```bash
export VPS_HOST=152.228.218.35
export VPS_USER=deploy
export VPS_SSH_KEY=~/.ssh/id_rsa
```

## 📚 Commandes disponibles

### 🖥️ Gestion Serveur (`server`)

#### Vérifier l'état
```bash
python main.py server status
python main.py server status --service backend
python main.py server status --admin  # Admin Central
```

#### Visualiser les logs
```bash
python main.py server logs
python main.py server logs backend
python main.py server logs backend --tail 50
python main.py server logs backend --follow  # Suivre en temps réel
python main.py server logs --errors  # Filtrer uniquement les erreurs
```

#### Redémarrer les services
```bash
python main.py server restart
python main.py server restart backend
python main.py server restart --admin
```

#### Monitoring ressources
```bash
python main.py server resources  # CPU, RAM, Disque, Réseau
python main.py server ps  # Liste containers avec détails
```

#### Nettoyage Docker
```bash
python main.py server cleanup --volumes
python main.py server cleanup --images
python main.py server cleanup --all --yes
```

#### Gestion variables d'environnement
```bash
python main.py server env --check  # Vérifier les fichiers .env
python main.py server env --backup  # Backup des .env
```

---

### 🚀 Déploiement (`deploy`)

#### Vérifier le déploiement
```bash
python main.py deploy check
python main.py deploy check --service reboul
python main.py deploy check --service admin
```

#### Déployer
```bash
python main.py deploy deploy
python main.py deploy deploy --service reboul
python main.py deploy deploy --build  # Rebuild images
python main.py deploy deploy --pull  # Pull git avant
```

#### Mettre à jour
```bash
python main.py deploy update --pull --rebuild
```

---

### 🏥 Health Check (`health`)

#### Vérifier la santé
```bash
python main.py health check
python main.py health check --service reboul
python main.py health check --service admin
```

#### État des containers
```bash
python main.py health containers
```

---

### 📊 Logs (`logs`)

#### Filtrer les erreurs
```bash
python main.py logs errors
python main.py logs errors --service backend
python main.py logs errors --last 24h
```

#### Rechercher dans les logs
```bash
python main.py logs search "ERROR"
python main.py logs search "database" --service backend --last 1h
```

---

## 🎯 Workflows courants

### Vérifier que tout fonctionne après un déploiement

```bash
# Vérification complète
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

### Monitoring quotidien

```bash
# État global
python main.py server status
python main.py health check

# Erreurs du jour
python main.py logs errors --last 24h

# Ressources système
python main.py server resources
```

### Mettre à jour le serveur

```bash
# Pull et redéployer
python main.py deploy update --pull --rebuild

# Vérifier que tout fonctionne
python main.py deploy check
python main.py health check
```

### Maintenance

```bash
# Backup avant maintenance
python main.py db backup-server

# Nettoyer si nécessaire
python main.py server cleanup --all --yes

# Redémarrer un service
python main.py server restart backend
```

---

## 📝 Documentation complète

Voir `docs/CLI_VPS_COMMANDS.md` pour la documentation complète de toutes les commandes.

---

## ⚠️ Notes importantes

1. **SSH Key** : Assure-toi d'avoir une clé SSH configurée et accessible depuis `~/.ssh/id_rsa` ou configure `VPS_SSH_KEY`

2. **Première connexion** : La première connexion SSH peut demander de confirmer la clé du serveur (paramiko gère cela automatiquement)

3. **Performance** : Les commandes SSH ont une petite latence. Pour les logs en temps réel, préférer `server logs --follow`

4. **Sécurité** : Les commandes nécessitent une clé SSH. Ne pas commiter les clés dans le repo.

---

## 🔄 Intégration avec scripts bash existants

Les commandes CLI peuvent appeler les scripts bash existants :
- `backup-db.sh` → `db backup-server`
- `view-logs.sh` → `server logs`
- `test-deployment.sh` → `deploy check`
- `security-audit.sh` → À venir

Les scripts bash restent utilisables directement sur le serveur.
