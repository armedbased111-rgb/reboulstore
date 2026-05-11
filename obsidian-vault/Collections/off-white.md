---
type: collection
marque: Off-White
slug-bdd: off-white
saison: SS26
statut-data: importe
statut-images: generees
maj: 2026-05-11
---
# Off-White SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **7 références** importées (toutes des sneakers OW Be Right Back)
- Slug exact : `off-white`
- Collection active : SS26
- 47 SKUs importés

## Références

| Ref | Modèle | Prix |
|-----|--------|------|
| BERIGHT/BLACK | OW Be Right Back Knit | 395€ |
| BERIGHT/COBA | OW Be Right Back Mesh | 489€ |
| BERIGHT/CYAN | OW Be Right Back Mesh | 489€ |
| BERIGHT/MAGE | OW Be Right Back Mesh | 549€ |
| BERIGHT/PINK | OW Be Right Back Net | 549€ |
| BERIGHT/SDBLK | OW Be Right Back Net | 549€ |
| BERIGHT/YEL | OW Be Right Back Net | 549€ |

CSV : `docs/imports/import-off-white-ss26.csv`

## ⚠️ Attention dossier iCloud

Dossier : `Collection reboulstore /OFF WHITE/`
Les sous-dossiers utilisent `:` au lieu de `/` dans les noms.
`BERIGHT:IMAGE` correspond à ref `BERIGHT/MAGE` (mal nommé — à vérifier).

## Images

- Type : sneakers → pipeline shoe (`--product-type shoe`)
- Output : `output_batch_off_white/` — **7/7 refs complètes** (1_face + 4_top) ✅
- 0 refs uploadées

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (7 refs, 47 SKUs) ✅
- [x] Générer images IA (7/7 — 1_face + 4_top) ✅
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_off_white`)
- [ ] Valider affichage sur le site

⚠️ `BERIGHT:IMAGE` dans iCloud = ref `BERIGHT/MAGE` (nom de dossier incorrect)
