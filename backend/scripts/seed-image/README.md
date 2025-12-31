# Upload d'image pour le seed

## Instructions

1. **Placez votre image** dans ce dossier avec le nom `product-image.jpg`
   - Formats acceptés: jpg, jpeg, png, gif, webp
   - Taille max: 10MB

2. **Exécutez le script d'upload**:
   ```bash
   npm run upload-seed-image
   ```

3. **L'image sera uploadée sur Cloudinary** et l'URL sera sauvegardée dans `seed-image-url.txt`

4. **Exécutez le seed** pour créer les produits avec cette image:
   ```bash
   npm run seed:ts
   ```

## Note

- L'image sera utilisée pour **tous les produits** créés par le seed
- Un seul produit sera créé par marque
- L'image doit avoir un format adapté pour les produits (ratio 4:5 recommandé)

