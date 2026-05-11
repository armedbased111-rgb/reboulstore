---
type: table
table: cart_items
entite: CartItem
---
# Table : cart_items

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| cart_id | int FK | → [[Database/tables/carts]] |
| variant_id | int FK | → [[Database/tables/variants]] |
| quantity | int | |

## Relations

- n──1 → [[Database/tables/carts]]
- n──1 → [[Database/tables/variants]]

## Consommé par

- Backend : [[Backend/cart]]
- Frontend : [[Frontend/Cart]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/cart-item.entity.ts`
