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

> **17/05/2026** — Phase 1 Winston **clôturée** : dev console ; prod JSON + `/app/logs` + `requestId`. Stack Loki/Grafana = Phase 3. Session : [[Sessions/2026-05-17-logs-winston]] · **Commandes** : [[Architecture/commands-logs]]

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

**Phase 3 — Stack centralisée (containers dédiés)**
- [ ] Ajouter services Docker : **Loki** + **Promtail** (ou Grafana Alloy) + **Grafana**
- [ ] Promtail : collecter logs Reboul Store + Admin Central (backend, nginx, json-file Docker)
- [ ] Rétention Loki : **14–30 jours** sur volume dédié (configurable)
- [ ] Dashboard Grafana : erreurs 5xx, auth failed, requêtes lentes, volume par service
- [ ] Sécuriser Grafana (auth, pas exposé publiquement sans protection — VPN ou basic auth + HTTPS)

**Phase 4 — Alertes & CLI**
- [ ] Alertes : pic 5xx ou absence de logs → email (complément UptimeRobot)
- [ ] Commande `./rcli server logs` — doc alignée (Docker live vs Grafana/Loki)
- [ ] Checklist pré-go-live : retrouver une erreur de test dans Grafana (< 24h)

### AS400 — Intégration SFTP bidirectionnel
- [x] Réunion expert cyber AS400 ✅ 12/05/2026 — décision : SFTP bidirectionnel, batch horaire
- [x] **Format fichiers** : CSV ✅ confirmé réunion 12/05
- [ ] **Phase 1** — Setup SFTP basique : user `sftp-as400`, chroot, `entrant/` + `sortant/`, transmettre accès à l'expert → [[Securite/as400]]
- [ ] **Phase 2** *(après premier CSV reçu)* — Parser NestJS adapté au format réel, cron horaire, logs, alertes, réconciliation hebdo

### Tests
- [ ] Tests unitaires frontend — composants critiques, hooks, panier/checkout (Vitest)
- [ ] Tests non-régression API — endpoints critiques
- [x] Checklist pré-lancement : domaine ✅, SSL ✅, backup auto ✅, variables prod ✅, UptimeRobot ✅
- [ ] Checklist pré-lancement : stack logs centralisée (Loki/Grafana Phase 3) — Winston Phase 1 ✅

---

## Lancement

- [ ] Basculer clés Stripe test → live — ⏳ en attente Julie
- [ ] Valider webhooks Stripe en prod — ⏳ en attente Julie
- [ ] Test flux paiement complet mode live (PaymentIntent → success → commande créée) — ⏳ en attente Julie
- [ ] Smoke tests prod : catalog → produit → panier → checkout → confirmation
- [ ] Smoke tests auth : login / register / profile
- [ ] Smoke tests pages légales / contact — ⏳ en attente Julie
- [ ] Monitoring en place — UptimeRobot ✅ + stack logs (Grafana/alertes 5xx) + `./rcli server monitor`
- [ ] Ouverture publique
