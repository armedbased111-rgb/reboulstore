---
type: page
fichier: src/pages/Home.tsx
route: /
statut: a-revoir
phase: "25"
maj: 2026-06-05
---
# Home

Page d'accueil — vitrine du concept-store Reboul. Ancrage local Marseille / Cassis / Sanary.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- **Hero section** — 3 slides : **MM6 × Salomon** · Off-White™ · Stone Island SS26 · carousel séquentiel ✅ 05/06
- **HeroSectionImage** — `h-[57vh] md:h-[47vh]` (hauteur fixe vh, object-cover) · desktop/mobile séparés ✅ 05/06
- **Mini-hero FeaturedProducts** — `h-[25vh] md:h-[30vh]` ✅ 05/06
- BrandCarousel — 57 marques, logos noirs sur fond clair, animation scroll
- BrandMarquee — sticky sous le header, logos blancs défilants sur fond noir
- **FeaturedProducts** — mini-hero optionnel (`heroBg`, `heroBgMobile`, `brandTag`) ✅ 01/06
- **Stone Island Best Sellers** — section avec mini-hero 280px + collection SS26 ✅ 01/06
- CategorySection — catégories avec images
- PromoCard — carte promo
- NewsletterEntryModal — modale newsletter à l'entrée
- **Images optimisées** — `cloudinaryUrl()` : WebP/AVIF auto, sizing adapté ✅ 01/06

## Points à revoir
- [ ] Revue desktop + mobile complète
- [x] Hero : image qualité, desktop/mobile séparés, f_auto ✅ 01/06
- [ ] Cohérence espacement entre les sections
- [ ] NewsletterEntryModal : timing d'apparition, contenu, UX fermeture
- [ ] BrandCarousel : vitesse, padding, affichage logos
- [ ] FeaturedProducts : nombre de produits affichés, ordre
- [ ] Animations AnimeJS : fluidité, respect prefers-reduced-motion
- [x] Performance : chargement images hero (LCP) — fetchpriority + f_auto ✅ 01/06

## Notes

**Mini-hero FeaturedProducts** : props `heroBg`, `heroBgMobile`, `brandTag` → quand fourni, affiche une bannière 280px avec l'image de la marque au-dessus du carousel. Stone Island l'utilise. Extensible à Off-White, Autry, etc.

**Gemini quota** : batch 1 (génération) + batch 3 (ombres) bloqués sur nouveau compte Google sans billing. Batch 2 (fond blanc) toujours en Gemini — activer billing pour débloquer.
