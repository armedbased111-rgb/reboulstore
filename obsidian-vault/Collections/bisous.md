---
type: collection
marque: Bisous Skateboards
slug-bdd: bisous
saison: SS26
statut-data: importe
statut-images: partiel
maj: 2026-05-11
---
# Bisous Skateboards SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **25 références** en BDD ✅
- Slug exact : `bisous`
- Type : streetwear (tee-shirts, sweats, pantalons, accessoires)
- CSV : `docs/imports/import-bisous-ss26.csv`

## Images

- Pipeline : **flat lay standard** (pas shoe)
- Output : `output_batch_bisous/` — **22/33 refs** avec face + back
- **2 refs avec face seulement** (back manquant) : SS26-91 · SS26-94
- **9 dossiers vides** (pas de photos) : SS26-30 · SS26-74 · SS26-75 · SS26-76 · SS26-77 · SS26-78 · SS26-79 · SS26-80 · SS26-81
- 0 refs uploadées

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (25 refs)
- [x] Générer images IA (22/33 avec face+back)
- [ ] Traiter les 9 refs vides (photos manquantes — à shooter ou supprimer)
- [ ] Régénérer back pour SS26-91 et SS26-94
- [ ] Vérifier qualité + trier les 22 existantes
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_bisous`)
- [ ] Valider affichage sur le site
