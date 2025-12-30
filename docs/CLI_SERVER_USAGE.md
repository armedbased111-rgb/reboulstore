# 🖥️ Guide d'utilisation CLI - Gestion Serveur

## 📋 Vue d'ensemble

Le CLI Python inclut des commandes pour gérer et surveiller le serveur VPS de production.

## 🔍 Statut du Serveur

### 1. Statut des Containers Docker

Affiche l'état de tous les containers Docker :

```bash
# Statut par défaut (Reboul Store)
python cli/main.py server status

# Tous les projets (Reboul Store + Admin Central)
python cli/main.py server status --all

# Admin Central uniquement
python cli/main.py server status --admin

# Mode watch (mise à jour en temps réel toutes les 2 secondes)
python cli/main.py server status --watch

# Mode watch avec intervalle personnalisé (ex: 5 secondes)
python cli/main.py server status --watch --interval 5
```

**Exemple de sortie :**
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  État des containers (Reboul Store) - 14:30:25        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Container              │ Status       │ Ports          ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ reboulstore-frontend   │ Up 2 hours   │ 0.0.0.0:80->80 │
│ reboulstore-backend    │ Up 2 hours   │                │
│ postgres               │ Up 2 hours   │                │
└────────────────────────┴──────────────┴────────────────┘
```

### 2. Vérification Santé des Services

Vérifie que les services répondent correctement :

```bash
# Tous les services (Reboul Store + Admin Central)
python cli/main.py health check

# Reboul Store uniquement
python cli/main.py health check --service reboul

# Admin Central uniquement
python cli/main.py health check --service admin

# État des containers Docker
python cli/main.py health containers
```

**Exemple de sortie :**
```
🏥 Vérification de santé...

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Health Check                                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Service        │ Type     │ Status  │ Details          ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ Reboul Store   │ Frontend │ ✅ OK   │ HTTP 200         ┃
│ Reboul Store   │ Backend  │ ✅ OK   │ HTTP 200         ┃
│ Admin Central  │ Frontend │ ✅ OK   │ HTTP 200         ┃
│ Admin Central  │ Backend  │ ✅ OK   │ HTTP 200         ┃
│ PostgreSQL     │ Database │ ✅ OK   │ Connected        ┃
└────────────────┴──────────┴─────────┴──────────────────┘

Résumé: 5/5 services OK
✅ Tous les services sont en bonne santé
```

## 📊 Ressources Système

Affiche l'utilisation des ressources (CPU, RAM, disque, réseau) :

```bash
python cli/main.py server resources
```

## 📝 Logs

Affiche les logs des services :

```bash
# Tous les services (dernières 100 lignes)
python cli/main.py server logs

# Un service spécifique
python cli/main.py server logs frontend
python cli/main.py server logs backend

# Suivre les logs en temps réel
python cli/main.py server logs --follow

# Filtrer uniquement les erreurs
python cli/main.py server logs --errors

# Nombre de lignes personnalisé
python cli/main.py server logs --tail 200

# Logs Admin Central
python cli/main.py server logs --admin
```

## 🔄 Gestion des Services

### Redémarrer un Service

```bash
# Tous les services
python cli/main.py server restart

# Un service spécifique
python cli/main.py server restart frontend
python cli/main.py server restart backend

# Admin Central
python cli/main.py server restart --admin
```

### Liste Détaillée des Containers

```bash
# Reboul Store
python cli/main.py server ps

# Admin Central
python cli/main.py server ps --admin
```

## 🧹 Nettoyage

Nettoyer les ressources Docker inutilisées :

```bash
# Volumes non utilisés
python cli/main.py server cleanup --volumes

# Images non utilisées
python cli/main.py server cleanup --images

# Tout nettoyer (volumes + images + containers arrêtés)
python cli/main.py server cleanup --all
```

## ⚙️ Variables d'Environnement

Gérer les variables d'environnement :

```bash
# Vérifier les variables d'environnement
python cli/main.py server env --check

# Backup des fichiers .env
python cli/main.py server env --backup
```

## 🎯 Workflow Recommandé

### Vérification Rapide Quotidienne

```bash
# 1. Vérifier l'état des containers
python cli/main.py server status --all

# 2. Vérifier la santé des services
python cli/main.py health check
```

### En Cas de Problème

```bash
# 1. Vérifier l'état
python cli/main.py server status --all

# 2. Vérifier les logs d'erreurs
python cli/main.py server logs --errors

# 3. Si nécessaire, redémarrer un service
python cli/main.py server restart frontend
```

### Surveillance en Temps Réel

```bash
# Watch mode pour surveiller en continu
python cli/main.py server status --watch

# Ou suivre les logs
python cli/main.py server logs --follow
```

## 📚 Commandes Disponibles

### Commandes Server (`server`)

- `server status` - État des containers
- `server logs` - Logs des services
- `server restart` - Redémarrer un service
- `server ps` - Liste détaillée des containers
- `server resources` - Utilisation des ressources
- `server cleanup` - Nettoyer Docker
- `server env` - Gérer les variables d'environnement

### Commandes Health (`health`)

- `health check` - Vérifier la santé des services
- `health containers` - État des containers Docker

## 🔐 Configuration Requise

Les commandes nécessitent :
- Configuration SSH vers le serveur (définie dans `SERVER_CONFIG`)
- Accès au serveur VPS
- Docker et Docker Compose installés sur le serveur

Voir `cli/utils/server_helper.py` pour la configuration.

---

**Dernière mise à jour** : 29 décembre 2025

