import * as anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds } from '../utils/constants';

export interface SlideUpOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  easing?: string;
  /** Distance en pixels pour le slide depuis le bas (défaut: 20) */
  distance?: number;
}

/**
 * Animation slide-up avec fade-in réutilisable (AnimeJS)
 * 
 * Fait apparaître un élément depuis le bas avec un fondu (opacity: 0, translateY: distance → opacity: 1, translateY: 0)
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance AnimeJS (pour contrôle si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateSlideUp(elementRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateSlideUp(elementRef.current, {
 *   duration: 0.6,
 *   delay: 0.2,
 *   distance: 30
 * });
 */
export const animateSlideUp = (
  element: HTMLElement | string | null,
  options: SlideUpOptions = {}
): ReturnType<typeof anime.animate> | null => {
  if (!element) return null;

  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
    distance = 20,
  } = options;

  return anime.animate(element, {
    opacity: [0, 1],
    translateY: [distance, 0],
    duration: toMilliseconds(duration),
    delay: toMilliseconds(delay),
    easing,
  });
};
