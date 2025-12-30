# Scripts Images Produits

Scripts pour optimiser et uploader les images produits.

## 📦 Prérequis

```bash
# Installer sharp pour l'optimisation (optionnel, seulement pour optimize-images.ts)
npm install sharp
npm install --save-dev @types/sharp
```

**Note** : Le script `optimize-images.ts` nécessite `sharp`. Le cron job d'optimisation automatique n'en a pas besoin (utilise Cloudinary directement).

## 🚀 Scripts Disponibles

### 1. Optimisation d'Images

**Script** : `optimize-images.ts`

Optimise les images produits (compression, redimensionnement, conversion WebP).

```bash
# Optimiser un dossier d'images
ts-node scripts/optimize-images.ts ./images

# Avec options
ts-node scripts/optimize-images.ts ./images --output ./optimized --quality 90

# Sans génération WebP
ts-node scripts/optimize-images.ts ./images --no-webp
```

**Options** :
- `--output <dossier>` : Dossier de sortie (défaut: `<dossier>_optimized`)
- `--quality <1-100>` : Qualité JPEG/PNG (défaut: 85)
- `--max-size <KB>` : Taille cible en KB (défaut: 300)
- `--no-webp` : Ne pas générer de fichiers WebP

**Standards appliqués** :
- Résolution max : 2048x2048px
- Poids cible : 200-300KB
- Qualité : 85% (configurable)

### 2. Batch Upload Images

**Script** : `batch-upload-images.ts`

Upload multiple images vers Cloudinary avec association automatique aux produits par SKU.

```bash
# Upload avec association automatique
ts-node scripts/batch-upload-images.ts ./images --collection SS2025

# Simulation (dry-run)
ts-node scripts/batch-upload-images.ts ./images --collection SS2025 --dry-run
```

**Convention nommage requise** :
- Format : `[SKU]_[numero]_[type].jpg`
- Exemple : `REB001_1_main.jpg`

**Options** :
- `--collection <nom>` : Nom de la collection (ex: SS2025)
- `--dry-run` : Simulation sans upload réel

**Fonctionnalités** :
- Association automatique par SKU
- Organisation Cloudinary : `products/[collection]/[sku]/`
- Validation avant upload
- Rapport détaillé

## 📝 Convention Nommage

### Format

```
[SKU]_[numero]_[type].[ext]
```

### Exemples

- `REB001_1_main.jpg` → Image principale produit REB001
- `REB001_2_detail.jpg` → Image détail produit REB001
- `REB001_3_back.jpg` → Image dos produit REB001

### Types d'Images

- `main` : Image principale (vue de face)
- `back` : Image dos
- `detail` : Image détail (matière, logo)
- `context` : Image contexte (porté)
- `alt` : Image alternative (angle différent)

## 🔄 Workflow Recommandé

1. **Shooting** → Images brutes
2. **Retouche Photoshop** → Export JPG/PNG
3. **Optimisation** :
   ```bash
   ts-node scripts/optimize-images.ts ./retouched --output ./optimized
   ```
4. **Upload** :
   ```bash
   ts-node scripts/batch-upload-images.ts ./optimized --collection SS2025
   ```

## ⚠️ Notes

- Les scripts nécessitent les variables d'environnement Cloudinary et DB
- Le script batch-upload nécessite que les produits existent déjà en base
- L'association automatique fonctionne par SKU (dans le nom de fichier)

