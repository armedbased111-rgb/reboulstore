# images-workflow

**Commande** : `/images-workflow`

Guide complet pour **gérer l'upload d'images produits** via Cloudinary dans Reboul Store.

---

## 📂 Fichiers impliqués

- `docs/IMAGES_UPLOAD.md` ⭐  
  → Documentation complète upload d'images (simple et multiple)

- `backend/src/modules/cloudinary/`  
  → Module et service Cloudinary

- `backend/src/modules/products/`  
  → Intégration Cloudinary dans ProductsService

- `backend/src/entities/image.entity.ts`  
  → Entité Image (url, publicId, alt, order)

---

## 🎯 Fonctionnalités disponibles

### Upload simple

- **Endpoint** : `POST /products/:id/images`
- **Type** : `multipart/form-data`
- **Champs** :
  - `file` (obligatoire) : Image (JPG, JPEG, PNG, GIF, WebP, max 5MB)
  - `alt` (optionnel) : Texte alternatif
  - `order` (optionnel) : Ordre d'affichage (0, 1, 2, ...)

### Upload multiple

- **Endpoint** : `POST /products/:id/images/bulk`
- **Type** : `multipart/form-data`
- **Champs** :
  - `files` (obligatoire) : Plusieurs images (max 7, max 10MB chacune)
  - `alts[]` (optionnel) : Liste de textes alternatifs
  - `orders[]` (optionnel) : Liste d'ordres

### Suppression

- **Endpoint** : `DELETE /products/:productId/images/:imageId`
- **Comportement** : Supprime l'image de Cloudinary + BDD

---

## 🔧 Configuration

### Variables d'environnement

```env
CLOUDINARY_CLOUD_NAME=ton_cloud_name
CLOUDINARY_API_KEY=ta_api_key
CLOUDINARY_API_SECRET=ton_api_secret
```

### Module Cloudinary

- **Service** : `CloudinaryService`
  - `uploadImage(file, options)` : Upload une image
  - `deleteImage(publicId)` : Supprimer une image
  - `getProductThumbnailUrls(publicId)` : Générer thumbnails (200x200, 400x400, 1200x1200)

---

## 🎨 Optimisation automatique

Chaque image uploadée est automatiquement :
- **Compressée** : Qualité auto (`quality: auto`)
- **Convertie** : Format moderne si possible (`fetch_format: auto`, ex: WebP)
- **Optimisée** : Cloudinary choisit le meilleur format selon le navigateur

---

## 📐 Thumbnails

Le service Cloudinary peut générer 3 tailles :
- **small** : 200x200 (vignettes, listes)
- **medium** : 400x400 (cartes produit)
- **large** : 1200x1200 (fiche produit, zoom)

Utilisation :
```typescript
const thumbnails = cloudinaryService.getProductThumbnailUrls(publicId);
// Retourne { small, medium, large }
```

---

## 🧪 Tests

### Script de test automatisé

```bash
cd backend
npx ts-node -r tsconfig-paths/register scripts/test-images-upload.ts \
  <PRODUCT_ID> \
  test-images/img1.jpg \
  test-images/img2.jpg \
  test-images/img3.png \
  test-images/img4.jpg \
  test-images/img5.png \
  test-images/img6.png \
  test-images/test.txt
```

Le script teste :
1. Upload simple
2. Suppression d'image
3. Upload multiple (3 images)
4. Upload multiple avec ordre auto
5. Erreur : trop de fichiers
6. Erreur : fichier non-image

---

## 📝 Documentation

### Pour les non-développeurs

Voir `docs/IMAGES_UPLOAD.md` pour :
- Guide simple d'utilisation
- Explications concrètes pour webdesigners/admins
- Ce qu'ils verront dans l'admin (futur)

### Pour les développeurs

- **Backend** : `backend/src/modules/cloudinary/cloudinary.service.ts`
- **Intégration** : `backend/src/modules/products/products.service.ts`
- **Entité** : `backend/src/entities/image.entity.ts`

---

## 🔗 Commandes associées

- `/backend-workflow` : Workflow backend complet
- `/implement-phase` : Implémenter une phase complète
- `/update-roadmap` : Mettre à jour la roadmap

---

## ⚠️ Règles importantes

1. **Max 7 images** par produit (upload multiple)
2. **Max 10MB** par image (upload multiple)
3. **Max 5MB** par image (upload simple)
4. **Formats acceptés** : JPG, JPEG, PNG, GIF, WebP
5. **Ordre automatique** : Si non fourni, calculé à partir de la dernière image

---

## 🐛 Dépannage

### Erreur "Only image files are allowed!"

- Vérifier le format du fichier (doit être JPG, PNG, WebP, GIF)
- Vérifier le mimetype

### Erreur "File size exceeds the maximum"

- Upload simple : Max 5MB
- Upload multiple : Max 10MB par image

### Erreur "You can upload up to 7 images at once"

- Réduire le nombre d'images dans la requête bulk

