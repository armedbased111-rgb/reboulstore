# checkout-workflow

**Commande** : `/checkout-workflow`

Workflow spécifique pour tout ce qui touche au **checkout** (UX, flow fonctionnel, Stripe, emails).

---

## 1. Docs & fichiers à lire avant

- `docs/context/ROADMAP_COMPLETE.md`  
  → Phases checkout (12.x, 13, etc.).

- `docs/context/CONTEXT.md`  
  → Résumé de l’état actuel du checkout (Stripe, emails invités, etc.).

- `docs/stripe/STRIPE_PAYMENT_FLOW.md`  
  → Flow complet de paiement (cart → checkout → Stripe → webhooks → order).

- `docs/stripe/TESTS_CHECKOUT.md`  
  → Scénarios de test checkout.

- `frontend/FRONTEND.md` (section Checkout).  
- `backend/BACKEND.md` (sections `checkout` et `orders`).

---

## 2. Côté frontend

Fichiers principaux :
- `frontend/src/pages/Checkout.tsx`
- `frontend/src/services/checkout.ts`
- `frontend/src/pages/OrderConfirmation.tsx`
- `frontend/src/pages/Orders.tsx` (quand l’historique sera implémenté)

Checklist UX :
- [ ] Récap panier clair (produits, quantités, total, livraison).  
- [ ] Formulaire client simple (nom, email, adresse, etc.).  
- [ ] Gestion des erreurs visibles (validation, erreurs API).  
- [ ] Redirection propre après paiement (vers `/order-confirmation`).  
- [ ] Pour les invités : message clair sur le suivi par email.  
- [ ] Pour les comptes : lien vers “Mes commandes”.

---

## 3. Côté backend

Fichiers principaux :
- `backend/src/modules/checkout/…`
- `backend/src/modules/orders/…`
- `backend/src/entities/order.entity.ts`
- `backend/src/entities/order-email.entity.ts`

Checklist logique :
- [ ] Création de session Stripe (Stripe Checkout).  
- [ ] Webhooks Stripe gérés (statuts payment_intent).  
- [ ] Création de `Order` en base **une seule fois**.  
- [ ] Sauvegarde des emails invités (si pas de compte).  
- [ ] Statuts de commande mis à jour correctement (PENDING, CONFIRMED, etc.).

---

## 4. Tests & validation

1. Utiliser `docs/stripe/TESTS_CHECKOUT.md` :
   - Cas de succès (paiement OK).
   - Cas d’échec (paiement refusé).
   - Cas d’annulation.
   - Comportement invité vs compte.

2. Vérifier :
   - Emails envoyés (invités + comptes).  
   - Suivi commande complet (front + back).  
   - Aucune double création de commandes (idempotence).

---

## 🔗 Commandes associées

- `/stripe-workflow` : Pour tout ce qui est purement Stripe.  
- `/frontend-workflow` : Pour les pages/components côté checkout.  
- `/backend-workflow` : Pour les modules checkout/orders.  
- `/brainstorm-topic checkout` : Pour brainstormer sur UX/flow checkout.


