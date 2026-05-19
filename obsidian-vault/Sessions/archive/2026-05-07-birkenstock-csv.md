---
type: session
date: 2026-05-07
sujet: Birkenstock SS26 — scan étiquettes + import BDD
collections: [birkenstock]
---
# Session 2026-05-07 — Birkenstock CSV

Liens : [[REBOUL]]

---

## Ce qui a avancé

- Vault restructuré : 6 sections (Database/ ajouté), graph cohérent
- project-rules.mdc + CLAUDE.md vault mis à jour pour Cursor
- Audit Birkenstock : comparaison feuilles de stock iCloud vs CSV existant
- 41 étiquettes scannées → prix + couleurs renseignés dans le CSV
- 22 refs sans photos supprimées du CSV et de la BDD
- Import Admin Centrale effectué — 218 lignes, 34 refs

## Résultat ✅ IMPORT TERMINÉ

- 41 scans PDF traités un par un
- CSV nettoyé : 218 lignes (était 303)
- 22 refs supprimées (dossiers vides/absents/manquants dans iCloud)
- Anomalie détectée et corrigée : BOSTON/1030851 → BOSTON/1030861 (mauvais nom de dossier)
- BDD Birkenstock purgée puis réimportée proprement

## Refs importées — prix et couleurs

| Ref | Modèle | Couleur | Prix |
|-----|--------|---------|------|
| ARIZON/1009527 | Arizon | Mink | 130€ |
| ARIZON/1009921 | Arizon | Graceful Pearl White | 100€ |
| ARIZON/1011073 | Arizon | Cognac | 150€ |
| ARIZON/1016111 | Arizon | Gold | 90€ |
| ARIZON/1021476 | Arizon | High-Shine Black | 160€ |
| ARIZON/1023960 | Arizon | Copper | 90€ |
| ARIZON/1024950 | Arizon | Warm Sand | 120€ |
| ARIZON/1029260 | Arizon | Sandcastle | 120€ |
| ARIZON/1029353 | Arizon | High-Shine Black | 200€ |
| ARIZON/1029390 | Arizon | Taupe | 150€ |
| ARIZON/1029651 | Arizon Big Buckle EVA | Eggshell | 65€ |
| ARIZON/1030389 | Arizon Big Buckle EVA | Gray Taupe | 65€ |
| ARIZON/1030395 | Arizon | Tobacco Brown | 150€ |
| ARIZON/1030865 | Arizon | Dark Tea Tonal FB | 130€ |
| ARIZON/1031254 | Arizon | Pink Clay | 120€ |
| ARIZON/1031596 | Arizon | Faded Purple Tonal FB | 130€ |
| ARIZON/1031651 | Arizon | Pink Clay | 120€ |
| ARIZON/1032061 | Arizon | Faded Khaki | 120€ |
| ARIZONA/151183 | Arizona BS | Mocca | 100€ |
| ARIZONA/951303 | Arizona BS | Taupe | 130€ |
| ARIZONA/951313 | Arizona BS | Mocca | 130€ |
| BOSTON/1024714 | Boston BS | Thyme | 150€ |
| BOSTON/1025844 | Boston BS | Faded Khaki | 150€ |
| BOSTON/1030418 | Boston BS | Taupe | 180€ |
| BOSTON/1030861 | Boston BS | Dark Tea Tonal FB | 160€ |
| BOSTON/1030883 | Boston BS | Sandcastle | 150€ |
| BOSTON/1031577 | Boston BS | Faded Purple Tonal FB | 160€ |
| BOSTON/1031635 | Boston BS | Pink Clay | 150€ |
| BOSTON/660463 | Boston BS | Mocca | 160€ |
| BOSTON/660473 | Boston BS | Black | 160€ |
| FLORI/1029385 | Florida Fresh | High-Shine Black | 220€ |
| FLORI/1029818 | Florida BS | Graceful Pearl White | 100€ |
| FLORI/1030352 | Florida BS | Graceful Taupe | 100€ |
| FLORI/1031867 | Florida Fresh | Mink | 135€ |
| LOMA/1031652 | Loma | Charcoal | 150€ |
| MADRID/1006525 | Madrid Big Buckle | Cognac | 130€ |
| MADRID/1020632 | Madrid BS | Graceful Taupe | 90€ |
| MADRID/1022650 | Madrid Big Buckle | High-Shine Black | 140€ |
| MAYARI/1016408 | Mayari | Graceful Taupe | 100€ |
| MAYARI/71661 | Mayari | Graceful Pearl White | 100€ |
| NAPLES/1029710 | Naples Wrapped | Taupe | 160€ |

## Tâches

- [x] Comparer feuilles de stock iCloud vs CSV
- [x] Ajouter les 7 refs manquantes au CSV
- [x] Scanner les 41 étiquettes boîtes
- [x] Renseigner prix + couleurs dans le CSV
- [x] Supprimer les 22 refs sans photos (CSV + BDD)
- [x] Importer via Admin Centrale
- [x] Définir pipeline images → shoe (`--product-type shoe`, même pipeline Autry) ✅ 2026-05-07
- [ ] Lancer pipeline IA (`./rcli images generate-batch --product-type shoe`)
- [ ] Retouche Photoshop
- [ ] Upload Cloudinary

→ Workflow documenté : [[Architecture/workflow-collection]]
