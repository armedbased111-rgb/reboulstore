---
type: table
table: products
entite: Product
---
# Table : products

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| name | varchar | nom affiché |
| reference | varchar UNIQUE | ex: `BOSTON/660463` |
| price | decimal | prix en € |
| description | text | nullable |
| is_published | boolean | visible sur le site |
| brand_id | int FK | → [[Database/tables/brands]] |
| category_id | int FK | → [[Database/tables/categories]] |
| collection_id | int FK | → [[Database/tables/collections]] |
| created_at | timestamp | |
| updated_at | timestamp | |

## Relations

- 1──n → [[Database/tables/variants]]
- 1──n → [[Database/tables/images]]
- n──1 → [[Database/tables/brands]]
- n──1 → [[Database/tables/categories]]
- n──1 → [[Database/tables/collections]]

## Consommé par

- Backend : [[Backend/products]]
- Frontend : [[Frontend/Catalog]] · [[Frontend/Product]] · [[Frontend/Home]] · [[Frontend/Search]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/product.entity.ts`
