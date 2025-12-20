# frontend-workflow

**Commande** : `/frontend-workflow`

Workflow complet pour développer des fonctionnalités frontend dans Reboul Store.

## 🎯 Workflow général Frontend

### 1. Avant de commencer

1. ✅ **Consulter ROADMAP_COMPLETE.md** pour identifier la phase/tâche
2. ✅ **Consulter CONTEXT.md** pour l'état actuel
3. ✅ **Consulter frontend/FRONTEND.md** pour la documentation frontend
4. ✅ **Vérifier les règles** dans `.cursor/rules/project-rules.mdc`

### 2. Mode de développement

**Mode pédagogique (par défaut) :**
- Tu ne codes pas, tu m'apprends
- Processus : Explication → Tu codes → Vérification → Correction ensemble

**Mode normal (si demandé explicitement) :**
- Je code directement pour toi
- Cas d'usage : Pages complexes, intégration API

### 3. Structure des fichiers frontend

```
frontend/src/
├── pages/              # Pages (routes)
│   ├── Home.tsx
│   ├── Product.tsx
│   └── ...
├── components/         # Composants réutilisables
│   ├── ui/            # Composants shadcn/ui
│   ├── product/       # Composants spécifiques produits
│   ├── layout/        # Layout (Header, Footer, etc.)
│   └── ...
├── contexts/          # Contextes React (Auth, Cart, etc.)
├── hooks/             # Hooks personnalisés
├── services/          # Services API (appels backend)
├── types/             # Types TypeScript
├── utils/             # Utilitaires
└── animations/        # Animations GSAP
```

## 📄 Créer une page

### 🚀 Option 1 : Utiliser le CLI Python (RECOMMANDÉ)

**⭐ Gain de temps : 30min → 2min (93% de gain)**

```bash
# Page complète avec intégration entity
python cli/main.py code page Checkout --entity Order

# Page simple
python cli/main.py code page About
```

Le CLI génère automatiquement :
- ✅ Structure `<main>` standardisée
- ✅ Gestion loading/error states
- ✅ Intégration hooks et services
- ✅ Layout responsive

Voir `/cli-workflow` pour le guide complet.

### Option 2 : Création manuelle

### Étapes

1. **Créer le fichier** : `frontend/src/pages/[NomPage].tsx`
2. **Ajouter la route** : `frontend/src/App.tsx`
3. **Créer les composants** si nécessaire (dans `components/`)
4. **Créer le service** si appel API (dans `services/`)
5. **Ajouter les types** si besoin (dans `types/`)
6. **Mettre à jour ROADMAP_COMPLETE.md** ✅

### Template de base

```typescript
import { useState, useEffect } from 'react';

/**
 * Page [NomPage] - Description
 * 
 * Route : /[route]
 */
export const NomPage = () => {
  // State, hooks, etc.

  return (
    <main id="MainContent" role="main" tabIndex={-1} className="grow flex">
      <div className="w-full">
        {/* Contenu */}
      </div>
    </main>
  );
};
```

## 🧩 Créer un composant

### Étapes

1. **Décider l'emplacement** :
   - Composant UI réutilisable → `components/ui/`
   - Composant spécifique → `components/[domaine]/`

2. **Créer le fichier** : `frontend/src/components/[domaine]/[NomComposant].tsx`

3. **Exporter et documenter** :

```typescript
interface NomComposantProps {
  // Props
}

/**
 * Composant NomComposant - Description
 * 
 * Usage: <NomComposant prop1="..." />
 */
export const NomComposant = ({ ...props }: NomComposantProps) => {
  return (
    // JSX
  );
};
```

### Bonnes pratiques

- ✅ **Props typées** avec interface TypeScript
- ✅ **Documentation JSDoc** pour chaque composant
- ✅ **Noms explicites** en PascalCase
- ✅ **Un composant = une responsabilité**
- ✅ **Réutilisabilité** si possible

## 🔌 Créer un service API

### Étapes

1. **Créer le fichier** : `frontend/src/services/[nom].ts`
2. **Importer axios** depuis `services/api.ts`
3. **Créer les fonctions** de service

### Template

```typescript
import { api } from './api';
import type { Type } from '../types';

/**
 * Service [Nom] - Gestion API [domaine]
 */

export const getSomething = async (): Promise<Type> => {
  const response = await api.get<Type>('/endpoint');
  return response.data;
};

export const createSomething = async (data: CreateDTO): Promise<Type> => {
  const response = await api.post<Type>('/endpoint', data);
  return response.data;
};
```

## 🎨 Styling (TailwindCSS)

### Classes principales

- **Typographie** : `.text-h1`, `.text-h2`, `.text-t1`, `.text-t2`, `.text-t3`
- **Espacements** : Mobile-first, utiliser `md:`, `lg:` pour desktop
- **Design** : Style A-COLD-WALL* (minimaliste, premium, noir/blanc)
- **Responsive** : Mobile-first, pas de centrage desktop (`justify-center` à éviter)

### Conventions

- ✅ **Mobile-first** : Styles de base pour mobile, breakpoints pour desktop
- ✅ **Pas de centrage** en desktop (contenu aligné à gauche)
- ✅ **Uppercase** pour les textes importants (style A-COLD-WALL*)
- ✅ **Polices** : Geist (définie dans `fonts.css`)

## 🎬 Animations GSAP

Voir `/animation-workflow` pour le workflow complet.

**Quick start :**
1. Créer animation dans `animations/presets/` ou `animations/components/`
2. Exporter dans `animations/index.ts`
3. Utiliser dans composant avec `useRef` + `useEffect`

## 📝 Mise à jour documentation

**Après chaque fonctionnalité :**
1. ✅ **ROADMAP_COMPLETE.md** : Cocher les tâches terminées
2. ✅ **frontend/FRONTEND.md** : Ajouter page/composant/service
3. ✅ **CONTEXT.md** : Mettre à jour état actuel si phase terminée

## 🔗 Commandes associées

- `/getcontext` : Recherche de contexte
- `/figma-workflow` : Workflow Figma → Code
- `/animation-workflow` : Workflow animations
- `/component-create` : Créer un composant
- `/page-create` : Créer une page

## 📚 Documentation de référence

- **frontend/FRONTEND.md** : Documentation complète frontend
- **frontend/AUTH_USAGE.md** : Système authentification
- **frontend/TAILWIND.md** : Guide TailwindCSS
- **ANIMATIONS_GUIDE.md** : Guide animations GSAP
- **FIGMA_DEV_GUIDE.md** : Guide développement depuis Figma

