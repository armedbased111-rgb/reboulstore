---
type: session
date: 2026-06-05
sujet: Hero MM6 × Salomon + fixes Image Manager + dimensions hero/mini-hero
---

# Session 2026-06-05

## Image Manager — Bugs corrigés

- **BrandView.tsx** : `.replace(/^.+?\s/, '')` supprimait le premier mot du nom → "MM6 x Salomon Cross" affichait "x Salomon Cross". Supprimé.
- **Dossier iCloud** : `WS01249:HB423` → `WS0249:HB423` (typo, produit sans nom dans l'UI)
- **upload.py** : `ref.replace(":", "/")` → `.replace(":", "/").replace("-", "/")` — anciens dossiers Salomon utilisent `-` comme séparateur au lieu de `:`
- **Backend NestJS** redémarré (container crashé à 7h46 — tunnel SSH actif mais container pas relancé)

## Salomon — Descriptions & matières

- Script créé : `scripts/update_salomon_descriptions.py`
- 23 produits mis à jour en DB : XT-6, XT-6 GTX, XT-4 OG, XT-4 OG GTX, Whisper Void, XT Pathway, MM6 × Salomon Cross
- Sources : salomon.com + maisonmargiela.com + endclothing.com

## Hero principal — Slide 1 remplacée

- Ancienne slide : "Salomon SS26" (photo montagne IA)
- Nouvelle slide : "MM6 × Salomon / Collaboration SS26"
- Desktop : `SALMONMM6DESKTOP.png` → `v1780661871/homepage/hero/slide_1780012531.png`
- Mobile : `SALOMON MM6 MOBILE.png` → `v1780663627/homepage/hero/slide_1780012531_mobile.png`
- Fichiers mis à jour : `backend/hero_slides.json` + `frontend/src/pages/Home.tsx` (FALLBACK_SLIDES)

## Dimensions hero

- **HeroSectionImage.tsx** : `aspect-[4/5] md:aspect-[4/1]` → `h-[57vh] md:h-[47vh]`
- **FeaturedProducts.tsx** (mini-hero) : `aspect-[4/1]` → `h-[25vh] md:h-[30vh]`
