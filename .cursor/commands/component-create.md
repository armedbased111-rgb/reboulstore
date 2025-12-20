# component-create

**Commande** : `/component-create [nom] [domaine?]`

Créer un nouveau composant React dans Reboul Store.

## 🎯 Workflow de création

### 1. Décider l'emplacement

- **Composant UI réutilisable** → `frontend/src/components/ui/`
- **Composant spécifique à un domaine** → `frontend/src/components/[domaine]/`
  - Exemples : `product/`, `cart/`, `orders/`, `profile/`, `layout/`

### 2. Nommer le composant

- **Fichier** : PascalCase (ex: `ProductCard.tsx`, `OrderSummary.tsx`)
- **Fonction** : Même nom que le fichier
- **Props interface** : `[NomComposant]Props`

### 3. Template de base

```typescript
interface NomComposantProps {
  // Définir les props ici
  prop1: string;
  prop2?: number; // Props optionnelles avec ?
}

/**
 * Composant NomComposant - Description courte
 * 
 * Description détaillée de ce que fait le composant
 * 
 * @example
 * <NomComposant prop1="value" prop2={123} />
 */
export const NomComposant = ({ prop1, prop2 }: NomComposantProps) => {
  // State, hooks, etc.

  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

### 4. Bonnes pratiques

#### Types & Props

- ✅ **Toujours typer les props** avec interface TypeScript
- ✅ **Props optionnelles** avec `?`
- ✅ **Destructuring** des props dans la signature

#### Documentation

- ✅ **JSDoc** pour chaque composant
- ✅ **Description** claire du rôle
- ✅ **Exemple d'utilisation** si utile

#### Styling

- ✅ **TailwindCSS** pour le styling
- ✅ **Mobile-first** : styles de base pour mobile, `md:`, `lg:` pour desktop
- ✅ **Classes typographiques** : `.text-h1`, `.text-h2`, `.text-t1`, etc.
- ✅ **Style A-COLD-WALL*** : Minimaliste, premium, noir/blanc
- ✅ **Uppercase** pour les textes importants

#### Structure

- ✅ **Un composant = une responsabilité**
- ✅ **Composants petits et réutilisables**
- ✅ **Extraire les sous-composants** si trop complexe

### 5. Exemples par domaine

#### Composant UI (shadcn/ui style)

```typescript
// components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-md',
          variant === 'primary' && 'bg-black text-white',
          variant === 'secondary' && 'bg-white border border-black',
          className
        )}
        {...props}
      />
    );
  }
);
```

#### Composant domaine (ex: Product)

```typescript
// components/product/ProductCard.tsx
import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

/**
 * Composant ProductCard - Carte produit style A-COLD-WALL*
 * 
 * Affiche l'image, nom et prix d'un produit
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`} className="text-t3 group block">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-xs uppercase">AUCUNE IMAGE</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="font-[Geist] font-medium text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-black">
          {product.name}
        </h3>
        <p className="font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] text-gray-700 mt-1">
          €{product.price}
        </p>
      </div>
    </Link>
  );
};
```

## 📁 Structure recommandée

```
frontend/src/components/
├── ui/                    # Composants UI réutilisables (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── product/               # Composants spécifiques produits
│   ├── ProductCard.tsx
│   ├── ProductGallery.tsx
│   └── ...
├── cart/                  # Composants panier
├── orders/                # Composants commandes
├── profile/               # Composants profil
└── layout/                # Layout (Header, Footer)
```

## ✅ Checklist création

- [ ] Fichier créé au bon emplacement
- [ ] Props typées avec interface
- [ ] Documentation JSDoc ajoutée
- [ ] Styling TailwindCSS (mobile-first)
- [ ] Testé dans le navigateur
- [ ] Responsive vérifié (mobile/desktop)
- [ ] Exporté si nécessaire

## 🚀 CLI Python - Génération automatique


**⭐ RECOMMANDÉ** : Utiliser le CLI Python pour générer automatiquement les composants :

```bash
# Composant standard
python cli/main.py code component ProductCard --domain Product

# Composant avec shadcn/ui
python cli/main.py code component Button --shadcn --use card button
```

**Gain de temps** : 15min → 1min (**93% de gain**)

Voir `/cli-workflow` pour le guide complet du CLI.

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python ⭐ **NOUVEAU**
- `/frontend-workflow` : Workflow frontend complet
- `/getcontext` : Recherche de contexte
- `/figma-workflow` : Workflow Figma → Code

