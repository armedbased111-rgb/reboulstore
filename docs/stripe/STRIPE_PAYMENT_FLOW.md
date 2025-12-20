# 💳 Comprendre Stripe PaymentIntent vs Checkout Session

## 🔍 Les deux approches Stripe

### 1. **Stripe Checkout Session** (ce qu'on utilise actuellement)

**Comment ça marche :**
- Tu crées une **Checkout Session** → Stripe affiche une page de paiement complète
- En arrière-plan, Stripe crée automatiquement un **PaymentIntent** pour toi
- Le client paie sur la page Stripe
- Le paiement est capturé **immédiatement** par défaut

**Avantages :**
- ✅ Simple à mettre en place
- ✅ Page de paiement gérée par Stripe (PCI-DSS compliant)
- ✅ Supporte beaucoup de méthodes de paiement
- ✅ Mobile-friendly

**Limite :**
- Par défaut, le paiement est capturé immédiatement après le paiement

---

### 2. **PaymentIntent direct** (approche plus complexe)

**Comment ça marche :**
- Tu crées directement un **PaymentIntent**
- Tu dois coder ta propre page de paiement avec **Stripe Elements** (formulaire carte bancaire)
- Tu contrôles quand le paiement est capturé

**Avantages :**
- ✅ Contrôle total sur la capture
- ✅ Design custom complet

**Inconvénients :**
- ❌ Plus complexe à implémenter
- ❌ Tu dois gérer le formulaire de paiement toi-même
- ❌ Plus de code à maintenir

---

## ✅ Solution : Checkout Session + Capture Manuelle

**La bonne nouvelle :** On peut utiliser **Stripe Checkout** (simple) mais avec **capture manuelle** !

### Comment ça fonctionne :

```typescript
// Dans checkout.service.ts - Création de la session
const session = await this.stripe.checkout.sessions.create({
  // ... autres paramètres
  payment_intent_data: {
    capture_method: 'manual', // ⭐ Ne capture PAS immédiatement
  },
});
```

**Workflow :**

1. **Client paie** → Stripe Checkout
2. **Stripe crée** :
   - Checkout Session ✅
   - PaymentIntent avec status `requires_capture` (pas encore capturé) ✅
3. **Webhook** `checkout.session.completed` reçu
4. **Backend** :
   - Crée commande avec status `PENDING`
   - Stocke le `paymentIntentId` dans la commande
   - **Ne décrémente PAS le stock** (on attend la validation admin)
5. **Admin vérifie** le stock
6. **Si stock OK** :
   - Admin appelle `POST /admin/orders/:id/capture`
   - Backend capture le paiement : `stripe.paymentIntents.capture(paymentIntentId)`
   - Commande passe à `PAID`
   - Stock décrémenté
7. **Si stock PAS OK** :
   - Admin annule : `POST /admin/orders/:id/cancel`
   - Backend annule le PaymentIntent : `stripe.paymentIntents.cancel(paymentIntentId)`
   - Commande passe à `CANCELLED`
   - Pas de débit pour le client

---

## 📊 Comparaison des statuts

### PaymentIntent (Stripe)

| Statut | Signification |
|--------|---------------|
| `requires_payment_method` | Pas encore payé |
| `requires_capture` | ✅ Payé mais pas capturé (ce qu'on veut) |
| `succeeded` | ✅ Payé ET capturé |
| `canceled` | ❌ Annulé (pas de débit) |

### Order (notre base de données)

| Statut | Signification | PaymentIntent Status |
|--------|---------------|---------------------|
| `PENDING` | Commande reçue, en attente validation | `requires_capture` |
| `PAID` | Validée, paiement capturé | `succeeded` |
| `CANCELLED` | Annulée avant capture | `canceled` |

---

## 🔄 Nouveau workflow complet

### Étape 1 : Client paie
```
Client → Stripe Checkout → PaymentIntent créé (requires_capture)
```

### Étape 2 : Webhook reçu
```
Stripe → Webhook checkout.session.completed
Backend → Crée Order (status: PENDING, paymentIntentId stocké)
```

### Étape 3 : Admin vérifie
```
Admin → Vérifie stock disponible
```

### Étape 4a : Stock OK → Capture
```
Admin → POST /admin/orders/:id/capture
Backend → stripe.paymentIntents.capture(paymentIntentId)
Backend → Order.status = PAID
Backend → Décrémente stock
Backend → Envoie email confirmation
```

### Étape 4b : Stock KO → Annule
```
Admin → POST /admin/orders/:id/cancel
Backend → stripe.paymentIntents.cancel(paymentIntentId)
Backend → Order.status = CANCELLED
Backend → Stock NON touché
Backend → Envoie email annulation
```

---

## ⏱️ Expiration des paiements

**Important :** Un PaymentIntent avec `requires_capture` expire après 7 jours.

Si l'admin ne valide pas dans les 7 jours :
- Le paiement expire
- Le client n'est jamais débité
- La commande doit être annulée automatiquement

**À prévoir :** Job/cron pour annuler automatiquement les commandes PENDING > 7 jours.

---

## 📝 Résumé

**Ce qu'on va faire :**
1. ✅ Modifier `createCheckoutSession` pour ajouter `payment_intent_data: { capture_method: 'manual' }`
2. ✅ Modifier le webhook pour créer la commande en `PENDING` (pas `PAID`)
3. ✅ Ne PAS décrémenter le stock dans le webhook
4. ✅ Ajouter endpoint admin `POST /admin/orders/:id/capture` pour capturer le paiement
5. ✅ Ajouter endpoint admin `POST /admin/orders/:id/cancel` pour annuler (si pas encore capturé)
6. ✅ Gérer l'annulation automatique si stock pas disponible

**Avantages :**
- ✅ On garde Stripe Checkout (simple)
- ✅ On contrôle quand on capture le paiement
- ✅ Pas de débit si stock pas disponible
- ✅ Workflow sécurisé
