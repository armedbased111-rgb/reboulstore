---
type: module
nom: products
statut: complet
---
# Module — Products

Module central du catalogue. Produits, variantes, images, filtres, pagination.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/products]] · [[Database/tables/variants]] · [[Database/tables/images]] · [[Database/tables/brands]] · [[Database/tables/categories]] · [[Database/tables/collections]]

---

## Endpoints

```
GET  /products                    # liste (brand, category, collection, page, limit)
GET  /products/:id                # produit par ID
GET  /products/:id/variants       # variantes (taille, couleur, stock, sku)
GET  /products/:id/images         # images Cloudinary
POST /products                    # créer (admin)
PATCH /products/:id               # modifier (admin)
DELETE /products/:id              # supprimer (admin)
```

## Entités

**Product** : id, name, reference, price, description, isPublished, collectionId, brandId, categoryId
**Variant** : id, productId, size, color, stock, sku
**Image** : id, productId, url, position, alt

## Règles métier

- Référence produit = source de vérité (unicité, obligatoire)
- SKU = référence + couleur + taille (dérivé auto)
- Filtrage automatique par collection active (le backend fait le filtre)
- Import via Admin : upsert sur reference/SKU → mise à jour stock sans crash doublon
- `isPublished` = colonne `is_published` en BDD

## CLI associé
```bash
./rcli db product-find --ref REF
./rcli db product-list --brand "Stone Island"
./rcli db variant-list --ref REF
./rcli db variant-set-stock --ref REF --size S --stock 3
```
