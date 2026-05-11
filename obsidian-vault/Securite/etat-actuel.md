---
type: securite
node: etat-actuel
maj: 2026-05-11
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
- UFW actif — ports ouverts : **22** (SSH), **80** (HTTP), **443** (HTTPS) uniquement
- SSL Let's Encrypt (Certbot) — auto-renouvellement actif
- PostgreSQL non exposé (accès dev via tunnel SSH `:5433`)

Référence infra : [[Architecture/vps]]

## Frontend

- Cookie consent + GA4 gating (RGPD conforme)
- JWT non exposés dans les URL
- HTTPS strict en prod

## Paiement (Stripe)

- Aucune donnée carte ne transite par nos serveurs
- Stripe Checkout hébergé = PCI DSS délégué à Stripe
- Webhook signé + vérifié côté backend

Référence : [[Architecture/services-tiers]]
