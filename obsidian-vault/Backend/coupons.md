---
type: module
nom: coupons
statut: complet
---
# Module — Coupons

Codes de réduction. Deux types : pourcentage ou montant fixe.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/coupons]]

---

## Endpoints

```
POST   /coupons                    # créer (admin, JWT requis)
GET    /coupons                    # lister tous (admin, JWT requis)
GET    /coupons/:id                # détail (admin, JWT requis)
PATCH  /coupons/:id                # modifier (admin, JWT requis)
DELETE /coupons/:id                # supprimer (admin, JWT requis)
POST   /coupons/validate           # valider un code { code } (public)
```

## Entité

**Coupon** : id, code (UPPERCASE unique), discountType (PERCENTAGE | FIXED), discountValue, minOrderAmount?, maxUses?, usedCount, expiresAt?, isActive

## Règles métier

- Code toujours stocké en UPPERCASE
- Type PERCENTAGE : valeur entre 0 et 100
- Type FIXED : valeur en euros
- `minOrderAmount` : montant minimum de commande pour appliquer
- `maxUses` : limite d'utilisations (null = illimité)
- `usedCount` incrémenté à chaque validation réussie
- Validation : vérifie actif + non expiré + quota non atteint + montant minimum

## Intégration frontend

- Champ code promo dans `Checkout.tsx`
- Service : `frontend/src/services/coupons.service.ts`
