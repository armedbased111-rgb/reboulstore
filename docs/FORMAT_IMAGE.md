 # FORMAT_IMAGE.md — Formats & Campagne Reboulstore

Guide complet des images du site : formats, dimensions, où elles s'affichent, et comment les préparer avec Photoshop en solo.

---

## 1. Vue d'ensemble — Tous les slots image du site

| Slot | Composant | Format | Dimensions cible | Ratio |
|------|-----------|--------|-----------------|-------|
| Hero desktop | `HeroSectionImage` | JPEG | 1440 × 720 px | 2:1 |
| Hero mobile | `HeroSectionImage` | JPEG | 390 × 520 px | 3:4 |
| Hero vidéo | `HeroSectionVideo` | MP4 | 1440 × 720 px | 2:1 |
| Catégorie (carousel) | `CategorySection` | JPEG | 600 × 750 px | 4:5 |
| PromoCard principale | `PromoCard` | JPEG | 600 × 750 px | 4:5 |
| PromoCard grille (×2) | `PromoCard` | JPEG | 500 × 500 px | 1:1 |
| Images produit | Pipeline IA | PNG | 1024 × 1365 px | 3:4 |

---

## 2. Hero Principal — Le slot le plus important

### Rôle
Première image vue à l'ouverture du site. Doit donner l'ambiance de la saison.
**Pas une photo produit** — une photo d'ambiance / lookbook / editorial.

### Deux fichiers à préparer (desktop + mobile)

#### Hero Desktop
- **Dimensions** : `1440 × 720 px` (ratio 2:1, paysage)
- **Format** : JPEG, qualité 85–90
- **Affichage** : `h-[80vh]` full width, `object-fit: cover`
- **Zone safe pour le texte** : éviter le tiers inférieur gauche — titre + bouton s'affichent à ~50% du haut, côté gauche, padding 20px
- **Objet dans Photoshop** : `Artboard 1440 × 720`

#### Hero Mobile
- **Dimensions** : `390 × 520 px` (ratio ≈3:4, portrait)
- **Format** : JPEG, qualité 85–90
- **Affichage** : `h-[60vh]` full width
- **Zone safe** : éviter le tiers inférieur gauche (titre + bouton à ~55% du haut, padding 16px)
- **Objet dans Photoshop** : `Artboard 390 × 520` (ou 780 × 1040 @2x)

### Paramétrage dans Home.tsx
```tsx
// Dans FALLBACK_SLIDES (ou via image-ui)
{
  imageSrc: 'URL_DESKTOP',       // desktop ≥ 768px
  imageSrcMobile: 'URL_MOBILE',  // mobile < 768px
  title: 'SS26 Pre Release',
  buttonText: 'Shop now',
  buttonLink: '/catalog',
}
```

### Export Photoshop
- `Fichier > Exporter > Enregistrer pour le web (legacy)` → JPEG qualité 85
- Nommage : `hero-ss26-desktop.jpg` / `hero-ss26-mobile.jpg`
- Upload sur Cloudinary dans le dossier `homepage/homepage/`

---

## 3. CategorySection — Images par catégorie

### Rôle
Carousel "Shop by category". Une image par catégorie (Vestes, Sweats, Tee-shirts, etc.).
**Ambiance + produit** — photo lifestyle ou flat lay stylisé.

### Specs
- **Dimensions** : `600 × 750 px` (ratio 4:5, portrait)
- **Format** : JPEG, qualité 85
- **Affichage** : `aspect-[4/5]`, `object-fit: cover`
- **Zone safe** : milieu-gauche (nom catégorie overlay), bas-gauche (bouton Shop now)

### Upload
Via admin → Catégories → modifier la catégorie → champ "Image URL" (Cloudinary).

---

## 4. PromoCard — Section éditoriale

### Rôle
Bloc éditorial en bas de page. Actuellement utilisé pour présenter une collaboration ou un univers.
**Style magazine** — peut être une image ambiance, un portrait, une texture.

### Specs
| Element | Dimensions | Ratio | Format |
|---------|-----------|-------|--------|
| Image principale | 600 × 750 px | 4:5 | JPEG |
| Grille image 1 | 500 × 500 px | 1:1 | JPEG |
| Grille image 2 | 500 × 500 px | 1:1 | JPEG |

---

## 5. Workflow Photoshop — Seul avec un téléphone/appareil

### Ce qu'il te faut
- Appareil photo ou iPhone en mode portrait/paysage selon le slot
- Photoshop (2024+)
- Cloudinary pour l'hébergement

### Étapes pour le Hero

1. **Shooting** : vêtements portés ou posés, ambiance urbaine/studio. Lumière naturelle ou flash.
2. **Ouvrir dans PS** → recadrer sur le bon ratio (2:1 desktop, 3:4 mobile)
3. **Ajustements recommandés** :
   - Camera Raw : expo +0.3, contraste +10, clarté +5, vibrance +10
   - Optionnel : noir et blanc partiel, grade colorimétrique
4. **Vérifier la zone safe** : ajouter un rectangle guide dans le tiers inférieur gauche pour simuler le titre/bouton
5. **Exporter** : JPEG 85, 1440×720 desktop / 390×520 mobile
6. **Upload Cloudinary** → copier l'URL → coller dans `Home.tsx` ou via image-ui

### Template Photoshop (à créer une fois)
- Fichier PSD : `template-hero.psd`
- 2 artboards : `Desktop_1440x720` + `Mobile_390x520`
- Calque guide "SAFE ZONE" (non exporté) : rectangle rouge en bas-gauche montrant où va le texte

---

## 6. Stratégie campagne SS26

### Concept visuel
Style inspiré ACW* : **minimaliste, sombre, urbain**. Pas de fond blanc. Matière + silhouette.

### Ce qui fonctionne bien pour le hero

| Type de photo | Exemple | Niveau de difficulté |
|--------------|---------|---------------------|
| Vêtement posé sur fond urbain (béton, mur) | Veste Stone Island sur un mur | ★★☆ |
| Close-up matière / détail | Badge Stone Island, tissu technique | ★☆☆ |
| Mannequin ou ami portant le vêtement | Lookbook simple en extérieur | ★★★ |
| Flat lay stylisé avec accessoires | Veste + sneakers sur asphalte | ★★☆ |

### Shooting minimum viable pour le hero
Pour 1 slide hero SS26 il te faut :
- **1 photo paysage** 1440×720 (ou recadrable) — ambiance forte
- **1 photo portrait** 390×520 (ou recadrable) — peut être un crop de la même scène
- Lumière : naturelle de préférence, pas de flash direct

### Marques à mettre en avant (par ordre de priorité)
1. **Stone Island SS26** — 63 refs — hero prioritaire
2. **Autry SS26** — 40 refs — hero ou CategorySection
3. **Arte Antwerp SS26** — 10 refs — PromoCard éditoriale
4. **Bisous Skateboards SS26** — 33 refs — CategorySection
5. **Off-White SS26** — 7 refs — PromoCard collab

---

## 7. Cloudinary — Structure des dossiers

```
homepage/
  homepage/
    hero.jpg           ← hero desktop slide 1
    hero-mobile.jpg    ← hero mobile slide 1
    hero_2.jpg         ← hero desktop slide 2
    hero_2-mobile.jpg  ← hero mobile slide 2
    addon.jpg          ← PromoCard grille 1
    addon2.jpg         ← PromoCard grille 2
    promoimage.jpg     ← PromoCard principale
    acw-video.mp4      ← HeroSectionVideo
```

Upload : [console.cloudinary.com](https://console.cloudinary.com) → Media Library → dossier `homepage/homepage/`

---

## 8. Résumé rapide — ce qu'il faut faire avant le lancement

- [ ] 1 photo hero desktop SS26 (1440×720)
- [ ] 1 photo hero mobile SS26 (390×520)
- [ ] Images pour les catégories principales (Vestes, Sweats, Tee-shirts...) en 4:5
- [ ] 1 image PromoCard pour la section éditoriale
- [ ] Upload tout sur Cloudinary + mettre à jour les URLs dans `Home.tsx`
