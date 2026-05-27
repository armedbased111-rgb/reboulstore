---
type: session
date: 2026-05-27
statut: termine
---
# Session 2026-05-27 — Bisous + is_published + Logos marques

Liens : [[Collections/bisous]] · [[Collections/hologram]] · [[Architecture/pipeline-images]] · [[Backend/products]]

## Hologram

- Upload 8/8 refs ✅ — is_published=true automatique
- Fix critique : ordre FACE/BACK inversé (BACK.png < FACE.png alphabétiquement) → corrigé dans CLI (tri face→back→reste)

## is_published — gate catalogue

- Nouveau champ `products.is_published` (existait déjà, DEFAULT changé → false)
- `findAll` + `findByCategory` filtrent `isPublished: true` — produits sans images invisibles sur le front
- `PATCH /products/:id/publish` — endpoint toggle visibilité
- Upload CLI auto-set `is_published = true` après upload réussi
- **136 produits** mis en `false` (0 images) via SQL UPDATE
- 169 produits publiés (avec images)

## Fix catalogue frontend

- `useProducts` : accepte `null` comme signal skip (pas de requête pendant résolution slug)
- Supprime le flash de tous les produits quand on navigue vers une marque

## Logos marques

- 6 marques sans logo ajoutées : Hologram · Carhartt · Saucony · Birkenstock · Nomad Society · White Sand
- Trim automatique PIL sur 59 logos (suppression whitespace → logos visuellement uniformes)
- Re-upload Cloudinary + UPDATE BDD

## Image UI — ref_status.py

- Back optionnel : seule la face est requise pour `needs_upload`
- Chaussettes/accessoires avec 1 seule image ne bloquent plus en `needs_generation`

## Bisous Skateboards

- Ordre face/back vérifié ✅ — 24 refs prêtes à uploader
- SS26-30 (jaune) exclu — photos manquantes
- Upload en attente confirmation

## Suite

- [ ] Bisous : lancer upload 24 refs
- [ ] Bisous : photographier SS26-30 (coloris jaune)
- [ ] Hologram : wipe + reupload via Image UI (fix ordre face/back ancien upload)
- [ ] Déployer backend (is_published filter + PATCH publish endpoint)
- [ ] Collections : Stone Island / Arte / Autry
