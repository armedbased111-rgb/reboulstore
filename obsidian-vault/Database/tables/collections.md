---
type: table
table: collections
entite: Collection
---
# Table : collections

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| name | varchar | ex: `SS26` |
| slug | varchar UNIQUE | ex: `ss26` |
| season | varchar | ex: `SS26` |
| is_active | boolean | collection courante |

## Relations

- 1──n → [[Database/tables/products]]

## Consommé par

- Backend : [[Backend/collections-module]]
- Frontend : [[Frontend/Home]] · [[Frontend/Catalog]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/collection.entity.ts`
