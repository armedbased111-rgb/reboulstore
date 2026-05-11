---
type: table
table: orders
entite: Order
---
# Table : orders

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| user_id | int FK nullable | → [[Database/tables/users]] (null si guest) |
| email | varchar | email acheteur |
| total | decimal | montant total |
| status | enum | pending / paid / shipped / cancelled |
| stripe_session_id | varchar | id session Stripe |
| coupon_id | int FK nullable | → [[Database/tables/coupons]] |
| created_at | timestamp | |

## Relations

- n──1 → [[Database/tables/users]]
- n──1 → [[Database/tables/coupons]]
- 1──n → [[Database/tables/order_emails]]

## Consommé par

- Backend : [[Backend/orders]] · [[Backend/checkout]]
- Frontend : [[Frontend/Orders]] · [[Frontend/OrderDetail]] · [[Frontend/OrderConfirmation]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/order.entity.ts`
