---
type: module
nom: checkout
statut: complet
---
# Module — Checkout

Tunnel de paiement Stripe. Session Stripe → webhook → commande créée.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/orders]] · [[Database/tables/order_emails]] · [[Database/tables/coupons]]

---

## Endpoints

```
POST /checkout/create-session     # créer une Stripe Checkout Session
POST /checkout/webhook            # webhook Stripe (checkout.session.completed)
```

## Flow complet

1. Frontend POST `/checkout/create-session` → reçoit `sessionUrl`
2. Redirect vers Stripe Checkout (hébergé par Stripe)
3. Paiement réussi → Stripe POST `/checkout/webhook`
4. Backend crée la commande + envoie email confirmation
5. Stripe redirige vers `/order-confirmation`

## Règles métier

- Webhook vérifié avec signature Stripe (`stripe-signature` header)
- Clés test en dev (`STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` dans `.env`)
- Clés live à basculer en Phase 27
- Guest checkout : email collecté dans la session Stripe

## ⚠️ Phase 27

Basculement vers les clés Stripe Live prévu en [[Projet/phase-27]].
