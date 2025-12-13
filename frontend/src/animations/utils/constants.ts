/**
 * Constantes pour les animations GSAP
 * 
 * Utilisées pour maintenir la cohérence dans tout le projet
 */

// Durées d'animation standards
export const ANIMATION_DURATIONS = {
  FAST: 0.2,      // Animations rapides (hover, click)
  NORMAL: 0.5,    // Animations standard (fade-in, slide)
  SLOW: 0.8,      // Animations lentes (entrées importantes)
} as const;

// Types d'easing standards
export const ANIMATION_EASES = {
  DEFAULT: "power2.out",    // Ease par défaut (fluide)
  SMOOTH: "power1.out",     // Ease plus doux
  SNAPPY: "power3.out",     // Ease plus prononcé
  BOUNCE: "back.out",       // Ease avec rebond léger
  ELASTIC: "elastic.out",   // Ease élastique
  NONE: "none",             // Linéaire (pas d'easing)
} as const;

// Délais standards
export const ANIMATION_DELAYS = {
  NONE: 0,
  SHORT: 0.1,
  MEDIUM: 0.2,
  LONG: 0.4,
} as const;

// Valeurs de stagger standards
export const ANIMATION_STAGGER = {
  TIGHT: 0.05,    // Délai très court entre éléments
  NORMAL: 0.1,    // Délai normal
  LOOSE: 0.2,     // Délai plus long
} as const;

