---
type: collection
marque: Saucony
slug-bdd: saucony
saison: SS26
statut-data: importe
statut-images: uploade
maj: 2026-05-29
---
# Saucony SS26

Liens : [[Collections/Collections]]

---

## Données BDD

- **8 références** en BDD ✅ — **8/8 publiées** ✅
- Slug exact : `saucony`
- CSV : `docs/imports/import-saucony-ss26.csv` — 157 variants

### Refs (8)

| Ref | Statut |
|-----|--------|
| `GUIDE7WHI/MUL` | ✅ uploadé |
| `OMNI9BEI/SIL` | ✅ uploadé |
| `OMNI9/BLACK` | ✅ uploadé — OMNI9:BLACK à re-générer (photo sur boîte noire) |
| `OMNI9/BLU/BRU` | ✅ uploadé |
| `OMNI9BLA/TOR` | ✅ uploadé |
| `OMNI9WHI/PUR` | ✅ uploadé |
| `OMNI9WHI/MUL` | ✅ uploadé |
| `S70704-30` | ✅ uploadé (Progrid Triumph 4 — ajouté 21/05) |

## Images

- Pipeline : **shoe** (`--product-type shoe`)
- Output : `output_batch_saucony/` — **8/8 refs uploadées ✅ 2026-05-29**
- `OMNI9:BLACK` — 1_face à refaire via ADJUST (photo sur boîte noire, fond mal supprimé)

### Commande ADJUST OMNI9/BLACK

```bash
./rcli images adjust \
  --image "/Users/tripleseptinteractive/Library/Mobile Documents/com~apple~CloudDocs/Collection reboulstore /SAUCONY/OMNI9:BLACK/face.jpeg" \
  --prompt "Extract ONLY the sneaker shoe. The dark rectangular foam insert under the shoe is NOT part of the shoe — remove it completely. Remove all background (boxes, floor, cardboard, everything). Place centered in lateral side profile view on a plain solid #808080 medium grey background. Equal margins. Preserve all details pixel-perfectly." \
  -o "output_batch_saucony/OMNI9:BLACK/1_face.png" \
  --gemini-pro
```

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (7 refs) ✅
- [x] CSV — ajout Progrid Triumph 4 (`S70704-30`, 10 tailles) ✅ 21/05
- [x] Importer la 8ᵉ ref en BDD (`S70704-30`) ✅
- [x] Générer images IA (8/8 — 1_face + 4_top) ✅
- [x] Uploader 8/8 vers Cloudinary ✅ 2026-05-29
- [x] Valider affichage sur le site ✅ 2026-05-29
- [ ] OMNI9/BLACK : re-générer 1_face via ADJUST (boîte noire en fond)
