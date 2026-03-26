# 🎬 Guide des Animations AnimeJS

> ⚠️ Document conservé pour historique. La version de référence est `docs/animations/ANIMATIONS_GUIDE.md`.

**Version** : 1.0  
**Date** : 20 décembre 2025  
**Bibliothèque** : AnimeJS

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
import anime from 'animejs';

anime({
  targets: element,        // Élément à animer (DOM, ref React, sélecteur CSS)
  opacity: [0, 1],         // Array [from, to] ou valeur unique
  duration: 500,           // Durée en millisecondes (pas secondes !)
  easing: 'easeOutQuad'    // Type d'easing
});
```

**Exemple concret** :
```typescript
// Fade-in simple
anime({
  targets: '.my-element',
  opacity: [0, 1],
  duration: 500,
  easing: 'easeOutQuad'
});
```

### 2. Animation avec plusieurs propriétés

```typescript
anime({
  targets: element,
  opacity: [0, 1],         // Fade in
  translateY: [20, 0],     // Slide up depuis 20px
  scale: [0.9, 1],         // Zoom léger
  duration: 500,
  easing: 'easeOutQuad'
});
```

### 3. Animation de plusieurs éléments (stagger)

**GSAP** :
```typescript
gsap.fromTo('.items', { opacity: 0 }, {
  opacity: 1,
  stagger: 0.1  // 0.1 secondes entre chaque élément
});
```

**AnimeJS** :
```typescript
anime({
  targets: '.items',
  opacity: [0, 1],
  delay: anime.stagger(100),  // 100ms entre chaque élément
  duration: 500
});
```

**⚠️ Important** : `anime.stagger()` prend des **millisecondes**, pas des secondes !

### 4. Timeline (orchestrer plusieurs animations)

**Syntaxe** :
```typescript
const tl = anime.timeline({
  // Options globales de la timeline
});

// Ajouter des animations
tl.add({
  targets: element1,
  opacity: [0, 1],
  duration: 500
});

tl.add({
  targets: element2,
  translateY: [20, 0],
  duration: 500
}, '-=200');  // Commence 200ms avant la fin de l'animation précédente
```

**Exemple complet** :
```typescript
const tl = anime.timeline();

// Animation 1 : Fade-in page
tl.add({
  targets: pageRef.current,
  opacity: [0, 1],
  duration: 300
});

// Animation 2 : Slide-up header (commence 200ms avant la fin de l'animation 1)
tl.add({
  targets: headerRef.current,
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 500
}, '-=200');

// Animation 3 : Stagger fade-in des items (commence en même temps que l'animation 2)
tl.add({
  targets: '.items',
  opacity: [0, 1],
  translateY: [10, 0],
  delay: anime.stagger(50),
  duration: 400
}, '-=500');
```

### 5. Callbacks

```typescript
anime({
  targets: element,
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
  const animation = anime({
    targets: elementRef.current,
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
| Animation simple | `gsap.to(el, {opacity: 1, duration: 0.5})` | `anime({targets: el, opacity: 1, duration: 500})` |
| From/To | `gsap.fromTo(el, {opacity: 0}, {opacity: 1})` | `anime({targets: el, opacity: [0, 1]})` |
| Timeline | `gsap.timeline()` | `anime.timeline()` |
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

### Fonctionnalités avancées

| Fonctionnalité | GSAP | AnimeJS |
|----------------|------|---------|
| Context (nettoyage auto) | `gsap.context()` | ❌ Pas d'équivalent natif (créer helper) |
| Animation d'objet | `gsap.fromTo(obj, {...})` | ✅ Supporté mais syntaxe différente |
| ScrollTrigger | ✅ Plugin natif | ❌ Pas de plugin natif |
| Repeat/Yoyo | `repeat: -1, yoyo: true` | `loop: true, direction: 'alternate'` |

---

## 📁 Structure des animations

### Organisation des fichiers

```
frontend/src/
├── animations/              # Dossier principal des animations
│   ├── index.ts            # Export centralisé de toutes les animations
│   ├── utils/              # Utilitaires et helpers AnimeJS
│   │   ├── animejs-helpers.ts  # Fonctions helper réutilisables
│   │   └── constants.ts        # Constantes (durées, easings, etc.)
│   ├── presets/            # Animations pré-configurées réutilisables
│   │   ├── fade-in.ts      # Animation fade-in réutilisable
│   │   ├── slide-up.ts     # Animation slide-up réutilisable
│   │   └── scale-hover.ts  # Animation hover scale réutilisable
│   └── components/         # Animations spécifiques à des composants
│       └── [ComponentName]/
│           └── [animation].ts
```

### Convention de nommage

- **Fichiers** : `kebab-case.ts` (ex: `fade-in.ts`, `slide-up.ts`)
- **Fonctions** : `camelCase` (ex: `fadeIn`, `slideUp`)
- **Presets** : Préfixe `animate` (ex: `animateFadeIn`, `animateSlideUp`)

---

## 💡 Exemples pratiques

### Exemple 1 : Fade-in simple

```typescript
// animations/presets/fade-in.ts
import anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface FadeInOptions {
  duration?: number;  // En millisecondes
  delay?: number;     // En millisecondes
  easing?: string;
  from?: number;
  to?: number;
}

export const animateFadeIn = (
  element: HTMLElement | string | null,
  options: FadeInOptions = {}
) => {
  if (!element) return;

  const {
    duration = ANIMATION_DURATIONS.NORMAL * 1000,  // Conversion secondes → ms
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
    from = 0,
    to = 1,
  } = options;

  return anime({
    targets: element,
    opacity: [from, to],
    duration,
    delay,
    easing,
  });
};
```

### Exemple 2 : Slide-up avec fade

```typescript
// animations/presets/slide-up.ts
import anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface SlideUpOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  distance?: number;  // En pixels
}

export const animateSlideUp = (
  element: HTMLElement | string | null,
  options: SlideUpOptions = {}
) => {
  if (!element) return;

  const {
    duration = ANIMATION_DURATIONS.NORMAL * 1000,
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
    distance = 20,
  } = options;

  return anime({
    targets: element,
    opacity: [0, 1],
    translateY: [distance, 0],
    duration,
    delay,
    easing,
  });
};
```

### Exemple 3 : Stagger fade-in

```typescript
// animations/presets/stagger-fade-in.ts
import anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, ANIMATION_STAGGER } from '../utils/constants';

export interface StaggerFadeInOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  stagger?: number;  // En millisecondes
  distance?: number;
}

export const animateStaggerFadeIn = (
  elements: NodeListOf<Element> | HTMLElement[] | string | null,
  options: StaggerFadeInOptions = {}
) => {
  if (!elements) return;

  const {
    duration = ANIMATION_DURATIONS.NORMAL * 1000,
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
    stagger = ANIMATION_STAGGER.NORMAL * 1000,  // Conversion secondes → ms
    distance = 20,
  } = options;

  return anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [distance, 0],
    duration,
    delay: anime.stagger(stagger, { start: delay }),
    easing,
  });
};
```

### Exemple 4 : Hook React avec nettoyage

```typescript
// animations/utils/animejs-helpers.ts
import { useEffect, useRef } from 'react';
import type { RefObject, DependencyList } from 'react';
import anime from 'animejs';

/**
 * Hook personnalisé pour utiliser AnimeJS avec React
 * 
 * Nettoie automatiquement les animations au démontage
 * 
 * @param callback - Fonction qui contient les animations AnimeJS
 * @param deps - Dépendances pour le useEffect
 * @returns Ref à attacher au container parent
 * 
 * @example
 * const scopeRef = useAnimeJS(() => {
 *   anime({ targets: '.fade-in', opacity: [0, 1], duration: 500 });
 * }, [data]);
 * 
 * return <div ref={scopeRef}>...</div>;
 */
export const useAnimeJS = (
  callback: () => void,
  deps: DependencyList = []
): RefObject<HTMLDivElement | null> => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<anime.AnimeInstance[]>([]);

  useEffect(() => {
    if (scopeRef.current) {
      // Exécuter le callback (créer les animations)
      callback();

      // Nettoyage au démontage
      return () => {
        animationsRef.current.forEach(anim => {
          anime.remove(anim);
        });
        animationsRef.current = [];
      };
    }
  }, deps);

  return scopeRef;
};
```

---

## ✅ Bonnes pratiques

### 1. Toujours nettoyer les animations

```typescript
useEffect(() => {
  const animation = anime({ /* ... */ });
  
  return () => {
    anime.remove(animation);  // Nettoyage
  };
}, []);
```

### 2. Vérifier que l'élément existe

```typescript
if (!elementRef.current) return;
anime({ targets: elementRef.current, /* ... */ });
```

### 3. Utiliser les constantes pour la cohérence

```typescript
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

anime({
  duration: ANIMATION_DURATIONS.NORMAL * 1000,  // Conversion
  easing: ANIMATION_EASES.DEFAULT
});
```

### 4. Respecter `prefers-reduced-motion`

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Pas d'animation ou animation instantanée
  element.style.opacity = '1';
  return;
}

// Animation normale
anime({ targets: element, opacity: [0, 1] });
```

### 5. Utiliser des timelines pour orchestrer

```typescript
// ✅ Bon : Timeline pour orchestrer
const tl = anime.timeline();
tl.add({ targets: el1, opacity: [0, 1] });
tl.add({ targets: el2, opacity: [0, 1] }, '-=200');

// ❌ Éviter : Animations séparées sans coordination
anime({ targets: el1, opacity: [0, 1] });
anime({ targets: el2, opacity: [0, 1] });
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

