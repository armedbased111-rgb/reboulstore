---
type: architecture
---
# Infrastructure

Liens : [[Architecture/Architecture]]

---

## VPS

- **Hôte** : 152.228.218.35 (OVH)
- **User deploy** : `deploy`
- **SSH key** : `~/.ssh/id_ed25519`

## Tunnel SSH (dev local)

```bash
ssh -L 5433:localhost:5432 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N
```

DB accessible sur `host.docker.internal:5433` depuis les containers Docker.

## Docker

- Dev : `docker-compose.yml` — services : backend (3001), frontend (3000), redis (6379)
- Prod : `docker-compose.prod.yml`
- **Jamais** `docker compose down -v` → supprimerait les volumes DB
- Volumes DB à ne jamais supprimer : `reboulstore_postgres_prod`, `postgres_data_prod`

## Déploiement prod

```bash
# TOUJOURS utiliser ce script
./scripts/deploy-prod.sh

# Ce script fait :
# 1. Backup DB automatique
# 2. docker compose down (SANS -v)
# 3. Supprime uniquement les volumes de build
# 4. Build nouvelles images
# 5. docker compose up -d
# 6. Vérification santé
```

## Nginx

- Reverse proxy : backend + frontend
- Page maintenance : `nginx/maintenance.html`
- Toggle maintenance : via config Nginx

## Backup DB

```bash
./rcli db backup --server          # backup manuel
./rcli db backup-list              # lister les backups
./rcli db backup-restore <file>    # restaurer
```

Backups stockés dans `/opt/reboulstore/backups/` sur le VPS.
Format : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`

## Variables d'environnement

- `.env` — dev (tunnel SSH, clés test)
- `.env.production` — prod (connexion VPS directe, clés live)
- **Jamais commiter** ces deux fichiers
- Build bloqué si `.env.production` absent

## Sitemap

`frontend/public/sitemap.xml` — à maintenir à jour avec les nouvelles pages.
