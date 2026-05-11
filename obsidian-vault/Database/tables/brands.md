---
type: table
table: brands
entite: Brand
---
# Table : brands

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| name | varchar | nom affiché |
| slug | varchar UNIQUE | ex: `stone-island`, `arte` |

## Relations

- 1──n → [[Database/tables/products]]

## Slugs SS26 actifs

`stone-island` · `autry` · `bisous` · `arte` · `off-white` · `carhartt` · `saucony` · `asics` · `salomon` · `birkenstock` · `hologram`

## Consommé par

- Backend : [[Backend/brands]]
- Frontend : [[Frontend/Home]] · [[Frontend/Catalog]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/brand.entity.ts`
