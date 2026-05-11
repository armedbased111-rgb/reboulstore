---
type: table
table: categories
entite: Category
---
# Table : categories

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| name | varchar | nom affiché |
| slug | varchar UNIQUE | ex: `t-shirt`, `sandales` |
| parent_id | int FK nullable | → même table (hiérarchie) |

## Relations

- 1──n → [[Database/tables/products]]
- self-reference (parent/enfant)

## Catégories SS26 notables

`t-shirt` · `chemise` · `sandales` · `sabots` · `mocassin` · `veste` · `jean` (id=31) · `coupe-vent` (id=32)

## Consommé par

- Backend : [[Backend/categories]]
- Frontend : [[Frontend/Catalog]] · [[Frontend/Home]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/category.entity.ts`
