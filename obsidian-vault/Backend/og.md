---
type: module
nom: og
statut: complet
---
# Module — OG (OpenGraph)

Génération dynamique des balises OpenGraph pour le partage réseaux sociaux.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/products]] · [[Database/tables/images]]

---

## Endpoints

```
GET /og/product/:id     # HTML avec balises OG pour un produit
```

## Fonctionnement

- Retourne une page HTML minimale avec les balises `<meta og:*>`
- Utilisé par les crawlers réseaux sociaux (Twitter, Facebook, WhatsApp, etc.)
- Données : nom produit, description (150 chars max), première image Cloudinary
- Fallback si pas d'image : `https://www.reboulstore.com/og-image.png`

## Balises générées

```html
<meta property="og:title" content="Nom produit | Reboul Store" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://res.cloudinary.com/..." />
<meta property="og:url" content="https://www.reboulstore.com/product/:id" />
<meta property="og:type" content="product" />
```

## Notes

- Composant SEO frontend : `frontend/src/components/seo/`
- `SITE_URL` hardcodé : `https://www.reboulstore.com`
