---
type: module
nom: categories
statut: complet
---
# Module — Categories

Catégories produit. Résultat mis en cache Redis (TTL 10 min).

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/categories]]

---

## Endpoints

```
GET    /categories          # liste toutes (ordre alphabétique)
GET    /categories/:id      # une catégorie
POST   /categories          # créer
PATCH  /categories/:id      # modifier
DELETE /categories/:id      # supprimer
```

## Entité

**Category** : id, name, slug, description, parentId (hiérarchie possible)

## Règles métier

- Cache Redis sur `categories:all` et `category:{id}` (TTL 600s)
- Cache invalidé à chaque création / modification / suppression
- Utilisée par Products pour filtrer par catégorie (`categoryId`)
- Catégories créées pour Arte : "jean" (id=31), "coupe vent" (id=32)

## CLI

```bash
./rcli db product-list --brand "Arte"   # filtrage indirect via catégorie
```
