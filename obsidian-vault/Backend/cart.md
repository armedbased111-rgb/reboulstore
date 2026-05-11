---
type: module
nom: cart
statut: complet
---
# Module — Cart

Panier par session ou par utilisateur connecté.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/carts]] · [[Database/tables/cart_items]] · [[Database/tables/variants]]

---

## Endpoints

```
GET  /cart                        # récupérer le panier courant
POST /cart/items                  # ajouter un article
PATCH /cart/items/:id             # modifier quantité
DELETE /cart/items/:id            # supprimer un article
DELETE /cart                      # vider le panier
```

## Entités

**Cart** : id, userId (nullable), sessionId, createdAt, updatedAt
**CartItem** : id, cartId, variantId, quantity, price (snapshot au moment de l'ajout)

## Règles métier

- Guest checkout : panier lié à sessionId (cookie)
- Utilisateur connecté : panier lié à userId
- Prix snapshot : le prix est capturé au moment de l'ajout (pas recalculé à chaque requête)
- Stock vérifié à l'ajout et au checkout
