---
type: collection
marque: RRD
slug-bdd: rrd
saison: SS26
statut-data: importe
statut-images: uploade
maj: 2026-06-01
---
# RRD SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **33 produits** importés ✅ 2026-06-01 — 109 variants
- Slug exact : `rrd`
- CSV : `docs/imports/import-rrd-ss26.csv` — prix réels depuis scan étiquettes
- Catégories : polo mc · bermuda · pantalon · veste (blaser) · coupe vent (blouson) · chemise · casquette

## Prix (depuis scan étiquettes)

| Catégorie | Prix |
|-----------|------|
| Polo mc (S26213, S26222) | 165€ |
| Chemise (S26271) | 185€ |
| Pantalon Surflex Chino (S26300) | 209€ |
| Short (S26321, S26325) | 215€ |
| Short Cargo (S26323) | 225€ |
| Pantalon Terzilight (S26315, S26322) | 245€ |
| Pantalon (S26335) | 255€ |
| Blouson (S26017) | 455€ |
| Blazer (S26051, S26056) | 549€ |
| Casquette (S26450) | à confirmer |

## Images

- Pipeline : **flat lay garment** — batch 1 (gris) → batch 2 (fond blanc) → batch 3 (ombres)
- Output : `output_batch_rrd/` — **27/33 uploadés** ✅ 2026-06-01
- 6 refs non publiées (photos manquantes) : `S26213/60` · `S26322/26` · `S26450/10` · `S26450/27` · `S26450/60` · `S26450/85`

## Plan

- [x] Récupérer les infos produits (feuilles PDF RRD1–3) ✅ 19/05
- [x] Créer le CSV ✅
- [x] Shooting photos ✅ 27/35 refs complètes
- [x] Scan étiquettes → prix réels dans CSV ✅ 2026-05-31
- [x] Importer en BDD ✅ 2026-06-01 (33 produits, 109 variants)
- [x] Pipeline IA (batch 1 → batch 2 → batch 3) ✅
- [x] Retouche Photoshop ✅
- [x] Upload Cloudinary ✅ 2026-06-01 — 27/33 publiés
- [x] Valider affichage sur le site ✅
- [ ] Photos manquantes : S26213/60 · S26322/26 · casquettes S26450 (4 coloris)
- [ ] Prix casquettes S26450 à confirmer

→ [[Architecture/workflow-collection]]
