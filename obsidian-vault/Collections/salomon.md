---
type: collection
marque: Salomon
slug-bdd: salomon
saison: SS26
statut-data: importe
statut-images: generees
maj: 2026-05-07
---
# Salomon SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **13 références** en BDD ✅
- Slug exact : `salomon`
- CSV : `docs/imports/import-salomon-ss26.csv`

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- Output : `output_batch_salomon/` — **13/13 refs** avec 1_face + 4_top ✅

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (13 refs) ✅
- [x] Générer images IA (13/13 — 1_face + 4_top) ✅
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_salomon`)
- [ ] Valider affichage sur le site
