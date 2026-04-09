# Intégration Stripe

Documentation complète de l'intégration Stripe pour les paiements.

## Documents

- [[../docs/stripe/STRIPE_PAYMENT_FLOW.md|STRIPE_PAYMENT_FLOW]] - Flow de paiement complet
- [[../docs/stripe/STRIPE_WEBHOOK_SETUP.md|STRIPE_WEBHOOK_SETUP]] - Configuration webhooks
- [[../docs/stripe/STRIPE_CHECKOUT_IMPROVEMENTS.md|STRIPE_CHECKOUT_IMPROVEMENTS]] - Améliorations checkout
- [[../docs/stripe/STRIPE_LIVE_KEY.md|STRIPE_LIVE_KEY]] - Configuration clés live
- [[../docs/stripe/TESTS_CHECKOUT.md|TESTS_CHECKOUT]] - Tests checkout

## Vue d'ensemble

Stripe est utilisé pour gérer tous les paiements du site e-commerce.

### Fonctionnalités

- Checkout Stripe intégré
- Webhooks pour les événements de paiement
- Gestion des commandes après paiement
- Support mode test et production

## Configuration

Voir [[../docs/integrations/ADD_STRIPE_CLOUDINARY_KEYS.md|ADD_STRIPE_CLOUDINARY_KEYS]] pour la configuration des clés.

## Architecture — Capture Manuelle

Le paiement utilise **Stripe Checkout Session + capture manuelle** :

1. `POST /checkout/create-session` → Stripe crée une session avec `capture_method: 'manual'`
2. Client paie sur Stripe → PaymentIntent status : `requires_capture`
3. Webhook `checkout.session.completed` → Order créée en **PENDING** (pas PAID)
4. Admin valide → `POST /admin/orders/:id/capture` → `stripe.paymentIntents.capture()` → PAID + stock décrémenté
5. Admin annule → `POST /admin/orders/:id/cancel` → `stripe.paymentIntents.cancel()` → CANCELLED (aucun débit)

**Délai max de capture : 7 jours** (expiration automatique Stripe).

## Canvas visuels

- [[../Canvas/Workflow-Paiement-Client.canvas|Flow Paiement — Côté Client]] — 11 étapes navigateur (Playwright validé 29/03/2026)
- [[../Canvas/Workflow-Paiement-Serveur.canvas|Flow Paiement — Côté Serveur]] — Architecture NestJS + Stripe

## Workflow (résumé)

1. Client sélectionne produits → Panier
2. Client clique "Checkout now" → `POST /checkout/create-session`
3. Redirect → Stripe Checkout (formulaire hébergé par Stripe, PCI-DSS)
4. Client paie → Stripe envoie webhook → Order PENDING
5. Admin capture → Order PAID + stock décrémenté

Voir [[../docs/stripe/STRIPE_PAYMENT_FLOW.md|STRIPE_PAYMENT_FLOW]] pour les détails complets.

## Bug corrigé (29/03/2026)

**`useLocalStorage` — sessionId cart non persisté**

- **Fichier** : `frontend/src/hooks/useLocalStorage.ts`
- **Symptôme** : le `cart_session_id` était généré en mémoire mais jamais écrit dans localStorage au premier montage → panier perdu à chaque rechargement (F5)
- **Fix appliqué** : écriture de la valeur initiale dans localStorage si la clé est absente
- **Validé** : même sessionId stable avant/après navigation inter-pages

