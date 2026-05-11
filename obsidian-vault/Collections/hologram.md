---
type: collection
marque: Hologram
slug-bdd: hologram
saison: SS26
statut-data: csv-pret
statut-images: photos-faites
maj: 2026-05-07
---
# Hologram SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- CSV : `docs/imports/import-hologram-ss26.csv` — 36 lignes, 8 refs, tous prix renseignés
- Slug exact : `hologram`
- Statut : **CSV prêt — import en attente**

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

## Plan

- [x] Récupérer les infos produits (refs, prix, tailles, couleurs)
- [x] Créer le CSV
- [x] Créer les dossiers iCloud pour prise de photos
- [x] Faire les photos des articles ✅ 2026-05-07
- [x] Scanner les 8 étiquettes → renseigner les prix ✅ 2026-05-07
- [x] Supprimer refs sans photos (AR00065, AR00647) ✅ 2026-05-07
- [ ] Importer via Admin Centrale
- [ ] Lancer pipeline IA (flat lay)
- [ ] Retouche Photoshop
- [ ] Upload Cloudinary

→ [[Architecture/workflow-collection]]
