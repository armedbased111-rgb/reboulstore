---
type: collection
marque: Stone Island
slug-bdd: stone-island
saison: SS26
statut-data: complet
statut-images: uploade
maj: 2026-05-27
---
# Stone Island SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **77 références** en base (apres MAJ stock SS26)
- Slug exact : `stone-island`
- Collection active : SS26
- Catégories : vêtements (pull, veste, pantalon, t-shirt…)
- CSV (collection) : `docs/imports/import-stone-island-ss26.csv`

### MAJ stock SS26 (CSV vs BDD)

- Rapport historique : `docs/archive/stone-maj-rapport.txt`
- Ce rapport liste :
  - variants nouveaux (dans CSV, pas en BDD)
  - mises a jour de stock
  - variants a retirer (absents du CSV)

## Images

- 63 refs dans `output_batch_stone_island/`
- Toutes avec `1_face` + `2_back` générés (IA Gemini Flash)
- **63 refs uploadées ✅ 27/05** — is_published=true · affichage validé sur le site

## Pipeline images

Flat lay standard (pas shoe). Fond #F3F3F3.

```bash
# Génération batch (déjà fait)
./rcli images generate-batch --input-dir DIR -o output_batch_stone_island \
  --refs-dir refs_empty --gemini-flash --flash-attempts 4 --delay 30

# Correction couleur si nécessaire
./rcli images color-fix --batch output_batch_stone_island

# Upload batch
./rcli images upload-batch --batch output_batch_stone_island
```

Ajustements ponctuels avec `--gemini-pro` (sans `--ref`, sans `--skip-verify`).

## Tâches

- [x] Générer images IA (63/63 face+back) ✅
- [x] Trier les refs (vérifier qualité face + back) ✅
- [x] Uploader 63 refs vers Cloudinary ✅ 2026-05-27
- [x] Valider affichage sur le site ✅ 2026-05-27
