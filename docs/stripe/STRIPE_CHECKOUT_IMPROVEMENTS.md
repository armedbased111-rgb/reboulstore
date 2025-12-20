# 🎨 Améliorations Stripe Checkout - Brainstorming

## 📋 Objectifs

1. **Personnaliser la page Stripe Checkout** avec nos données (images, descriptions, etc.)
2. **Extraire toutes les données** nécessaires depuis Stripe pour créer la commande complète
3. **Permettre l'achat sans compte** (guest checkout)

---

## 🎨 1. Personnalisation Stripe Checkout

### ✅ Ce que Stripe Checkout permet de personnaliser

D'après la documentation Stripe, on peut personnaliser via `line_items` :

#### Images de produits
```typescript
product_data: {
  name: "Product Name",
  description: "Variant info",
  images: ["https://example.com/image.jpg"], // ✅ Images supportées
}
```

#### Métadonnées produits
- Name (nom du produit)
- Description (on peut mettre variant + détails)
- Images (jusqu'à 8 images par produit)

### 💡 Ce qu'on veut afficher dans Stripe Checkout

**Réflexion à faire ensemble :**

#### ✅ Images produits
- [ ] **Image principale du produit** (première image du produit)
- [ ] **Ou image spécifique au variant** ? (si on a des images par couleur)

#### ✅ Informations produits
- [ ] **Nom du produit** : `variant.product.name`
- [ ] **Description** : Actuellement `${variant.color} - Size ${variant.size}`
  - On pourrait ajouter : SKU, matériaux, etc.
- [ ] **Prix** : Déjà affiché (par variant)

#### ✅ Informations de la commande
- [ ] **Quantité** : Déjà affiché par Stripe
- [ ] **Total** : Déjà calculé par Stripe
- [ ] **Réduction/Code promo** : À discuter (futur)

### ❓ Questions à trancher

1. **Images** : 
   - Utiliser la première image du produit ?
   - Ou une image spécifique selon le variant (couleur) ?
   - Fallback si pas d'image ?

2. **Description** :
   - Format actuel : `${variant.color} - Size ${variant.size}`
   - Ajouter SKU ? Matériaux ? Marque ?
   - Limite Stripe : description courte (recommandé < 100 caractères)

3. **Branding** :
   - Logo de la marque dans Stripe Checkout ? (nécessite Stripe Express/Plus)
   - Couleurs custom ? (nécessite Stripe Express/Plus)
   - Pour MVP : on garde le design Stripe par défaut

---

## 📦 2. Extraction des données depuis Stripe

### Données actuellement récupérées

Depuis `checkout.session.completed` webhook :

```typescript
// Actuellement récupéré :
- session.id (checkout session ID)
- session.metadata.userId (ou 'anonymous')
- session.metadata.items (variantId + quantity)
- session.customer_details.email
- session.customer_details.name
```

### 📋 Données à récupérer pour une commande complète

#### ✅ Adresse de livraison (Shipping Address)
Stripe Checkout permet de collecter l'adresse de livraison :

```typescript
session.shipping_details = {
  address: {
    line1: "123 Main St",
    line2: null,
    city: "Paris",
    state: null,
    postal_code: "75001",
    country: "FR"
  },
  name: "John Doe"
}
```

**À récupérer :**
- [x] `session.shipping_details.address` → Adresse complète
- [x] `session.shipping_details.name` → Nom pour la livraison
- [ ] `session.shipping_details.phone` → Téléphone (optionnel)

#### ✅ Informations de facturation (Billing Address)
```typescript
session.customer_details = {
  address: { ... }, // Adresse de facturation
  email: "...",
  name: "...",
  phone: "..." // Optionnel
}
```

**À récupérer :**
- [x] `session.customer_details.email` → Email (déjà fait)
- [x] `session.customer_details.name` → Nom (déjà fait)
- [ ] `session.customer_details.address` → Adresse de facturation
- [ ] `session.customer_details.phone` → Téléphone

#### ✅ Informations de paiement
- [x] `session.payment_status` → Statut paiement
- [x] `session.amount_total` → Montant total payé (en centimes)
- [ ] `session.currency` → Devise (EUR)

#### ✅ Métadonnées Stripe
- [x] `session.metadata.userId` → ID utilisateur (ou 'anonymous')
- [x] `session.metadata.items` → Items de la commande
- [x] `session.metadata.total` → Total

### 🎯 Données manquantes actuellement

**À extraire depuis le webhook :**

1. **Shipping Address** complète (street, city, postalCode, country)
2. **Billing Address** (si différente de shipping)
3. **Phone number** (si fourni)
4. **Montant exact** payé (depuis `amount_total` pour validation)

---

## 👤 3. Achat sans compte (Guest Checkout)

### 🔓 Objectif

Permettre aux utilisateurs d'acheter **sans créer de compte**.

### 📋 Modifications nécessaires

#### Backend

**Actuellement :**
- `POST /checkout/create-session` est protégé par `@UseGuards(JwtAuthGuard)`
- `userId` est récupéré depuis `req.user.id`

**À modifier :**

1. **Rendre l'endpoint accessible sans auth** :
   ```typescript
   // Enlever @UseGuards(JwtAuthGuard) ou le rendre optionnel
   ```

2. **Gérer userId optionnel** :
   ```typescript
   const userId = req.user?.id || null; // null si pas connecté
   ```

3. **Metadata Stripe** :
   ```typescript
   metadata: {
     userId: userId || 'anonymous', // Déjà fait ✅
     // ...
   }
   ```

4. **Création de commande sans userId** :
   - L'entité `Order` a déjà `userId` nullable ✅
   - Mais il faut s'assurer que `createFromStripeCheckout` accepte `userId: null`

#### Frontend

**Actuellement :**
- `CartSummary` vérifie si l'utilisateur est connecté
- Redirige vers `/login` si pas connecté

**À modifier :**

1. **Enlever la vérification de connexion** dans `CartSummary`
2. **Permettre le checkout même sans compte**

#### Base de données

**Vérifier :**
- ✅ `Order.userId` est déjà nullable
- ✅ Pas de contrainte Foreign Key qui bloque

### ⚠️ Considérations

1. **Suivi de commande** : Comment un guest peut suivre sa commande ?
   - Solution 1 : Par email + numéro de commande
   - Solution 2 : Créer un compte après la commande (suggest après paiement)
   - Solution 3 : Lien unique par email

2. **Historique commandes** : Les guests n'ont pas accès à `/orders`
   - OK, ils reçoivent juste l'email de confirmation

3. **Relation commande-utilisateur** : Si un guest crée un compte plus tard, peut-on lier ses commandes ?
   - Solution : Chercher par email et proposer de lier les commandes

---

## 📝 Checklist d'implémentation

### Phase 1 : Personnalisation Stripe Checkout
- [ ] Ajouter images produits dans `line_items.product_data.images`
- [ ] Améliorer description avec plus d'infos (SKU, marque, etc.)
- [ ] Tester l'affichage dans Stripe Checkout
- [ ] Gérer le cas où il n'y a pas d'image

### Phase 2 : Extraction données complètes
- [ ] Extraire `session.shipping_details` dans le webhook
- [ ] Extraire `session.customer_details.address` (billing)
- [ ] Extraire `session.customer_details.phone`
- [ ] Extraire `session.amount_total` pour validation
- [ ] Stocker toutes ces données dans l'entité `Order`
- [ ] Mettre à jour `createFromStripeCheckout` pour utiliser ces données

### Phase 3 : Guest Checkout
- [ ] Enlever `@UseGuards(JwtAuthGuard)` de `POST /checkout/create-session`
- [ ] Gérer `userId` optionnel dans le service
- [ ] Enlever vérification de connexion dans `CartSummary` (frontend)
- [ ] Tester checkout sans être connecté
- [ ] Vérifier création de commande avec `userId = null`

---

## 🔗 Références Stripe

- **Stripe Checkout Images** : https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-price_data-product_data-images
- **Shipping Details** : https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-shipping_details
- **Customer Details** : https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-customer_details

---

## 💬 Questions à trancher ensemble

1. **Images** : Première image du produit ou image spécifique variant ?
2. **Description** : Format exact ? (SKU, marque, matériaux ?)
3. **Guest Checkout** : On enlève complètement la vérification de connexion ?
4. **Adresses** : On collecte shipping ET billing, ou juste shipping ?
