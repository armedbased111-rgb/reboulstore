---
type: module
nom: shops
statut: complet
---
# Module — Shops

Boutiques physiques Reboul (Marseille, Cassis, Sanary).

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/shops]]

---

## Endpoints

```
GET    /shops          # liste toutes les boutiques
GET    /shops/:id      # une boutique
POST   /shops          # créer
PATCH  /shops/:id      # modifier
DELETE /shops/:id      # supprimer
```

## Entité

**Shop** : id, name, address, city, zipCode, phone, email, latitude, longitude, openingHours (JSON), isActive

## Règles métier

- Données statiques (boutiques fixes)
- Utilisé par la page `Stores.tsx` pour afficher les points de vente
- `openingHours` : objet JSON avec jours/horaires

## Page frontend

`/stores` → `Stores.tsx` appelle `GET /shops`
