---
type: collection
marque: Asics
slug-bdd: asics
saison: SS26
statut-data: importe
statut-images: generees
maj: 2026-05-07
---
# Asics SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **15 références** en BDD ✅
- Slug exact : `asics`
- CSV : `docs/imports/import-asics-ss26.csv`

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- Output : `output_batch_asics/` — **15/15 refs** avec 1_face + 4_top ✅

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (15 refs) ✅
- [x] Générer images IA (15/15 — 1_face + 4_top) ✅
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_asics`)
- [ ] Valider affichage sur le site
