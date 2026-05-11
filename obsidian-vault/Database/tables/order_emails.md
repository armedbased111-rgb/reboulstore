---
type: table
table: order_emails
entite: OrderEmail
---
# Table : order_emails

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| order_id | int FK | → [[Database/tables/orders]] |
| type | varchar | ex: `confirmation`, `shipped` |
| sent_at | timestamp | |

## Relations

- n──1 → [[Database/tables/orders]]

## Consommé par

- Backend : [[Backend/checkout]] (emails transactionnels post-paiement)
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/order-email.entity.ts`
