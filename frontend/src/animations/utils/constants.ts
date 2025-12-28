/**
 * Constantes pour les animations AnimeJS
 * 
 * Utilisées pour maintenir la cohérence dans tout le projet
 * 
 * ⚠️ IMPORTANT : Les durées sont en SECONDES (compatibilité avec ancien code GSAP)
 * Utiliser les helpers de conversion pour AnimeJS (qui utilise des millisecondes)
 */

// Durées d'animation standards (en secondes)
export const ANIMATION_DURATIONS = {
  FAST: 0.2,      // Animations rapides (hover, click)
  NORMAL: 0.5,    // Animations standard (fade-in, slide)
  SLOW: 0.8,      // Animations lentes (entrées importantes)
} as const;

// Types d'easing AnimeJS standards
export const ANIMATION_EASES = {
  DEFAULT: "easeOutQuad",      // Ease par défaut (fluide) - équivalent "power2.out" GSAP
  SMOOTH: "easeOutSine",       // Ease plus doux - équivalent "power1.out" GSAP
  SNAPPY: "easeOutCubic",      // Ease plus prononcé - équivalent "power3.out" GSAP
  BOUNCE: "easeOutBack",       // Ease avec rebond léger - équivalent "back.out" GSAP
  ELASTIC: "easeOutElastic",    // Ease élastique - équivalent "elastic.out" GSAP
  NONE: "linear",              // Linéaire (pas d'easing) - équivalent "none" GSAP
} as const;

// Mapping GSAP → AnimeJS (pour référence pendant migration)
export const GSAP_TO_ANIMEJS_EASING_MAP: Record<string, string> = {
  "power2.out": "easeOutQuad",
  "power1.out": "easeOutSine",
  "power3.out": "easeOutCubic",
  "back.out": "easeOutBack",
  "elastic.out": "easeOutElastic",
  "none": "linear",
  "power2.in": "easeInQuad",
  "power1.in": "easeInSine",
  "power1.inOut": "easeInOutSine",
} as const;

// Délais standards (en secondes)
export const ANIMATION_DELAYS = {
  NONE: 0,
  SHORT: 0.1,
  MEDIUM: 0.2,
  LONG: 0.4,
} as const;

// Valeurs de stagger standards (en secondes)
export const ANIMATION_STAGGER = {
  TIGHT: 0.05,    // Délai très court entre éléments
  NORMAL: 0.1,    // Délai normal
  LOOSE: 0.2,     // Délai plus long
} as const;

/**
 * Convertit une durée en secondes vers des millisecondes (pour AnimeJS)
 * 
 * @param seconds - Durée en secondes
 * @returns Durée en millisecondes
 * 
 * @example
 * const duration = toMilliseconds(ANIMATION_DURATIONS.NORMAL); // 500
 */
export const toMilliseconds = (seconds: number): number => {
  return seconds * 1000;
};

/**
 * Convertit un easing GSAP vers un easing AnimeJS
 * 
 * @param gsapEasing - Easing GSAP (ex: "power2.out")
 * @returns Easing AnimeJS (ex: "easeOutQuad")
 * 
 * @example
 * const easing = convertEasing("power2.out"); // "easeOutQuad"
 */
export const convertEasing = (gsapEasing: string): string => {
  return GSAP_TO_ANIMEJS_EASING_MAP[gsapEasing] || ANIMATION_EASES.DEFAULT;
};
