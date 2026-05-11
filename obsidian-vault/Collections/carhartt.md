---
type: collection
marque: Carhartt WIP
slug-bdd: carhartt
saison: SS26
statut-data: importe
statut-images: generees
maj: 2026-05-11
---
# Carhartt WIP SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **62 références** en BDD ✅
- Slug exact : `carhartt`
- CSV : `docs/imports/import-carhartt-ss26.csv`
- Prix : `docs/imports/carhartt-ss26-prix.csv`

## Images

- Pipeline : **flat lay standard** (vêtements)
- Output : `output_batch_carhartt/` — **54/62 refs** avec face + back (8 refs sans dossier — pas de photos sources)

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (62 refs) ✅
- [x] Générer images IA (54/62 face+back) — 8 refs sans photos sources
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_carhartt`)
- [ ] Valider affichage sur le site
