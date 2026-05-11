---
type: module
nom: notifications
statut: complet
---
# Module — Notifications (WebSocket)

Gateway Socket.io pour les notifications temps réel côté admin.

Liens : [[Backend/Backend]]

---

## Gateway

`notifications.gateway.ts` — `@WebSocketGateway()`

## Événements émis

| Événement | Payload | Déclencheur |
|-----------|---------|-------------|
| `new-order` | `{ orderId, total, email }` | Nouveau webhook Stripe complété |
| `low-stock` | `{ productId, ref, size, stock }` | Stock variant passe sous seuil |

## Intégration frontend

- Hook : `frontend/src/hooks/useWebSocket.ts`
- Service : `frontend/src/services/websocket.service.ts`
- Composant : `frontend/src/components/notifications/` (badges, toasts admin)

## Notes

- Utilisé principalement côté Admin Centrale (monitoring commandes en temps réel)
- Côté client public : non utilisé pour l'instant
