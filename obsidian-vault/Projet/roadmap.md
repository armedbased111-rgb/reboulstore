---
type: roadmap
statut: en-cours
maj: 2026-05-17
---

# Roadmap — Reboul Store SS26

Liens : [[Projet/Projet]] · [[Collections/Collections]]

---

## Images & Collections

Tout ce qui est pipeline IA, tri, upload Cloudinary.

- [ ] **Hologram** — importer le CSV via Admin Centrale (8 refs)
- [ ] **Hologram** — lancer pipeline flat lay
- [ ] **Birkenstock** — lancer `generate-batch --product-type shoe` (34 refs)
- [ ] **Autry** — générer pipeline shoe sur les 4 nouvelles refs (SCLM/CQ02, CU01, CU03, SVLM/PJ02)
- [ ] **Autry** — générer 4_top manquants via Gemini ADJUST (10 refs : HIPX-032K · JAPM-026B · PAPM-027B · PAPX-019K · SHPM-079Y · SWPX-036W · TSPM-044W · TSPX-047W · TSPX-053W · TSPX-053Y)
- [ ] **Bisous** — décider du sort des 9 refs vides (SS26-30, SS26-74→81) : shooter ou supprimer
- [ ] **Bisous** — régénérer back pour SS26-91 et SS26-94
- [ ] **RRD** — démarrer : feuille stock → CSV → photos → pipeline
- [ ] Trier + vérifier qualité toutes collections avant upload
- [ ] **Upload batch** — Stone Island (61 refs)
- [ ] **Upload batch** — Carhartt (54 refs)
- [ ] **Upload batch** — Autry (quand complet)
- [ ] **Upload batch** — Arte Antwerp (10 refs)
- [ ] **Upload batch** — Off-White (7 refs)
- [ ] **Upload batch** — Saucony (7 refs)
- [ ] **Upload batch** — Asics (15 refs)
- [ ] **Upload batch** — Salomon (13 refs)
- [ ] **Upload batch** — Hologram (après génération)
- [ ] **Upload batch** — Birkenstock (après génération)

---

## Frontend & UX

Revue pages, corrections UI, responsive, copywriting.

- [ ] [[Frontend/Home]] + popup newsletter — revue desktop + mobile
- [ ] [[Frontend/Catalog]] — revue desktop + mobile
- [ ] [[Frontend/Product]] — revue desktop + mobile
- [ ] [[Frontend/Cart]] — revue desktop + mobile
- [ ] [[Frontend/Checkout]] — revue desktop + mobile
- [ ] [[Frontend/Search]] — revue desktop + mobile
- [ ] [[Frontend/Login]] / [[Frontend/Register]] — revue
- [ ] [[Frontend/Profile]] / [[Frontend/Orders]] / [[Frontend/OrderDetail]] / [[Frontend/OrderConfirmation]] — revue
- [ ] [[Frontend/About]] / [[Frontend/Contact]] / [[Frontend/Stores]] / [[Frontend/ShippingReturns]] — revue
- [ ] Harmonisation spacing / typo / couleurs globale
- [ ] Relecture copywriting FR — ton, orthographe, cohérence
- [ ] Nettoyage composants dupliqués ou legacy

---

## SEO & Métadonnées

- [ ] `react-helmet-async` sur toutes les pages principales
- [ ] Titles + meta descriptions propres (FR) par page
- [ ] Open Graph minimal (title, description, image) — s'appuie sur [[Backend/og]]
- [ ] Favicon + cohérence branding
- [ ] Vérification sitemap.xml + robots.txt

---

## Technique & Sécurité

Détail complet → [[Securite/Securite]]

### Hardening
- [x] Helmet — headers HTTP sécurisés (NestJS) ✅ 11/05/2026
- [x] Rate limiting — throttler NestJS (100 req/min par IP) ✅ déjà en place
- [x] CORS strict — whitelist `reboulstore.com` uniquement ✅
- [x] fail2ban — brute force SSH sur VPS ✅ jail sshd actif
- [x] Audit permissions `/opt/reboulstore/` — `.env` 644→600 ✅ 11/05/2026
- [x] Ports ouverts VPS vérifiés — Syncthing supprimé (port 22000 fermé) ✅ 11/05/2026
- [x] `npm audit` — 0 critical/high (1 moderate restant nodemailer, breaking change) ✅
- [x] CSP + HSTS headers — configurés manuellement dans `main.ts` ✅
- [x] `apt upgrade` VPS — 35 packages dont Docker 29.4.3 ✅ 11/05/2026

### Logs & observabilité *(avant lancement)*

> **17/05/2026** — **Logs Phases 1–4 ✅ clôturées** · Guide : [[Architecture/grafana]] · Session : [[Sessions/2026-05-17-logs-winston]]

**Phase 1 — Logs applicatifs NestJS (Winston)**
- [x] Installer `winston` + `nest-winston`, activer `getLoggerConfig()` dans `app.module.ts` ✅ 17/05/2026
- [x] Format JSON en prod — timestamp, level, context, message (`format.json` Winston) ✅ 17/05/2026
- [x] `requestId` par requête (middleware `X-Request-Id` + `AsyncLocalStorage` dans `logEvent`) ✅ 17/05/2026
- [x] Événements obligatoires : `auth_login_failed`, `http_5xx`, `stripe_webhook_failed`, `checkout_error` ✅ 17/05/2026
- [x] Volume Docker : dev `./backend/logs` → `/app/logs` ; prod `logs_data_prod` ✅ 17/05/2026
- [x] Entrypoint prod : `docker-entrypoint.sh` + `Dockerfile.prod` (`chown` `/app/logs`, `su-exec nestjs`) — redeploy ✅ 17/05/2026
- [x] Entrypoint dev : `docker-entrypoint.dev.sh` (séparé du prod — évite `chown nestjs` sur image dev) ✅ 17/05/2026
- [x] Vérif prod : `docker logs` JSON + `/app/logs/combined.log` écrit (`nestjs`, ~19 Ko) ; health API 200 ✅ 17/05/2026
- [x] Test local validé : health 200, `auth_login_failed`, `checkout_error` dans `docker logs` ✅ 17/05/2026

**Phase 2 — Hygiène logs VPS** ✅ 17/05/2026
- [x] `logrotate` pour `/var/log/reboulstore-backup.log` — `config/logrotate/reboulstore-backup` + `scripts/setup-logrotate-backup.sh` (install VPS ✅)
- [x] Politique de rétention documentée dans [[Architecture/vps]] (Docker, Winston, backup log, dumps DB)
- [x] Docker prod : conserver `10m × 3` (documenté ; ajustement différé jusqu’à Loki ou besoin trafic)

**Phase 3 — Stack centralisée (containers dédiés)** — code ✅ 17/05/2026 · **activer sur VPS** : `./scripts/setup-observability.sh`
- [x] Services Docker : **Loki** + **Promtail** + **Grafana** → `docker-compose.observability.yml`
- [x] Promtail : Reboul + Admin (`reboulstore-*`, `admin-central-*`) + fichiers Winston (`logs_data_prod`)
- [x] Rétention Loki : **30 jours** (`720h`, volume `reboulstore_loki_data`)
- [x] Dashboard Grafana provisionné : 5xx, `auth_login_failed`, `checkout_error`, volume / container
- [x] Grafana sécurisé : auth admin (`.env.observability`), bind **127.0.0.1:3030** + tunnel SSH
- [x] **VPS** : `.env.observability` + stack up (Loki, Promtail, Grafana) ✅ 17/05/2026 — vérif dashboard via tunnel SSH

**Phase 4 — Alertes & CLI** ✅ 17/05/2026
- [x] Alertes : `scripts/check-log-alerts.sh` + `send-log-alert.py` (SMTP `.env.production`) — cron `setup-log-alerts-cron.sh` (*/15)
- [x] CLI : `./rcli logs guide`, `logs events`, `server logs --events` — doc [[Architecture/commands-logs]] + [[Architecture/grafana]]
- [x] Checklist pré-go-live : erreur de test visible dans Grafana (`auth_login_failed`) ✅ 17/05/2026

### AS400 — Intégration SFTP bidirectionnel → [[Securite/as400]]

| Phase                | Dossier    | Statut                                                                    |
| -------------------- | ---------- | ------------------------------------------------------------------------- |
| **1** SFTP           | —          | ✅ VPS 17/05 · [ ] envoi [[Securite/as400-fiche-expert]] + mdp (plus tard) |
| **2** Stocks entrant | `entrant/` | ⏸️ attend 1er CSV expert — parser DB, cron, alertes                       |
| **3** Sortant        | `sortant/` | ✅ 3a · ✅ B1 test CLI · ⏳ **B2–B4 NestJS `sync-as400`**                  |

- [x] Réunion expert 12/05/2026 — SFTP bidirectionnel, CSV, batch horaire
- [x] Phase 1 — SFTP VPS (chroot, test upload `entrant/`)
- [x] Phase **3a** — Cadrage sortant (delta, actif, stock web) → [[Securite/as400]]
- [x] Phase **3b B1** — Test manuel CLI + SFTP → `sortant/produits_reboul_test.csv` ✅ 17/05
- [x] Architecture **3b** actée — prod = **backend NestJS** (CLI = debug seulement)
- [ ] Phase 1 — Transmission fiche expert + mdp
- [ ] Phase 2 — Import `entrant/` *(après 1er CSV AS400)*
- [ ] Phase **3b B2** — Module `sync-as400` : export `is_published` → `sortant/produits_reboul.csv`
- [ ] Phase **3b B2** — Volume / droits écriture Docker → `/var/sftp/as400/sortant/`
- [ ] Phase **3b B3** — Delta + suppressions
- [ ] Phase **3b B4** — `@Cron` horaire (comme images-optimization)

### Tests
- [ ] Tests unitaires frontend — composants critiques, hooks, panier/checkout (Vitest)
- [ ] Tests non-régression API — endpoints critiques
- [x] Checklist pré-lancement : domaine ✅, SSL ✅, backup auto ✅, variables prod ✅, UptimeRobot ✅
- [x] Checklist pré-lancement : stack logs (Winston + Loki/Grafana + alertes cron) ✅ 17/05/2026

---

## Lancement

- [ ] Basculer clés Stripe test → live — ⏳ en attente Julie
- [ ] Valider webhooks Stripe en prod — ⏳ en attente Julie
- [ ] Test flux paiement complet mode live (PaymentIntent → success → commande créée) — ⏳ en attente Julie
- [ ] Smoke tests prod : catalog → produit → panier → checkout → confirmation
- [ ] Smoke tests auth : login / register / profile
- [ ] Smoke tests pages légales / contact — ⏳ en attente Julie
- [x] Monitoring en place — UptimeRobot ✅ + Grafana/Loki + alertes email cron ✅ 17/05/2026 · `./rcli server monitor`
- [ ] Ouverture publique
