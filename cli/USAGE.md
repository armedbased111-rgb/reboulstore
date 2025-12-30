# 🚀 Guide d'utilisation du CLI Python

## 📦 Installation

```bash
cd cli
./setup.sh
source venv/bin/activate
```

## 🚀 Utilisation rapide

**Option 1 : Utiliser le script wrapper (recommandé)** ⭐
```bash
# Depuis la racine du projet
./rcli logs
./rcli logs --service backend
./rcli roadmap check
```

**Option 2 : Avec python3 directement**
```bash
# Activer l'environnement virtuel d'abord
cd cli
source venv/bin/activate

# Puis utiliser python3 (pas python)
python3 main.py logs
python3 main.py logs --service backend
```

**Option 3 : Depuis n'importe où**
```bash
# Activer l'environnement virtuel
source cli/venv/bin/activate

# Utiliser le chemin complet avec python3
python3 cli/main.py logs
```

## 🎯 Cas d'usage principaux

### 1. Mettre à jour la roadmap après avoir terminé une tâche

```bash
# Cocher une tâche spécifique
./rcli roadmap update --task "15.1 Configuration Cloudinary"

# Marquer une phase complète
./rcli roadmap update --phase 15 --complete
```

### 2. Vérifier la cohérence de la roadmap

```bash
./rcli roadmap check
```

### 3. Obtenir les détails d'une phase

```bash
./rcli roadmap phase 15
```

### 4. Générer un résumé de contexte pour Cursor

```bash
# Génère .cursor/context-summary.md
./rcli context generate

# Ou spécifier un fichier de sortie
./rcli context generate --output .cursor/my-context.md
```

### 5. Synchroniser tous les fichiers de contexte

```bash
./rcli context sync
```

### 6. Générer du code rapidement

```bash
# Générer un composant React
./rcli code component ProductCard --domain UI

# Générer un module NestJS (basique)
./rcli code module Reviews

# Générer un module NestJS complet (Entity + DTOs + Service + Controller + Module)
./rcli code module Reviews --full

# Générer une entité TypeORM
./rcli code entity Review

# Générer des DTOs
./rcli code dto Review --type all

# Générer un service NestJS
./rcli code service Review

# Générer un controller NestJS
./rcli code controller Review

# Générer une page React
./rcli code page Orders
```

### 7. Générer un script de test

```bash
# Pour un endpoint
./rcli test generate endpoint products

# Pour un module
./rcli test generate module orders
```

### 8. Valider la documentation

```bash
./rcli docs validate
```

### 9. Synchroniser la documentation

```bash
./rcli docs sync
```

### 11. Gérer les backups de la base de données 💾

```bash
# Créer un backup (local)
./rcli db backup --local

# Créer un backup sur le serveur distant
./rcli db backup --server

# Options avancées
./rcli db backup --local --keep 50  # Garder 50 backups au lieu de 30

# Lister tous les backups
./rcli db backup-list

# Restaurer un backup
./rcli db backup-restore backups/reboulstore_db_20250129_143022.sql.gz --local

# Supprimer un backup
./rcli db backup-delete backups/reboulstore_db_20250129_143022.sql.gz

# Options avancées
./rcli db backup --local --keep 50  # Garder 50 backups au lieu de 30
./rcli db backup --container reboulstore-postgres-prod  # Container personnalisé
```

### 10. Vérifier les certificats SSL 🔐

```bash
# Vérifier tous les certificats (reboulstore.com, www, admin)
./rcli server ssl --check

# Vérifier un domaine spécifique
./rcli server ssl --check --domain reboulstore.com

# Vérifier seulement Admin Central
./rcli server ssl --check --admin
```

### 11. Gérer les cron jobs ⏰

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

### 12. Gérer les fichiers (upload/download) 📁

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

### 13. Exécuter une commande SSH directement 🖥️

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

### 14. Recherche avancée dans les logs 🔍

```bash
# Rechercher les erreurs API (codes 4xx, 5xx, exceptions backend)
./rcli logs api-errors --last 1h

# Rechercher les requêtes lentes (> 2 secondes par défaut)
./rcli logs slow-requests --threshold 2.0 --last 1h

# Analyser l'activité utilisateurs (IPs, endpoints populaires)
./rcli logs user-activity --last 1h --top 20
```

### 15. Monitoring des ressources serveur 📊

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

### 16. Audit de sécurité 🔒

```bash
# Effectuer un audit de sécurité complet
./rcli server security --audit
```

L'audit vérifie :
- Ports ouverts
- Permissions des fichiers sensibles (.env, clés SSL)
- Certificats SSL (expiration)
- Mises à jour de sécurité disponibles
- Configuration firewall (UFW/iptables)
- Conteneurs Docker actifs

### 17. Vérification DNS/Propagation 🌐

```bash
# Vérifier les enregistrements DNS d'un domaine
./rcli server dns --check reboulstore.com

# Vérifier la propagation DNS pour tous les domaines du projet
./rcli server dns --propagate
```

### 18. Backup complet du système 💾

```bash
# Créer un backup complet (DB + fichiers + configs)
./rcli server backup --full
```

Le backup complet inclut :
- Base de données (reboulstore_db.sql.gz)
- Fichiers uploads (uploads.tar.gz)
- Fichiers de configuration (.env.production)
- Archive unique avec timestamp : `backups/full_YYYYMMDD_HHMMSS.tar.gz`

### 19. Rollback rapide 🔄

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

### 20. Consulter les logs du serveur 📋

**Logs locaux (développement)** :
```bash
# Voir les logs locaux de tous les services (100 dernières lignes)
./rcli logs --local

# Voir les logs d'un service spécifique (local)
./rcli logs --local --service backend
./rcli logs --local --service frontend

# Suivre les logs en temps réel (local)
./rcli logs --local --follow

# Voir seulement les erreurs (local)
./rcli logs errors --local

# Rechercher dans les logs (local)
./rcli logs search "error" --local
```

**Logs serveur distant (production)** :
```bash
# Voir les logs de tous les services (100 dernières lignes)
./rcli logs

# Voir les logs d'un service spécifique
./rcli logs --service backend
./rcli logs --service frontend
./rcli logs --service nginx

# Voir plus de lignes
./rcli logs --tail 500

# Suivre les logs en temps réel (comme tail -f)
./rcli logs --follow

# Ou utiliser la commande dédiée
./rcli logs live

# Voir seulement les erreurs
./rcli logs errors

# Rechercher un motif dans les logs
./rcli logs search "error"
./rcli logs search "POST /api"

# Logs Admin Central
./rcli logs --admin
./rcli logs --admin --service backend

# Liste les services disponibles
./rcli logs list
```

**Raccourcis rapides :**
- `./rcli logs --local` → Logs locaux de base
- `./rcli logs` → Logs serveur distant (par défaut)
- `./rcli logs -f --local` → Suivi en temps réel (local)
- `./rcli logs errors --local` → Seulement les erreurs (local)
- `./rcli logs -s backend --local` → Logs backend uniquement (local)

**Note :** Remplacez `./rcli` par `python3 cli/main.py` si vous préférez utiliser python3 directement (après avoir activé l'environnement virtuel).

## 🔄 Workflow recommandé

### Après avoir terminé une tâche

```bash
# 1. Cocher la tâche dans la roadmap
./rcli roadmap update --task "15.1 Configuration Cloudinary"

# 2. Vérifier la cohérence
./rcli roadmap check

# 3. Si la phase est complète, la marquer
./rcli roadmap update --phase 15 --complete

# 4. Synchroniser le contexte
./rcli context sync

# 5. Générer un nouveau résumé pour Cursor
./rcli context generate
```

### Avant de commencer une nouvelle phase

```bash
# 1. Vérifier l'état de la roadmap
./rcli roadmap check

# 2. Obtenir les détails de la phase précédente
./rcli roadmap phase 14

# 3. Générer un résumé de contexte à jour
./rcli context generate
```

## 🎨 Intégration avec Cursor

Le CLI peut être utilisé directement depuis Cursor :

1. **Générer un résumé de contexte** avant une session de travail
2. **Mettre à jour la roadmap** après chaque tâche
3. **Valider la cohérence** avant de commiter

## 📚 Commandes complètes

Voir `./rcli --help` ou `python3 cli/main.py --help` pour la liste complète des commandes.

