---
type: table
table: users
entite: User
---
# Table : users

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| email | varchar UNIQUE | |
| password_hash | varchar | bcrypt |
| role | enum | `customer` / `admin` |
| created_at | timestamp | |

## Relations

- 1──1 → [[Database/tables/carts]]
- 1──n → [[Database/tables/orders]]
- 1──n → [[Database/tables/addresses]]

## Consommé par

- Backend : [[Backend/auth]]
- Frontend : [[Frontend/Login]] · [[Frontend/Register]] · [[Frontend/Profile]]
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/user.entity.ts`
