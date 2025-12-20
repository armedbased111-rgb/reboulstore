# stripe-workflow

**Commande** : `/stripe-workflow`

Workflow pour tout ce qui concerne **Stripe** dans Reboul Store (setup, paiement, checkout, tests).

---

## 📂 Fichiers Stripe importants

- **Backend** :
  - `backend/STRIPE_SETUP.md` : Configuration Stripe (clés, env, webhooks).
  - `backend/STRIPE_CLI_SETUP.md` : Configuration Stripe CLI.

- **Docs Stripe globales** :
  - `docs/stripe/STRIPE_PAYMENT_FLOW.md` : Flow de paiement complet (intention, webhooks, statuts).
  - `docs/stripe/STRIPE_CHECKOUT_IMPROVEMENTS.md` : Améliorations prévues.
  - `docs/stripe/TESTS_CHECKOUT.md` : Scénarios de test checkout.

- **Config API** :
  - `docs/context/API_CONFIG.md` : Ports, URLs, endpoints liés à Stripe/back.

---

## 1. Setup Stripe (nouvel environnement)

1. Lire `backend/STRIPE_SETUP.md` :
   - Créer un compte Stripe si besoin.
   - Récupérer `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`.
   - Remplir le `.env` backend.

2. Lire `backend/STRIPE_CLI_SETUP.md` :
   - Installer Stripe CLI.
   - Configurer la redirection des webhooks vers le backend NestJS.

3. Vérifier les variables d’environnement dans :
   - `backend/.env`
   - `docs/context/API_CONFIG.md`

---

## 2. Comprendre le flow de paiement

1. Lire `docs/stripe/STRIPE_PAYMENT_FLOW.md` :
   - Comment une commande passe de **cart → checkout → paiement → webhook → order**.
   - Quels endpoints backend sont impliqués.
   - Quels statuts sont utilisés côté `Order`.

2. Lire `backend/BACKEND.md` (section checkout / orders) :
   - Endpoints `POST /checkout/...`, `POST /orders`, webhooks.

---

## 3. Travailler sur le checkout

Quand tu modifies ou ajoutes des fonctionnalités checkout/paiement :

1. Identifier dans `docs/stripe/STRIPE_CHECKOUT_IMPROVEMENTS.md` :
   - La feature / amélioration précise.

2. Travailler côté :
   - `backend/src/modules/checkout/…`
   - `frontend/src/pages/Checkout.tsx`
   - `frontend/src/services/checkout.ts`

3. Tester en suivant `docs/stripe/TESTS_CHECKOUT.md` :
   - Cas de succès
   - Cas d’erreur
   - Annulation
   - Webhooks

4. Mettre à jour la doc :
   - `docs/context/ROADMAP_COMPLETE.md` : cocher la tâche.
   - `backend/BACKEND.md` : endpoints ou logique checkout si modifiés.
   - `docs/stripe/STRIPE_PAYMENT_FLOW.md` / `STRIPE_CHECKOUT_IMPROVEMENTS.md` : si le flow a été changé.

---

## 4. Ajout / modification d’un endpoint Stripe

1. Lire `docs/context/API_CONFIG.md` pour connaître les conventions d’URL.
2. Ajouter / modifier les endpoints dans :
   - `backend/src/modules/checkout/checkout.controller.ts`
   - `backend/src/modules/checkout/checkout.service.ts`
3. Mettre à jour :
   - `backend/BACKEND.md` (section checkout)
   - `docs/context/API_CONFIG.md` (nouvel endpoint)

---

## 🔗 Commandes associées

- `/backend-workflow` : Workflow général backend.
- `/getcontext stripe` : Où trouver la doc Stripe.
- `/documentation-workflow` : Discipline de mise à jour de la doc.


