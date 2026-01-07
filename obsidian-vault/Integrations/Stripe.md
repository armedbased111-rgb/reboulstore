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

## Workflow

1. Client sélectionne produits → Panier
2. Client clique "Passer commande" → Checkout Stripe
3. Paiement Stripe → Webhook reçoit événement
4. Backend crée commande → Confirmation client

Voir [[../docs/stripe/STRIPE_PAYMENT_FLOW.md|STRIPE_PAYMENT_FLOW]] pour les détails complets.

