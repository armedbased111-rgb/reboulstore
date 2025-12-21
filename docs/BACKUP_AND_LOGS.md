# Backup & Logs - Configuration Production

## 📦 Backups Automatiques

### Configuration

Les backups de la base de données PostgreSQL sont configurés pour s'exécuter automatiquement chaque jour à 2h du matin.

**Script de backup** : `scripts/backup-db.sh`
**Script de configuration cron** : `scripts/setup-backup-cron.sh`

### Installation

```bash
cd /opt/reboulstore
chmod +x scripts/backup-db.sh scripts/setup-backup-cron.sh
./scripts/setup-backup-cron.sh
```

### Emplacement des backups

Les backups sont stockés dans : `/opt/reboulstore/backups/`

Format : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`

### Rétention

- Les 30 derniers backups sont conservés automatiquement
- Les anciens backups sont supprimés automatiquement

### Restauration

```bash
cd /opt/reboulstore
./scripts/backup-db.sh --restore backups/reboulstore_db_YYYYMMDD_HHMMSS.sql.gz
```

### Vérification des backups

```bash
# Voir les backups disponibles
ls -lh /opt/reboulstore/backups/

# Voir les logs des backups
tail -f /var/log/reboulstore-backup.log

# Voir le cron job
crontab -l | grep backup-db
```

### Backup manuel

```bash
cd /opt/reboulstore
./scripts/backup-db.sh
```

---

## 📋 Logs Centralisés

### Configuration

Les logs sont centralisés via Docker logging driver (json-file) avec rotation automatique :
- Taille max : 10 MB par fichier
- Nombre de fichiers : 3 (rotation)
- Format : JSON (structuré)

### Visualisation des logs

**Script de visualisation** : `scripts/view-logs.sh`

```bash
# Tous les services (100 dernières lignes)
cd /opt/reboulstore
./scripts/view-logs.sh

# Service spécifique
./scripts/view-logs.sh backend
./scripts/view-logs.sh frontend
./scripts/view-logs.sh postgres

# Avec nombre de lignes personnalisé
./scripts/view-logs.sh backend --tail 200

# Suivre les logs en temps réel
./scripts/view-logs.sh backend --follow
```

### Commandes Docker directes

```bash
cd /opt/reboulstore

# Logs de tous les services
docker compose -f docker-compose.prod.yml --env-file .env.production logs

# Logs d'un service spécifique
docker compose -f docker-compose.prod.yml --env-file .env.production logs backend

# Suivre les logs en temps réel
docker compose -f docker-compose.prod.yml --env-file .env.production logs --follow backend

# Logs avec timestamp
docker compose -f docker-compose.prod.yml --env-file .env.production logs -t backend
```

### Emplacement des logs Docker

Les logs sont stockés dans : `/var/lib/docker/containers/[container_id]/`

Pour trouver le container ID :
```bash
docker ps --format "{{.ID}} {{.Names}}"
```

### Filtrage des logs

```bash
# Logs d'erreur uniquement
docker compose -f docker-compose.prod.yml --env-file .env.production logs backend | grep -i error

# Logs depuis une date spécifique
docker compose -f docker-compose.prod.yml --env-file .env.production logs --since 2025-12-20T00:00:00 backend

# Logs entre deux dates
docker compose -f docker-compose.prod.yml --env-file .env.production logs --since 2025-12-20T00:00:00 --until 2025-12-20T23:59:59 backend
```

### Logs Backend (NestJS)

Le backend utilise le logger NestJS avec différents niveaux :
- **Production** : `error`, `warn`, `log`
- **Development** : `error`, `warn`, `log`, `debug`, `verbose`

Les logs sont automatiquement formatés et incluent :
- Timestamp
- Niveau de log
- Contexte (module/service)
- Message

---

## 🔧 Maintenance

### Vérifier l'état des backups

```bash
# Taille totale des backups
du -sh /opt/reboulstore/backups/

# Nombre de backups
ls -1 /opt/reboulstore/backups/ | wc -l

# Dernier backup
ls -t /opt/reboulstore/backups/ | head -1
```

### Nettoyer les anciens backups manuellement

```bash
# Garder seulement les 7 derniers backups
cd /opt/reboulstore/backups/
ls -t reboulstore_db_*.sql.gz | tail -n +8 | xargs -r rm -f
```

### Vérifier l'espace disque

```bash
# Espace utilisé par les backups
du -sh /opt/reboulstore/backups/

# Espace utilisé par les logs Docker
du -sh /var/lib/docker/containers/

# Espace disque total
df -h
```

---

## 🚨 Troubleshooting

### Le backup ne s'exécute pas

1. Vérifier que le cron job existe :
   ```bash
   crontab -l | grep backup-db
   ```

2. Vérifier les logs cron :
   ```bash
   tail -f /var/log/reboulstore-backup.log
   ```

3. Vérifier les permissions :
   ```bash
   ls -l /opt/reboulstore/scripts/backup-db.sh
   chmod +x /opt/reboulstore/scripts/backup-db.sh
   ```

### Les logs sont trop volumineux

Les logs Docker sont limités à 10 MB par fichier avec 3 fichiers max (30 MB total par service).

Pour réduire la taille des logs :
```bash
# Redémarrer les services pour créer de nouveaux fichiers de log
cd /opt/reboulstore
docker compose -f docker-compose.prod.yml --env-file .env.production restart
```

### Erreur lors de la restauration

1. Vérifier que le fichier de backup existe
2. Vérifier que la base de données est vide ou que tu acceptes de la remplacer
3. Vérifier les permissions PostgreSQL

---

## 📝 Notes

- Les backups sont compressés (gzip) pour économiser l'espace disque
- Les logs Docker sont automatiquement rotatés pour éviter la saturation disque
- En cas de problème, consulter `/var/log/reboulstore-backup.log` pour les erreurs de backup
