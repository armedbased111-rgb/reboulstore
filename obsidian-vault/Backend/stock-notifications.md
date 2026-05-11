---
type: module
nom: stock-notifications
statut: complet
---
# Module — Stock Notifications

Alertes email automatiques quand un produit rupture de stock repasse en stock.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/stock_notifications]] · [[Database/tables/products]] · [[Database/tables/variants]]

---

## Endpoints

```
POST /products/:productId/notify-stock      # s'abonner { email, variantId? }
GET  /products/:productId/notify-stock      # voir abonnements (admin, JWT)
```

## Entité

**StockNotification** : id, productId, variantId?, email, notifiedAt (null = pas encore notifié), createdAt

## Règles métier

- Un email ne peut s'abonner qu'une fois par produit/variant → ConflictException si doublon
- **Scheduler** (`stock-notifications.scheduler.ts`) : tâche CRON qui vérifie périodiquement les variants repassés en stock et déclenche les emails
- Email envoyé via `EmailService` (module orders)
- `notifiedAt` rempli après l'envoi → évite les doublons de notification

## Intégration frontend

- Bouton "Me notifier" sur fiche produit si stock = 0
- Service : `frontend/src/services/stock-notifications.service.ts`
