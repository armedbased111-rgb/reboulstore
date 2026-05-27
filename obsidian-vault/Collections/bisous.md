---
type: collection
marque: Bisous Skateboards
slug-bdd: bisous
saison: SS26
statut-data: importe
statut-images: uploade
maj: 2026-05-27
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
- Output : `output_batch_bisous/` — **24 refs** avec au moins face
- Retouche PS : ✅ toutes les refs prêtes (FACE.png + BACK.png ou FACE.png seul)
- Ordre upload vérifié ✅ 27/05 — FACE toujours en [0]
- **1 ref à photographier** : SS26-30 (jaune — photos manquantes)
- **SS26-24** : inclus ✅ (retouche terminée)
- Refs face-only (1 image) : SS26-85 · SS26-87 · SS26-88 · SS26-91 · SS26-92 · SS26-94
- **24 refs uploadées ✅ 27/05** — is_published=true · affichage validé sur le site
- SS26-30 (coloris jaune) exclu — photos manquantes

## Plan

- [x] Récupérer les infos produits
- [x] Créer le CSV
- [x] Importer via Admin Centrale (25 refs)
- [x] Générer images IA
- [x] Retouche PS — toutes refs prêtes ✅ 27/05
- [x] Vérifier ordre face/back ✅ 27/05
- [x] Uploader 24 refs vers Cloudinary (SS26-30 exclu — photos manquantes) ✅ 2026-05-27
- [ ] Photographier SS26-30 (coloris jaune)
- [x] Valider affichage sur le site ✅ 2026-05-27
