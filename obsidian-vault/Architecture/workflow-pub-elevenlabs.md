---
type: workflow
section: Architecture
sujet: images publicitaires ElevenLabs Flows
maj: 2026-06-02
---

# Workflow images pub — ElevenLabs Flows

Pipeline standard pour créer les visuels campagne et hero du site.

Liens : [[Architecture/Architecture]] · [[Architecture/pipeline-images]] · [[Architecture/services-tiers]]

---

## Pipeline standard

```
GPT Image 2 → Flux 1 Kontext Pro → Flux 2 Pro → Photoshop
```

| Étape | Outil | Rôle | Coût approx |
|-------|-------|------|-------------|
| 1 | GPT Image 2 | Composition scène + produits | ~$0.08/image |
| 2 | Flux 1 Kontext Pro | Ajustements chirurgicaux | ~$0.04/image |
| 3 | Flux 2 Pro | Finish final — lissage rendu | ~$0.05/image |
| 4 | Photoshop | Logos SVG + recadrage formats | — |

---

## Étape 1 — GPT Image 2 (Composition)

**Rôle :** Placer les produits dans une scène à partir de plusieurs refs.

**Inputs :**
- 2 à 5 photos produits (face + top minimum)
- 1 image inspiration (ambiance, composition)

**Règles :**
- Toujours donner minimum 2 vues du produit
- Ne jamais mentionner le nom de la marque dans le prompt (ToS violation)
- Format : 16:9 / 4K pour desktop, 9:16 pour mobile

**Prompt type :**
```
Replace all garments with the exact pieces from the 
reference photos only, use only the garments shown 
in the references, do not add any extra garments 
not in the references, keep the [background description] 
identical, same composition, preserve all garment 
details exactly
```

---

## Étape 2 — Flux 1 Kontext Pro (Ajustements chirurgicaux)

**Rôle :** Modifier un élément précis sans toucher au reste.

**Règle absolue :** Un seul changement par prompt. Jamais plusieurs en même temps.

**Inputs :** Une seule image (Kontext n'accepte pas de double ref).

**Prompt correction fond + ombrage :**
```
Enhance photorealism and shading on this shoe/garment,
deeper contrast,
change background to [couleur HEX ex: #F4C2C2] tones,
subtle gradient from [couleur] to [couleur],
stronger dramatic rim lighting on edges,
keep hand/garment position identical,
high-end editorial photography
```

**Prompt remplacement élément :**
```
Replace only the [élément précis] with the exact 
piece from the reference photo,
keep all other elements and background completely 
identical, do not change anything else
```

**Mots à éviter absolument :**
- `sharper` → hallucine les textures
- `enhance details` → invente des détails
- `more detailed` → déforme le produit

---

## Étape 3 — Flux 2 Pro (Finish final)

**Rôle :** Lisser et polir le rendu sans modifier le contenu.

**Prompt universel :**
```
Unsharp the textures of this image a little 
to be less painful to the eyes, 
do not modify anything else, make it beautiful
```

**Variante eau/reflets :**
```
Unsharp the textures of this image a little 
to be less painful to the eyes,
enhance water reflections to look more natural,
add subtle natural shadows beneath each garment,
do not modify anything else, make it beautiful
```

---

## Étape 4 — Photoshop (Logos & Format)

- Logo marque en **SVG** (jamais PNG pour les logos)
- Logo Reboul en SVG blanc
- Desktop : **1920 × 1080 px** (16:9)
- Mobile : **750 × 1334 px** (9:16)

---

## Règles générales Flows

### Upload fichiers
- **Toujours convertir en PNG** avant d'uploader (JPG et HEIC souvent rejetés)
- Dans Aperçu Mac : Fichier → Exporter → PNG → sRGB

### Gestion crédits
- Valider chaque nœud avant de chaîner au suivant
- Lancer nœud par nœud, jamais tout le flow d'un coup
- Télécharger les bons résultats immédiatement

### Terms of Service — Mots interdits dans les prompts
- Noms de marques premium : Stone Island, Off-White, Nike, Adidas…
- "Military", "apocalyptic", "Eastern European", "abandoned"
- → Remplacer par des descriptions visuelles neutres

---

## Formats de sortie

| Destination | Dimensions | Ratio | Format export |
|-------------|-----------|-------|---------------|
| Hero desktop | **1920 × 480 px** | **4:1** | JPG 90% ou PNG |
| Hero mobile | **828 × 1035 px** | **4:5** | JPG 90% ou PNG |
| Mini-hero | **1920 × 480 px** | **4:1** | JPG 90% ou PNG — même image desktop + mobile |
| Social / carré | **1080 × 1080** | 1:1 | JPG 90% |

> Hero principal et mini-hero partagent le même ratio 4:1 desktop — une seule image suffit pour les deux si la composition le permet.

> ⚠️ **Règle composition mini-hero** : le badge / élément clé doit être dans la zone centrale-droite de l'image dès la génération. Si l'image est générée en 3:1, `object-right` ne fonctionne pas (l'image remplit déjà la largeur). Générer directement en **4:1** ou **21:9** dans ElevenLabs pour le mini-hero.

**Avec texte/logo intégré dans l'image** → PNG-24
**Photo pure sans texte** → JPG 85-90% (Cloudinary compressera en WebP automatiquement)

---

## Templates validés

### Off-White × Reboul — Paire tenue à la main

- Fond : gradient blanc → rose `#F4C2C2`
- Pipeline : GPT Image 2 (3 refs paire) → Kontext → Flux 2
- Prompt clé Kontext : `Enhance photorealism and shading, subtle gradient from warm pink to off-white, stronger dramatic rim lighting on edges`
- Résultat session 01/06 : slide hero ✅ [[Sessions/archive/2026-06-01-hero-slides-image-optim]]

### Stone Island × Reboul — Vêtements sur eau

- Fond : eau teal foncée avec reflets lumineux
- Pipeline : GPT Image 2 (4-5 refs vêtements + inspiration) → GPT Image 2 (corrections) → Flux 2
- Prompt clé Flux 2 : `Unsharp + enhance water reflections to look more natural, add subtle natural shadows beneath each garment`
- Résultat session 01/06 : slide hero + mini-hero Best Sellers ✅

---

## Pipeline fond blanc e-commerce (Gemini)

Pour les photos produit fond blanc standard.

**Modèle :** Nano Banana 2 (`gemini-3.1-flash-image` dans l'image-ui)
**Format :** 1024 × 1365 px (ratio 3:4)

**Prompt :**
```
Change only the background color to pure white 
#F3F3F3, do not modify the garment in any way, 
do not alter fabric texture, colors, stitching, 
buttons, patches or any garment details, 
preserve the product 100% identical, 
add very subtle natural drop shadow beneath, 
clean professional product photography
```

**Alternative API :** fal.ai → Flux Kontext Pro à ~$0.04/image

> ⚠️ Gemini image actuellement bloqué sur le nouveau compte Google (quota free tier = 0). Activer billing Google Cloud pour débloquer.

---

## Intégration site Reboul

Après Photoshop, uploader via l'image-ui :
- **Hero slide** : `image-ui` → onglet Campaign → Upload hero → renseigne titre/subtitle/lien
- **Mini-hero FeaturedProducts** : passer l'URL Cloudinary en prop `heroBg` dans `Home.tsx`
- **Dimensions upload** : voir section Formats ci-dessus
