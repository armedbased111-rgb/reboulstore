---
type: architecture
---
# Pipeline images produit

Liens : [[Architecture/Architecture]]

---

## Vue d'ensemble

```
Photos brutes (iCloud)
    ↓
[1] Préparation — resize + organisation dossiers
    ↓
[2] Génération IA (Gemini) — remove bg + flat lay ou shoe
    ↓
[3] Correction couleur (PIL/numpy)
    ↓
[4] Vérification manuelle — tri, qualité, hallucinations
    ↓
[5] Upload (Cloudinary CDN)
    ↓
Site prod — images accessibles
```

---

## [1] Préparation photos

**Dossier source** : iCloud `Collection reboulstore /MARQUE/`
**Convention de nommage** :
- `face.jpeg` = vue principale (face ou profil latéral pour shoes)
- `back.jpeg` = vue dos (ou vue top pour shoes)

**Resize** : toujours `sips -Z 1365` (proportionnel sur grande dimension)
**Jamais** `sips -z` (déforme l'image).

---

## [2] Génération IA

### Flat lay (vêtements)

```bash
./rcli images generate-batch \
  --input-dir "~/iCloud/Collection reboulstore/MARQUE/" \
  -o ./output_batch_marque \
  --refs-dir refs_empty \
  --gemini-flash --flash-attempts 4 \
  --delay 30
```

Gemini reçoit la photo brute et produit :
- `1_face.png` — vêtement flat lay, bg #808080 gris moyen, centré
- `1_back.png` — vue dos, même traitement

### Chaussures (shoe pipeline)

```bash
./rcli images generate-batch \
  ... --product-type shoe --skip-existing --delay 30
```

- `1_face.png` — profil latéral (génération IA)
- `4_top.png` — vue dessus via **Gemini ADJUST** (pas génération)

```bash
# Générer la vue top via adjust
./rcli images adjust \
  --image "back.jpeg" \
  --prompt "Remove background, place shoe centered on #F3F3F3, top-down view, preserve all details" \
  -o output_batch_autry/REF/4_top.png \
  --gemini-pro
```

**Jamais `--ref` pour les chaussures** → cause hallucinations (badges inventés).

---

**Note (27/05/2026)** : PIL normalize_bg désactivé après génération — les images gardent exactement ce que le modèle produit. Le fond #808080 est conservé pour PS (retouche manuelle de fond et ombre).

---

## [3] Correction couleur

```bash
# Une ref
./rcli images color-fix --dir output_batch_marque/REF/

# Tout un batch
./rcli images color-fix --batch output_batch_marque/
```

PIL/numpy : recalibrage couleur pour cohérence entre face et back.

---

## [4] Vérification manuelle

Points à vérifier :
- [ ] Pas d'hallucinations (badges inventés, logos modifiés, textes ajoutés)
- [ ] Centrage correct (marges équilibrées, pas de crop)
- [ ] Couleurs fidèles à la photo source
- [ ] Back cadré au même niveau que la face

**Si hallucinations** → stratégie ADJUST anti-hallucination :
```bash
./rcli images adjust \
  --image "face.jpeg" \
  --prompt "Remove bg, center garment, preserve everything exactly as-is. No changes to logos, badges, text, colors." \
  -o output_batch_marque/REF/1_face.png \
  --gemini-pro
```

**Recadrage back trop zoomé** :
```bash
./rcli images adjust \
  --image output/REF/1_back.png \
  --ref output/REF/1_face.png \
  --prompt "Dezoom back view to match same framing and scale as face reference. Same white space margins." \
  -o output/REF/1_back.png \
  --gemini-pro
```

---

## [5] Upload Cloudinary

```bash
# Upload une ref
./rcli images upload --ref REF --dir output_batch_marque/REF/

# Upload tout un batch
./rcli images upload-batch --batch output_batch_marque/
```

**Ordre upload** : FACE toujours en position 0 (image principale). Tri : `face` → `back/top` → reste. Insensible à la casse (FACE.png = face.png).

**is_published** : après upload réussi, le CLI set automatiquement `is_published = true` sur le produit → visible sur le catalogue. Produits sans images = `is_published = false` par défaut.

**Back optionnel** : une seule image (face) suffit pour passer à `needs_upload` dans Image UI (chaussettes, accessoires). Le back n'est pas bloquant.

---

## Dimensions & format

| Paramètre | Valeur |
|-----------|--------|
| Dimensions | 1024 × 1365 px |
| Ratio | 3:4 |
| Fond génération | `#808080` (gris moyen — contraste optimal blanc ET noir) |
| Format | PNG |
| Centrage | **PIL uniquement** (jamais IA) |

---

## Règles anti-hallucination

- Ne jamais passer `--ref` pour les chaussures
- Si l'IA invente des détails → ADJUST avec photo brute + "preserve everything"
- Toujours `--gemini-pro` pour les ajustements qualité (pas flash)
- Prompt flat lay standard : `"Perfect flat lay: garment lying flat, centered with even margins, no shadow. Smooth all fabric wrinkles. Keep all logos, badges, colors pixel-perfect identical."`

---

## `--skip-existing`

Vérifie si le dossier output contient un fichier avec "face" ET un fichier avec "back". Si oui → skip la ref (pas de régénération inutile).

---

## Collections — état pipeline (27/05/2026)

| Marque | Statut pipeline |
|--------|----------------|
| Hologram | ✅ Uploadé (8/8) — is_published=true |
| Bisous | ✅ Prêt upload (24 refs) — SS26-30 jaune à photographier |
| Stone Island | Généré — 61+ à uploader |
| Autry | Généré (40 refs) — tri + upload à faire |
| Arte Antwerp | À lancer (photos dispo iCloud) |
| Off-White | À lancer (shoes) |
| Carhartt | Pas de photos — is_published=false |
| Saucony | Pas de photos — is_published=false |
| Birkenstock | Pas de photos — is_published=false |
| RRD | Import BDD en attente |
