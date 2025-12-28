import * as anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds } from '../utils/constants';

/**
 * Options pour l'animation test-slide
 */
export interface TestSlideOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  easing?: string;
}

/**
 * Animation test-slide réutilisable (AnimeJS)
 * 
 * Fait glisser un élément vers le haut avec fondu
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance AnimeJS (pour contrôle si besoin)
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
 *   easing: ANIMATION_EASES.SMOOTH
 * });
 */
export const animateTestSlide = (
  element: HTMLElement | string | null,
  options: TestSlideOptions = {}
): ReturnType<typeof anime.animate> | null => {
  if (!element) return null;

  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
  } = options;

  return anime.animate(element, {
    
    opacity: [0, 1],
    translateY: [50, 0],
    duration: toMilliseconds(duration),
    delay: toMilliseconds(delay),
    easing,
  });
};
