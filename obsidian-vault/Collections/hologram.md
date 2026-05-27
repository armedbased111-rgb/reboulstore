---
type: collection
marque: Hologram
slug-bdd: hologram
saison: SS26
statut-data: importe
statut-images: photos-faites
maj: 2026-05-27
---
# Hologram SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- CSV : `docs/imports/import-hologram-ss26.csv` — 37 variants, 8 refs, `cod_article` renseigné (feuille PDF 06/05/26)
- Slug exact : `hologram`
- Statut : **importé en BDD** ✅ 19/05 (`./rcli import apply-csv` ou Admin)
- Feuille stock : iCloud `feuille de stockage/HOLOGRAM/HOLOGRAM.pdf` (06/05/26)

### Feuille stock

Colonne **Cod Article** (ERP) — renseignée dans le CSV et en BDD (`variants.cod_article`).

| Colonne feuille | Exemple | Notre champ |
|-----------------|---------|-------------|
| Cod Article | `5 001 35923` | `cod_article` |
| Reference | `AR0066/PINK L` | `sku` variant |
| Px Achat | 40,00 | — (prix vente en boutique) |

→ Roadmap : [[Projet/roadmap#Code article (ERP / AS400)]]

### Refs supprimées (sans photos)

- AR00065/PINK (dossier vide)
- AR00647/NAVY (dossier vide)

## Produits SS26

| Ref | Genre | Couleur | Tailles | Prix |
|-----|-------|---------|---------|------|
| AR00066 | Chemise | PINK | XS, S, M | 100€ |
| AR00665 | Chemise | NAVY | XS, S, M, L | 100€ |
| AR00677 | T-shirt | BLUE | XS, S, M, L, XL | 65€ |
| AR00679 | T-shirt | PINK | XS, S, M, L, XL | 65€ |
| AR00681 | T-shirt | WHITE | XS, S, M, L, XL | 65€ |
| AR00682 | T-shirt | BLACK | XS, S, M, L, XL | 65€ |
| AR00683 | T-shirt | WHITE | XS, S, M, L, XL | 65€ |
| AR00685 | T-shirt | WHITE | XS, M, L, XL | 65€ |

## Images

- Type : **flat lay** (vêtements)
- Photos : faites — dossier iCloud `Collection reboulstore /HOLOGRAM/`
- Pipeline : **garment** (flat lay) — Image UI marque **Hologram** · `output_batch_hologram`

## Plan

- [x] Récupérer les infos produits (refs, prix, tailles, couleurs)
- [x] Créer le CSV
- [x] Créer les dossiers iCloud pour prise de photos
- [x] Faire les photos des articles ✅ 2026-05-07
- [x] Scanner les 8 étiquettes → renseigner les prix ✅ 2026-05-07
- [x] Supprimer refs sans photos (AR00065, AR00647) ✅ 2026-05-07
- [x] Renseigner `cod_article` depuis feuille PDF ✅ 18/05
- [x] Importer en BDD ✅ 19/05 (8 produits, 37 variants)
- [x] Lancer pipeline IA (flat lay) ✅ 27/05 — batch lancé via Image UI · problème coloris blancs identifié → fond #808080 corrigé dans pipeline
- [x] Retouche Photoshop ✅ 2026-05-27
- [x] Upload Cloudinary ✅ 2026-05-27

→ [[Architecture/workflow-collection]]
