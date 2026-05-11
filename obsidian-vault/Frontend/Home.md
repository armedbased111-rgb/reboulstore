---
type: page
fichier: src/pages/Home.tsx
route: /
statut: a-revoir
phase: "25"
---
# Home

Page d'accueil — vitrine du concept-store Reboul. Ancrage local Marseille / Cassis / Sanary.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- Hero section (HeroSectionImage ou HeroSectionVideo selon config)
- BrandCarousel — 57 marques, logos noirs sur fond clair, animation scroll
- BrandMarquee — sticky sous le header, logos blancs défilants sur fond noir
- FeaturedProducts — produits mis en avant
- CategorySection — catégories avec images
- PromoCard — carte promo
- NewsletterEntryModal — modale newsletter à l'entrée

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] Hero : image / vidéo — qualité, timing, texte superposé
- [ ] Cohérence espacement entre les sections
- [ ] NewsletterEntryModal : timing d'apparition, contenu, UX fermeture
- [ ] BrandCarousel : vitesse, padding, affichage logos
- [ ] FeaturedProducts : nombre de produits affichés, ordre
- [ ] Animations AnimeJS : fluidité, respect prefers-reduced-motion
- [ ] Performance : chargement images hero (LCP)

## Notes
