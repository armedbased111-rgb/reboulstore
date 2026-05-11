---
type: module
nom: brands
statut: complet
---
# Module — Brands

57 marques avec logos Cloudinary. Affiché dans BrandCarousel et BrandMarquee.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/brands]]

---

## Endpoints

```
GET  /brands                      # liste toutes les marques (avec logos)
GET  /brands/:id                  # détail une marque
POST /brands                      # créer (admin)
PATCH /brands/:id                 # modifier (admin)
DELETE /brands/:id                # supprimer (admin)
```

## Entités

**Brand** : id, name, slug, logoUrl (Cloudinary), logoUrlWhite (Cloudinary), isActive

## État actuel

- 57 marques en BDD
- 56 logos uploadés sur Cloudinary
- Logos noirs (`_b`) : BrandCarousel (fond clair)
- Logos blancs (`_w`) : BrandMarquee (fond noir)

## Slugs exacts des marques principales

| Marque | Slug BDD |
|--------|---------|
| Stone Island | `stone-island` |
| Autry | `autry` |
| Bisous Skateboards | `bisous` |
| Arte Antwerp | `arte` |
| Off-White | `off-white` |
| Carhartt | `carhartt` |
| Saucony | `saucony` |
| Birkenstock | `birkenstock` |
