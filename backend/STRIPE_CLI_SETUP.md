# 🚀 Configuration Stripe CLI pour Développement Local

## 📋 Prérequis

- Backend démarré sur `http://localhost:3001`
- Variables `STRIPE_SECRET_KEY` et `STRIPE_PUBLIC_KEY` configurées dans `.env`

---

## 🔧 Installation Stripe CLI

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Autres systèmes
Télécharge depuis : https://stripe.com/docs/stripe-cli

---

## 📝 Configuration étape par étape

### Étape 1 : Login à Stripe

```bash
stripe login
```

Cela va ouvrir ton navigateur pour t'authentifier avec ton compte Stripe.

### Étape 2 : Forwarder les webhooks vers ton backend local

Dans un **nouveau terminal**, lance :

```bash
stripe listen --forward-to localhost:3001/checkout/webhook
```

**⚠️ Important :** Garde ce terminal ouvert pendant que tu développes !

### Étape 3 : Récupérer le webhook secret

Après avoir lancé `stripe listen`, tu verras quelque chose comme :

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Copie ce secret** (il commence par `whsec_...`)

### Étape 4 : Ajouter dans `.env`

Ouvre `backend/.env` et ajoute :

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Note :** Ce secret change à chaque fois que tu relances `stripe listen`, donc tu devras le mettre à jour dans `.env` si tu relances la commande.

### Étape 5 : Redémarrer ton backend

```bash
cd backend
npm run start:dev
```

---

## ✅ Vérifier que ça fonctionne

### Test 1 : Vérifier que Stripe CLI forward les webhooks

1. Lance `stripe listen` (étape 2)
2. Dans un autre terminal, déclenche un event de test :
   ```bash
   stripe trigger checkout.session.completed
   ```
3. Tu devrais voir dans les deux terminaux :
   - **Stripe CLI** : Un message indiquant qu'un webhook a été forwardé
   - **Backend** : Un log indiquant que le webhook a été reçu et traité

### Test 2 : Tester un paiement réel

1. Va sur ton site : `http://localhost:3000/cart`
2. Ajoute un produit au panier
3. Clique sur "Checkout now"
4. Tu seras redirigé vers Stripe Checkout
5. Utilise la carte de test : `4242 4242 4242 4242`
   - Date d'expiration : n'importe quelle date future (ex: 12/25)
   - CVV : n'importe quoi (ex: 123)
6. Complète le paiement
7. Tu devrais voir :
   - **Stripe CLI** : Un webhook `checkout.session.completed` forwardé
   - **Backend** : Logs indiquant que la commande a été créée
   - **Site** : Redirection vers `/order-confirmation`

---

## 🐛 Dépannage

### Erreur : "command not found: stripe"
→ Stripe CLI n'est pas installé. Réfère-toi à la section Installation.

### Erreur : "Webhook signature verification failed"
→ Le `STRIPE_WEBHOOK_SECRET` dans `.env` ne correspond pas au secret affiché par `stripe listen`. 
→ **Solution :** Copie le nouveau secret de `stripe listen` et mets à jour `.env`, puis redémarre le backend.

### Les webhooks ne sont pas reçus
→ Vérifie que :
1. `stripe listen` est toujours en cours d'exécution
2. L'URL forward est correcte : `localhost:3001/checkout/webhook`
3. Le backend est démarré sur le port 3001

### Le secret change à chaque fois
→ C'est normal ! Chaque fois que tu relances `stripe listen`, un nouveau secret est généré. 
→ **Solution :** Mets à jour `STRIPE_WEBHOOK_SECRET` dans `.env` avec le nouveau secret.

---

## 💡 Astuces

### Script pour automatiser

Tu peux créer un script pour lancer Stripe CLI et mettre à jour automatiquement le `.env` :

```bash
#!/bin/bash
# scripts/stripe-dev.sh

echo "🚀 Starting Stripe CLI..."
echo ""
echo "⚠️  Copy the webhook secret below and update your .env file:"
echo ""

stripe listen --forward-to localhost:3001/checkout/webhook
```

### Workflow quotidien

1. **Démarrer le backend** : `npm run start:dev`
2. **Dans un autre terminal** : `stripe listen --forward-to localhost:3001/checkout/webhook`
3. **Copier le secret** affiché par Stripe CLI
4. **Mettre à jour `.env`** avec le nouveau secret
5. **Redémarrer le backend** (optionnel si tu veux être sûr)

---

## 🔗 Liens utiles

- **Documentation Stripe CLI** : https://stripe.com/docs/stripe-cli
- **Cartes de test Stripe** : https://stripe.com/docs/testing
- **Dashboard Stripe** : https://dashboard.stripe.com
