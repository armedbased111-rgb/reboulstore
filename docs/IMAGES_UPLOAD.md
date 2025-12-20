# 📸 Guide Upload Images – ReboulStore (Backend + Cloudinary)

Ce document explique **simplement** comment fonctionne l’upload d’images produits dans ReboulStore.  
Il est pensé pour des **webdesigners, admins, marketeurs**, pas seulement pour des développeurs.

---

## 🧠 Vue générale

- Les images produits sont **hébergées sur Cloudinary** (service spécialisé pour les images).
- Quand tu envoies une image :
  - le backend la reçoit,
  - l’envoie à Cloudinary,
  - enregistre dans la base de données :
    - l’**URL de l’image optimisée**,
    - un identifiant technique (`publicId`) pour pouvoir la supprimer,
    - un **texte alternatif** (`alt`),
    - un **ordre d’affichage** (`order`).
- Cloudinary **optimise automatiquement** les images :
  - compression (`quality: auto`),
  - choix d’un **format moderne** si possible (`format: auto`, ex : WebP).

Tu n’as **rien à configurer dans Cloudinary** côté design : tout est géré par le backend.

---

## 1️⃣ Upload simple – une image à la fois

### 1.1. À quoi ça sert ?

- Ajouter une **image de produit** (photo principale, zoom, vue alternative).
- Utile quand tu veux **ajouter ou remplacer** une seule image.

### 1.2. Comment ça marche (concept)

- Endpoint backend : `POST /products/:id/images`
  - `:id` = ID du produit concerné.
- Type de requête : `multipart/form-data` (formulaire avec fichier).

En pratique, dans l’admin, ce sera :
- un bouton **“Ajouter une image”**,
- un champ **fichier** (image),
- un champ **texte alternatif**,
- éventuellement un champ pour l’**ordre**.

### 1.3. Champs à remplir

- **`file`** (obligatoire)
  - L’image à envoyer.
  - Formats acceptés : **JPG, JPEG, PNG, GIF, WebP**.
  - Taille maximale : **10 Mo** (5 Mo auparavant, mais 10 Mo max technique).

- **`alt`** (fortement recommandé)
  - Texte alternatif pour :
    - l’accessibilité (lecteurs d’écran),
    - le SEO,
    - l’affichage si l’image ne se charge pas.
  - Exemples :
    - `Basket montante noire Reboul – vue de profil`
    - `Pull en laine gris Reboul – détail col`

- **`order`** (optionnel)
  - Nombre entier : `0, 1, 2, 3, …`
  - Définit l’**ordre d’affichage** des images pour le produit :
    - `0` = première image,
    - `1` = deuxième, etc.
  - Si tu ne précises rien :
    - le système met l’image **à la suite** (après la dernière image existante).

### 1.4. Ce que fait le système

1. Vérifie qu’un fichier est bien présent → sinon erreur “File is required”.
2. Vérifie que le fichier est bien une image (format autorisé).
3. Vérifie que la taille est dans les limites.
4. Envoie l’image à **Cloudinary** :
   - compression automatique,
   - format moderne si possible (WebP/AVIF).
5. Sauvegarde dans la base :
   - `url` (URL sécurisée Cloudinary),
   - `publicId` (identifiant Cloudinary),
   - `alt` (texte alternatif),
   - `order` (ordre d’affichage).

Résultat : ta nouvelle image sera disponible et optimisée pour l’affichage sur le site.

---

## 2️⃣ Suppression d’une image

### 2.1. À quoi ça sert ?

- Enlever une image qui n’est plus pertinente :
  - ancienne collection,
  - photo de mauvaise qualité,
  - doublon.

### 2.2. Comment ça marche (concept)

- Endpoint backend : `DELETE /products/:productId/images/:imageId`
  - `productId` = ID du produit,
  - `imageId` = ID de l’image à supprimer.

Dans l’admin, ça sera typiquement :
- une **liste de miniatures (thumbnails)** pour le produit,
- à côté de chaque image, un bouton **“Supprimer”**.

### 2.3. Ce que fait le système

1. Vérifie que l’image existe → sinon erreur “Image not found”.
2. Si un `publicId` est enregistré :
   - supprime l’image correspondante chez **Cloudinary**.
3. Supprime ensuite l’enregistrement en base de données.

Résultat : l’image disparaît **du site** et **de Cloudinary** (pas de fichiers “fantômes”).

---

## 3️⃣ Optimisation automatique & miniatures

### 3.1. Optimisation automatique

Pour **toutes** les images uploadées :

- Cloudinary applique automatiquement :
  - `quality: auto` → **compression intelligente**,
  - `format: auto` → convertit en **format moderne** (ex : WebP) quand le navigateur le supporte.
- Avantages :
  - pages plus rapides,
  - images plus légères,
  - qualité visuelle conservée.

Tu peux donc continuer à uploader des **images de bonne qualité**, le système se charge de l’optimisation.

### 3.2. Thumbnails (petites / moyennes / grandes images)

À partir du `publicId` d’une image, le backend sait générer plusieurs tailles standard :

- **Small** : `200x200`
  - Pour les listes, galeries, vignettes.
- **Medium** : `400x400`
  - Pour les cartes produit ou les aperçus.
- **Large** : `1200x1200`
  - Pour les pages produits, grandes images, zooms légers.

Chaque taille :
- est recadrée automatiquement pour **remplir** le cadre (`crop: fill`),
- est centrée automatiquement sur le sujet (`gravity: auto`),
- est optimisée (qualité + format).

Ces différentes tailles pourront être utilisées :
- soit par le backend (qui renverra plusieurs URLs),
- soit directement dans le frontend selon les besoins.

---

## 4️⃣ Upload multiple – plusieurs images en une fois

### 4.1. À quoi ça sert ?

- Gagner du temps quand tu as **plusieurs photos pour un même produit** :
  - vue de face / profil / dos,
  - détails (matière, logo, semelle),
  - variantes visuelles.
- Éviter de devoir uploader chaque image **une par une**.

### 4.2. Comment ça marche (concept)

- Endpoint backend : `POST /products/:id/images/bulk`
  - `:id` = ID du produit.
- Type de requête : `multipart/form-data`.

Dans l’admin, ce sera :
- un **zone de drag & drop** ou un champ fichier avec **sélection multiple**,
- une interface qui permet de :
  - voir toutes les miniatures,
  - saisir les textes alternatifs,
  - éventuellement ajuster l’ordre.

### 4.3. Règles importantes

- **Nombre maximum d’images par requête** : **7**
  - Si tu en envoies plus → erreur “You can upload up to 7 images at once”.

- **Formats acceptés** :
  - jpg, jpeg, png, webp (gif possible mais à éviter pour les photos de produits).

- **Taille maximale** :
  - **10 Mo par image**.
  - Si une image est trop lourde → erreur indiquant le nom du fichier concerné.

- **Ordre automatique** :
  - Le système regarde la **dernière image existante** du produit (ex : `order = 2`).
  - Pour chaque nouvelle image :
    - si tu as fourni un `order` → il sera utilisé,
    - sinon → le système continue la séquence : `3, 4, 5, …`.

Résultat : même si tu ne t’occupes pas de l’ordre, les nouvelles images se positionnent à la suite de celles déjà présentes.

---

## 5️⃣ Ce que doivent retenir les non-dev

Pour les **webdesigners / admins** :

- Toujours :
  - uploader des images **propres et assez grandes** (maximum 10 Mo),
  - remplir le **texte alternatif** avec une vraie description,
  - vérifier l’**ordre d’affichage** quand c’est important.

- Tu peux :
  - utiliser l’**upload simple** si tu ajoutes une seule image,
  - utiliser l’**upload multiple** pour envoyer une série de photos produit d’un coup (max 7).

- Tu n’as pas besoin de :
  - gérer la compression,
  - choisir les formats (JPG/WebP),
  - gérer manuellement les différentes tailles (thumbnails).

Tout cela est géré 🌐 automatiquement par Cloudinary + le backend ReboulStore.

---

## 6️⃣ Notes pour développeurs (résumé très rapide)

- Upload simple :
  - `POST /products/:id/images`
  - `FileInterceptor('file', multerConfig)`
  - Service : `createImage(productId, file, dto)`.

- Upload multiple :
  - `POST /products/:id/images/bulk`
  - `FilesInterceptor('files', 7, multerConfig)`
  - Service : `createImagesBulk(productId, files, dtos)`.

- Suppression :
  - `DELETE /products/:productId/images/:imageId`
  - Supprime de Cloudinary si `publicId` défini, puis de la BDD.

- Optimisation :
  - Cloudinary `upload_stream` avec `quality: 'auto'`, `fetch_format: 'auto'`.
  - Méthode utilitaire pour générer des thumbnails 200 / 400 / 1200.

> ⚠️ Quand nous ferons évoluer la gestion des images (nouveaux formats, nouvelles tailles, admin, etc.), **ce fichier devra être mis à jour à la fin de la phase concernée**.


