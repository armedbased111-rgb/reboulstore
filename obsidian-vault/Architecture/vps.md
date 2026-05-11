---
type: architecture
---
# VPS — Infrastructure serveur

Liens : [[Architecture/Architecture]]

---

## Serveur OVH

| Paramètre | Valeur |
|-----------|--------|
| IP | `152.228.218.35` |
| OS | Ubuntu |
| User deploy | `deploy` |
| SSH key | `~/.ssh/id_ed25519` |
| Répertoire | `/opt/reboulstore/` |

## Containers Docker (prod)

| Container | Image | Port exposé | Rôle |
|-----------|-------|-------------|------|
| `reboul_frontend` | node/vite | 3000 | Sert le frontend React |
| `reboul_backend` | node/nest | 3001 | API NestJS |
| `reboul_postgres` | postgres:15 | — (interne) | Base de données |
| `reboul_redis` | redis:7 | — (interne) | Cache + sessions |
| `reboul_nginx` | nginx | 80 / 443 | Reverse proxy + SSL |

## Nginx — Reverse proxy

```
reboulstore.com        → frontend :3000
reboulstore.com/api    → backend :3001
reboulstore.com/api/docs → Swagger UI
```

SSL via Let's Encrypt (Certbot). Vérification : `./rcli server ssl --check`

## Mode maintenance

```bash
# Activer
./rcli server maintenance --on

# Désactiver
./rcli server maintenance --off
```

Page : `nginx/maintenance.html` — "Coming Soon" (montée dans `/etc/nginx/`)

## Déploiement prod

```bash
# TOUJOURS ce script — jamais docker compose down -v
./scripts/deploy-prod.sh

# Étapes internes :
# 1. Backup DB automatique
# 2. docker compose down (sans -v)
# 3. Build nouvelles images
# 4. docker compose up -d
# 5. Healthcheck
```

## Dev local — Tunnel SSH

```bash
# Ouvrir le tunnel (DB VPS → localhost:5433)
ssh -L 5433:localhost:5432 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N

# DB_HOST dans .env dev :
DB_HOST=host.docker.internal
DB_PORT=5433
```

## Backup DB

```bash
./rcli db backup --server          # backup manuel → /opt/reboulstore/backups/
./rcli db backup-list              # lister
./rcli db backup-restore <file>    # restaurer (demande confirmation)
```

Format : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`
**Le backup bloque l'opération si il échoue — ne jamais forcer.**

## Volumes critiques (NE JAMAIS supprimer)

- `reboulstore_postgres_prod`
- `postgres_data_prod`

## Monitoring

```bash
./rcli server status               # état containers
./rcli server logs backend         # logs NestJS
./rcli server logs --errors --last 1h
./rcli server monitor --once       # snapshot métriques
./rcli health check                # healthcheck complet
```

## Variables d'environnement

| Fichier | Contexte | Note |
|---------|----------|------|
| `.env` | Dev local | Clés test, tunnel SSH |
| `.env.production` | Prod VPS | Clés live, connexion directe |

**Jamais commiter ces fichiers. Build bloqué si `.env.production` absent.**
