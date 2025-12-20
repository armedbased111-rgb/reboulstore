# Script de test E2E - Uploads Cloudinary

Ce script teste automatiquement toutes les fonctionnalités d'upload Cloudinary dans l'admin centrale.

## Prérequis

1. Les services doivent être démarrés :
   ```bash
   docker compose -f admin-central/docker-compose.yml up -d
   ```

2. Le frontend doit être accessible sur `http://localhost:4000`
3. Le backend doit être accessible sur `http://localhost:4001`
4. **Cloudinary doit être configuré** dans `.env` du backend :
   ```env
   CLOUDINARY_CLOUD_NAME=votre_cloud_name
   CLOUDINARY_API_KEY=votre_api_key
   CLOUDINARY_API_SECRET=votre_api_secret
   ```
5. Le dossier `frontend/public/webdesign` doit contenir des fichiers images/vidéos

## Utilisation

```bash
cd admin-central/frontend
npm run test:e2e:uploads
```

## Ce que fait le script

1. **Recherche des fichiers**
   - Scanne le dossier `frontend/public/webdesign` pour trouver images et vidéos
   - Recherche aussi dans les sous-dossiers (ex: `brandImage/`)

2. **Test création catégorie avec uploads**
   - Crée une catégorie avec upload d'image hero
   - Crée une catégorie avec upload de vidéo hero
   - Crée une catégorie avec image ET vidéo hero

3. **Test création marque avec uploads**
   - Crée une marque avec upload de logo
   - Crée une marque avec uploads mega menu (images + vidéos)
   - Teste tous les champs d'upload disponibles

4. **Test édition avec remplacement**
   - Édite une catégorie et remplace le fichier uploadé
   - Édite une marque et remplace les fichiers uploadés
   - Vérifie que le remplacement fonctionne correctement

## Fichiers supportés

### Images
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

### Vidéos
- `.mp4`, `.webm`, `.ogg`, `.mov`

## Fichiers de test utilisés

Le script utilise automatiquement les fichiers trouvés dans :
- `frontend/public/webdesign/` (racine)
- `frontend/public/webdesign/brandImage/` (sous-dossier)

## Résultats attendus

- ✅ Uploads d'images réussis
- ✅ Uploads de vidéos réussis
- ✅ Création de catégories avec médias
- ✅ Création de marques avec médias
- ✅ Remplacement de fichiers lors de l'édition
- ✅ URLs Cloudinary correctement sauvegardées

## Dépannage

Si les uploads échouent :
1. Vérifier que Cloudinary est configuré dans `.env`
2. Vérifier que les credentials Cloudinary sont valides
3. Vérifier que le backend est accessible
4. Vérifier que des fichiers existent dans `webdesign/`
