---
type: collection
marque: Arte Antwerp
slug-bdd: arte
saison: SS26
statut-data: importe
statut-images: uploade
maj: 2026-05-27
---
# Arte Antwerp SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **10 références** importées ✅
- Slug exact : `arte` (**pas** "arte antwerp")
- Collection active : SS26
- Catégories : tee-shirts (65€), pantalon (140€), jackets (145€)
- CSV : `docs/imports/import-arte-ss26.csv`

## Références

| Ref | Produit | Prix |
|-----|---------|------|
| 099T/BLACK | Back Poster T-Shirt | 65€ |
| 099T/WHITE | Back Poster T-Shirt | 65€ |
| 100T/26/WHITE | Back Collage T-Shirt | 65€ |
| 101T/BLUE | Blurry Back Print | 65€ |
| 103T/BLACK | SS26 Back T-Shirt | 65€ |
| 141T/WHITE | Big Logo Back T-Shirt | 65€ |
| 143T/26/WHITE | Back Graphic T-Shirt | 65€ |
| 171P/BLEACH | Circle Logo Pocket Pants | 140€ |
| 231J/BLACK | Shiny Nylon Jacket | 145€ |
| 231J/GREEN | Shiny Nylon Jacket | 145€ |

## Images

- Pipeline : **flat lay standard** (pas shoe)
- Photos sources : iCloud `Collection reboulstore /ARTE/`
- Output : `output_batch_arte/` — **10/10 refs générées** (face + back) ✅

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Faire les photos des articles (iCloud)
- [x] Scanner les étiquettes → prix renseignés
- [x] Importer via Admin Centrale (10 refs, 37 SKUs)
- [x] Générer les images IA (10/10 face+back) ✅
- [x] Vérifier qualité + color-fix ✅
- [x] Uploader vers Cloudinary ✅ 2026-05-27
- [x] Valider affichage sur le site ✅ 2026-05-27
