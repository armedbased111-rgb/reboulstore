# 🧪 Guide de Test des Services API

Ce guide explique comment tester les services API métier du frontend.

## 🎯 Composant de test

Le composant `TestServices.tsx` permet de tester tous les services API créés en Phase 4.2.

## 🚀 Accès à la page de test

1. Assurez-vous que le backend et le frontend sont démarrés :
   ```bash
   docker-compose up backend frontend
   ```

2. Ouvrez votre navigateur à l'adresse :
   ```
   http://localhost:3000/test-services
   ```

## 📊 Services testés

### 1. Categories Service

- **getCategories** : Récupère toutes les catégories
- **getCategory (ID réel)** : Récupère une catégorie par son ID
- **getCategoryBySlug (réel)** : Récupère une catégorie par son slug

### 2. Products Service

- **getProducts** : Récupère tous les produits
- **getProducts (avec filtres)** : Récupère les produits avec pagination (page=1, limit=10)
- **getProduct (ID réel)** : Récupère un produit par son ID avec relations (catégorie, images, variantes)
- **getProductsByCategory (réel)** : Récupère les produits d'une catégorie

### 3. Cart Service

- **getCart** : Récupère ou crée un panier avec sessionId
- **addToCart (réel)** : Ajoute un article au panier avec un variantId réel
- **updateCartItem** : Met à jour la quantité d'un article (nécessite un itemId existant)
- **removeCartItem** : Retire un article du panier (nécessite un itemId existant)
- **clearCart** : Vide le panier

### 4. Orders Service

- **Flux Complet (Panier → Commande)** : Test du flux complet :
  1. Récupère/crée un panier
  2. Ajoute un article au panier
  3. Récupère le panier mis à jour
  4. Crée une commande avec les informations client

## 🔑 Données de test

Les tests utilisent de vraies données créées dans le backend :

- **Catégorie** : "Vêtements Adultes" (slug: `vetements-adultes`)
  - ID: `ed4dab6d-92f9-4a35-9dbb-3a7227bb8a1f`

- **Produit** : "T-shirt Premium"
  - ID: `4fe992c5-8df9-4c4a-b699-550cc2a1987e`
  - Prix: 29.99€
  - Description: "T-shirt de qualité premium en coton bio"

- **Variante** : Noir, Taille M
  - ID: `b8c000ad-327a-43bf-8a56-5601d9e1826c`
  - Stock: 50 unités
  - SKU: `TSHIRT-NOIR-M`

## ✅ Résultats attendus

### Tests réussis (✅)

Les tests suivants devraient réussir :
- `getCategories` : Retourne un array de catégories
- `getCategory (ID réel)` : Retourne la catégorie "Vêtements Adultes"
- `getCategoryBySlug (réel)` : Retourne la catégorie via son slug
- `getProducts` : Retourne un objet paginé avec les produits
- `getProduct (ID réel)` : Retourne le produit "T-shirt Premium" avec ses relations
- `getProductsByCategory (réel)` : Retourne les produits de la catégorie
- `getCart` : Crée ou récupère un panier
- `addToCart (réel)` : Ajoute le T-shirt au panier
- `clearCart` : Vide le panier
- `Flux Complet` : Crée une commande avec succès

### Tests attendus en erreur (❌)

Ces tests échouent avec des données fictives (c'est normal) :
- `updateCartItem` : Nécessite un itemId existant dans le panier
- `removeCartItem` : Nécessite un itemId existant dans le panier

## 🔧 Créer vos propres données

Pour créer d'autres données de test, utilisez curl :

### Créer une catégorie

```bash
curl -X POST http://localhost:3001/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Sneakers",
    "slug":"sneakers",
    "description":"Chaussures de sport"
  }'
```

### Créer un produit

```bash
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Nike Air Max",
    "description":"Sneakers confortables",
    "price":129.99,
    "categoryId":"<ID_CATEGORIE>"
  }'
```

### Créer une variante

```bash
curl -X POST http://localhost:3001/products/<ID_PRODUIT>/variants \
  -H "Content-Type: application/json" \
  -d '{
    "color":"Blanc",
    "size":"42",
    "stock":30,
    "sku":"NIKE-AIR-BLANC-42"
  }'
```

## 📝 Interpréter les résultats

### Zone de résultats

- **⏳ Chargement...** : Requête en cours
- **✅ Test réussi** : La requête a réussi, les données sont affichées en JSON
- **❌ Erreur** : La requête a échoué, le message d'erreur est affiché

### Console du navigateur

Tous les résultats sont également loggés dans la console :
- `✅ [Nom du test] réussi:` + données
- `❌ [Nom du test] échoué:` + erreur

## 🎓 Prochaines étapes

Après avoir validé les services, vous pouvez passer à :
- **Phase 4.3** : Custom Hooks (useProducts, useCart, etc.)
- **Phase 5** : Layout & Navigation
- **Phase 6** : Pages Catalogue & Produits

## 🐛 Debugging

Si un test échoue :

1. Vérifiez que le backend est démarré :
   ```bash
   docker-compose ps backend
   ```

2. Vérifiez les logs backend :
   ```bash
   docker-compose logs backend
   ```

3. Vérifiez que les données existent en base :
   ```bash
   curl http://localhost:3001/categories
   curl http://localhost:3001/products
   ```

4. Vérifiez la console du navigateur (F12) pour voir les détails des erreurs
