# animation-workflow

**Commande** : `/animation-workflow`

Workflow complet pour créer des animations AnimeJS dans Reboul Store.

## 🎯 Workflow Animations AnimeJS

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
export { animateFadeIn, type FadeInOptions } from './presets/fade-in';
```

### 4. Utiliser dans un composant

**Avec AnimationProvider (recommandé)** :

```typescript
import { useRef, useEffect } from 'react';
import { useAnimation } from '../../animations';
import { animateFadeIn } from '../../animations';

const MyComponent = () => {
  const { prefersReducedMotion, cleanup } = useAnimation();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return;

    const anim = animateFadeIn(elementRef.current, { duration: 0.6, delay: 0.2 });

    return () => {
      if (elementRef.current) cleanup(elementRef.current);
    };
  }, [prefersReducedMotion, cleanup]);

  return <div ref={elementRef}>Content</div>;
};
```

**Sans provider (simple)** :

```typescript
import { useRef, useEffect } from 'react';
import { animateFadeIn } from '../../animations';
import * as anime from 'animejs';

const MyComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      animateFadeIn(elementRef.current, { duration: 0.6, delay: 0.2 });
    }

    return () => {
      if (elementRef.current) anime.remove(elementRef.current);
    };
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
    ├── animejs-helpers.ts   # Hook useAnimeJS
    └── constants.ts         # Durées, eases, délais
```

## 💡 Template animation réutilisable

```typescript
// animations/presets/fade-in.ts
import * as anime from 'animejs';
import { toMilliseconds, convertEasing, ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface FadeInOptions {
  duration?: number;  // En secondes (sera converti en ms)
  delay?: number;     // En secondes (sera converti en ms)
  ease?: string;
}

/**
 * Animation fade-in réutilisable
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance d'animation AnimeJS
 */
export const animateFadeIn = (
  element: HTMLElement | string | null,
  options: FadeInOptions = {}
): ReturnType<typeof anime.animate> | null => {
  if (!element) return null;

  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
  } = options;

  return anime.animate(element, {
    opacity: [0, 1],
    duration: toMilliseconds(duration),
    delay: toMilliseconds(delay),
    easing: convertEasing(ease),
  });
};
```

## 🎨 Constantes disponibles

```typescript
// animations/utils/constants.ts

ANIMATION_DURATIONS = {
  FAST: 0.2,      // En secondes
  NORMAL: 0.5,
  SLOW: 0.8,
}

ANIMATION_EASES = {
  DEFAULT: "easeOutQuad",      // Équivalent "power2.out" GSAP
  SMOOTH: "easeOutSine",       // Équivalent "power1.out" GSAP
  SNAPPY: "easeOutCubic",      // Équivalent "power3.out" GSAP
  BOUNCE: "easeOutBack",       // Équivalent "back.out" GSAP
  ELASTIC: "easeOutElastic",   // Équivalent "elastic.out" GSAP
  NONE: "linear",              // Équivalent "none" GSAP
}

// Helpers de conversion
toMilliseconds(seconds: number): number  // Convertit secondes → ms
convertEasing(gsapEasing: string): string  // Convertit easing GSAP → AnimeJS
```

## 🔧 Hook useAnimeJS (recommandé)

```typescript
import { useAnimeJS } from '../../animations';

const MyComponent = () => {
  const scopeRef = useAnimeJS(() => {
    anime.animate('.fade-in', { opacity: [0, 1], duration: 500 });
  }, [data]);

  return <div ref={scopeRef}>...</div>;
};
```

**Avantages :**
- Nettoyage automatique
- Plus sûr pour éviter les fuites mémoire

## 🎯 AnimationProvider (recommandé)

**Dans main.tsx** :
```typescript
import { AnimationProvider } from './contexts/AnimationContext';

<AnimationProvider>
  <App />
</AnimationProvider>
```

**Dans un composant** :
```typescript
import { useAnimation } from '../../animations';

const { prefersReducedMotion, cleanup, durations, eases } = useAnimation();
```

## ✅ Bonnes pratiques

- ✅ **Toujours créer des animations réutilisables** dans `presets/`
- ✅ **Utiliser `useAnimeJS` hook** ou `AnimationProvider` pour le nettoyage
- ✅ **Respecter les constantes** définies (`ANIMATION_DURATIONS`, etc.)
- ✅ **Documenter avec JSDoc** chaque animation
- ✅ **Respecter `prefers-reduced-motion`** pour l'accessibilité (via `useAnimation()`)
- ✅ **Utiliser `toMilliseconds()` et `convertEasing()`** pour la compatibilité
- ❌ **Ne pas dupliquer** le code d'animation dans plusieurs composants
- ❌ **Ne pas oublier de nettoyer** les animations au démontage

## 📚 Documentation complète

Consulter **ANIMATIONS_GUIDE.md** pour :
- Concepts de base AnimeJS
- Tous les exemples d'animations
- Références et cheat sheet
- Bonnes pratiques détaillées
- Comparaison GSAP vs AnimeJS

## 🔗 Commandes associées

- `/frontend-workflow` : Workflow frontend complet
- `/getcontext` : Recherche de contexte
- `/component-create` : Créer un composant

## ⚡ Quick Reference

```typescript
// Fade-in
animateFadeIn(element, { duration: 0.5 });

// Slide-up
anime.animate(element, { opacity: [0, 1], translateY: [20, 0], duration: 500 });

// Scale hover
anime.animate(element, { scale: [1, 1.05], duration: 200 });

// Stagger
anime.animate('.items', { opacity: [0, 1], delay: anime.stagger(100), duration: 500 });

// Timeline
const tl = anime.createTimeline();
tl.add(element1, { opacity: [0, 1], duration: 500 });
tl.add(element2, { translateY: [20, 0], duration: 500 }, '-=200');
```
