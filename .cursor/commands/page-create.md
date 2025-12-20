# page-create

**Commande** : `/page-create [nom]`

Créer une nouvelle page React dans Reboul Store.

## 🎯 Workflow de création

### 1. Créer le fichier

**Emplacement** : `frontend/src/pages/[NomPage].tsx`

**Nom** : PascalCase (ex: `Product.tsx`, `Orders.tsx`, `OrderDetail.tsx`)

### 2. Template de base

```typescript
import { useState, useEffect } from 'react';

/**
 * Page NomPage - Description
 * 
 * Route : /[route]
 * Description de ce que fait la page
 */
export const NomPage = () => {
  // State, hooks, etc.
  const [data, setData] = useState(null);

  useEffect(() => {
    // Charger les données
  }, []);

  // Loading state
  if (loading) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <div className="py-8 text-center uppercase">CHARGEMENT...</div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <div className="py-8 text-center uppercase text-red-500">
            ERREUR : {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        {/* Contenu de la page */}
      </div>
    </main>
  );
};
```

### 3. Ajouter la route

**Fichier** : `frontend/src/App.tsx`

```typescript
import { NomPage } from './pages/NomPage';

// Dans le composant App, ajouter :
<Route path="/route" element={<NomPage />} />
```

**Si route protégée :**

```typescript
<Route
  path="/route"
  element={
    <ProtectedRoute>
      <NomPage />
    </ProtectedRoute>
  }
/>
```

### 4. Structure de page standard

```typescript
<main id="MainContent" role="main" tabIndex={-1} className="grow flex">
  <div className="w-full">
    {/* Section avec padding/border selon design A-COLD-WALL* */}
    <section className="m-[2px] last:mb-0">
      <div className="p-[2px] bg-grey light:bg-inherit relative w-full">
        {/* Contenu */}
      </div>
    </section>
  </div>
</main>
```

### 5. Bonnes pratiques

#### Structure HTML

- ✅ **`<main>`** avec `id="MainContent"`, `role="main"`, `tabIndex={-1}`
- ✅ **Classes** : `grow flex` sur main, `w-full` sur container
- ✅ **Sections** : Utiliser `<section>` pour chaque section de contenu

#### States

- ✅ **Loading state** : Afficher "CHARGEMENT..." en uppercase
- ✅ **Error state** : Afficher message d'erreur en uppercase
- ✅ **Empty state** : Afficher message approprié si pas de données

#### Responsive

- ✅ **Mobile-first** : Styles de base pour mobile
- ✅ **Breakpoints** : `md:`, `lg:` pour desktop
- ✅ **Pas de centrage** en desktop (contenu aligné à gauche)

#### Styling

- ✅ **TailwindCSS** : Classes utilitaires
- ✅ **Classes typographiques** : `.text-h1`, `.text-h2`, etc.
- ✅ **Style A-COLD-WALL*** : Minimaliste, premium, noir/blanc
- ✅ **Uppercase** : Textes importants en majuscules

## 📄 Exemples de pages

### Page simple (Home)

```typescript
export const Home = () => {
  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        <HeroSectionImage />
        <CategorySection />
        <FeaturedProducts />
      </div>
    </main>
  );
};
```

### Page avec données (Product)

```typescript
export const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <div className="py-8 text-center uppercase">CHARGEMENT...</div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
        <div className="w-full">
          <div className="py-8 text-center uppercase text-red-500">
            {error || 'PRODUIT INTROUVABLE'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
    </main>
  );
};
```

## 🔗 Intégration avec services

### Utiliser un hook personnalisé

```typescript
import { useProducts } from '../hooks/useProducts';

const { products, loading, error } = useProducts({ categoryId: '...' });
```

### Utiliser un service directement

```typescript
import { getProducts } from '../services/products';

useEffect(() => {
  const fetchData = async () => {
    const data = await getProducts();
    setProducts(data);
  };
  fetchData();
}, []);
```

## ✅ Checklist création

- [ ] Fichier créé dans `frontend/src/pages/`
- [ ] Route ajoutée dans `App.tsx`
- [ ] Structure `<main>` respectée
- [ ] Loading state géré
- [ ] Error state géré
- [ ] Responsive vérifié
- [ ] Testé dans le navigateur
- [ ] ROADMAP_COMPLETE.md mis à jour
- [ ] frontend/FRONTEND.md mis à jour

## 🚀 CLI Python - Génération automatique

**⭐ RECOMMANDÉ** : Utiliser le CLI Python pour générer automatiquement les pages :

```bash
# Page complète avec intégration entity
python cli/main.py code page Checkout --entity Order

# Page simple
python cli/main.py code page About
```

**Gain de temps** : 30min → 2min (**93% de gain**)

Le CLI génère automatiquement :
- ✅ Structure `<main>` standardisée
- ✅ Gestion loading/error states
- ✅ Intégration hooks et services
- ✅ Layout responsive

Voir `/cli-workflow` pour le guide complet du CLI.

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python ⭐ **NOUVEAU**
- `/frontend-workflow` : Workflow frontend complet
- `/component-create` : Créer un composant
- `/getcontext` : Recherche de contexte
- `/figma-workflow` : Workflow Figma → Code

