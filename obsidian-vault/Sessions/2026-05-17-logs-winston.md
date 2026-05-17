---
type: session
date: 2026-05-17
sujet: Logs Phase 1 — Winston structuré
statut: en-cours
note: tests locaux OK — prod + requestId restants
---
# Session — Winston / logs structurés (Phase 1)

## Objectif

Activer les logs applicatifs NestJS avant la stack Loki/Grafana (Phase 3).

## Ce qui a été fait (code)

### Dépendances
- `winston` + `nest-winston` dans `backend/package.json`

### Configuration
- `backend/src/config/logger.config.ts` — console (dev coloré), fichiers `error.log` + `combined.log` en prod (`LOG_DIR`, défaut `/app/logs`)
- `backend/src/app.module.ts` — `WinstonModule.forRoot`, filtre global, interceptor HTTP
- `backend/src/main.ts` — logger Nest branché sur Winston (`bufferLogs`)

### Événements structurés (JSON via `log-event.ts`)
| Event | Où |
|-------|-----|
| `auth_login_failed` | `auth.service.ts` (email + reason) |
| `http_5xx` | `global-exception-logging.filter.ts` |
| `stripe_webhook_failed` | `checkout.service.ts` (signature) |
| `checkout_error` | `http-logging.interceptor.ts` (4xx sur `/checkout`) |

### Filtre unique
- `global-exception-logging.filter.ts` remplace l’ancien `MulterExceptionFilter` (multer + 5xx + logging)

### Docker
- `docker-compose.yml` : volume `./backend/logs:/app/logs`, `LOG_DIR=/app/logs`
- `docker-compose.prod.yml` : volume `logs_data_prod` → `/app/logs`

### Build
- `npm run build` backend ✅

## Tests locaux ✅ 17/05/2026

| Test | Résultat |
|------|----------|
| `GET /health` | 200 OK |
| `POST /auth/login` (mauvais mot de passe) | 401 + log `auth_login_failed` |
| `POST /checkout/create-session` (panier vide) | 400 + log `checkout_error` |

**Note** : au premier démarrage, `winston` manquait dans le volume `node_modules` du container → `docker exec reboulstore-backend npm install winston nest-winston --legacy-peer-deps` puis restart.

**Fix interceptor** : `checkout_error` loggé via `GlobalExceptionLoggingFilter` (les 4xx Nest ne passent pas toujours par `finalize` de l’interceptor).

## Reste à faire (Phase 1)

- [ ] Middleware `requestId`
- [ ] Deploy prod + vérif `logs/error.log` dans le container

## Commandes test

→ Référence complète : [[Architecture/commands-logs]]

## Fichiers touchés

- `backend/src/config/logger.config.ts`
- `backend/src/common/log-event.ts`
- `backend/src/common/filters/global-exception-logging.filter.ts`
- `backend/src/common/interceptors/http-logging.interceptor.ts`
- `backend/src/app.module.ts`, `main.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/checkout/checkout.service.ts`
- `docker-compose.yml`, `docker-compose.prod.yml`
- `backend/.gitignore` (`logs/`)
