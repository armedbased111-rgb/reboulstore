---
type: architecture
---
# Workflow — Comment le site fonctionne

Liens : [[Architecture/Architecture]]

---

## Vue d'ensemble

```
Visiteur → Nginx (SSL) → Frontend React → API NestJS → PostgreSQL (VPS)
                                       ↘ Stripe (paiement)
                                       ↘ Cloudinary (images)
                                       ↘ Redis (cache/sessions)
                                       ↘ SMTP (emails)
```

---

## 1. Navigation catalogue

```
Visiteur charge /catalog
→ React Router → Catalog.tsx
→ GET /api/products?brand=...&page=1
→ NestJS ProductsService → TypeORM → PostgreSQL
→ Retourne produits paginés + images Cloudinary URLs
→ Affichage ProductCard avec image Cloudinary
```

## 2. Fiche produit

```
Clic sur un produit → /product/:id
→ GET /api/products/:id          → données produit
→ GET /api/products/:id/variants → tailles + stock
→ GET /api/products/:id/images   → URLs Cloudinary
→ Affichage : galerie, sélecteur taille, stock, prix
```

## 3. Panier

```
"Ajouter au panier" (clic)
→ POST /api/cart/add { productId, variantId, quantity }
→ CartService vérifie stock → ajoute en BDD
→ Frontend met à jour CartContext (état global)
→ Icône panier header incrémentée
```

## 4. Tunnel de paiement (Stripe)

```
Checkout.tsx → POST /api/checkout/create-session
→ NestJS crée Stripe Checkout Session (produits + montants + email)
→ Retourne sessionUrl
→ window.location.href = sessionUrl (redirect vers Stripe hébergé)
→ Client paie sur page Stripe
→ Stripe POST /api/checkout/webhook (checkout.session.completed)
→ NestJS vérifie signature → crée commande en BDD
→ Envoie email confirmation (SMTP + Handlebars)
→ Stripe redirige vers /order-confirmation
```

## 5. Authentification

```
Login.tsx → POST /api/auth/login { email, password }
→ NestJS valide → JWT signé (access token + refresh token)
→ Tokens stockés (httpOnly cookie ou localStorage selon config)
→ Requêtes suivantes : Authorization: Bearer <token>
→ Guards NestJS vérifient le token sur routes protégées
```

## 6. Pipeline images (côté admin)

```
Photos brutes (iCloud)
→ ./rcli images generate-batch (Gemini IA : remove bg + flat lay/shoe)
→ ./rcli images color-fix (PIL numpy : correction couleur)
→ Vérification manuelle (tri)
→ ./rcli images upload --ref REF (Cloudinary CDN)
→ BDD mis à jour avec URLs Cloudinary
→ Frontend affiche les images via URL Cloudinary
```

## 7. Import collection

```
CSV préparé (voir docs/imports/)
→ Admin Centrale → Import Collection
→ reboul-import.service.ts → upsert sur reference/SKU
→ Produits + variantes créés/mis à jour (pas de doublon)
→ ./rcli db product-list --brand "..." pour vérifier
```

---

## Flux temps réel

- **Socket.io** : notifications admin (nouvelle commande, alerte stock)
- **Redis** : cache réponses API + sessions temporaires

## Emails transactionnels

| Trigger | Template |
|---------|----------|
| Commande confirmée | `order-confirmation.hbs` |
| Réinitialisation mdp | `password-reset.hbs` |
| Expédition | `shipping-notification.hbs` |
