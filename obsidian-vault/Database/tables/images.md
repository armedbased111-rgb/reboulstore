---
type: table
table: images
entite: Image
---
# Table : images

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| product_id | int FK | → [[Database/tables/products]] |
| url | varchar | URL Cloudinary |
| position | int | ordre d'affichage (1_face, 2_back…) |
| alt | varchar | texte alternatif |

## Relations

- n──1 → [[Database/tables/products]]

## Consommé par

- Backend : [[Backend/products]] · [[Backend/cloudinary]] · [[Backend/images-optimization]]
- Frontend : [[Frontend/Product]] · [[Frontend/Catalog]] · [[Frontend/Home]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/image.entity.ts`
