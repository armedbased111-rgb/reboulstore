---
type: securite
node: etat-actuel
maj: 2026-05-11 (soir)
---
# Sécurité — État actuel

Liens : [[Securite/Securite]]

---

## Backend NestJS

- **Helmet** : ✅ activé (11/05/2026) — X-Frame-Options, X-Content-Type-Options, etc.
- **Rate limiting** : ✅ ThrottlerModule — 100 req/min par IP (global via ThrottlerGuard)
- **CORS** : ✅ whitelist stricte — `reboulstore.com` + localhost dev uniquement
- **HSTS** : ✅ `max-age=63072000; includeSubDomains; preload` (manuel dans main.ts)
- **CSP** : ✅ configuré manuellement (Stripe, GTM, Cloudinary)
- **JWT** : access token (15 min) + refresh token (7j), guards sur toutes les routes protégées
- **Validation DTO** : `class-validator` sur tous les inputs — protection injection de base
- **Stripe webhook** : signature vérifiée (`stripe-signature` header)
- **Variables env** : `.env` / `.env.production` jamais commitées, build bloqué si absentes
- **PostgreSQL** : non exposé publiquement — interne Docker uniquement
- **Redis** : interne Docker uniquement
- **npm audit** : 0 critical/high — 1 moderate restant (nodemailer, breaking change)

Modules concernés : [[Backend/auth]] · [[Backend/checkout]] · [[Backend/products]]

## VPS OVH (`152.228.218.35`)

- SSH par clé uniquement (`~/.ssh/id_ed25519`) — mot de passe désactivé
- **fail2ban** actif — jail `sshd` configuré
- **iptables** configuré (UFW)
- Ports ouverts :
  - `80/443` — Reboul Store nginx
  - `4000/4443` — Admin Central nginx
  - `8384/53` — localhost uniquement (systemd-resolved)
- Syncthing supprimé le 11/05/2026 (port 22000 fermé, service désactivé)
- **SSL** : 3 certificats valides (reboulstore.com, www, admin) — exp. 17/07/2026 (66j)
- `.env.production` permissions : **600** (corrigé 11/05/2026, était 644)
- PostgreSQL non exposé (accès dev via tunnel SSH `:5433`)
- **35 updates apt appliquées** dont Docker 29.4.3 — ✅ 11/05/2026

Référence infra : [[Architecture/vps]]

## Monitoring

- **UptimeRobot** : ✅ configuré (11/05/2026) — 2 moniteurs, vérification toutes les 5 min
  - `https://www.reboulstore.com` (Frontend)
  - `https://www.reboulstore.com/api/health` (API)
  - Alertes email : `armedbased111@gmail.com`
- **Commande toggle maintenance** : `./rcli server maintenance [on|off|status]`

## Frontend

- Cookie consent + GA4 gating (RGPD conforme)
- JWT non exposés dans les URL
- HTTPS strict en prod

## Paiement (Stripe)

- Aucune donnée carte ne transite par nos serveurs
- Stripe Checkout hébergé = PCI DSS délégué à Stripe
- Webhook signé + vérifié côté backend

Référence : [[Architecture/services-tiers]]
