import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

/**
 * Options pour l'animation test-slide
 */
export interface TestSlideOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
}

/**
 * Animation test-slide réutilisable
 * 
 * Fait glisser un élément vers le haut avec fondu
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateTestSlide(elementRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateTestSlide(elementRef.current, {
 *   duration: 0.8,
 *   delay: 0.2,
 *   ease: ANIMATION_EASES.SMOOTH
 * });
 */
export const animateTestSlide = (
  element: gsap.TweenTarget,
  options: TestSlideOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
  } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration,
      delay,
      ease,
    }
  );
};
