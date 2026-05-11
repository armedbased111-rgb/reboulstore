---
type: collection
marque: Saucony
slug-bdd: saucony
saison: SS26
statut-data: importe
statut-images: generees
maj: 2026-05-07
---
# Saucony SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **7 références** en BDD ✅
- Slug exact : `saucony`
- CSV : `docs/imports/import-saucony-ss26.csv`

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- Output : `output_batch_saucony/` — **7/7 refs** avec 1_face + 4_top ✅

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (7 refs) ✅
- [x] Générer images IA (7/7 — 1_face + 4_top) ✅
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_saucony`)
- [ ] Valider affichage sur le site
