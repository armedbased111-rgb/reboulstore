---
type: page
fichier: src/pages/Catalog.tsx
route: /catalog
statut: a-revoir
phase: "25"
---
# Catalog

Catalogue produits — liste filtrée par catégorie via `?category=slug`.
Structure inspirée A-COLD-WALL* : banner titre dynamique + hero catégorie + grille produits.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- Banner titre dynamique (nom catégorie ou "Shop All")
- Hero section avec image de catégorie si catégorie sélectionnée (HeroSectionImage)
- ProductGrid — grille responsive (2 cols mobile, auto-fit desktop)
- ProductCard — hover 2 images, prix barré, uppercase
- Pagination — structure de base
- Filtrage par catégorie via URL (`?category=slug`)
- États loading / error gérés

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] Filtres avancés (marque, taille, prix) — à implémenter ou confirmer scope
- [ ] Tri (nouveautés, prix asc/desc) — à implémenter ou confirmer scope
- [ ] Pagination complète (numéros de pages, prev/next)
- [ ] Grille : nombre de colonnes desktop, espacement
- [ ] ProductCard : cohérence visuelle avec le design system
- [ ] Hero catégorie : images manquantes pour certaines catégories ?
- [ ] URL avec catégorie : vérifier que tous les slugs BDD fonctionnent

## Notes
