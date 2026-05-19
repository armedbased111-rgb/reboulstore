---
type: architecture
node: commands-logs
maj: 2026-05-17
---
# Commandes — Logs & observabilité

Référence rapide : tests Winston (Phase 1), lecture logs Docker, prod, backups cron.

Liens : [[Architecture/vps]] · [[Projet/roadmap]] · [[Sessions/archive/2026-05-17-logs-winston]]

---

## Pendant une tâche longue (deploy prolongé, handoff IA)

Pour ne pas perdre le fil entre agents ou après interruption partielle :

### Avant deploy

- [ ] **Session** — note objectif deploy (fix, branche ou script `./scripts/deploy-prod.sh`).
- [ ] **Roadmap** — si la tâche change un statut (ex. « à confirmer » → déploiement lancé), ajuster ligne / sous-liste correspondante.
- [ ] **REBOUL.md** — seulement si l’état global lisible hors session change (nouveau risque, phase bloquée).

### Pendant deploy (attente, redeploy sibling, coupure SSH)

- [ ] **Session** — `statut: en-cours` + courte **note** (ex. redeploy entrypoint en cours).
- [ ] **Roadmap** — rappeler « en cours » dans la sous-section technique concernée si utile aux prochains passages.
- [ ] **REBOUL.md** — optionnel : une formulation « en cours » dans le tableau d’état si quelqu’un ne lit pas la session.
- [ ] **`./rcli context sync`** _(racine du repo Reboul)_ — après toute mise à jour vault significative pendant l’attente, pour refléter le contexte Cursor/CLI [[Projet/regles-critiques]].

### Après deploy

- [ ] **Session** — statut (terminé ou suite), résultats vérif prod ; cocher suites (ex. `/app/logs` non vides).
- [ ] **Roadmap** — cocher ou reformuler les lignes vérif prod ; retirer « en cours » si clos.
- [ ] **REBOUL.md** — aligner ligne **Logs** / état avec la vérité terrain.
- [ ] **`./rcli context sync`** _(racine du repo)_ — obligatoire en fin de cycle vault pour garder aides et prompts alignés.

**Session / commandes vault** — si nouveau pattern opérationnel : ajouter une phrase dans ce fichier (chemins docker, commandes `./rcli`).

**Entrypoints Docker (ne pas mélanger)**

| Fichier | Image | Rôle |
|---------|-------|------|
| `docker-entrypoint.dev.sh` | `Dockerfile` (dev) | `exec "$@"` — pas de `chown` / `nestjs` |
| `docker-entrypoint.sh` | `Dockerfile.prod` | `chown` `/app/logs` + `su-exec nestjs` si user présent |

**Fix entrypoint prod (volume `/app/logs` root-owned)** : `backend/docker-entrypoint.sh` + `su-exec` dans `Dockerfile.prod`.

Rebuild dev après changement entrypoint :

```bash
docker compose build backend && docker compose up -d backend
```

---

## Prérequis local

```bash
# Tunnel DB (obligatoire pour le backend Reboul)
./scripts/db-tunnel.sh

# Stack locale
docker compose up -d backend redis
# ou tout : docker compose up -d
```

Si erreur `Cannot find module 'nest-winston'` dans les logs :

```bash
docker exec reboulstore-backend npm install winston nest-winston --legacy-peer-deps
docker restart reboulstore-backend
# attendre ~30 s
```

---

## Tests Phase 1 — Winston (local)

### 1. Health

```bash
curl -s http://localhost:3001/health
```

Attendu : `"status":"ok"` (HTTP 200).

### 2. Login raté → `auth_login_failed`

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

```bash
docker logs reboulstore-backend --tail 15
```

Attendu : HTTP **401** + ligne JSON `"event":"auth_login_failed"` + `"requestId":"..."`.

```bash
curl -sI -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' | grep -i x-request-id
```

### 3. Checkout panier vide → `checkout_error`

```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST http://localhost:3001/checkout/create-session \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'
```

```bash
docker logs reboulstore-backend --tail 10 | grep checkout_error
```

Attendu : HTTP **400** + `"event":"checkout_error"`.

### 4. Suivre les logs en direct

```bash
docker logs reboulstore-backend -f --tail 30
```

(Lancer les `curl` dans un autre terminal.)

---

## Événements structurés (JSON)

Chaque ligne JSON inclut **`requestId`** (UUID) — header réponse `X-Request-Id` (réutilisé si le client/nginx l’envoie).

| `event` | Quand |
|---------|--------|
| `auth_login_failed` | Login email/mot de passe invalide |
| `checkout_error` | Erreur 4xx sur route `/checkout/*` |
| `http_5xx` | Erreur serveur 5xx |
| `stripe_webhook_failed` | Signature webhook Stripe invalide |

En **dev** : console colorée (`docker logs`).  
En **prod** (`NODE_ENV=production`) : aussi fichiers dans le container `/app/logs/error.log` et `combined.log` (volume `logs_data_prod`).

---

## CLI `./rcli` — logs serveur (prod)

```bash
./rcli server logs --tail 50
./rcli server logs backend --tail 100
./rcli server logs --errors
./rcli server logs --follow

./rcli logs errors --last 1h
./rcli logs api-errors --last 1h
./rcli logs slow-requests --threshold 2.0
```

---

## Vérif logs applicatifs en prod

```bash
# Logs Docker live
./rcli server logs backend --errors --tail 50

# Health public
curl -sL https://reboulstore.com/api/health

# Fichiers Winston — dans le container (pas sur l'hôte VPS)
./rcli server exec 'docker exec reboulstore-backend-prod ls -lh /app/logs/'
./rcli server exec 'docker exec reboulstore-backend-prod tail -5 /app/logs/combined.log'
```

---

## Backup cron — log VPS (pas NestJS)

```bash
./rcli server exec "tail -10 /var/log/reboulstore-backup.log && ls -lht /var/www/reboulstore/backups/ | head -6"
```

Attendu : `✅ Backup terminé` + fichier `reboulstore_db_YYYYMMDD_020001.sql.gz`.

**Logrotate** (une fois sur le VPS, ou après `git pull`) :

```bash
./scripts/setup-logrotate-backup.sh   # sur le VPS (sudo)
# Vérif config :
./rcli server exec "sudo logrotate -d /etc/logrotate.d/reboulstore-backup 2>&1 | head -5"
```

Rétention : 30 jours → [[Architecture/vps#Logs — politique de rétention (Phase 2)]]

---

## Rétention actuelle (rappel)

| Source | Rétention |
|--------|-----------|
| Docker `json-file` | 10 Mo × 3 fichiers / container (~rotation courte) |
| Winston fichiers prod | 10 Mo × 5 par fichier (`error.log`, `combined.log`) |
| Backups DB cron | 30 derniers fichiers `.sql.gz` |

## Grafana / Loki (Phase 3)

→ **Guide utilisateur** : [[Architecture/grafana]] (mdp, dashboard, LogQL, events)

```bash
./scripts/setup-observability.sh   # VPS
ssh -L 3030:127.0.0.1:3030 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N
```

Infra : [[Architecture/observability]]

---

## CLI — Docker live vs Grafana

| Besoin | Commande |
|--------|----------|
| Aide rapide | `./rcli logs guide` |
| Logs live | `./rcli server logs backend --follow` |
| Events JSON | `./rcli server logs backend --events` ou `./rcli logs events --last 1h` |
| Erreurs | `./rcli logs errors --last 24h` |
| API 4xx/5xx | `./rcli logs api-errors --last 1h` |
| Historique 30j | Grafana → [[Architecture/grafana]] |

---

## Alertes email (cron VPS)

```bash
./scripts/setup-log-alerts-cron.sh    # une fois
./scripts/check-log-alerts.sh         # test manuel
```

Variables : `.env.observability` (`LOG_ALERT_EMAIL`, `LOG_ALERT_5XX_THRESHOLD`, …)

---

## Variables

| Variable | Valeur |
|----------|--------|
| `LOG_DIR` | `/app/logs` (Docker) |
| Dev volume | `./backend/logs` → `/app/logs` |
| Prod volume | `logs_data_prod` → `/app/logs` |
