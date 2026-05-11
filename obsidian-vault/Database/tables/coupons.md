---
type: table
table: coupons
entite: Coupon
---
# Table : coupons

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| code | varchar UNIQUE | toujours en MAJUSCULES |
| discount_type | enum | `percentage` / `fixed` |
| discount_value | decimal | montant ou % |
| min_order_amount | decimal nullable | seuil minimum |
| max_uses | int nullable | limite d'utilisations |
| used_count | int | compteur utilisations |
| is_active | boolean | |
| expires_at | timestamp nullable | |

## Relations

- 1──n → [[Database/tables/orders]]

## Consommé par

- Backend : [[Backend/coupons]] · [[Backend/checkout]]
- Frontend : [[Frontend/Checkout]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/coupon.entity.ts`
