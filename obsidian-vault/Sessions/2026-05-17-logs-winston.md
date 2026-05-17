---
type: session
date: 2026-05-17
sujet: Logs & observabilité — Phases 1–4 complètes
statut: terminé
note: Commit feat(logging) ; Grafana VPS validé ; guide [[Architecture/grafana]]
---
# Session — Logs & observabilité (Phases 1–4)

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

## Phase 4 — Alertes & CLI ✅

- `scripts/check-log-alerts.sh` + cron */15 sur VPS (`LOG_ALERT_EMAIL`)
- `./rcli logs guide` · `logs events` · `server logs --events`
- Commit : `feat(logging)` (observability, CLI, vault)

## Bilan

Section **Logs & observabilité** roadmap : **clôturée** avant lancement (hors évolutions futures type plus de dashboards).

**Doc utilisateur** : [[Architecture/grafana]] (mdp, tunnel, LogQL, events, alertes).

## Fichiers clés

- Backend : `logger.config.ts`, `log-event.ts`, `request-id.middleware.ts`, filters/interceptors
- Docker : entrypoints, `docker-compose.prod.yml`, `docker-compose.observability.yml`
- Scripts : `setup-observability.sh`, `check-log-alerts.sh`, logrotate backup
- Vault : [[Architecture/grafana]], [[Architecture/observability]], [[Architecture/commands-logs]]
