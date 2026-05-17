---
type: architecture
node: observability
maj: 2026-05-17
---
# Observability — Loki + Promtail + Grafana

Liens : [[Architecture/grafana]] · [[Architecture/vps]] · [[Architecture/commands-logs]] · [[Projet/roadmap]]

---

## Stack (Phase 3)

| Service | Container | Rôle |
|---------|-----------|------|
| Loki | `reboulstore-loki` | Stockage + requêtes LogQL |
| Promtail | `reboulstore-promtail` | Collecte logs Docker + Winston |
| Grafana | `reboulstore-grafana` | Dashboards |

Fichiers repo :
- `docker-compose.observability.yml`
- `observability/loki/loki-config.yml` — rétention **30 jours** (`720h`)
- `observability/promtail/promtail-config.yml`
- `observability/grafana/` — datasource + dashboard `Reboul Store — Logs`

## Collecte Promtail

- **Docker** : containers `reboulstore-*` et `admin-central-*` (socket Docker)
- **Winston** : volume `reboulstore_logs_prod` → `/winston/reboul/*.log`

## Grafana (UI)

→ **Guide complet** : [[Architecture/grafana]] (tunnel, mdp, dashboard, LogQL, dépannage)

## Déploiement (une fois sur le VPS)

```bash
cd /var/www/reboulstore
cp .env.observability.example .env.observability
# Éditer GRAFANA_ADMIN_PASSWORD (mot de passe fort)
chmod 600 .env.observability
./scripts/setup-observability.sh
```

Prérequis : stack prod + Admin Central déjà sur `reboulstore-network`.

## Dashboard provisionné

Requêtes Loki : `{job="winston", service="reboulstore-backend"}` — détail : [[Architecture/grafana]]

- Erreurs 5xx · `auth_login_failed` · `checkout_error` · volume / 5 min

## Volumes

| Volume | Usage |
|--------|--------|
| `reboulstore_loki_data` | Chunks Loki |
| `reboulstore_grafana_data` | Config / users Grafana |

Ne pas supprimer avec `docker compose down -v` sur la stack prod principale.
