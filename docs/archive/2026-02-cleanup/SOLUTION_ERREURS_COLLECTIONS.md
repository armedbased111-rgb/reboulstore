# ✅ Solution : Erreurs Collections et Cron Job

## 🔍 Problèmes identifiés

### 1. Table `collections` manquante
**Erreur** : `relation "collections" does not exist`

**Cause** : La migration `AddCollections1767024676000` n'a pas été exécutée en production.

**Impact** :
- Toutes les requêtes vers `/collections` échouent
- Les produits ne peuvent pas être associés à une collection
- Erreurs répétées dans les logs PostgreSQL

### 2. Colonne `collectionId` manquante dans `products`
**Erreur** : `column ...collectionId does not exist`

**Cause** : Même migration non exécutée.

**Impact** :
- Les requêtes qui chargent les produits avec leur collection échouent
- Erreurs lors de la récupération du panier (qui charge les produits avec collection)
- Erreurs 500 sur `/api/products`, `/api/cart`

### 3. Cron job avec nom de table incorrect
**Erreur** : `relation "cart" does not exist`

**Cause** : Le cron job utilise `cart` au lieu de `carts` (la table s'appelle `carts` avec un 's').

**Impact** :
- Le nettoyage automatique des paniers anciens échoue chaque jour à 5h
- Erreur dans les logs PostgreSQL quotidiennement

---

## ✅ Solutions

### Solution 1 : Exécuter la migration Collections

**Migration à exécuter** : `1767024676000-AddCollections.ts`

**Ce qu'elle fait** :
1. Crée la table `collections`
2. Ajoute la colonne `collectionId` dans `products`
3. Crée une collection par défaut "current" et l'active
4. Assigne tous les produits existants à cette collection

**Commandes** :

```bash
# Option 1 : Via SSH direct
ssh deploy@152.228.218.35 << 'EOF'
cd /opt/reboulstore
docker exec reboulstore-backend-prod npm run migration:run
EOF

# Option 2 : Via CLI (si commande disponible)
./rcli db migrate --server
```

**Vérification après exécution** :
```bash
# Vérifier que la table collections existe
ssh deploy@152.228.218.35 "docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"SELECT table_name FROM information_schema.tables WHERE table_name = 'collections';\""

# Vérifier que la colonne collectionId existe
ssh deploy@152.228.218.35 "docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"SELECT column_name FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'collectionId';\""

# Vérifier que la collection par défaut existe
ssh deploy@152.228.218.35 "docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"SELECT * FROM collections;\""
```

---

### Solution 2 : Corriger le cron job

**Problème** : Le cron job utilise `cart` au lieu de `carts`

**Commande actuelle (incorrecte)** :
```bash
DELETE FROM cart WHERE "createdAt" < NOW() - INTERVAL '30 days' ...
```

**Commande corrigée** :
```bash
DELETE FROM carts WHERE "createdAt" < NOW() - INTERVAL '30 days' ...
```

**Correction** :

```bash
# 1. Éditer le cron job
ssh deploy@152.228.218.35 "crontab -e"

# 2. Remplacer la ligne :
# AVANT : 0 5 * * * docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c "DELETE FROM cart WHERE ...
# APRÈS : 0 5 * * * docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c "DELETE FROM carts WHERE ...

# 3. Vérifier
ssh deploy@152.228.218.35 "crontab -l | grep cart"
```

**Ou via script** :
```bash
ssh deploy@152.228.218.35 << 'EOF'
# Sauvegarder le crontab actuel
crontab -l > /tmp/crontab_backup.txt

# Remplacer cart par carts
crontab -l | sed 's/DELETE FROM cart/DELETE FROM carts/g' | crontab -

# Vérifier
crontab -l | grep cart
EOF
```

---

## 🚀 Plan d'action complet

### Étape 1 : Backup de la base de données
```bash
./rcli db backup --server
```

### Étape 2 : Exécuter la migration Collections
```bash
ssh deploy@152.228.218.35 << 'EOF'
cd /opt/reboulstore
docker exec reboulstore-backend-prod npm run migration:run
EOF
```

### Étape 3 : Vérifier la migration
```bash
# Vérifier table collections
ssh deploy@152.228.218.35 "docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"\\dt collections\""

# Vérifier colonne collectionId
ssh deploy@152.228.218.35 "docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c \"\\d products\" | grep collectionId"
```

### Étape 4 : Corriger le cron job
```bash
ssh deploy@152.228.218.35 << 'EOF'
# Sauvegarder
crontab -l > /tmp/crontab_backup_$(date +%Y%m%d_%H%M%S).txt

# Corriger
crontab -l | sed 's/DELETE FROM cart/DELETE FROM carts/g' | crontab -

# Vérifier
echo "✅ Cron job corrigé :"
crontab -l | grep cart
EOF
```

### Étape 5 : Vérifier que tout fonctionne
```bash
# Vérifier les logs (plus d'erreurs collections)
./rcli logs errors --last 5m

# Tester une requête API
curl -s https://www.reboulstore.com/api/collections/active | head -20

# Vérifier les produits
curl -s https://www.reboulstore.com/api/products?limit=1 | head -20
```

---

## 📝 Notes importantes

### Migration Collections

**Fichier** : `backend/src/migrations/1767024676000-AddCollections.ts`

**Ce qu'elle crée** :
- Table `collections` avec colonnes : id, name, displayName, isActive, description, createdAt, updatedAt
- Colonne `collectionId` (nullable) dans `products`
- Foreign key `FK_products_collection`
- Collection par défaut "current" (active)
- Tous les produits existants assignés à cette collection

**Sécurité** :
- La colonne `collectionId` est nullable (pas de problème si migration échoue partiellement)
- Foreign key avec `ON DELETE SET NULL` (pas de cascade destructive)

### Cron job

**Fréquence** : Quotidien à 5h du matin

**Action** : Supprime les paniers de plus de 30 jours qui ne sont pas associés à une commande

**Table correcte** : `carts` (avec 's')

---

## ✅ Après correction

**Résultats attendus** :
- ✅ Plus d'erreurs `relation "collections" does not exist`
- ✅ Plus d'erreurs `column ...collectionId does not exist`
- ✅ Plus d'erreurs `relation "cart" does not exist` dans les logs
- ✅ Les endpoints `/api/collections` fonctionnent
- ✅ Les endpoints `/api/products` fonctionnent (plus d'erreurs 500)
- ✅ Le panier fonctionne correctement
- ✅ Le cron job nettoie les paniers anciens sans erreur

---

**Date** : 31 décembre 2025  
**Statut** : ⚠️ À corriger

