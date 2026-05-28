---
type: collection
marque: Carhartt WIP
slug-bdd: carhartt
saison: SS26
statut-data: importe
statut-images: uploade
maj: 2026-05-29
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

- Pipeline : **flat lay standard** (vêtements) — fond #808080
- Output : `output_batch_carhartt/` — **52 refs uploadées ✅** (52/62 publiées)
- 2 refs sans images générées : `I030434_3IR` · `I030469_0160`
- 8 refs sans photos sources (is_published=false)

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (62 refs) ✅
- [x] Générer images IA (54/62 face+back) — 8 refs sans photos sources
- [x] Vérifier qualité + retouche PS ✅ 2026-05-29
- [x] Uploader 52 refs vers Cloudinary ✅ 2026-05-29
- [x] Valider affichage sur le site ✅ 2026-05-29
- [ ] Photos manquantes : 8 refs à shooter
