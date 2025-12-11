# 🔧 Configuration Stripe - Guide Complet

## 📋 Variables d'environnement nécessaires

Tu as besoin de **3 variables** dans ton fichier `.env` :

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔑 Comment obtenir ces clés ?

### 1. **STRIPE_SECRET_KEY** (clé secrète backend)

**C'est quoi ?** La clé secrète utilisée par le backend pour créer des Checkout Sessions et gérer les paiements.

**Où la trouver ?**
1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Connecte-toi (ou crée un compte si tu n'en as pas)
3. Va dans **Developers** → **API keys** (menu de gauche)
4. Tu verras deux clés :
   - **Publishable key** (commence par `pk_test_...`) → C'est `STRIPE_PUBLIC_KEY`
   - **Secret key** (commence par `sk_test_...`) → C'est `STRIPE_SECRET_KEY`
   - Clique sur **Reveal test key** pour voir la clé secrète

**⚠️ IMPORTANT :**
- En développement : utilise la clé **TEST** (commence par `sk_test_...`)
- En production : utilise la clé **LIVE** (commence par `sk_live_...`)
- **NE JAMAIS** commit ces clés dans Git (déjà dans `.gitignore`)

---

### 2. **STRIPE_PUBLIC_KEY** (clé publique frontend)

**C'est quoi ?** La clé publique que tu pourrais utiliser côté frontend (pas utilisée pour l'instant avec Stripe Checkout hébergé, mais utile pour plus tard).

**Où la trouver ?**
- Même endroit : **Developers** → **API keys**
- C'est la **Publishable key** (commence par `pk_test_...`)

---

### 3. **STRIPE_WEBHOOK_SECRET** (secret pour vérifier les webhooks)

**C'est quoi ?** Le secret utilisé pour vérifier que les webhooks viennent bien de Stripe (sécurité).

**Où la trouver ?**
1. Va dans **Developers** → **Webhooks** (menu de gauche)
2. Clique sur **Add endpoint** (ou sélectionne un endpoint existant)
3. Configure l'endpoint :
   - **Endpoint URL** : `http://localhost:3001/checkout/webhook` (en dev local)
   - **Description** : "Reboul Store Webhooks"
   - **Events to send** : Sélectionne ces événements :
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
4. Après avoir créé l'endpoint, clique dessus
5. Dans la section **Signing secret**, clique sur **Reveal** ou **Click to reveal**
6. Copie le secret (commence par `whsec_...`) → C'est `STRIPE_WEBHOOK_SECRET`

**📝 Note :** 
- En développement local, tu peux utiliser **Stripe CLI** pour forwarder les webhooks vers ton localhost (voir section "Stripe CLI" ci-dessous)
- En production, configure un endpoint HTTPS réel

---

## 🛠️ Configuration dans ton projet

### 1. Ajouter dans `.env`

Ouvre ton fichier `backend/.env` et ajoute :

```env
# Stripe (Phase 13)
# ⚠️ REMPLACE les valeurs ci-dessous par TES VRAIES clés depuis le Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**⚠️ REMPLACE** les `x` par tes vraies clés.

### 2. Vérifier que ça fonctionne

Démarre ton backend :
```bash
cd backend
npm run start:dev
```

Si `STRIPE_SECRET_KEY` est manquant, tu auras une erreur au démarrage :
```
Error: STRIPE_SECRET_KEY is not configured
```

---

## 🧪 Mode Test vs Production

### Mode Test (Développement)

- Utilise les clés **TEST** :
  - `sk_test_...`
  - `pk_test_...`
  - `whsec_...` (webhook test)
- Les paiements sont simulés (pas de vrai argent)
- Carte de test : `4242 4242 4242 4242` (expire n'importe quand, CVV n'importe quoi)
- Toutes les autres cartes de test : https://stripe.com/docs/testing

### Mode Production

- Utilise les clés **LIVE** :
  - `sk_live_...`
  - `pk_live_...`
  - `whsec_...` (webhook live)
- Les paiements sont réels (vrai argent)
- Configure un endpoint webhook HTTPS réel dans le dashboard Stripe

---

## 🔧 Stripe CLI (Pour développement local)

**Problème :** En développement local, Stripe ne peut pas envoyer des webhooks à `http://localhost:3001` (pas accessible depuis Internet).

**Solution :** Utilise **Stripe CLI** pour forwarder les webhooks vers ton localhost.

### Installation

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Ou télécharge depuis : https://stripe.com/docs/stripe-cli
```

### Utilisation

1. **Login à Stripe** :
```bash
stripe login
```

2. **Forwarder les webhooks vers ton backend** :
```bash
stripe listen --forward-to localhost:3001/checkout/webhook
```

3. **Stripe CLI te donne un webhook secret temporaire** :
```
> Ready! Your webhook signing secret is whsec_YOUR_TEMPORARY_SECRET_HERE
```

4. **Utilise ce secret dans ton `.env`** :
```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_TEMPORARY_SECRET_HERE
```

5. **Redémarre ton backend**

**📝 Note :** Ce secret change à chaque fois que tu relances `stripe listen`, donc il faut le mettre à jour dans ton `.env`.

**Alternative :** Tu peux aussi désactiver temporairement la vérification de signature en dev (mais c'est moins sécurisé).

---

## ✅ Checklist de configuration

- [ ] Créer un compte Stripe
- [ ] Récupérer `STRIPE_SECRET_KEY` (test)
- [ ] Récupérer `STRIPE_PUBLIC_KEY` (test)
- [ ] Configurer un endpoint webhook dans Stripe Dashboard
- [ ] Récupérer `STRIPE_WEBHOOK_SECRET`
- [ ] Ajouter les 3 variables dans `backend/.env`
- [ ] Tester que le backend démarre sans erreur
- [ ] (Optionnel) Installer Stripe CLI pour dev local
- [ ] (Optionnel) Tester avec une carte test (`4242 4242 4242 4242`)

---

## 🐛 Dépannage

### Erreur : "STRIPE_SECRET_KEY is not configured"
→ Vérifie que la variable est bien dans `.env` et que le backend a redémarré

### Webhooks ne fonctionnent pas en local
→ Utilise Stripe CLI (`stripe listen`) ou configure un tunnel (ngrok, etc.)

### Erreur de signature webhook
→ Vérifie que `STRIPE_WEBHOOK_SECRET` correspond bien au secret de ton endpoint webhook

### Les paiements ne passent pas
→ Vérifie que tu utilises bien une carte de test : https://stripe.com/docs/testing

---

## 🔗 Liens utiles

- **Dashboard Stripe** : https://dashboard.stripe.com
- **Documentation API** : https://stripe.com/docs/api
- **Cartes de test** : https://stripe.com/docs/testing
- **Stripe CLI** : https://stripe.com/docs/stripe-cli
