# 🏗️ Architecture Multi-Shops - Analyse & Recommandation

**⚠️ NOTE IMPORTANTE** : Ce document décrit l'ancienne approche (Option A : Multi-Tenant).  
**✅ Architecture finale validée** : Voir [`ARCHITECTURE_ADMIN_CENTRAL.md`](./ARCHITECTURE_ADMIN_CENTRAL.md)

L'architecture finale choisie est : **3 projets Docker séparés + 1 Admin Centralisée** (connexions multiples TypeORM).

Ce document est conservé pour référence historique mais n'est plus la référence principale.

---

## 📊 Comparaison des Options (Ancienne Analyse)

### Option A : Multi-Tenant (Recommandée ✅)

**Architecture** : Une seule base de données, une seule API, entité `Shop` pour séparer les données

#### Structure Docker
```
docker-compose.yml
├── postgres (1 seule base)
├── backend (1 seul service)
└── frontend (1 seul service)
```

#### Structure Base de Données
```sql
shops
├── id, name, slug, isFranchise
products
├── id, name, price, categoryId, shopId ← Ajout shopId
categories
├── id, name, slug, shopId ← Ajout shopId
```

#### Avantages ✅
1. **Simplicité Docker** : 3 services seulement (postgres, backend, frontend)
2. **Coûts réduits** : 1 seule base de données, 1 seul serveur
3. **Maintenance facile** : Un seul codebase, une seule API
4. **Déploiement simple** : Un seul docker-compose.yml
5. **Partage de ressources** : Panier, commandes, utilisateurs partagés
6. **Migration facile** : Ajouter `shopId` aux entités existantes
7. **Performance** : Pas de duplication de code, cache partagé
8. **Évolutif** : Facile d'ajouter un 5ème shop plus tard

#### Inconvénients ❌
1. **Filtrage obligatoire** : Toujours filtrer par `shopId` dans les requêtes
2. **Risque de mélange** : Si oubli de filtre, risque de voir produits d'autres shops
3. **Isolation limitée** : Tous les shops partagent la même base

#### Implémentation
```typescript
// Entité Shop
@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 255 })
  name: string; // "Reboul Adult", "Reboul Kids", etc.
  
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string; // "reboul-adult", "reboul-kids", etc.
  
  @Column({ type: 'boolean', default: false })
  isFranchise: boolean; // true pour C.P.COMPANY
}

// Modification Product
@Entity('products')
export class Product {
  // ... champs existants
  @Column({ type: 'uuid' })
  shopId: string;
  
  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;
}
```

#### Filtrage dans les requêtes
```typescript
// ProductsService
async findAll(shopId: string, query: ProductQueryDto) {
  return this.productRepository.find({
    where: { shopId, ...filters },
    relations: ['category', 'images', 'variants']
  });
}
```

---

### Option B : Microservices (Non recommandée pour votre cas)

**Architecture** : Chaque shop = service séparé avec sa propre base

#### Structure Docker
```
docker-compose.yml
├── postgres-reboul-adult
├── postgres-reboul-kids
├── postgres-reboul-sneakers
├── postgres-cpcompany
├── backend-reboul-adult
├── backend-reboul-kids
├── backend-reboul-sneakers
├── backend-cpcompany
├── api-gateway (routage)
└── frontend
```

#### Avantages ✅
1. **Isolation totale** : Chaque shop complètement séparé
2. **Scalabilité** : Mettre à l'échelle chaque shop indépendamment
3. **Sécurité** : Pas de risque de mélange de données

#### Inconvénients ❌
1. **Complexité Docker** : 9+ services au lieu de 3
2. **Coûts élevés** : 4 bases de données, 4 backends, plus de ressources
3. **Duplication de code** : Même code backend répété 4 fois
4. **Maintenance difficile** : 4 codebases à maintenir
5. **Partage difficile** : Panier, commandes, utilisateurs compliqués à partager
6. **Déploiement complexe** : Gérer 4 services backend
7. **API Gateway nécessaire** : Routage complexe
8. **Surcharge** : Overkill pour 4 shops

---

## 🎯 Recommandation : Option A (Multi-Tenant)

### Pourquoi l'Option A est meilleure pour vous :

1. **Vous avez déjà une base fonctionnelle** : Migration simple (ajouter `shopId`)
2. **4 shops seulement** : Pas besoin de microservices
3. **Budget optimisé** : Hébergement sur même serveur Docker
4. **Maintenance simplifiée** : Un seul codebase
5. **Partage naturel** : Utilisateurs peuvent acheter dans plusieurs shops
6. **Évolutif** : Facile d'ajouter un 5ème shop plus tard

### Migration depuis l'architecture actuelle

#### Étape 1 : Créer entité Shop
```typescript
// src/entities/shop.entity.ts
@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ type: 'varchar', length: 255 })
  name: string;
  
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;
  
  @Column({ type: 'text', nullable: true })
  description: string | null;
  
  @Column({ type: 'boolean', default: false })
  isFranchise: boolean;
  
  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];
  
  @OneToMany(() => Category, (category) => category.shop)
  categories: Category[];
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Étape 2 : Ajouter shopId aux entités existantes
```typescript
// Product entity - Ajouter
@Column({ type: 'uuid' })
shopId: string;

@ManyToOne(() => Shop, (shop) => shop.products)
@JoinColumn({ name: 'shopId' })
shop: Shop;

// Category entity - Ajouter
@Column({ type: 'uuid' })
shopId: string;

@ManyToOne(() => Shop, (shop) => shop.categories)
@JoinColumn({ name: 'shopId' })
shop: Shop;
```

#### Étape 3 : Seed des shops initiaux
```typescript
// Script de seed
const shops = [
  { name: 'Reboul Adult', slug: 'reboul-adult', isFranchise: false },
  { name: 'Reboul Kids', slug: 'reboul-kids', isFranchise: false },
  { name: 'Reboul Sneakers', slug: 'reboul-sneakers', isFranchise: false },
  { name: 'C.P.COMPANY Marseille', slug: 'cpcompany-marseille', isFranchise: true },
];
```

#### Étape 4 : Migration des données existantes
```sql
-- Assigner tous les produits existants au shop par défaut (Reboul Adult)
UPDATE products SET shopId = (SELECT id FROM shops WHERE slug = 'reboul-adult');
UPDATE categories SET shopId = (SELECT id FROM shops WHERE slug = 'reboul-adult');
```

#### Étape 5 : Modifier les services pour filtrer par shopId
```typescript
// ProductsService
async findAll(shopId: string, query: ProductQueryDto) {
  const where: any = { shopId };
  
  if (query.category) where.categoryId = query.category;
  if (query.minPrice || query.maxPrice) {
    where.price = Between(query.minPrice || 0, query.maxPrice || 999999);
  }
  
  return this.productRepository.find({
    where,
    relations: ['category', 'images', 'variants', 'shop']
  });
}
```

---

## 🐳 Configuration Docker (Option A)

Votre `docker-compose.yml` actuel reste **identique** ! Pas besoin de changement.

```yaml
services:
  postgres:    # 1 seule base pour tous les shops
  backend:     # 1 seul backend qui gère tous les shops
  frontend:    # 1 seul frontend avec navigation multi-shops
```

---

## 🎨 Frontend - Navigation Multi-Shops

### Option 1 : Switch de shop dans le header
```tsx
// Header.tsx
<ShopSelector>
  <ShopLink shop="reboul-adult">Reboul Adult</ShopLink>
  <ShopLink shop="reboul-kids">Les Minots</ShopLink>
  <ShopLink shop="reboul-sneakers">Sneakers</ShopLink>
  <ShopLink shop="cpcompany-marseille">C.P.COMPANY</ShopLink>
</ShopSelector>
```

### Option 2 : Routes séparées
```tsx
// Routes
/shop/reboul-adult/catalog
/shop/reboul-kids/catalog
/shop/reboul-sneakers/catalog
/shop/cpcompany-marseille/catalog
```

### Option 3 : Sous-domaines (optionnel, plus complexe)
```
reboul-adult.reboulstore.com
reboul-kids.reboulstore.com
```

---

## ✅ Conclusion

**Option A (Multi-Tenant) est la meilleure solution** pour votre projet car :

1. ✅ **Simple** : Migration facile depuis votre architecture actuelle
2. ✅ **Économique** : 1 base, 1 backend, coûts réduits
3. ✅ **Maintenable** : Un seul codebase
4. ✅ **Évolutif** : Facile d'ajouter des shops
5. ✅ **Docker-friendly** : Votre docker-compose.yml actuel suffit

L'Option B (Microservices) serait justifiée si vous aviez :
- 10+ shops
- Besoin d'isolation totale
- Budget illimité
- Équipes séparées par shop

Ce n'est pas votre cas, donc **Option A = Meilleur choix** ! 🎯
