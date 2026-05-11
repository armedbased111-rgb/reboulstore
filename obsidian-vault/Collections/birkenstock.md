---
type: collection
marque: Birkenstock
slug-bdd: birkenstock
saison: SS26
statut-data: importe
statut-images: photos-faites
maj: 2026-05-07
---
# Birkenstock SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- CSV : `docs/imports/import-birkenstock-ss26.csv`
- **218 lignes** — 34 refs, toutes avec prix et couleurs réels
- Slug exact : `birkenstock`
- Statut : **importé en BDD ✅ 2026-05-07**

### Refs importées

| Modèle | Refs | Catégorie | Couleur |
|--------|------|-----------|---------|
| Boston BS | 660463, 660473, 1024714, 1025844, 1030418, 1030861, 1030883, 1031577, 1031635 | sabots | Mocca / Black / Thyme / Faded Khaki / Taupe / Dark Tea Tonal FB / Sandcastle / Faded Purple Tonal FB / Pink Clay |
| Loma | 1031652 | sabots | Charcoal |
| Naples Wrapped | 1029710 | mocassin | Taupe |
| Arizona BS | 951303, 951313, 151183 | sandales | Taupe / Mocca / Mocca |
| Arizon | 1009527…1032061 + 1029651, 1030389 | sandales | Mink / GPW / Cognac / Gold / HSB / Copper / Warm Sand / Sandcastle / HSB / Taupe / Eggshell / Gray Taupe / Tobacco Brown / Dark Tea / Pink Clay / Faded Purple / Pink Clay / Faded Khaki |
| Florida BS / Fresh | 1029385, 1029818, 1030352, 1031867 | sandales | High-Shine Black / GPW / Graceful Taupe / Mink |
| Madrid Big Buckle / BS | 1006525, 1020632, 1022650 | sandales | Cognac / Graceful Taupe / High-Shine Black |
| Mayari | 1016408, 71661 | sandales | Graceful Taupe / Graceful Pearl White |

### Refs supprimées (sans photos)

- **Dossiers vides** : GIEE/1016144, GIEE/943871, MADRID/40093, MADRID/40791, MADRID/40793, MADRID/940153
- **Dossiers absents** : SOLANA/1031578, ARIZONA/151181, ARIZONA/151211, ARIZONA/151213, ARIZONA/51791
- **Pas de dossier iCloud** : ARIZON/1021704, 1023965, 1024955, 1029333, 1029439, 1029451, 1030355, 1030369, 1031283, BOSTON/1027875, 1029748

## Images

- Type : **shoe** (`--product-type shoe`) — même pipeline qu'Autry
- 2 vues : `1_face` (profil latéral, IA) + `4_top` (vue top, Gemini ADJUST)
- Photos : faites — dossier iCloud `Collection reboulstore /BIRKENSTOCK/`

## Plan (ordre logique)

- [x] Récupérer les infos produits (feuilles de stock iCloud)
- [x] Créer le CSV
- [x] Faire les photos des articles
- [x] Supprimer refs sans photos (22 refs total — 2026-05-07)
- [x] Scanner les 41 étiquettes → renseigner prix + couleurs dans le CSV (2026-05-07)
- [x] Importer via Admin Centrale — 218 lignes, 34 refs (2026-05-07)
- [x] Définir pipeline images → shoe (`--product-type shoe`, même pipeline Autry) ✅ 2026-05-07
- [ ] Lancer pipeline IA (`./rcli images generate-batch --product-type shoe`)
- [ ] Retouche Photoshop
- [ ] Upload Cloudinary

→ Workflow référence : [[Architecture/workflow-collection]]
