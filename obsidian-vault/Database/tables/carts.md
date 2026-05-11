---
type: table
table: carts
entite: Cart
---
# Table : carts

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| user_id | int FK nullable | → [[Database/tables/users]] (null si guest) |
| session_id | varchar | identifiant session guest |
| updated_at | timestamp | |

## Relations

- n──1 → [[Database/tables/users]]
- 1──n → [[Database/tables/cart_items]]

## Consommé par

- Backend : [[Backend/cart]]
- Frontend : [[Frontend/Cart]] · [[Frontend/Checkout]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/cart.entity.ts`
