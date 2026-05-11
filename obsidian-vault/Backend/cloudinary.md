---
type: module
nom: cloudinary
statut: complet
---
# Module — Cloudinary

CDN images. Upload, optimisation, transformation à la volée.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/images]]

---

## Fonctions principales

- Upload images produit (via Admin ou via CLI `./rcli images upload`)
- Upload logos marques
- Transformation à la volée (resize, crop, format WebP)
- Association image → produit (par nommage SKU)

## Conventions nommage images

Format : `[REF]_[numero]_[type].[ext]`
- `1_face` — vue principale / face
- `2_back` — vue dos
- `3_detail` — détail / logo
- `4_top` — vue du dessus (shoes uniquement)

Dossier Cloudinary : `products/[collection]/[ref]/`

## CLI associé

```bash
./rcli images upload --ref REF --dir output/REF/
./rcli images upload-batch --batch output_batch_stone_island/
```

## Intégration Admin

- Upload multiple (drag & drop)
- Prévisualisation avant upload
- Réordonnancement des images (flèches)
- Max 7 images par produit
