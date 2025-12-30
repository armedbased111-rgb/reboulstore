# 🔧 CLI Server Workflow - Commandes de gestion serveur

## Vue d'ensemble

Le CLI dispose d'un arsenal complet de commandes pour gérer le serveur VPS. Toutes les commandes utilisent `./rcli` comme wrapper.

## 📋 Commandes disponibles

### 1. 🔐 Certificats SSL

```bash
# Vérifier l'expiration des certificats SSL
./rcli server ssl --check

# Vérifier un domaine spécifique
./rcli server ssl --check --domain reboulstore.com

# Vérifier seulement Admin Central
./rcli server ssl --check --admin
```

**Utilité** : Vérifier que les certificats SSL sont valides et ne vont pas expirer bientôt.

---

### 2. ⏰ Gestion des Cron Jobs

```bash
# Lister tous les cron jobs
./rcli server cron --list

# Activer le backup automatique de la DB (quotidien à 2h)
./rcli server cron --enable-backup

# Désactiver le backup automatique
./rcli server cron --disable-backup

# Ajouter un cron job personnalisé
./rcli server cron --add "0 3 * * * /path/to/script.sh" --description "Mon script quotidien"

# Supprimer un cron job (par numéro)
./rcli server cron --remove 1
```

**Utilité** : Automatiser des tâches récurrentes (backups, nettoyage, etc.).

---

### 3. 📁 Gestion des fichiers (upload/download)

```bash
# Uploader un fichier
./rcli server file --upload ./image.jpg /var/www/reboulstore/uploads/image.jpg

# Télécharger un fichier
./rcli server file --download /var/log/nginx/error.log ./logs/error.log

# Lister les fichiers d'un répertoire
./rcli server file --list /var/www/reboulstore/backups

# Backup d'un répertoire (ex: uploads)
./rcli server file --backup uploads

# Backup complet (uploads + configs)
./rcli server file --backup-all
```

**Utilité** : Transférer des fichiers sans FTP/SFTP séparé.

---

### 4. 🖥️ Exécuter des commandes SSH

```bash
# Exécuter une commande simple
./rcli server exec "df -h"

# Exécuter une commande dans un répertoire spécifique
./rcli server exec "ls -la" --cwd /var/www/reboulstore

# Voir les containers Docker
./rcli server exec "docker ps"

# Afficher les dernières lignes d'un log
./rcli server exec "tail -100 /var/log/nginx/access.log"
```

**Utilité** : Exécuter des commandes rapides sans ouvrir un terminal SSH.

---

### 5. 🔍 Recherche avancée dans les logs

```bash
# Rechercher les erreurs API (codes 4xx, 5xx, exceptions backend)
./rcli logs api-errors --last 1h

# Rechercher les requêtes lentes (> 2 secondes par défaut)
./rcli logs slow-requests --threshold 2.0 --last 1h

# Analyser l'activité utilisateurs (IPs, endpoints populaires)
./rcli logs user-activity --last 1h --top 20

# Rechercher un motif dans les logs
./rcli logs search "ERROR" --last 1h

# Filtrer seulement les erreurs
./rcli logs errors --last 24h
```

**Utilité** : Déboguer plus facilement les problèmes.

---

### 6. 📊 Monitoring des ressources serveur

```bash
# Afficher l'état des ressources une fois
./rcli server monitor --once

# Surveiller en continu (Ctrl+C pour arrêter)
./rcli server monitor

# Surveiller avec des seuils personnalisés
./rcli server monitor --cpu-threshold 70 --ram-threshold 85 --disk-threshold 80

# Surveiller avec un intervalle personnalisé (en secondes)
./rcli server monitor --interval 10
```

**Utilité** : Détecter les problèmes de performance avant qu'ils n'affectent les utilisateurs.

---

### 7. 🔒 Audit de sécurité

```bash
# Effectuer un audit de sécurité complet
./rcli server security --audit
```

**Vérifications** :
- Ports ouverts
- Permissions des fichiers sensibles (.env, clés SSL)
- Certificats SSL (expiration)
- Mises à jour de sécurité disponibles
- Configuration firewall (UFW/iptables)
- Conteneurs Docker actifs

**Utilité** : S'assurer que le serveur est sécurisé.

---

### 8. 🌐 Vérification DNS/Propagation

```bash
# Vérifier les enregistrements DNS d'un domaine
./rcli server dns --check reboulstore.com

# Vérifier la propagation DNS pour tous les domaines du projet
./rcli server dns --propagate
```

**Utilité** : Vérifier rapidement si les changements DNS sont propagés.

---

### 9. 💾 Backup complet du système

```bash
# Créer un backup complet (DB + fichiers + configs)
./rcli server backup --full
```

**Contenu du backup** :
- Base de données (reboulstore_db.sql.gz)
- Fichiers uploads (uploads.tar.gz)
- Fichiers de configuration (.env.production)
- Archive unique avec timestamp : `backups/full_YYYYMMDD_HHMMSS.tar.gz`

**Utilité** : Backup complet du système en une commande.

---

### 10. 🔄 Rollback rapide

```bash
# Lister les backups disponibles pour rollback
./rcli server rollback --list

# Rollback vers un backup spécifique
./rcli server rollback --to 20250129_120000

# Rollback vers le dernier backup disponible
./rcli server rollback --latest

# Rollback uniquement de la base de données
./rcli server rollback --latest --db-only

# Confirmer automatiquement (sans prompt)
./rcli server rollback --latest --yes
```

**Utilité** : Revenir rapidement en arrière après un déploiement qui pose problème.

---

## 🎯 Workflow recommandé

### Avant un déploiement

```bash
# 1. Vérifier l'état des ressources
./rcli server monitor --once

# 2. Faire un backup complet
./rcli server backup --full

# 3. Vérifier les logs d'erreurs
./rcli logs errors --last 1h
```

### Après un déploiement

```bash
# 1. Vérifier que tout fonctionne
./rcli server status
./rcli logs api-errors --last 5m

# 2. Monitorer les ressources
./rcli server monitor --interval 30

# 3. Si problème, rollback rapide
./rcli server rollback --list
./rcli server rollback --latest
```

### Maintenance quotidienne

```bash
# Vérifier les certificats SSL (1x par semaine)
./rcli server ssl --check

# Vérifier les cron jobs
./rcli server cron --list

# Audit de sécurité (1x par mois)
./rcli server security --audit

# Vérifier l'espace disque
./rcli server exec "df -h"
```

---

## 📚 Documentation complète

- **USAGE.md** : `cli/USAGE.md` - Guide complet d'utilisation
- **RECAPITULATIF.md** : `cli/RECAPITULATIF.md` - Récapitulatif de toutes les commandes
- **CRON_JOBS_RECOMMENDATIONS.md** : `cli/CRON_JOBS_RECOMMENDATIONS.md` - Recommandations de cron jobs

