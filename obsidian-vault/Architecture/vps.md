---
type: architecture
maj: 2026-05-11 (soir)
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
| Répertoire projet | `/var/www/reboulstore/` |

## Containers Docker (prod)

| Container | Image | Port exposé | Rôle |
|-----------|-------|-------------|------|
| `reboulstore-frontend-prod` | reboulstore-frontend | 80 (interne) | Sert le build React (nginx statique) |
| `reboulstore-backend-prod` | reboulstore-backend | 3001 (interne) | API NestJS |
| `reboulstore-postgres-prod` | postgres:15-alpine | — (interne) | Base de données |
| `reboulstore-redis-prod` | redis:7-alpine | — (interne) | Cache + sessions |
| `reboulstore-nginx-prod` | nginx:alpine | 80 / 443 | Reverse proxy + SSL (Cloudflare) |

## Nginx — Reverse proxy

```
www.reboulstore.com        → frontend (build statique)
www.reboulstore.com/api    → backend :3001
www.reboulstore.com/health → backend /health
```

Config : `/var/www/reboulstore/nginx/conf.d/reboulstore.conf`
SSL via Let's Encrypt. Certs : `/var/www/reboulstore/nginx/ssl/`
Expiration SSL : **17/07/2026** (renouvellement automatique Certbot)

## Mode maintenance

```bash
./rcli server maintenance status   # afficher l'état
./rcli server maintenance on       # activer (return 503)
./rcli server maintenance off      # désactiver (site en ligne)
```

Page de maintenance : `nginx/maintenance.html`

## Déploiement prod

```bash
# TOUJOURS ce script — jamais docker compose down -v
DEPLOY_HOST=deploy@152.228.218.35 ./scripts/deploy-prod.sh
```

Étapes internes : backup DB → build images → down (sans -v) → up -d → healthcheck

## Dev local — Tunnel SSH

```bash
# Ouvrir le tunnel (DB VPS → localhost:5433)
./scripts/db-tunnel.sh

# ou manuellement :
ssh -L 5433:localhost:5432 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N
```

## Backup DB

```bash
./rcli db backup --server          # backup manuel → /var/www/reboulstore/backups/
./rcli db backup-list              # lister
./rcli db backup-restore <file>    # restaurer (demande confirmation)
```

Format : `reboulstore_db_YYYYMMDD_HHMMSS.sql.gz`
Cron backup quotidien : 2h00, log → `/var/log/reboulstore-backup.log`

## Volumes critiques (NE JAMAIS supprimer)

- `reboulstore_postgres_prod`
- `reboulstore_frontend_build`

## Monitoring

```bash
./rcli server status               # état containers
./rcli server logs --tail 50       # logs tous services
./rcli server logs --errors        # filtrer erreurs uniquement
./rcli server maintenance status   # mode maintenance actif ?
```

UptimeRobot : 2 moniteurs actifs (check toutes les 5 min) — alertes `armedbased111@gmail.com`

## Logs applicatifs (Winston — depuis 17/05/2026)

| Couche | Détail |
|--------|--------|
| Docker | `json-file` 10m × 3 / container (rotation courte) |
| NestJS prod | Volume `logs_data_prod` → `/app/logs` (`error.log`, `combined.log`) |
| NestJS dev | `./backend/logs` monté sur `/app/logs` |
| Événements JSON | `auth_login_failed`, `http_5xx`, `stripe_webhook_failed`, `checkout_error` |

Phase 3 prévue : Loki + Promtail + Grafana → [[Projet/roadmap#Logs & observabilité *(avant lancement)*]]

**Commandes** (tests, rcli, prod) → [[Architecture/commands-logs]]

## Variables d'environnement

| Fichier | Contexte | Note |
|---------|----------|------|
| `.env` | Dev local | Clés test, tunnel SSH |
| `.env.production` | Prod VPS | Clés live, connexion directe — permissions 600 |

**Jamais commiter ces fichiers. Build bloqué si `.env.production` absent.**
