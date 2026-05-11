---
type: table
table: variants
entite: Variant
---
# Table : variants

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| product_id | int FK | → [[Database/tables/products]] |
| size | varchar | ex: `38`, `M`, `L` |
| color | varchar | ex: `Black`, `Mocca` |
| stock | int | quantité dispo |
| sku | varchar UNIQUE | ex: `BOSTON/660463 38` |

## Relations

- n──1 → [[Database/tables/products]]
- 1──n → [[Database/tables/cart_items]]
- 1──n → [[Database/tables/stock_notifications]]

## Consommé par

- Backend : [[Backend/products]] · [[Backend/cart]]
- Frontend : [[Frontend/Product]] · [[Frontend/Cart]] · [[Frontend/Checkout]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/variant.entity.ts`
