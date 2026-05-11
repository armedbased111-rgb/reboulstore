---
type: hub
section: Database
---
# Database — Hub

PostgreSQL sur VPS OVH. 16 tables, géré par TypeORM. Jamais de DB locale Docker.

Liens : [[REBOUL]] · [[Architecture/Architecture]] · [[Backend/Backend]]

---

## Connexion

| Env | Host | Port |
|-----|------|------|
| Dev (tunnel SSH) | `host.docker.internal` | `5433` |
| Prod (VPS direct) | `152.228.218.35` | `5432` |

**Règle absolue : jamais `DB_HOST=postgres` ou `DB_HOST=localhost`.**

---

## Références

| Fichier | Contenu |
|---------|---------|
| [[Database/schema]] | Conventions ORM, migrations, cache Redis |
| [[Database/backup]] | Backup, restauration, volumes critiques |

---

## Tables (16)

### Catalogue produit

- [[Database/tables/products]] — produits (référence, prix, marque, catégorie)
- [[Database/tables/variants]] — variants (taille, couleur, stock, SKU)
- [[Database/tables/images]] — images Cloudinary liées aux produits
- [[Database/tables/brands]] — marques (stone-island, autry, arte…)
- [[Database/tables/categories]] — catégories (t-shirt, sandales, sabots…)
- [[Database/tables/collections]] — collections saisonnières (SS26…)

### Commerce

- [[Database/tables/carts]] — paniers (user ou guest via sessionId)
- [[Database/tables/cart_items]] — lignes de panier (variant + quantité)
- [[Database/tables/orders]] — commandes (Stripe, statut, total)
- [[Database/tables/order_emails]] — emails transactionnels liés aux commandes
- [[Database/tables/coupons]] — codes promo (% ou fixe, limites, expiration)

### Utilisateurs

- [[Database/tables/users]] — comptes (customer / admin)
- [[Database/tables/addresses]] — adresses de livraison

### Engagement

- [[Database/tables/newsletter_subscriptions]] — inscriptions newsletter
- [[Database/tables/stock_notifications]] — alertes retour en stock

### Boutiques

- [[Database/tables/shops]] — points de vente physiques (GPS, horaires)

---

## Relations clés

```
brands      1──n  products
categories  1──n  products
collections 1──n  products
products    1──n  variants
products    1──n  images
users       1──1  carts
carts       1──n  cart_items
cart_items  n──1  variants
users       1──n  orders
orders      n──1  coupons
orders      1──n  order_emails
users       1──n  addresses
products    1──n  stock_notifications
variants    1──n  stock_notifications
```
