# product-workflow

**Commande** : `/product-workflow`

Workflow pour tout ce qui touche au **catalogue produits** (Product / Variant / Image / Category / Brand) côté backend + frontend.

---

## 1. Docs & fichiers à lire

- `docs/context/ROADMAP_COMPLETE.md`  
  → Phases catalogue / produits / variants / images / brands.

- `docs/context/CONTEXT.md`  
  → Résumé de l’état actuel du catalogue.

- `backend/BACKEND.md`  
  → Sections Products, Variants, Images, Categories, Brands.

- `frontend/FRONTEND.md`  
  → Sections Catalog, Product page, ProductCard, ProductGrid, etc.

---

## 2. Backend – Modèle produits

**Entités principales** :
- `backend/src/entities/product.entity.ts`
- `backend/src/entities/variant.entity.ts`
- `backend/src/entities/image.entity.ts`
- `backend/src/entities/category.entity.ts`
- `backend/src/entities/brand.entity.ts`

**Modules** :
- `backend/src/modules/products/…`
- `backend/src/modules/categories/…`
- `backend/src/modules/brands/…`

Quand tu ajoutes / modifies :
- Un champ produit (ex : nouveau champ metadata)  
- Une logique de stock (variants)  
- Une relation (brand, category, size chart, etc.)

→ Toujours :
- Mettre à jour les entités correspondantes.  
- Adapter les DTOs (`backend/src/modules/products/dto/...`).  
- Mettre à jour `backend/BACKEND.md` (section Products/Variants/Images/Brands).  
- Mettre à jour `docs/context/API_CONFIG.md` si endpoints changent.

---

## 3. Frontend – Pages & composants produits

**Pages principales** :
- `frontend/src/pages/Catalog.tsx`
- `frontend/src/pages/Product.tsx`

**Composants clés** (selon la structure actuelle de `frontend/FRONTEND.md`) :
- Grille / cartes produits : `ProductGrid`, `ProductCard`, etc.  
- Page produit : `ProductGallery`, `ProductInfo`, `VariantSelector`, `AddToCartButton`, `ProductTabs` (Details, Sizing, Shipping, Returns).  
- Filtres : catégories + marques (tabs, sidebars, etc.).

**Services & hooks** :
- `frontend/src/services/products.ts`
- `frontend/src/services/categories.ts`
- `frontend/src/services/brands.ts`
- `useProducts`, `useProduct`, `useCategories`, `useBrands`

---

## 4. Checklist quand tu touches au domaine “produit”

1. **Backend** :
   - [ ] Entités à jour (Product, Variant, Image, Category, Brand).  
   - [ ] DTOs & validations à jour.  
   - [ ] Endpoints cohérents (filtres, pagination, slug, etc.).  
   - [ ] `backend/BACKEND.md` mis à jour.

2. **Frontend** :
   - [ ] `services` à jour (nouveaux champs pris en compte).  
   - [ ] Pages Catalog/Product reflètent bien les nouveaux champs / relations.  
   - [ ] Composants (cards, tabs, selectors) mis à jour.  

3. **Doc & roadmap** :
   - [ ] `docs/context/ROADMAP_COMPLETE.md` : tâches cochées.  
   - [ ] `frontend/FRONTEND.md` : pages / composants mis à jour.  
   - [ ] `docs/context/CONTEXT.md` : si c’est un changement important de features.

---

## 🔗 Commandes associées

- `/frontend-workflow` : Workflow général frontend.  
- `/backend-workflow` : Workflow général backend.  
- `/getcontext products` : Pour retrouver rapidement toute la doc produits.  
- `/brainstorm-topic catalogue` : Pour brainstormer sur l’UX / architecture du catalogue.



