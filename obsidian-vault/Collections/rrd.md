---
type: collection
marque: RRD
slug-bdd: rrd
saison: SS26
statut-data: csv-pret
statut-images: shooting-en-cours
maj: 2026-05-21
---
# RRD SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- CSV : `docs/imports/import-rrd-ss26.csv` — **110 variants** (~33 refs boutique ; V70/V71 chemise retirés)
- Slug exact : `rrd`
- Statut : **CSV prêt — import en attente**
- Feuille stock : iCloud `feuille de stockage/RRD/RRD1.pdf` … `RRD3.pdf`

### Feuille stock

Comme [[Collections/hologram#Feuille stock]] — on ne reprend **pas** le prix feuille (`Px Achat`).

| Colonne feuille | Exemple | Notre champ |
|-----------------|---------|-------------|
| Cod Article | `5 029 01862` | `cod_article` |
| Référence | `S26213/10 48` | `sku` / `reference` |
| Stock | `2` | `stock` |
| Px Achat | `60,00` | — *(prix vente = scan étiquettes)* |

**Prix boutique** : tableau ci-dessous à remplir au scan (comme Hologram) — CSV import avec `price: 100` placeholder en attendant.

### Cod article / refs

Même `cod_article` sur plusieurs lignes = normal côté ERP (réassort → nouvelle ref, même article). L’import upsert par **SKU** (`reference` complète) — pas bloquant pour nous.

## Produits SS26 (prix à compléter au scan)

| Ref base | Genre | Couleur (code) | Prix vente |
|----------|-------|----------------|------------|
| *à remplir après scan étiquettes* | | | |

## Images

- Type : **flat lay** (vêtements — polos, chemises, pantalons, blazers, casquettes)
- Photos iCloud : `Collection reboulstore /RRD/` — **35 dossiers** (1 par ref base, `/` → `:` ex. `S26213:10`)
- Par ref : `face.jpeg` + `back.jpeg` + `Document scanné.pdf` (étiquette)
- Pipeline : **garment** (flat lay) — Image UI marque **RRD** · `tools/image-ui/brand_configs.json`
- **Shooting** (maj 21/05) : **27/35** dossiers complets · **~32/35** effectif (exceptions) — session shoot terminée, **5** refs à finir

### Shooting — faites ✅ (27)

`S26017:61` · `S26051:20` · `S26056:13` · `S26056:60` · `S26213:10` · `S26213:20` · `S26222:43` · `S26222:61` · `S26222:64` · `S26271:V72` *(photos ex-V71)* · `S26300:10` · `S26300:20` · `S26300:60` · `S26315:20` · `S26315:84M` · `S26321:20` · `S26321:84` · `S26322:20` · `S26322:60` · `S26322:84` · `S26322:85` · `S26323:26` · `S26323:85` · `S26325:43` · `S26325:64` · `S26335:13` · `S26335:60` · `S26271:V72`

### Shooting — exceptions (pas de re-shoot)

| Ref | Décision |
|-----|----------|
| `S26213:60` | Polo **pas là** — on laisse (pas de photos) |
| `S26271:V70` · `S26271:V71` | **Retirés du CSV** — même chemise que V72, une seule fiche boutique |
| `S26271:V72` | **Seule ref chemise** en ligne · photos copiées depuis `S26271:V71` |

### Shooting — restantes à faire (5)

`S26322:26` · `S26450:10` · `S26450:27` · `S26450:60` · `S26450:85` *(casquettes)*

## Plan

- [x] Récupérer les infos produits (feuilles PDF RRD1–3) ✅ 19/05
- [x] Créer le CSV ✅ format Hologram (`color`, `sku`) — prix feuille ignorés, `100` placeholder
- [x] Créer dossiers shooting iCloud ✅ 19/05 (`RRD/` — 35 refs)
- [x] Ajout de la marque dans le pipeline IA ✅ 19/05 (`brand_configs.json` → `output_batch_rrd`)
- [x] Shooting photos (session) ✅ 27/35 — 8 refs à finir plus tard
- [x] Scan étiquettes (27 dossiers) → prix vente dans CSV + tableau « Produits SS26 » ✅ 2026-05-21
- [ ] Importer en BDD (`./rcli import apply-csv` ou Admin)
- [ ] Pipeline IA (possible sur les 27 refs complètes avant les 8 manquantes)
- [ ] Retouche Photoshop
- [ ] Upload Cloudinary

→ [[Architecture/workflow-collection]]
