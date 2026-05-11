---
type: architecture
---
# Services tiers

Liens : [[Architecture/Architecture]]

---

## Stripe — Paiement

| Paramètre | Valeur |
|-----------|--------|
| Mode actuel | Test (clés `sk_test_...`) |
| Mode Phase 27 | Live (clés `sk_live_...`) |
| Intégration | Stripe Checkout hébergé (redirect) |
| Webhook | `POST /api/checkout/webhook` |

Variables : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`

Flow : Frontend → create-session → redirect Stripe → webhook → commande créée

---

## Cloudinary — CDN Images

| Paramètre | Valeur |
|-----------|--------|
| Rôle | Stockage + CDN des images produit |
| Upload | Via `./rcli images upload --ref REF` |
| Format URL | `https://res.cloudinary.com/reboul/image/upload/...` |
| Transformations | Resize à la volée via paramètres URL |

Variables : `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Images organisées par référence produit. Position 1 = `1_face.png`, position 2 = `1_back.png`, etc.

---

## Google Gemini — IA Images

| Paramètre | Valeur |
|-----------|--------|
| Modèle Flash | `gemini-1.5-flash` (génération batch, rapide) |
| Modèle Pro | `gemini-1.5-pro` (ajustements qualité) |
| Rôle | Remove background + flat lay + centrage IA |

Variables : `GEMINI_API_KEY`

Utilisé par : `./rcli images generate-batch`, `./rcli images adjust`
**Jamais pour centrer** (hallucinations) — centrage = PIL uniquement.

---

## Redis — Cache & Sessions

| Paramètre | Valeur |
|-----------|--------|
| Port | 6379 |
| Rôle | Cache réponses API, sessions temporaires |
| Container | `reboul_redis` |

---

## SMTP — Emails transactionnels

| Trigger | Template Handlebars |
|---------|---------------------|
| Confirmation commande | `order-confirmation.hbs` |
| Reset mot de passe | `password-reset.hbs` |
| Expédition | `shipping-notification.hbs` |

Variables : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

---

## Twilio — SMS

| Rôle | Reset password, notifications commande |
|------|----------------------------------------|
| Variables | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |

---

## Socket.io — Temps réel

| Rôle | Notifications admin (nouvelle commande, alerte stock faible) |
|------|-------------------------------------------------------------|
| Intégration | NestJS Gateway (`@WebSocketGateway`) |

---

## Récapitulatif variables `.env`

```bash
# DB
DB_HOST=host.docker.internal
DB_PORT=5433
DB_NAME=reboulstore
DB_USER=...
DB_PASS=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Gemini
GEMINI_API_KEY=...

# SMTP
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# JWT
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```
