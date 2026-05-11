---
type: table
table: newsletter_subscriptions
entite: NewsletterSubscription
---
# Table : newsletter_subscriptions

Liens : [[Database/Database]]

---

## Colonnes principales

| Colonne | Type | Notes |
|---------|------|-------|
| id | int PK | auto-increment |
| email | varchar UNIQUE | |
| source | varchar | ex: `popup`, `footer` |
| subscribed_at | timestamp | |

## Consommé par

- Backend : [[Backend/newsletter]]
- Frontend : composant `NewsletterModal` (modale entrée + footer)
- API : [[Frontend/Frontend]]

## Fichier entité

`backend/src/entities/newsletter-subscription.entity.ts`
