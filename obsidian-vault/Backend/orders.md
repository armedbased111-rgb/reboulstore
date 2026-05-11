---
type: module
nom: orders
statut: complet
---
# Module — Orders

Commandes — création, statuts, historique, emails transactionnels.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/orders]] · [[Database/tables/order_items]] · [[Database/tables/variants]]

---

## Endpoints

```
GET  /orders                      # liste commandes (admin : toutes, client : les siennes)
GET  /orders/:id                  # détail commande
PATCH /orders/:id/status          # modifier statut (admin)
```

## Entités

**Order** : id, userId (nullable), status, total, shippingAddress, paymentMethod, stripeSessionId, createdAt
**OrderItem** : id, orderId, productId, variantId, quantity, price (snapshot), productName, size, color

## Statuts

`pending` → `confirmed` → `shipped` → `delivered` | `cancelled`

## Règles métier

- Commande créée après webhook Stripe `checkout.session.completed`
- Email de confirmation envoyé automatiquement (SMTP + Handlebars)
- Guest orders : userId null, email stocké dans shippingAddress

## CLI associé
```bash
./rcli db order-list --last 10
./rcli db order-detail --id ID
```
