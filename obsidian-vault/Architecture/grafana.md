---
type: architecture
node: grafana
maj: 2026-05-17
---
# Grafana — Logs production Reboul Store

> **Nœud de référence** : accès, mot de passe, commandes, ce qu’on surveille.  
> Infra Docker : [[Architecture/observability]] · CLI : [[Architecture/commands-logs]]

Liens : [[Architecture/Architecture]] · [[Projet/roadmap]] · [[Sessions/2026-05-17-logs-winston]]

---

## Référence rapide

| Question | Réponse |
|----------|---------|
| **À quoi ça sert ?** | Voir et chercher les **logs du site** (erreurs, login, checkout) sur **30 jours**, sans `docker logs` à la main |
| **Où ?** | Sur le VPS uniquement — **pas** sur Internet |
| **Comment y aller ?** | Tunnel SSH puis navigateur |
| **Login / mdp ?** | User `admin` · mdp dans `.env.observability` sur le VPS (jamais dans git) |
| **Quoi qu’on ne track pas ?** | Pas les ventes / stocks / AS400 — uniquement **logs techniques** Winston |

### Commandes essentielles

```bash
# 1. Tunnel (terminal ouvert)
ssh -L 3030:127.0.0.1:3030 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N

# 2. Navigateur
# http://localhost:3030

# 3. Mot de passe Grafana (sur le VPS)
ssh -i ~/.ssh/id_ed25519 deploy@152.228.218.35 \
  'grep GRAFANA_ADMIN /var/www/reboulstore/.env.observability'
```

| Action | Où dans Grafana |
|--------|-----------------|
| Vue d’ensemble | **Dashboards** → **Reboul Store — Logs** |
| Recherche libre | **Explore** → Loki → `{job="winston"} \|= "checkout_error"` |
| Période | En haut à droite → **Last 24 hours** |

### Ce qu’on track (4 événements + tout le JSON)

| `event` (champ JSON) | Signification |
|----------------------|---------------|
| `auth_login_failed` | Mauvais email / mot de passe |
| `checkout_error` | Erreur checkout (ex. panier vide) |
| `http_5xx` | Erreur serveur |
| `stripe_webhook_failed` | Webhook Stripe invalide |

Chaque ligne a un **`requestId`** → recouper avec l’en-tête HTTP `X-Request-Id` côté API.

**Alertes email** (en plus de Grafana) : cron */15 sur le VPS si pic 5xx ou stack down → [[Architecture/commands-logs#Alertes]]

---

## À quoi ça sert ? (détail)

**Grafana** = interface web pour **chercher et visualiser** les logs de production Reboul Store (et bientôt Admin), sans enchaîner des `docker logs` sur le VPS.

| Outil | Quand l’utiliser |
|-------|------------------|
| **Grafana** | Incident, « qui a eu une erreur checkout ? », tendance sur 24h |
| `docker logs` / `./rcli server logs` | Debug rapide en live, une ligne précise |
| **UptimeRobot** | Site down / health KO (pas le détail des logs) |

**Sous le capot** : Promtail envoie les logs → **Loki** stocke 30 jours → Grafana interroge en **LogQL**.

---

## Ce qu’on track (événements Winston)

Chaque ligne importante est du **JSON** dans `combined.log` (prod), avec **`requestId`** pour suivre une même requête.

| `event` | Signification | Gravité |
|---------|---------------|---------|
| `auth_login_failed` | Email / mot de passe invalide | warn |
| `checkout_error` | Erreur 4xx sur `/checkout/*` (ex. panier vide) | warn |
| `http_5xx` | Erreur serveur 5xx | error |
| `stripe_webhook_failed` | Signature webhook Stripe invalide | error |

**Header HTTP** : chaque réponse API peut renvoyer `X-Request-Id` (même id que dans les logs).

**Labels Loki** (dashboard actuel) :
- `job="winston"` — fichiers `/app/logs/*.log` du backend Reboul
- `service="reboulstore-backend"`

> Les logs Docker bruts (`container=...`) ne sont pas encore indexés sous ce label ; le dashboard utilise **Winston** (source fiable pour les events ci-dessus).

---

## Accès — commandes

### 1. Tunnel SSH (obligatoire)

Grafana n’est **pas** sur Internet — uniquement sur le VPS en `127.0.0.1:3030`.

```bash
ssh -L 3030:127.0.0.1:3030 -i ~/.ssh/id_ed25519 deploy@152.228.218.35 -N
```

Laisser ce terminal ouvert. Puis navigateur :

**http://localhost:3030**

### 2. Identifiants

| Champ | Valeur |
|-------|--------|
| Utilisateur | `admin` (défaut) |
| Mot de passe | Dans `/var/www/reboulstore/.env.observability` sur le VPS |

```bash
ssh -i ~/.ssh/id_ed25519 deploy@152.228.218.35 \
  'grep GRAFANA_ADMIN /var/www/reboulstore/.env.observability'
```

- Fichier **jamais** commiter (`.gitignore` : `.env.observability`)
- Mot de passe **généré** au premier `./scripts/setup-observability.sh`
- Grafana peut proposer de le changer à la 1ʳᵉ connexion (optionnel)

### 3. Dashboard principal

**Menu** → **Dashboards** → **Reboul Store — Logs**

| Panneau | Requête (idée) | « No data » = |
|---------|----------------|---------------|
| Erreurs 5xx | `http_5xx` / level error | Pas d’erreur serveur (normal) |
| auth_login_failed | event auth | Pas de login raté récent |
| checkout_error | event checkout | Pas d’erreur checkout |
| Volume / 5 min | activité Winston | Peu de trafic |

**Période** : en haut à droite → **Last 24 hours** (ou plus).

### 4. Explore (recherche libre)

**Explore** → datasource **Loki** → exemples :

```logql
{job="winston"} |= "auth_login_failed"
```

```logql
{job="winston", service="reboulstore-backend"} |= "checkout_error"
```

```logql
{job="winston"} |~ "requestId"
```

```logql
{job="winston"} |= "http_5xx"
```

**Run query** → lignes horodatées ; cliquer une ligne pour le JSON complet.

### 5. Générer un log de test (prod)

```bash
curl -s -X POST https://reboulstore.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

Rafraîchir Grafana → panneau **auth_login_failed** (délai ~30 s max).

---

## Stack Docker (rappel)

```bash
# Sur le VPS
cd /var/www/reboulstore
./scripts/setup-observability.sh

# Statut
docker ps --filter name=reboulstore-loki --filter name=reboulstore-grafana --filter name=reboulstore-promtail
```

| Container | Rôle |
|-----------|------|
| `reboulstore-loki` | Stockage |
| `reboulstore-promtail` | Collecte |
| `reboulstore-grafana` | UI |

Détail infra : [[Architecture/observability]]

---

## Dépannage

| Problème | Action |
|----------|--------|
| Page inaccessible | Tunnel SSH actif ? |
| Login refusé | Relire `.env.observability` sur le VPS |
| **No data** partout | Période → 24h ; vérifier Loki : Explore `{job="winston"}` |
| Dashboard vide mais Explore OK | Rafraîchir (F5) ; dashboard corrigé 17/05 (`job=winston` pas `container`) |
| Promtail | `docker logs reboulstore-promtail --tail 20` sur le VPS |

---

## Sécurité

- ❌ Ne pas exposer le port 3030 sur `0.0.0.0`
- ✅ Tunnel SSH ou VPN uniquement
- ✅ Mot de passe fort dans `.env.observability` (`chmod 600`)

---

## Alertes email (Phase 4)

Cron ***/15** sur le VPS : `scripts/check-log-alerts.sh`

| Déclencheur | Seuil (défaut) |
|-------------|----------------|
| Pic `http_5xx` | ≥ 5 events / 15 min |
| Silence Winston | `combined.log` inchangé ≥ 6 h |
| Stack down | loki / promtail / grafana container absent |

Config : `.env.observability` → `LOG_ALERT_EMAIL` (+ SMTP dans `.env.production`)

```bash
# Activer cron (VPS)
./scripts/setup-log-alerts-cron.sh

# Test manuel
./scripts/check-log-alerts.sh
```

Complète **UptimeRobot** (site down) — pas un doublon.

## CLI vs Grafana

| Besoin | Outil |
|--------|--------|
| Live | `./rcli server logs backend -f` |
| Events | `./rcli logs events --last 1h` |
| Aide | `./rcli logs guide` |
| 30 jours | Grafana (ce guide) |
