# Workflow Déploiement

Processus complet de déploiement en production pour Reboul Store.

## Vue d'ensemble

Le déploiement suit un processus sécurisé avec sauvegarde automatique et vérifications.

## Processus de déploiement

### 1. Pré-déploiement

**Sauvegarde obligatoire** :
```bash
./rcli db backup --server
```

**Vérifications** :
- Vérifier l'état des ressources : `./rcli server monitor --once`
- Vérifier les logs d'erreurs : `./rcli logs errors --last 1h`
- Vérifier la sécurité : `./rcli server security --audit`

### 2. Déploiement

**Script de déploiement** :
```bash
./scripts/deploy-prod.sh
```

Ce script :
- Sauvegarde automatiquement la base de données
- Arrête les services SANS supprimer les volumes de base de données
- Supprime UNIQUEMENT les volumes de build (frontend_build)
- Build et redémarre les services

**JAMAIS exécuter** :
- `docker compose down -v` (supprime TOUS les volumes)
- `docker volume rm` sur les volumes de base de données

### 3. Post-déploiement

**Vérifications** :
```bash
# État des services
./rcli server status

# Logs d'erreurs API
./rcli logs api-errors --last 5m

# Monitoring ressources
./rcli server monitor --interval 30
```

**Si problème** :
```bash
# Lister les backups
./rcli db backup-list

# Rollback si nécessaire
./rcli server rollback --latest
```

## Références

- [[../docs/deployment/DEPLOYMENT_PROCEDURE.md|DEPLOYMENT_PROCEDURE]] - Procédure déploiement complète
- [[../docs/deployment/DEPLOYMENT_PREPARATION.md|DEPLOYMENT_PREPARATION]] - Préparation déploiement
- [[../docs/server/BACKUP_AND_LOGS.md|BACKUP_AND_LOGS]] - Gestion backups et logs
- [[../docs/server/PRODUCTION_SECURITY.md|PRODUCTION_SECURITY]] - Sécurité production
- [[../Server/Production.md|Production]] - Documentation serveur production
- [[CLI.md|CLI]] - Commandes CLI pour déploiement

## Commandes CLI utiles

### Monitoring
```bash
./rcli server status
./rcli server monitor
./rcli server resources
```

### Logs
```bash
./rcli server logs
./rcli logs errors --last 1h
./rcli logs api-errors --last 1h
./rcli logs slow-requests --threshold 2.0
```

### Backups
```bash
./rcli db backup --server
./rcli db backup-list
./rcli db backup-restore <backup_file> --yes
```

### Rollback
```bash
./rcli server rollback --list
./rcli server rollback --latest
```

## Maintenance

### Quotidienne
- Vérifier les logs d'erreurs
- Vérifier l'état des services
- Vérifier l'espace disque

### Hebdomadaire
- Vérifier les certificats SSL : `./rcli server ssl --check`
- Vérifier les backups automatiques
- Analyser l'activité : `./rcli logs user-activity --last 7d`

### Mensuelle
- Audit de sécurité : `./rcli server security --audit`
- Vérifier les mises à jour de sécurité
- Analyser les performances : `./rcli logs slow-requests --last 30d`

