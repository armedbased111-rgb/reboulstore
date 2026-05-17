---
type: architecture
node: commands-logs
maj: 2026-05-17
---
# Commandes — Logs & observabilité

Référence rapide : tests Winston (Phase 1), lecture logs Docker, prod, backups cron.

Liens : [[Architecture/vps]] · [[Projet/roadmap]] · [[Sessions/2026-05-17-logs-winston]]

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

Attendu : HTTP **401** + ligne JSON `"event":"auth_login_failed"`.

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

## Vérif logs applicatifs en prod (après deploy Phase 1)

```bash
# Logs Docker live
./rcli server logs backend --errors --tail 50

# Fichiers Winston dans le container
./rcli server exec "ls -lh /app/logs/ && tail -20 /app/logs/error.log 2>/dev/null; tail -5 /app/logs/combined.log 2>/dev/null"
```

---

## Backup cron — log VPS (pas NestJS)

```bash
./rcli server exec "tail -10 /var/log/reboulstore-backup.log && ls -lht /var/www/reboulstore/backups/ | head -6"
```

Attendu : `✅ Backup terminé` + fichier `reboulstore_db_YYYYMMDD_020001.sql.gz`.

---

## Rétention actuelle (rappel)

| Source | Rétention |
|--------|-----------|
| Docker `json-file` | 10 Mo × 3 fichiers / container (~rotation courte) |
| Winston fichiers prod | 10 Mo × 5 par fichier (`error.log`, `combined.log`) |
| Backups DB cron | 30 derniers fichiers `.sql.gz` |

Phase 3 roadmap : Loki + Promtail + Grafana → [[Projet/roadmap#Logs & observabilité *(avant lancement)*]]

---

## Variables

| Variable | Valeur |
|----------|--------|
| `LOG_DIR` | `/app/logs` (Docker) |
| Dev volume | `./backend/logs` → `/app/logs` |
| Prod volume | `logs_data_prod` → `/app/logs` |
