---
type: collection
marque: Autry
slug-bdd: autry
saison: SS26
statut-data: importe
statut-images: partiel
maj: 2026-05-11
---
# Autry SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **40 références** en BDD ✅ (36 initiales + 4 nouvelles ajoutées le 20/03/2026)
- Slug exact : `autry`
- Type : sneakers uniquement
- CSV : `docs/imports/import-autry-ss26.csv` + `import-autry-new-ss26.csv`

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- 2 vues : `1_face` (IA) + `4_top` (Gemini ADJUST sur `back.jpeg`)
- Pas de `--ref` (hallucinations)
- Output : `output_batch_autry/` — **24/34 refs complètes** (1_face + 4_top)

### 10 refs avec seulement 1_face — 4_top manquant

HIPX-032K · JAPM-026B · PAPM-027B · PAPX-019K · SHPM-079Y · SWPX-036W · TSPM-044W · TSPX-047W · TSPX-053W · TSPX-053Y

### 4 nouvelles refs — pipeline pas encore lancé

SCLM/CQ02 · SCLM/CU01 · SCLM/CU03 · SVLM/PJ02 (photos présentes iCloud : `Collection reboulstore /AUTRY/new ref /`)

## Plan

- [x] Récupérer les infos produits + 4 nouvelles refs
- [x] Créer les CSV
- [x] Faire les photos des articles (iCloud)
- [x] Scanner les étiquettes → prix renseignés
- [x] Importer via Admin Centrale (40 refs)
- [x] Générer 1_face (34/34) ✅
- [ ] Lancer pipeline shoe sur les 4 nouvelles refs (1_face + 4_top)
- [ ] Générer les 10 `4_top` manquants via Gemini ADJUST
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_autry`)
- [ ] Valider affichage sur le site
