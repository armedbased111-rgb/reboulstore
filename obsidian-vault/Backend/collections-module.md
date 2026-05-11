---
type: module
nom: collections
statut: complet
---
# Module — Collections

Rotation des collections (active / archivée). Filtre automatique des produits.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/collections]]

---

## Endpoints

```
GET  /collections                 # toutes les collections
GET  /collections/active          # collection active uniquement
POST /collections                 # créer
PATCH /collections/:id/activate   # activer une collection (archive les autres)
PATCH /collections/:id/archive    # archiver
DELETE /collections/:id           # supprimer (si non active)
```

## Entités

**Collection** : id, name, displayName, isActive, description, createdAt

## Règles métier

- Une seule collection active à la fois
- Activer une collection archive automatiquement la précédente
- Les produits sont filtrés par collection active (côté backend)
- Nouveau produit importé → assigné automatiquement à la collection active
- Collection courante : SS26

## Collection actuelle

`SS26` — active. Contient : Stone Island, Autry, Bisous Skateboards, Arte Antwerp, Off-White, Carhartt, Saucony, Birkenstock.
