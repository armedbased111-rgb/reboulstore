# animation-workflow

**Commande** : `/animation-workflow`

Workflow complet pour créer des animations GSAP dans Reboul Store.

## 🎯 Workflow Animations GSAP

### 1. Décider du type d'animation

- **Animation réutilisable** (plusieurs composants) → `animations/presets/`
- **Animation spécifique à un composant** → `animations/components/[ComponentName]/`
- **Animation unique** (une seule page) → Directement dans le composant (rare)

### 2. Créer le fichier d'animation

**Pour une animation réutilisable :**

1. Créer fichier `animations/presets/[nom-animation].ts`
2. Nommer en `kebab-case.ts`
3. Exporter fonction nommée `animate[NomAnimation]`
4. Documenter avec JSDoc
5. Utiliser les constantes de `animations/utils/constants.ts`

### 3. Exporter dans index.ts

Ajouter l'export dans `animations/index.ts` :

```typescript
export { animateFadeIn } from './presets/fade-in';
```

### 4. Utiliser dans un composant

```typescript
import { useRef, useEffect } from 'react';
import { animateFadeIn } from '../../animations';

const MyComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      animateFadeIn(elementRef.current, { duration: 0.6, delay: 0.2 });
    }
  }, []);

  return <div ref={elementRef}>Content</div>;
};
```

## 📁 Structure des animations

```
frontend/src/animations/
├── index.ts                 # Export centralisé
├── presets/                 # Animations réutilisables
│   ├── fade-in.ts
│   ├── slide-up.ts
│   └── scale-hover.ts
├── components/              # Animations spécifiques
│   └── [ComponentName]/
│       └── [animation].ts
└── utils/
    ├── gsap-helpers.ts      # Hook useGSAP
    └── constants.ts         # Durées, eases, délais
```

## 💡 Template animation réutilisable

```typescript
// animations/presets/fade-in.ts
import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface FadeInOptions {
  duration?: number;
  delay?: number;
  ease?: string;
}

/**
 * Animation fade-in réutilisable
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP
 */
export const animateFadeIn = (
  element: gsap.TweenTarget,
  options: FadeInOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
  } = options;

  return gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      duration,
      delay,
      ease,
    }
  );
};
```

## 🎨 Constantes disponibles

```typescript
// animations/utils/constants.ts

ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.5,
  SLOW: 0.8,
}

ANIMATION_EASES = {
  DEFAULT: "power2.out",
  SMOOTH: "power1.out",
  SNAPPY: "power3.out",
  BOUNCE: "back.out",
  ELASTIC: "elastic.out",
}

ANIMATION_DELAYS = {
  NONE: 0,
  SHORT: 0.1,
  MEDIUM: 0.2,
  LONG: 0.4,
}

ANIMATION_STAGGER = {
  TIGHT: 0.05,
  NORMAL: 0.1,
  LOOSE: 0.2,
}
```

## 🔧 Hook useGSAP (recommandé)

```typescript
import { useGSAP } from '../../animations';

const MyComponent = () => {
  const scopeRef = useGSAP(() => {
    gsap.from(".fade-in", { opacity: 0, duration: 0.5, stagger: 0.1 });
  }, [data]);

  return <div ref={scopeRef}>...</div>;
};
```

**Avantages :**
- Nettoyage automatique avec `gsap.context()`
- Pas besoin de gérer manuellement les refs
- Plus sûr pour éviter les fuites mémoire

## ✅ Bonnes pratiques

- ✅ **Toujours créer des animations réutilisables** dans `presets/`
- ✅ **Utiliser `useGSAP` hook** ou `gsap.context()` pour le nettoyage
- ✅ **Respecter les constantes** définies (`ANIMATION_DURATIONS`, etc.)
- ✅ **Documenter avec JSDoc** chaque animation
- ✅ **Respecter `prefers-reduced-motion`** pour l'accessibilité
- ❌ **Ne pas dupliquer** le code d'animation dans plusieurs composants
- ❌ **Ne pas oublier de nettoyer** les animations au démontage

## 📚 Documentation complète

Consulter **ANIMATIONS_GUIDE.md** pour :
- Concepts de base GSAP
- Tous les exemples d'animations
- Références et cheat sheet
- Bonnes pratiques détaillées

## 🔗 Commandes associées

- `/frontend-workflow` : Workflow frontend complet
- `/getcontext` : Recherche de contexte
- `/component-create` : Créer un composant

## ⚡ Quick Reference

```typescript
// Fade-in
animateFadeIn(element, { duration: 0.5 });

// Slide-up
gsap.from(element, { opacity: 0, y: 20, duration: 0.5 });

// Scale hover
gsap.to(element, { scale: 1.05, duration: 0.2 });

// Stagger
gsap.to(".items", { opacity: 1, y: 0, stagger: 0.1 });
```

