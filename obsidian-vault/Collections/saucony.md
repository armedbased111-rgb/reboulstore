---
type: collection
marque: Saucony
slug-bdd: saucony
saison: SS26
statut-data: importe
statut-images: generees
maj: 2026-05-21
---
# Saucony SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **8 références** en BDD ✅ (dont **S70704-30** Progrid Triumph 4, produit #459)
- Slug exact : `saucony`
- CSV : `docs/imports/import-saucony-ss26.csv` — **157 variants** (8 refs après ajout)

### Nouvelle ref (21/05) — Progrid Triumph 4

| Champ | Valeur |
|-------|--------|
| Ref base | **`S70704-30`** *(iCloud `S70704-30`)* — Mist / lapis |
| Couleur | Mist / lapis |
| Prix | **185** € |
| Tailles | 40.5 → 46.5 (10 pointures, stock 1) |
| `cod_article` | `5 009 54937` → `54946` (+1 par taille, 40.5→46.5) |

**Refs (8)** : `GUIDE7WHI/MUL` · `OMNI9BEI/SIL` · `OMNI9BLA/TOR` · `OMNI9WHI/PUR` · `OMNI9WHI/MUL` · `OMNI9/BLACK` · `OMNI9/BLU/BRU` · **`S70704-30`** (Progrid Triumph 4)

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- Output : `output_batch_saucony/` — **7/7 refs** avec 1_face + 4_top ✅ — **`S70704-30`** à générer
- iCloud : `S70704-30/` — photos shoe à déposer

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (7 refs) ✅
- [x] CSV — ajout Progrid Triumph 4 (`S70704-30`, 10 tailles) ✅ 21/05
- [x] Importer la 8ᵉ ref en BDD (`S70704-30`, 10 tailles) ✅ — couleur `Mist/lapis` en BDD
- [ ] Photos + pipeline shoe sur `S70704-30`
- [x] Générer images IA (7/7 — 1_face + 4_top) ✅
- [ ] Vérifier qualité + trier
- [ ] Uploader vers Cloudinary (`./rcli images upload-batch --batch output_batch_saucony`)
- [ ] Valider affichage sur le site
