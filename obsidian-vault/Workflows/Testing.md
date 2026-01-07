# Workflow Tests

Processus de test pour le projet Reboul Store.

## Vue d'ensemble

Les tests couvrent :
- Tests unitaires (Backend, Frontend)
- Tests E2E (End-to-End)
- Tests fonctionnels (Checkout, Stripe)
- Tests manuels

## Backend

### Tests unitaires

Tests des services et controllers dans `backend/test/`.

### Tests E2E

Tests complets dans `backend/test/app.e2e-spec.ts`.

## Frontend

### Tests unitaires

Tests des composants dans `frontend/src/__tests__/`.

### Tests manuels

Vérification fonctionnalité dans le navigateur.

## Stripe Checkout

Voir [[../docs/stripe/TESTS_CHECKOUT.md|TESTS_CHECKOUT]] pour les cas de test complets.

### Scénarios testés

- Ajout au panier
- Passage commande
- Paiement Stripe
- Webhook confirmation
- Création commande

## GA4

Voir [[../docs/integrations/TEST_GA4.md|TEST_GA4]] pour les tests GA4.

## Génération de tests

Utiliser le CLI pour générer des tests :

```bash
# Tests E2E
./rcli test generate e2e products

# Tests unitaires
./rcli test generate unit ProductsService

# Tests fonctionnels
./rcli test generate functional upload-images
```

Voir [[../CLI/Overview.md|CLI_Overview]] pour plus de détails.

