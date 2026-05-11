---
type: table
table: addresses
entite: Address
---
# Table : addresses

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| user_id | int FK | → [[Database/tables/users]] |
| street | varchar | |
| city | varchar | |
| zip_code | varchar | |
| country | varchar | |
| is_default | boolean | adresse principale |

## Relations

- n──1 → [[Database/tables/users]]

## Consommé par

- Backend : [[Backend/auth]] (gestion profil)
- Frontend : [[Frontend/Profile]] · [[Frontend/Checkout]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/address.entity.ts`
