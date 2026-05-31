---
type: session
date: 2026-06-01
statut: termine
---
# Session 2026-06-01 — RRD + Birkenstock + Pipeline Batch 2/3

Liens : [[Collections/rrd]] · [[Collections/birkenstock]] · [[Architecture/pipeline-images]]

## RRD

- CSV mis à jour avec prix réels depuis scan étiquettes PDFs iCloud
- Import BDD : 33 produits, 109 variants ✅
- Catégories mappées : short homme→bermuda, blaser→veste, blouson→coupe vent
- Fix `import_apply_csv.py` : `is_published=false` à la création (était `true` hardcodé)
- Upload 27/33 refs ✅ — 6 sans photos sources (S26213/60, S26322/26, casquettes S26450)

## Birkenstock

- Pipeline IA shoe + retouche PS terminés
- Upload 40/41 refs ✅

## Pipeline images — Batch 2 & 3

- **Batch 2** : fond blanc #F3F3F3 (Gemini Flash) — vêtements + shoes
- **Batch 3** : ombres (Gemini Flash)
  - Vêtements : ombre autour des bords
  - Shoe face : ombre sous la semelle (aligné batch 1)
  - Shoe top : ombre autour des bords
- Boutons B2/B3 par image individuelle dans RefView
- Fix `_resolve_output_folder` généralisé : delete, rename, refs endpoint

## Fixes Image UI

- `refs.py` : `_resolve_output_folder` pour les images (`: → _`)
- `images_manage.py` : delete + rename avec résolution correcte
- Suppression image : plus de popup confirm
- Batch 2/3 par image individuelle (endpoints + boutons B2/B3 sur chaque card)
