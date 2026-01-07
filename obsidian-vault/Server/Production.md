# Serveur Production

Documentation complète du serveur de production (VPS OVH).

## Documents

- [[../docs/server/OVH_SERVER_SETUP.md|OVH_SERVER_SETUP]] - Setup serveur OVH
- [[../docs/server/PRODUCTION_SECURITY.md|PRODUCTION_SECURITY]] - Sécurité production
- [[../docs/server/HTTPS_SETUP_COMPLETE.md|HTTPS_SETUP_COMPLETE]] - Configuration HTTPS
- [[../docs/server/BACKUP_AND_LOGS.md|BACKUP_AND_LOGS]] - Backups et logs
- [[../docs/server/ADMIN_CENTRAL_MONITORING.md|ADMIN_CENTRAL_MONITORING]] - Monitoring Admin Central

## Vue d'ensemble

Le serveur de production est un VPS OVH qui héberge :
- Reboul Store (frontend + backend + database)
- Admin Central (frontend + backend)
- Nginx (reverse proxy)
- PostgreSQL (base de données)

## Infrastructure

### Docker

Tous les services tournent dans des containers Docker.

### Nginx

Reverse proxy pour router les requêtes vers les bons services.

### SSL

Certificats SSL via Cloudflare (automatique).

## Sécurité

Voir [[../docs/server/PRODUCTION_SECURITY.md|PRODUCTION_SECURITY]] pour les détails complets.

### Mesures de sécurité

- Firewall configuré
- Accès SSH sécurisé
- Variables d'environnement protégées
- Backups automatiques

## Monitoring

- Logs centralisés
- Monitoring ressources (CPU, RAM, disque)
- Alertes automatiques

Voir [[../docs/server/BACKUP_AND_LOGS.md|BACKUP_AND_LOGS]] pour les détails.

