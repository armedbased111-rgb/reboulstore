---
type: collection
marque: Salomon
slug-bdd: salomon
saison: SS26
statut-data: importe
statut-images: uploade
maj: 2026-06-05
---
# Salomon SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **23 références** en BDD ✅ (13 initiales + 10 nouvelles dont 5 MM6 × Salomon Cross)
- Slug exact : `salomon`
- CSV : `docs/imports/import-salomon-ss26.csv` + `docs/imports/import-salomon-new-ss26.csv`
- **Descriptions + matières** renseignées ✅ 2026-06-05 (script `scripts/update_salomon_descriptions.py`)
  - 7 modèles : XT-6, XT-6 GTX, XT-4 OG, XT-4 OG GTX, Whisper Void, XT Pathway, MM6 × Salomon Cross

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- Output : `output_batch_salomon/` — 23 refs avec 1_face + 4_top
- Dossier iCloud : `SALOMON PHOTOS/` — dossier `WS0249:HB423` corrigé (était `WS01249:HB423`)
- Upload : fix séparateur `-` → `/` dans `upload.py` (anciens dossiers utilisent `-`, nouveaux `:`)

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (23 refs) ✅
- [x] Générer images IA ✅
- [x] Vérifier qualité + trier ✅
- [x] Uploader vers Cloudinary ✅
- [x] Renseigner descriptions + matières ✅ 2026-06-05
- [x] Valider affichage sur le site ✅
