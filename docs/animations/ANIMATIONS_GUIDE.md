# 🎬 Guide des Animations GSAP

**Version** : 1.0  
**Date** : 12 décembre 2025  
**Bibliothèque** : GSAP (GreenSock Animation Platform)

---

## 📋 Table des matières

1. [Présentation de GSAP](#présentation-de-gsap)
2. [Structure des animations](#structure-des-animations)
3. [Workflow de création d'animation](#workflow-de-création-danimation)
4. [Concepts de base GSAP](#concepts-de-base-gsap)
5. [Exemples d'animations](#exemples-danimations)
6. [Bonnes pratiques](#bonnes-pratiques)
7. [Références](#références)

---

## 🎯 Présentation de GSAP

### Qu'est-ce que GSAP ?

**GSAP (GreenSock Animation Platform)** est une bibliothèque JavaScript ultra-performante pour créer des animations fluides et professionnelles.

### Pourquoi GSAP pour notre projet ?

- ✅ **Performance** : Animations 60fps garanties
- ✅ **Contrôle total** : Plus de contrôle que CSS animations
- ✅ **Compatibilité** : Fonctionne partout (navigateurs, React, etc.)
- ✅ **Flexibilité** : Timeline complexes, scroll triggers, etc.
- ✅ **Documentation** : Excellente documentation et communauté

### Installation

```bash
npm install gsap
```

---

## 📁 Structure des animations

### Organisation des fichiers

```
frontend/src/
├── animations/              # Dossier principal des animations
│   ├── index.ts            # Export centralisé de toutes les animations
│   ├── utils/              # Utilitaires et helpers GSAP
│   │   └── gsap-helpers.ts # Fonctions helper réutilisables
│   ├── presets/            # Animations pré-configurées réutilisables
│   │   ├── fade-in.ts      # Animation fade-in réutilisable
│   │   ├── slide-up.ts     # Animation slide-up réutilisable
│   │   └── scale-hover.ts  # Animation hover scale réutilisable
│   └── components/         # Animations spécifiques à des composants
│       ├── ProductPage/
│       │   ├── product-fade-in.ts
│       │   └── badge-appear.ts
│       └── OrderCard/
│           └── card-hover.ts
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

**Exemple :**

```typescript
// animations/presets/fade-in.ts
import gsap from 'gsap';

/**
 * Animation fade-in réutilisable
 * 
 * @param element - Élément DOM ou sélecteur CSS
 * @param options - Options d'animation (duration, delay, ease, etc.)
 * @returns Timeline GSAP (pour chaînage si besoin)
 */
export const animateFadeIn = (
  element: gsap.TweenTarget,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    from?: number;
    to?: number;
  } = {}
) => {
  const {
    duration = 0.5,
    delay = 0,
    ease = "power2.out",
    from = 0,
    to = 1,
  } = options;

  return gsap.fromTo(
    element,
    { opacity: from },
    {
      opacity: to,
      duration,
      delay,
      ease,
    }
  );
};
```

### Étape 3 : Exporter dans index.ts

```typescript
// animations/index.ts
export { animateFadeIn } from './presets/fade-in';
export { animateSlideUp } from './presets/slide-up';
// ... autres exports
```

### Étape 4 : Utiliser dans un composant

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

---

## 📚 Concepts de base GSAP

### 1. Les 3 méthodes principales

#### `gsap.to()` - Animer vers un état

```typescript
// Animer vers opacity: 1 en 0.5 secondes
gsap.to(".element", { opacity: 1, duration: 0.5 });
```

#### `gsap.from()` - Animer depuis un état

```typescript
// Partir de opacity: 0 et aller vers l'état CSS actuel
gsap.from(".element", { opacity: 0, duration: 0.5 });
```

#### `gsap.fromTo()` - Contrôler début ET fin

```typescript
// Partir de opacity: 0, aller vers opacity: 1
gsap.fromTo(
  ".element",
  { opacity: 0 },        // État initial
  { opacity: 1, duration: 0.5 }  // État final
);
```

### 2. Propriétés CSS animables

GSAP peut animer presque toutes les propriétés CSS :

- **Position** : `x`, `y` (translateX/Y), `rotation`
- **Taille** : `scale`, `scaleX`, `scaleY`, `width`, `height`
- **Opacité** : `opacity`, `autoAlpha` (opacity + visibility)
- **Couleurs** : `backgroundColor`, `color`, `borderColor`
- **Filtres** : `blur`, `brightness`, `contrast`
- **Transform** : `transform`, `transformOrigin`

### 3. Options importantes

| Option | Type | Description | Exemple |
|--------|------|-------------|---------|
| `duration` | number | Durée en secondes | `0.5` |
| `delay` | number | Délai avant l'animation | `0.2` |
| `ease` | string | Type d'animation | `"power2.out"` |
| `stagger` | number | Délai entre éléments multiples | `0.1` |
| `repeat` | number | Nombre de répétitions | `2`, `-1` (infini) |
| `yoyo` | boolean | Aller-retour | `true` |

### 4. Easing (courbes d'animation)

**Types d'ease courants :**

- `"power1.out"` - Démarrage rapide, ralentit (défaut fluide)
- `"power2.out"` - Plus prononcé que power1
- `"power3.out"` - Encore plus prononcé
- `"back.out"` - Recul léger (effet rebond)
- `"elastic.out"` - Effet élastique
- `"bounce.out"` - Effet rebond
- `"none"` - Linéaire (pas d'easing)

**Variantes :**
- `.out` - Rapide au début, lent à la fin (défaut)
- `.in` - Lent au début, rapide à la fin
- `.inOut` - Lent au début et à la fin, rapide au milieu

### 5. Timelines (séquences d'animations)

Pour créer des animations séquentielles :

```typescript
const tl = gsap.timeline();

tl.to(".element1", { opacity: 1, duration: 0.5 })
  .to(".element2", { opacity: 1, duration: 0.5 })  // Après element1
  .to(".element3", { opacity: 1, duration: 0.5 }); // Après element2

// Avec délais personnalisés
tl.to(".element1", { opacity: 1, duration: 0.5 })
  .to(".element2", { opacity: 1, duration: 0.5 }, "-=0.2")  // 0.2s avant la fin de element1
  .to(".element3", { opacity: 1, duration: 0.5 }, "+=0.1"); // 0.1s après element2
```

### 6. Utilisation avec React

**Hook personnalisé recommandé :**

```typescript
// hooks/useGSAP.ts
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useGSAP = (callback: (ctx: gsap.Context) => void, deps: React.DependencyList = []) => {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scopeRef.current) {
      const ctx = gsap.context(() => {
        callback(ctx);
      }, scopeRef.current);

      return () => ctx.revert(); // Nettoyage
    }
  }, deps);

  return scopeRef;
};
```

**Utilisation :**

```typescript
const scopeRef = useGSAP(() => {
  gsap.from(".fade-in", { opacity: 0, duration: 0.5, stagger: 0.1 });
}, [data]);

return <div ref={scopeRef}>...</div>;
```

---

## 💡 Exemples d'animations

### Exemple 1 : Fade-in simple

```typescript
// animations/presets/fade-in.ts
import gsap from 'gsap';

export const animateFadeIn = (
  element: gsap.TweenTarget,
  options: { duration?: number; delay?: number } = {}
) => {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      duration: options.duration || 0.5,
      delay: options.delay || 0,
      ease: "power2.out",
    }
  );
};
```

### Exemple 2 : Slide-up avec fade

```typescript
// animations/presets/slide-up.ts
import gsap from 'gsap';

export const animateSlideUp = (
  element: gsap.TweenTarget,
  options: { 
    duration?: number; 
    delay?: number;
    distance?: number; // Distance en pixels
  } = {}
) => {
  const distance = options.distance || 20;
  
  return gsap.fromTo(
    element,
    { opacity: 0, y: distance },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.5,
      delay: options.delay || 0,
      ease: "power2.out",
    }
  );
};
```

### Exemple 3 : Scale au hover

```typescript
// animations/presets/scale-hover.ts
import gsap from 'gsap';

export const animateScaleHover = (
  element: gsap.TweenTarget,
  options: { scale?: number; duration?: number } = {}
) => {
  const scale = options.scale || 1.05;
  const duration = options.duration || 0.2;

  // Hover in
  element.addEventListener('mouseenter', () => {
    gsap.to(element, { scale, duration, ease: "power2.out" });
  });

  // Hover out
  element.addEventListener('mouseleave', () => {
    gsap.to(element, { scale: 1, duration, ease: "power2.out" });
  });
};
```

### Exemple 4 : Stagger (animation en cascade)

```typescript
// animations/presets/stagger-fade-in.ts
import gsap from 'gsap';

export const animateStaggerFadeIn = (
  elements: gsap.TweenTarget,
  options: { 
    duration?: number;
    stagger?: number; // Délai entre chaque élément
  } = {}
) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.4,
      stagger: options.stagger || 0.1, // 0.1s entre chaque
      ease: "power2.out",
    }
  );
};
```

---

## ✅ Bonnes pratiques

### 1. Toujours nettoyer les animations

```typescript
useEffect(() => {
  const animation = gsap.to(elementRef.current, { opacity: 1 });
  
  return () => {
    animation.kill(); // Nettoyer si le composant se démonte
  };
}, []);
```

### 2. Utiliser `gsap.context()` pour le nettoyage automatique

```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".element1", { opacity: 1 });
    gsap.to(".element2", { opacity: 1 });
  }, containerRef.current);

  return () => ctx.revert(); // Nettoie toutes les animations
}, []);
```

### 3. Créer des animations réutilisables

**✅ BON :**

```typescript
// animations/presets/fade-in.ts
export const animateFadeIn = (element, options) => { ... }

// Utilisation dans plusieurs composants
import { animateFadeIn } from '../../animations';
```

**❌ MAUVAIS :**

```typescript
// Dupliquer le code dans chaque composant
gsap.from(element, { opacity: 0, duration: 0.5 });
```

### 4. Utiliser des variables pour la cohérence

```typescript
// animations/utils/constants.ts
export const ANIMATION_DURATIONS = {
  FAST: 0.2,
  NORMAL: 0.5,
  SLOW: 0.8,
};

export const ANIMATION_EASES = {
  DEFAULT: "power2.out",
  SMOOTH: "power1.out",
  SNAPPY: "power3.out",
};
```

### 5. Respecter les préférences utilisateur (réduire les animations)

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  gsap.to(element, { opacity: 1, duration: 0.5 });
} else {
  // Animation minimale ou pas d'animation
  element.style.opacity = '1';
}
```

### 6. Performance : Utiliser `will-change` CSS

```typescript
// GSAP le fait automatiquement, mais tu peux aussi :
gsap.set(element, { willChange: "transform, opacity" });
// ... animation
gsap.set(element, { willChange: "auto" }); // Nettoyer après
```

---

## 📖 Références

### Documentation officielle

- **GSAP Documentation** : https://greensock.com/docs/
- **GSAP React Guide** : https://greensock.com/react/
- **GSAP Easing Visualizer** : https://greensock.com/ease-visualizer/

### Plugins GSAP (à installer si besoin)

- **ScrollTrigger** : Animations déclenchées au scroll
- **MotionPath** : Suivre un chemin SVG
- **SplitText** : Animation de texte lettre par lettre

### Cheat Sheet rapide

```typescript
// Simple fade-in
gsap.to(element, { opacity: 1, duration: 0.5 });

// Slide + fade
gsap.from(element, { opacity: 0, y: 20, duration: 0.5 });

// Scale
gsap.to(element, { scale: 1.1, duration: 0.3 });

// Stagger (plusieurs éléments)
gsap.to(".items", { opacity: 1, y: 0, stagger: 0.1 });

// Timeline
const tl = gsap.timeline();
tl.to(".el1", { opacity: 1 })
  .to(".el2", { opacity: 1 }, "-=0.2");

// Hover
element.addEventListener('mouseenter', () => {
  gsap.to(element, { scale: 1.05, duration: 0.2 });
});
```

---

## 🎯 Workflow résumé

1. **Identifier** le besoin d'animation
2. **Décider** si réutilisable ou spécifique
3. **Créer** le fichier dans `animations/presets/` ou `animations/components/`
4. **Exporter** dans `animations/index.ts`
5. **Utiliser** dans le composant avec `useRef` + `useEffect`
6. **Tester** et ajuster
7. **Documenter** avec JSDoc

---

**Dernière mise à jour** : 12 décembre 2025

