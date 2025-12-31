# 🖥️ Guide d'Utilisation du Serveur - Pour Toi et Moi

## 🎯 Vue d'ensemble

Le CLI Python (`./rcli`) dispose d'un **arsenal complet** pour gérer et surveiller le serveur VPS de production. Ce guide explique comment **toi et moi** pouvons utiliser ces commandes.

---

## 🚀 Démarrage rapide

### Installation (une seule fois)

```bash
# Si pas encore fait, installer le CLI
cd cli
./setup.sh
source venv/bin/activate

# Retourner à la racine
cd ..
```

### Utilisation

**Toutes les commandes utilisent le wrapper `./rcli`** à la racine du projet :

```bash
# Au lieu de : python cli/main.py server status
./rcli server status
```

---

## 📋 Commandes principales - Utilisation quotidienne

### 1. Vérifier l'état du serveur

**Pour toi (vérification rapide)** :
```bash
# État de tous les containers
./rcli server status

# État Admin Central uniquement
./rcli server status --admin

# Mode watch (mise à jour en temps réel)
./rcli server status --watch
```

**Pour moi (diagnostic)** :
```bash
# Vérification complète avec ressources
./rcli server status --all
./rcli server resources

# Health check de tous les services
./rcli health check
```

**Exemple de sortie** :
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

---

### 2. Consulter les logs

**⚠️ IMPORTANT : Deux commandes disponibles** :
- `./rcli server logs` : Commande simple (groupe `server`)
- `./rcli logs` : Commande avancée avec plus d'options (groupe `logs`)

**Pour toi (logs récents)** :
```bash
# Logs de tous les services (100 dernières lignes)
./rcli server logs
# OU
./rcli logs

# Logs d'un service spécifique
./rcli server logs backend
# OU
./rcli logs --service backend

# Suivre en temps réel (⭐ RECOMMANDÉ pour travailler)
./rcli logs --follow
# OU
./rcli server logs --follow

# Suivre un service spécifique en temps réel
./rcli logs --follow --service backend
./rcli logs --follow --service postgres
```

**💡 Astuce : Logs en temps réel pendant le développement**
```bash
# Ouvrir un terminal dédié aux logs
./rcli logs --follow

# Filtrer uniquement les erreurs en temps réel
./rcli logs --follow | grep -i "error\|exception\|failed"

# Suivre uniquement le backend
./rcli logs --follow --service backend
```

**Pour moi (diagnostic avancé)** :
```bash
# Voir uniquement les erreurs
./rcli server logs --errors
./rcli logs errors --last 1h

# Rechercher un motif spécifique
./rcli logs search "ERROR" --last 1h

# Erreurs API (4xx, 5xx)
./rcli logs api-errors --last 1h

# Requêtes lentes (> 2 secondes)
./rcli logs slow-requests --threshold 2.0

# Activité utilisateurs
./rcli logs user-activity --last 1h --top 20
```

**🧹 Nettoyer les logs** :
```bash
# Nettoyer les logs de tous les conteneurs
./rcli server cleanup --logs

# Nettoyer les logs + autres ressources
./rcli server cleanup --all

# Nettoyer les logs Admin Central
./rcli server cleanup --logs --admin
```

---

### 3. Redémarrer les services

**Quand redémarrer** :
- Après un déploiement
- Si un service plante
- Après modification de configuration

**Commandes** :
```bash
# Redémarrer tous les services Reboul Store
./rcli server restart

# Redémarrer un service spécifique
./rcli server restart backend
./rcli server restart frontend

# Redémarrer Admin Central
./rcli server restart --admin
```

---

### 4. Monitoring des ressources

**Pour toi (vérification ponctuelle)** :
```bash
# Ressources système (CPU, RAM, disque)
./rcli server resources

# Monitoring une fois
./rcli server monitor --once
```

**Pour moi (surveillance continue)** :
```bash
# Monitoring continu (mise à jour toutes les 30 secondes)
./rcli server monitor

# Avec seuils personnalisés
./rcli server monitor --cpu-threshold 70 --ram-threshold 85
```

---

### 5. Gestion des backups

**Pour toi (backup manuel)** :
```bash
# Backup de la base de données
./rcli db backup --server

# Lister les backups disponibles
./rcli db backup-list

# Restaurer un backup
./rcli db backup-restore backups/reboulstore_db_20251229_153150.sql.gz --yes
```

**Pour moi (automatisation)** :
```bash
# Vérifier les backups automatiques (cron)
./rcli server cron --list

# Activer backup automatique quotidien (2h du matin)
./rcli server cron --enable-backup
```

---

### 6. Sécurité et certificats SSL

**Pour toi (vérification)** :
```bash
# Vérifier l'expiration des certificats SSL
./rcli server ssl --check

# Vérifier un domaine spécifique
./rcli server ssl --check --domain reboulstore.com
```

**Pour moi (audit complet)** :
```bash
# Audit de sécurité complet
./rcli server security --audit

# Vérifie :
# - Ports ouverts
# - Permissions fichiers sensibles (.env, SSL)
# - Certificats SSL (expiration)
# - Mises à jour de sécurité
# - Configuration firewall
# - Containers Docker actifs
```

---

### 7. Gestion des fichiers (upload/download)

**Pour toi (transfert de fichiers)** :
```bash
# Uploader un fichier
./rcli server file --upload ./image.jpg /var/www/reboulstore/uploads/image.jpg

# Télécharger un fichier
./rcli server file --download /var/log/nginx/error.log ./logs/error.log

# Lister les fichiers d'un répertoire
./rcli server file --list /var/www/reboulstore/backups
```

**Pour moi (backup fichiers)** :
```bash
# Backup d'un répertoire (ex: uploads)
./rcli server file --backup uploads

# Backup complet (uploads + configs)
./rcli server file --backup-all
```

---

### 8. Exécuter des commandes SSH

**Pour toi (commandes simples)** :
```bash
# Voir l'espace disque
./rcli server exec "df -h"

# Voir les containers Docker
./rcli server exec "docker ps"

# Voir les dernières lignes d'un log
./rcli server exec "tail -100 /var/log/nginx/access.log"
```

**Pour moi (diagnostic avancé)** :
```bash
# Exécuter dans un répertoire spécifique
./rcli server exec "ls -la" --cwd /var/www/reboulstore

# Commandes complexes
./rcli server exec "docker stats --no-stream"
```

---

### 9. Déploiement

**Pour toi (déploiement standard)** :
```bash
# Vérifier que le déploiement fonctionne
./rcli deploy check

# Déployer les services
./rcli deploy deploy

# Mettre à jour le code depuis git et redémarrer
./rcli deploy update
```

**Pour moi (déploiement avancé)** :
```bash
# Déployer avec rebuild
./rcli deploy deploy --build

# Déployer avec pull git
./rcli deploy update --pull

# Déployer avec rebuild + pull
./rcli deploy update --rebuild --pull
```

---

## 🎯 Workflows recommandés

### Workflow quotidien (pour toi)

**Le matin** :
```bash
# 1. Vérifier l'état du serveur
./rcli server status

# 2. Vérifier les erreurs récentes
./rcli logs errors --last 1h

# 3. Vérifier les ressources
./rcli server resources
```

**Avant un déploiement** :
```bash
# 1. Vérifier l'état actuel
./rcli server status

# 2. Faire un backup
./rcli db backup --server

# 3. Vérifier les logs d'erreurs
./rcli logs errors --last 1h

# 4. Déployer
./rcli deploy update
```

**Après un déploiement** :
```bash
# 1. Vérifier que tout fonctionne
./rcli server status
./rcli health check

# 2. Vérifier les logs d'erreurs
./rcli logs api-errors --last 5m

# 3. Monitorer les ressources
./rcli server monitor --once
```

---

### Workflow diagnostic (pour moi)

**Quand un problème survient** :
```bash
# 1. État complet
./rcli server status --all
./rcli server resources

# 2. Logs d'erreurs
./rcli logs errors --last 1h
./rcli logs api-errors --last 1h

# 3. Health check
./rcli health check

# 4. Requêtes lentes
./rcli logs slow-requests --last 1h

# 5. Activité utilisateurs
./rcli logs user-activity --last 1h --top 20
```

**Si problème persiste** :
```bash
# 1. Logs en temps réel
./rcli server logs --follow

# 2. Monitoring continu
./rcli server monitor

# 3. Audit de sécurité
./rcli server security --audit
```

---

## 📚 Documentation complète

### Fichiers de référence

- **`cli/CLI_SERVER_COMMANDS.md`** : Toutes les commandes serveur ⭐
- **`docs/cli/CLI_SERVER_USAGE.md`** : Guide d'utilisation détaillé
- **`docs/cli/CLI_VPS_COMMANDS.md`** : Commandes VPS spécifiques
- **`cli/RECAPITULATIF.md`** : Récapitulatif complet du CLI

### Dans project-rules.mdc

La section **"CLI - Gestion Serveur VPS (PRODUCTION)"** contient toutes les commandes avec exemples.

---

## 🔧 Configuration requise

### Variables d'environnement (optionnelles)

Le CLI utilise la configuration SSH définie dans `cli/utils/server_helper.py`.

**Si besoin de configurer** :
```bash
export VPS_HOST=152.228.218.35
export VPS_USER=deploy
export VPS_SSH_KEY=~/.ssh/id_rsa
```

**Par défaut** : Le CLI utilise la configuration dans `cli/utils/server_helper.py`.

---

## 💡 Astuces

### 1. Mode watch pour monitoring continu

```bash
# Statut en temps réel (mise à jour toutes les 2 secondes)
./rcli server status --watch

# Monitoring ressources en continu
./rcli server monitor
```

### 2. Combinaison de commandes

```bash
# Vérifier état + logs erreurs en une fois
./rcli server status && ./rcli logs errors --last 1h

# Backup + vérification
./rcli db backup --server && ./rcli server status
```

### 3. Redirection des logs

```bash
# Sauvegarder les logs dans un fichier
./rcli server logs > logs_$(date +%Y%m%d_%H%M%S).txt

# Filtrer et sauvegarder
./rcli logs errors --last 1h > errors_$(date +%Y%m%d).txt
```

---

## ❓ Questions fréquentes

### Q: Comment savoir si le serveur a un problème ?

**R** : Utiliser cette séquence :
```bash
./rcli server status
./rcli health check
./rcli logs errors --last 1h
```

### Q: Comment voir les erreurs récentes ?

**R** :
```bash
# Erreurs générales
./rcli logs errors --last 1h

# Erreurs API spécifiques
./rcli logs api-errors --last 1h
```

### Q: Comment redémarrer un service qui plante ?

**R** :
```bash
# Redémarrer le service spécifique
./rcli server restart backend

# Vérifier qu'il redémarre correctement
./rcli server status --watch
```

### Q: Comment faire un backup avant un changement ?

**R** :
```bash
# Backup DB
./rcli db backup --server

# Backup fichiers
./rcli server file --backup-all
```

### Q: Comment vérifier la sécurité du serveur ?

**R** :
```bash
# Audit complet
./rcli server security --audit

# Vérifier certificats SSL
./rcli server ssl --check
```

---

## 🎯 Résumé - Commandes essentielles

**Pour toi (utilisation quotidienne)** :
```bash
./rcli server status              # État du serveur
./rcli server logs               # Logs récents
./rcli server restart            # Redémarrer
./rcli db backup --server        # Backup DB
./rcli logs errors --last 1h    # Erreurs récentes
```

**Pour moi (diagnostic avancé)** :
```bash
./rcli server status --all      # État complet
./rcli server resources          # Ressources système
./rcli health check              # Health check complet
./rcli logs api-errors --last 1h # Erreurs API
./rcli server security --audit   # Audit sécurité
```

---

**Date de création** : 31 décembre 2025  
**Dernière mise à jour** : 31 décembre 2025

