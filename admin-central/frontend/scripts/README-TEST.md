# Script de test E2E - Gestion des produits

Ce script teste automatiquement toutes les fonctionnalités de gestion des produits dans l'admin centrale.

## Prérequis

1. Les services doivent être démarrés :
   ```bash
   docker compose -f admin-central/docker-compose.yml up -d
   ```

2. Le frontend doit être accessible sur `http://localhost:4000`
3. Le backend doit être accessible sur `http://localhost:4001`

## Utilisation

```bash
cd admin-central/frontend
npm run test:e2e:products
```

## Ce que fait le script

1. **Vérification/Création utilisateur admin**
   - Crée un utilisateur admin de test si nécessaire (`admin@test.com` / `admin123456`)

2. **Création de 10 produits**
   - Navigue vers la page de création
   - Remplit le formulaire pour chaque produit
   - Soumet et vérifie la redirection

3. **Suppression de 2 produits**
   - Navigue vers la liste des produits
   - Trouve et supprime les 2 premiers produits créés
   - Confirme la suppression dans l'alerte

4. **Édition de 2 produits**
   - Navigue vers la liste des produits
   - Trouve et édite les 2 produits suivants
   - Modifie le nom, prix et description
   - Sauvegarde et vérifie la redirection

## Produits de test créés

1. T-shirt Premium Noir
2. Pantalon Cargo Beige
3. Sneakers White Low
4. Veste Bomber Noir
5. Jeans Slim Fit
6. Sweat à Capuche Gris
7. Short Cargo Vert
8. Baskets High Top
9. Polo Blanc
10. Chaussures Bébé

Les produits 1 et 2 seront supprimés.
Les produits 3 et 4 seront édités.
