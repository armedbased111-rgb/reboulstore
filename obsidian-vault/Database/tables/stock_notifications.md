---
type: table
table: stock_notifications
entite: StockNotification
---
# Table : stock_notifications

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| product_id | int FK | → [[Database/tables/products]] |
| variant_id | int FK nullable | → [[Database/tables/variants]] |
| email | varchar | email à notifier |
| notified_at | timestamp nullable | null = pas encore envoyé |
| created_at | timestamp | |

## Relations

- n──1 → [[Database/tables/products]]
- n──1 → [[Database/tables/variants]]

## Consommé par

- Backend : [[Backend/stock-notifications]]
- Frontend : [[Frontend/Product]] (bouton "Me prévenir")
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/stock-notification.entity.ts`
