---
type: session
date: 2026-05-17
sujet: Logs Phases 1–3 — Winston, Loki, Grafana
statut: terminé
note: Grafana OK VPS ; dashboard fix job=winston ; node [[Architecture/grafana]]
---
# Session — Logs & observabilité (Phases 1–3)

## Objectif

Logs structurés avant lancement + stack centralisée Loki/Grafana.

## Phase 1 — Winston ✅

- `winston` + events : `auth_login_failed`, `http_5xx`, `stripe_webhook_failed`, `checkout_error`
- `requestId` + `X-Request-Id` (middleware + `logEvent`)
- Entrypoints dev/prod séparés (incident `chown nestjs` en dev résolu)
- Prod : `/app/logs/combined.log` + `docker logs` JSON

## Phase 2 — Hygiène VPS ✅

- Logrotate `/var/log/reboulstore-backup.log` (30 j)
- Rétention documentée → [[Architecture/vps]]

## Phase 3 — Loki / Grafana ✅

- Repo : `docker-compose.observability.yml`, `observability/`, `scripts/setup-observability.sh`
- VPS : stack up, `.env.observability` (mdp sur serveur uniquement)
- Dashboard **Reboul Store — Logs** validé (`auth_login_failed` visible)
- Fix requêtes : `{job="winston"}` (pas `container`)
- **Guide** : [[Architecture/grafana]]

## Reste (Phase 4)

- [ ] Alertes email 5xx
- [ ] Aligner doc `./rcli server logs`
- [ ] Commit + push repo (observability pas encore sur git remote)

## Fichiers clés

- Backend : `logger.config.ts`, `log-event.ts`, `request-id.middleware.ts`, filters/interceptors
- Docker : entrypoints, `docker-compose.prod.yml`, `docker-compose.observability.yml`
- Vault : [[Architecture/grafana]], [[Architecture/observability]], [[Architecture/commands-logs]]
