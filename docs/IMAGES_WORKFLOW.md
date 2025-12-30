# Workflow Images Produits - Reboul Store

**Version** : 1.0  
**Date** : Décembre 2024  
**Statut** : En cours de documentation

## 📋 Vue d'ensemble

Ce document décrit le workflow complet de création, traitement et upload des images produits pour le site Reboul Store.

### Objectifs

- Documenter le processus actuel de création d'images produits
- Définir les standards qualité et conventions de nommage
- Optimiser le workflow pour l'automatisation future
- Faciliter l'association automatique images → produits

---

## 🎬 Processus Actuel

### 1. Préparation Shooting

**Lieu** : Aubagne (stock)  
**Matériel** : Récupéré chez le patron

**Étapes** :
1. Récupération matériel de shooting (caméra, éclairage, fond, etc.)
2. Transport vers Aubagne
3. Setup matériel (éclairage, fond, positionnement)
4. Préparation produits (repassage, mise en forme si nécessaire)

### 2. Shooting Produits

**Quantité** : 3-5 images par produit

**Types d'images** :
- [ ] Image principale (vue de face)
- [ ] Image secondaire (vue de dos)
- [ ] Image détail (matière, logo, etc.)
- [ ] Image contexte (porté si applicable)
- [ ] Image supplémentaire (angle différent, détail spécifique)

**Standards shooting** :
- Résolution : À définir
- Format : À définir (RAW, JPG, etc.)
- Éclairage : À définir
- Fond : À définir (blanc, gris, etc.)

### 3. Retouche Photoshop

**Étapes** :
1. Import images depuis appareil photo
2. Sélection images à retoucher
3. Retouche Photoshop :
   - [ ] Correction couleur
   - [ ] Détourage (si nécessaire)
   - [ ] Ajustement luminosité/contraste
   - [ ] Nettoyage (poussière, défauts)
   - [ ] Recadrage
   - [ ] Redimensionnement (optionnel, on peut le faire automatiquement)
4. Export images finales

**Standards retouche** ✅ :
- **Format export** : JPG (qualité 85-90%) ou PNG si transparence
- **Résolution finale** : 2048x2048px (ou 2048x1536px) - **mais on peut aussi le faire automatiquement**
- **Poids cible** : 200-300KB (on optimisera si nécessaire)
- **Espace couleur** : sRGB

**Note** : Si tu exportes en plus haute résolution, on optimisera automatiquement lors de l'upload

### 4. Nommage Fichiers

**Convention actuelle** : À définir

**Objectif** : Permettre l'association automatique images → produits

**Exemples possibles** :
- `[SKU]_[numero]_[type].jpg` (ex: `REB001_1_main.jpg`)
- `[nom-produit]_[numero]_[type].jpg` (ex: `T-shirt-coton_1_main.jpg`)
- `[reference-as400]_[numero].jpg` (ex: `12345_1.jpg`)

**À définir** :
- [ ] Format exact du nommage
- [ ] Comment identifier le produit associé
- [ ] Comment identifier le type d'image (main, detail, etc.)
- [ ] Comment gérer les variants (couleur, taille)

### 5. Upload Cloudinary

**Méthode actuelle** : Manuel via Admin (interface upload)

**Organisation Cloudinary** ✅ :
- **Dossier principal** : `products/`
- **Structure** : `products/[collection]/[sku]/` (ex: `products/SS2025/REB001/`)
- **Nommage fichiers** : Conservé tel quel (ex: `REB001_1_main.jpg`)

**Étapes** :
1. Upload images sur Cloudinary (via Admin ou script batch)
2. Association images → produits :
   - **Automatique** : Par convention nommage (SKU dans le nom)
   - **Manuelle** : Via Admin si besoin
3. Définition ordre d'affichage (drag & drop dans Admin)
4. Vérification affichage sur site

**Optimisation automatique** :
- Compression JPG/PNG
- Conversion WebP (avec fallback)
- Génération thumbnails
- Redimensionnement si nécessaire

---

## 📐 Standards Qualité

### Formats Acceptés ✅

- **JPG** : Pour toutes les photos produits (recommandé)
- **PNG** : Pour images avec transparence (logos, etc.)

**Note** : Tu peux nous donner du JPG ou PNG, on s'occupe du reste (optimisation, conversion WebP si nécessaire)

### Résolution ✅

- **Recommandé** : **2048x2048px** (carré) ou **2048x1536px** (format 4:3)
- **Minimum** : 1920x1080px
- **Maximum** : 4000x4000px (on optimisera automatiquement)

**Pourquoi 2048px ?**
- Bon compromis qualité/poids
- Suffisant pour zoom sur site
- Performance optimale

### Poids ✅

- **Cible** : **200-300KB par image**
- **Maximum** : 500KB (on optimisera si plus lourd)
- **Minimum** : Pas de minimum (mais qualité suffisante)

**Note** : On optimisera automatiquement les images lors de l'upload pour atteindre ces objectifs

### Qualité JPG ✅

- **Qualité export Photoshop** : **85-90%** (bon compromis)
- **Espace couleur** : **sRGB** (standard web)
- **Profil ICC** : sRGB IEC61966-2.1 (standard)

### Optimisation Automatique

Lors de l'upload sur Cloudinary, on appliquera automatiquement :
- Compression optimale
- Conversion WebP (avec fallback JPG)
- Génération thumbnails (si nécessaire)
- Redimensionnement si trop grand

---

## 🔄 Workflow Optimisé ✅

### Automatisation Implémentée

1. ✅ **Batch Processing** :
   - Script traitement multiple images (`backend/scripts/optimize-images.ts`)
   - Compression automatique
   - Génération WebP
   - Validation qualité

2. ✅ **Upload Automatique** :
   - Script batch upload (dossier → Cloudinary) (`backend/scripts/batch-upload-images.ts`)
   - Association automatique par nommage SKU
   - Vérification qualité avant upload

3. ✅ **Interface Admin Améliorée** :
   - Upload multiple (drag & drop)
   - Prévisualisation avant upload
   - Réordonnancement (flèches haut/bas)

4. ✅ **Cron Job Optimisation Automatique** :
   - **Quotidien (3h)** : Optimise les nouvelles images (24h)
   - **Hebdomadaire (dimanche 4h)** : Optimise toutes les images non optimisées
   - Conversion automatique JPG/PNG → WebP
   - Mise à jour automatique des URLs en base

**Documentation** : Voir `docs/IMAGES_OPTIMIZATION_CRON.md`
   - Association automatique par SKU/nom

---

## 📝 Convention Nommage

### Format Adopté ✅

```
[SKU]_[numero]_[type].[ext]
```

**Exemples** :
- `REB001_1_main.jpg` → Image principale produit REB001
- `REB001_2_detail.jpg` → Image détail produit REB001
- `REB001_3_back.jpg` → Image dos produit REB001
- `REB001_4_context.jpg` → Image contexte produit REB001

### Règles

1. **SKU** : Code produit (ex: REB001, SNK123) - **OBLIGATOIRE**
2. **Numéro** : Numéro séquentiel (1, 2, 3, 4, 5) - **OBLIGATOIRE**
3. **Type** : Type d'image (optionnel mais recommandé)
4. **Extension** : `.jpg` ou `.png`

### Types d'Images (Optionnels)

- `main` : Image principale (vue de face) - **Recommandé pour la première image**
- `back` : Image dos
- `detail` : Image détail (matière, logo, etc.)
- `context` : Image contexte (porté)
- `alt` : Image alternative (angle différent)

**Note** : Si tu ne précises pas le type, utilise juste `[SKU]_[numero].jpg` (ex: `REB001_1.jpg`)

### Variants (Couleurs)

Pour les produits avec plusieurs couleurs, utilise le SKU du variant :
- `REB001-BLK_1_main.jpg` → Noir
- `REB001-WHT_1_main.jpg` → Blanc
- `REB001-RED_1_main.jpg` → Rouge

Ou utilise le SKU principal et l'ordre sera géré dans l'Admin.

### Exemples Complets

```
REB001_1_main.jpg      → Image principale
REB001_2_detail.jpg   → Détail matière
REB001_3_back.jpg     → Dos
REB001_4_context.jpg  → Porté
REB001_5_alt.jpg      → Angle alternatif
```

---

## ✅ Checklist Qualité

Avant upload, vérifier :

- [ ] Résolution correcte
- [ ] Poids acceptable
- [ ] Couleurs correctes (pas de dominante)
- [ ] Nettoyage fait (poussière, défauts)
- [ ] Recadrage correct
- [ ] Nommage conforme à la convention
- [ ] Association produit correcte

---

## 🚀 Prochaines Étapes

1. ✅ **Définir convention nommage** → `[SKU]_[numero]_[type].jpg`
2. ✅ **Valider standards qualité** → 2048px, 200-300KB, JPG/PNG
3. ✅ **Créer scripts d'optimisation** (compression, WebP) → `backend/scripts/optimize-images.ts`
4. ✅ **Créer script batch upload** (dossier → Cloudinary avec association auto) → `backend/scripts/batch-upload-images.ts`
5. ✅ **Améliorer interface Admin** (upload multiple, drag & drop) → `ProductImagesUpload.tsx`

**Documentation scripts** : Voir `backend/scripts/README_IMAGES.md`

---

## 📚 Ressources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [WebP Format](https://developers.google.com/speed/webp)

---

## 📝 Notes

- Workflow actuel : Manuel (shooting → retouche → upload)
- Objectif : Automatiser au maximum sans perdre en qualité
- Priorité : Définir convention nommage pour association automatique

