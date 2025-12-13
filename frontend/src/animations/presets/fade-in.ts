import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface FadeInOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
  /** Opacité de départ (défaut: 0) */
  from?: number;
  /** Opacité finale (défaut: 1) */
  to?: number;
}

/**
 * Animation fade-in réutilisable
 * 
 * Fait apparaître un élément en fondu (opacity: 0 → 1)
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateFadeIn(elementRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateFadeIn(elementRef.current, {
 *   duration: 0.8,
 *   delay: 0.2,
 *   ease: ANIMATION_EASES.SMOOTH
 * });
 */
export const animateFadeIn = (
  element: gsap.TweenTarget,
  options: FadeInOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
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

