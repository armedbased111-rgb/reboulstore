---
type: collection
marque: Autry
slug-bdd: autry
saison: SS26
statut-data: importe
statut-images: partiel
maj: 2026-05-27
---
# Autry SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **76 produits** en BDD ✅ (toutes saisons confondues — SS26 = 40 refs)
- Slug exact : `autry`
- Type : sneakers uniquement
- CSV : `docs/imports/import-autry-ss26.csv` + `import-autry-new-ss26.csv`

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- 2 vues : `1_face` (IA) + `4_top` (Gemini ADJUST sur `back.jpeg`)
- Pas de `--ref` (hallucinations)
- **34 refs uploadées ✅ 27/05** — is_published=true · affichage validé
- **6 produits non-publiés** (is_published=false) — images manquantes

## Plan

- [x] Récupérer les infos produits + 4 nouvelles refs
- [x] Créer les CSV
- [x] Faire les photos des articles (iCloud)
- [x] Scanner les étiquettes → prix renseignés
- [x] Importer via Admin Centrale (40 refs)
- [x] Générer 1_face (34/34) ✅
- [x] Uploader 34 refs vers Cloudinary ✅ 2026-05-27
- [x] Valider affichage sur le site ✅ 2026-05-27
- [ ] Générer les 6 refs manquantes (4_top + pipeline) pour les non-publiés
