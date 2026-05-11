---
type: frontend
---
# Design System

Inspiration : **A-COLD-WALL*** — minimaliste, premium, industriel, streetwear.
Référence : https://www.a-cold-wall.com/

Liens : [[Frontend/Frontend]]

---

## Palette

| Token | Valeur | Usage |
|-------|--------|-------|
| Primary | `#1A1A1A` | Texte, fonds sombres, boutons principaux |
| Secondary | `#F3F3F3` | Fond général, surfaces claires |
| Accent | `#D93434` | CTA, badge, rouge Reboul |
| Product card | `#F8F8F8` | Fond des cartes produit |
| White | `#FFFFFF` | Fond page, texte sur fond sombre |

## Typographie

- **Police unique** : Geist (toutes variantes — Regular, Medium, Bold)
- **Labels produit** : uppercase systématique
- **Code / datum** : IBM Plex Mono (HUD technique uniquement)
- **Hiérarchie** :
  - H1 : Geist Bold, grand
  - H2 : Geist Bold, medium
  - H3 : Geist Medium
  - Body : Geist Regular
  - Caption : Geist Regular, petit, uppercase

## Spacing

Base 8px : `4 / 8 / 16 / 24 / 32 / 48 / 64 / 96px`

## Composants visuels clés

- **ProductCard** : fond #F8F8F8, nom uppercase, prix barré + prix réduit, hover 2 images (opacity transition)
- **Boutons** : fond #1A1A1A, texte blanc, uppercase, pas de border-radius ou très léger
- **Inputs** : minimalistes, border bottom uniquement ou outline léger

## HUD décoratif (TechnicalDecorFrame)

Équerres d'angle + micro-crosshairs (+) + ticks sur les bords + ligne datum en IBM Plex Mono.
Règles : toujours bas contraste, `pointer-events-none`, `z-[2]`, parent `relative overflow-hidden`.
Usage : overlays, cartes premium, modales — jamais de façon agressive.

## Mobile-first

Tous les composants pensés mobile d'abord.
Breakpoints TailwindCSS : `sm` (640px) · `md` (768px) · `lg` (1024px) · `xl` (1280px)

## Workflow design → code

1. Inspiration A-COLD-WALL*
2. Création directe en React + TailwindCSS
3. shadcn/ui si composant UI générique adapté
4. Custom sinon, style A-COLD-WALL* appliqué à la main
5. Figma uniquement pour les pages complexes nouvelles
