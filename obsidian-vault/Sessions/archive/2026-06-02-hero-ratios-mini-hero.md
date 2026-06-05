---
type: session
date: 2026-06-02
sujets: ratios hero/mini-hero, campaign Stone Island close-up, workflow pub prompts
statut: archivée
---

# Session 2026-06-02 — Ratios hero + campaign Stone Island

Liens : [[REBOUL]] · [[Frontend/Home]] · [[Architecture/workflow-pub-elevenlabs]]

---

## Ce qui a été fait

### Ratios finaux hero + mini-hero

- **Hero principal** : `aspect-[4/5] md:aspect-[4/1]` — mobile 4:5, desktop 4:1 ✅
- **Mini-hero FeaturedProducts** : `aspect-[4/1]` — même ratio desktop + mobile ✅
- `object-cover` sans position forcée sur le mini-hero ✅

### Campaign Stone Island close-up

- Généré dans ElevenLabs : GPT Image 2 (close-up badge + zip veste noire) → result validé
- Desktop : STONEHERODESKTOP.png 3840×1280 → uploadé Cloudinary slide_1780365503
- Mobile : STONEHEROMOBILE.png 2160×3840 → uploadé Cloudinary slide_1780365503_mobile
- Appliqué sur mini-hero Best Sellers Stone Island ✅
- **Problème identifié** : image 3:1 dans container 4:1 → object-position sans effet (image remplit toute la largeur). Il faut générer directement en **4:1 ou 21:9** dans ElevenLabs.

### Workflow pub — prompts validés

- Prompt GPT Image 2 close-up validé (cf. [[Architecture/workflow-pub-elevenlabs]])
- Règle : une seule image 4:1 suffit pour hero desktop + mini-hero

---

## Dimensions finales campagne

| Destination | Dimensions | Ratio |
|-------------|-----------|-------|
| **Hero desktop** | 1920 × 480 px | 4:1 |
| **Hero mobile** | 828 × 1035 px | 4:5 |
| **Mini-hero** | 1920 × 480 px | 4:1 — même image pour tout |

---

## À faire

- [ ] Refaire le mini-hero Stone Island directement en **4:1** dans ElevenLabs (badge centré dans la composition)
- [ ] Appliquer le même mini-hero sur Off-White quand l'image est prête
