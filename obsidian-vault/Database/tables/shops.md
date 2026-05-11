---
type: table
table: shops
entite: Shop
---
# Table : shops

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| name | varchar | nom de la boutique |
| address | varchar | adresse complète |
| city | varchar | |
| phone | varchar | |
| latitude | decimal | coordonnées GPS |
| longitude | decimal | coordonnées GPS |
| opening_hours | JSON | horaires par jour |
| is_active | boolean | affiché sur le site |

## Consommé par

- Backend : [[Backend/shops]]
- Frontend : [[Frontend/Stores]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/shop.entity.ts`
