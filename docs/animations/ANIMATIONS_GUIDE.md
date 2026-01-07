# 🎬 Guide des Animations AnimeJS

**Version** : 2.0  
**Date** : 20 décembre 2025  
**Bibliothèque** : AnimeJS

Voir aussi : [[../../frontend/FRONTEND.md|FRONTEND]] - [[../export/FIGMA_WORKFLOW.md|FIGMA_WORKFLOW]]

---

## 📋 Table des matières

1. [Présentation d'AnimeJS](#présentation-danimejs)
2. [Installation](#installation)
3. [Concepts de base](#concepts-de-base)
4. [Comparaison GSAP vs AnimeJS](#comparaison-gsap-vs-animejs)
5. [Structure des animations](#structure-des-animations)
6. [Exemples pratiques](#exemples-pratiques)
7. [Bonnes pratiques](#bonnes-pratiques)
8. [Références](#références)

---

## 🎯 Présentation d'AnimeJS

### Qu'est-ce qu'AnimeJS ?

**AnimeJS** est une bibliothèque JavaScript légère et performante pour créer des animations fluides. Elle offre une API simple et intuitive pour animer des propriétés CSS, SVG, et même des objets JavaScript.

### Pourquoi AnimeJS pour notre projet ?

- ✅ **Léger** : ~15KB (vs ~50KB pour GSAP)
- ✅ **Simple** : API intuitive et facile à apprendre
- ✅ **Performant** : 60fps garantis
- ✅ **Flexible** : Support CSS, SVG, objets JavaScript
- ✅ **Timeline** : Support des timelines pour orchestrer plusieurs animations
- ✅ **Provider React** : AnimationProvider pour gestion centralisée

### Installation

```bash
# Dans le dossier frontend/
npm install animejs

# Types TypeScript (optionnel mais recommandé)
npm install --save-dev @types/animejs
```

---

## 📚 Concepts de base

### 1. Animation simple

**Syntaxe de base** :
```typescript
import * as anime from 'animejs';

anime.animate(element, {
  opacity: [0, 1],         // Array [from, to] ou valeur unique
  duration: 500,           // Durée en millisecondes (pas secondes !)
  easing: 'easeOutQuad'    // Type d'easing
});
```

**Exemple concret** :
```typescript
// Fade-in simple
anime.animate('.my-element', {
  opacity: [0, 1],
  duration: 500,
  easing: 'easeOutQuad'
});
```

### 2. Animation avec plusieurs propriétés

```typescript
anime.animate(element, {
  opacity: [0, 1],         // Fade in
  translateY: [20, 0],     // Slide up depuis 20px
  scale: [0.9, 1],         // Zoom léger
  duration: 500,
  easing: 'easeOutQuad'
});
```

### 3. Animation de plusieurs éléments (stagger)

**AnimeJS** :
```typescript
anime.animate('.items', {
  opacity: [0, 1],
  delay: anime.stagger(100),  // 100ms entre chaque élément
  duration: 500
});
```

**⚠️ Important** : `anime.stagger()` prend des **millisecondes**, pas des secondes !

### 4. Timeline (orchestrer plusieurs animations)

**Syntaxe** :
```typescript
const tl = anime.createTimeline({
  // Options globales de la timeline
});

// Ajouter des animations
tl.add(element1, {
  opacity: [0, 1],
  duration: 500
});

tl.add(element2, {
  translateY: [20, 0],
  duration: 500
}, '-=200');  // Commence 200ms avant la fin de l'animation précédente
```

**Exemple complet** :
```typescript
const tl = anime.createTimeline();

// Animation 1 : Fade-in page
tl.add(pageRef.current, {
  opacity: [0, 1],
  duration: 300
});

// Animation 2 : Slide-up header (commence 200ms avant la fin de l'animation 1)
tl.add(headerRef.current, {
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 500
}, '-=200');

// Animation 3 : Stagger fade-in des items (commence en même temps que l'animation 2)
tl.add('.items', {
  opacity: [0, 1],
  translateY: [10, 0],
  delay: anime.stagger(50),
  duration: 400
}, '-=500');
```

### 5. Callbacks

```typescript
anime.animate(element, {
  opacity: [0, 1],
  duration: 500,
  begin: (anim) => {
    // Appelé au début de l'animation
    console.log('Animation commencée');
  },
  update: (anim) => {
    // Appelé à chaque frame
    const progress = anim.progress;  // 0-100
    console.log(`Progression: ${progress}%`);
  },
  complete: (anim) => {
    // Appelé à la fin de l'animation
    console.log('Animation terminée');
  }
});
```

### 6. Nettoyage (cleanup)

**Important** : AnimeJS ne nettoie pas automatiquement les animations. Il faut le faire manuellement :

```typescript
useEffect(() => {
  const animation = anime.animate(elementRef.current, {
    opacity: [0, 1],
    duration: 500
  });

  return () => {
    // Nettoyer l'animation au démontage
    anime.remove(elementRef.current);
    // Ou pause si on veut pouvoir reprendre
    animation.pause();
  };
}, []);
```

---

## 🔄 Comparaison GSAP vs AnimeJS

### Syntaxe

| Action | GSAP | AnimeJS |
|--------|------|---------|
| Animation simple | `gsap.to(el, {opacity: 1, duration: 0.5})` | `anime.animate(el, {opacity: [0, 1], duration: 500})` |
| From/To | `gsap.fromTo(el, {opacity: 0}, {opacity: 1})` | `anime.animate(el, {opacity: [0, 1]})` |
| Timeline | `gsap.timeline()` | `anime.createTimeline()` |
| Stagger | `stagger: 0.1` | `delay: anime.stagger(100)` |

### Unités

| Propriété | GSAP | AnimeJS |
|-----------|------|---------|
| Durée | Secondes (0.5) | Millisecondes (500) |
| Délai | Secondes (0.1) | Millisecondes (100) |
| Stagger | Secondes (0.1) | Millisecondes (100) |

**⚠️ Conversion nécessaire** : Multiplier par 1000 pour convertir secondes → millisecondes

### Easings

| GSAP | AnimeJS | Description |
|------|---------|-------------|
| `"power2.out"` | `"easeOutQuad"` | Ease out quadratique |
| `"power1.out"` | `"easeOutSine"` | Ease out sinusoïdal |
| `"power1.inOut"` | `"easeInOutSine"` | Ease in/out sinusoïdal |
| `"power2.in"` | `"easeInQuad"` | Ease in quadratique |
| `"none"` | `"linear"` | Linéaire |

---

## 📁 Structure des animations

### Organisation des fichiers

```
frontend/src/
├── animations/              # Dossier principal des animations
│   ├── index.ts            # Export centralisé de toutes les animations
│   ├── utils/              # Utilitaires et helpers AnimeJS
│   │   ├── animejs-helpers.ts  # Fonctions helper réutilisables (useAnimeJS)
│   │   ├── constants.ts        # Constantes (durées, easings, etc.)
│   │   └── useScrollAnimation.ts  # Hook pour animations au scroll
│   ├── presets/            # Animations pré-configurées réutilisables
│   │   ├── fade-in.ts      # Animation fade-in réutilisable
│   │   ├── slide-up.ts     # Animation slide-up réutilisable
│   │   └── scale-hover.ts  # Animation hover scale réutilisable
│   └── components/         # Animations spécifiques à des composants
│       └── [ComponentName]/
│           └── [animation].ts
├── contexts/               # Contexts React
│   └── AnimationContext.tsx  # Provider pour gestion centralisée
```

### Convention de nommage

- **Fichiers** : `kebab-case.ts` (ex: `fade-in.ts`, `slide-up.ts`)
- **Fonctions** : `camelCase` (ex: `fadeIn`, `slideUp`)
- **Presets** : Préfixe `animate` (ex: `animateFadeIn`, `animateSlideUp`)

---

## 🔄 Workflow de création d'animation

### Étape 1 : Décider du type d'animation

- **Animation réutilisable** (plusieurs composants) → `animations/presets/`
- **Animation spécifique à un composant** → `animations/components/[ComponentName]/`
- **Animation unique** (une seule page) → Directement dans le composant (rare)

### Étape 2 : Créer le fichier d'animation

**Pour une animation réutilisable :**

1. Créer fichier `animations/presets/[nom-animation].ts`
2. Exporter une fonction nommée `animate[NomAnimation]`
3. Documenter avec JSDoc
4. Utiliser les constantes de `animations/utils/constants.ts`

**Exemple :**

```typescript
// animations/presets/fade-in.ts
import * as anime from 'animejs';
import { toMilliseconds, convertEasing, ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface FadeInOptions {
  duration?: number;  // En secondes (sera converti en ms)
  delay?: number;     // En secondes (sera converti en ms)
  easing?: string;
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
    easing = ANIMATION_EASES.DEFAULT,
  } = options;

  return anime.animate(element, {
    opacity: [0, 1],
    duration: toMilliseconds(duration),
    delay: toMilliseconds(delay),
    easing: convertEasing(easing),
  });
};
```

### Étape 3 : Exporter dans index.ts

```typescript
// animations/index.ts
export { animateFadeIn, type FadeInOptions } from './presets/fade-in';
export { animateSlideUp, type SlideUpOptions } from './presets/slide-up';
// ... autres exports
```

### Étape 4 : Utiliser dans un composant

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

---

## 💡 Exemples pratiques

### Exemple 1 : Fade-in simple

```typescript
// animations/presets/fade-in.ts
import * as anime from 'animejs';
import { toMilliseconds, convertEasing, ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export const animateFadeIn = (
  element: HTMLElement | string | null,
  options: { duration?: number; delay?: number } = {}
) => {
  if (!element) return null;

  return anime.animate(element, {
    opacity: [0, 1],
    duration: toMilliseconds(options.duration || ANIMATION_DURATIONS.NORMAL),
    delay: toMilliseconds(options.delay || 0),
    easing: convertEasing(ANIMATION_EASES.DEFAULT),
  });
};
```

### Exemple 2 : Slide-up avec fade

```typescript
// animations/presets/slide-up.ts
import * as anime from 'animejs';
import { toMilliseconds, convertEasing, ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export const animateSlideUp = (
  element: HTMLElement | string | null,
  options: { 
    duration?: number; 
    delay?: number;
    distance?: number; // Distance en pixels
  } = {}
) => {
  if (!element) return null;

  const distance = options.distance || 20;
  
  return anime.animate(element, {
    opacity: [0, 1],
    translateY: [distance, 0],
    duration: toMilliseconds(options.duration || ANIMATION_DURATIONS.NORMAL),
    delay: toMilliseconds(options.delay || 0),
    easing: convertEasing(ANIMATION_EASES.DEFAULT),
  });
};
```

### Exemple 3 : Stagger fade-in

```typescript
// animations/presets/stagger-fade-in.ts
import * as anime from 'animejs';
import { toMilliseconds, convertEasing, ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export const animateStaggerFadeIn = (
  elements: NodeListOf<Element> | HTMLElement[] | string | null,
  options: { 
    duration?: number;
    stagger?: number; // Délai entre chaque élément (en secondes)
  } = {}
) => {
  if (!elements) return null;

  return anime.animate(elements, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: toMilliseconds(options.duration || ANIMATION_DURATIONS.NORMAL),
    delay: anime.stagger(toMilliseconds(options.stagger || 0.1)),
    easing: convertEasing(ANIMATION_EASES.DEFAULT),
  });
};
```

---

## ✅ Bonnes pratiques

### 1. Toujours nettoyer les animations

```typescript
useEffect(() => {
  const animation = anime.animate(elementRef.current, { /* ... */ });
  
  return () => {
    anime.remove(elementRef.current);  // Nettoyage
  };
}, []);
```

### 2. Utiliser AnimationProvider

```typescript
// Dans main.tsx
import { AnimationProvider } from './contexts/AnimationContext';

<AnimationProvider>
  <App />
</AnimationProvider>

// Dans un composant
import { useAnimation } from '../../animations';

const { prefersReducedMotion, cleanup } = useAnimation();
```

### 3. Vérifier que l'élément existe

```typescript
if (!elementRef.current) return;
anime.animate(elementRef.current, { /* ... */ });
```

### 4. Utiliser les constantes pour la cohérence

```typescript
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds, convertEasing } from '../utils/constants';

anime.animate(element, {
  duration: toMilliseconds(ANIMATION_DURATIONS.NORMAL),
  easing: convertEasing(ANIMATION_EASES.DEFAULT)
});
```

### 5. Respecter `prefers-reduced-motion`

```typescript
const { prefersReducedMotion } = useAnimation();

if (prefersReducedMotion) {
  // Pas d'animation ou animation instantanée
  element.style.opacity = '1';
  return;
}

// Animation normale
anime.animate(element, { opacity: [0, 1] });
```

### 6. Utiliser des timelines pour orchestrer

```typescript
// ✅ Bon : Timeline pour orchestrer
const tl = anime.createTimeline();
tl.add(el1, { opacity: [0, 1] });
tl.add(el2, { opacity: [0, 1] }, '-=200');

// ❌ Éviter : Animations séparées sans coordination
anime.animate(el1, { opacity: [0, 1] });
anime.animate(el2, { opacity: [0, 1] });
```

---

## 📚 Références

- **Documentation officielle** : https://animejs.com/
- **GitHub** : https://github.com/juliangarnier/anime
- **Exemples** : https://animejs.com/documentation/

---

## 🔄 Migration depuis GSAP

Voir le document `GSAP_TO_ANIMEJS_ANALYSIS.md` pour :
- Inventaire complet des animations GSAP
- Équivalents AnimeJS
- Plan de migration détaillé

---

**Dernière mise à jour** : 20 décembre 2025
