import * as anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds } from '../utils/constants';

export interface FadeInOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  easing?: string;
  /** Opacité de départ (défaut: 0) */
  from?: number;
  /** Opacité finale (défaut: 1) */
  to?: number;
}

/**
 * Animation fade-in réutilisable (AnimeJS)
 * 
 * Fait apparaître un élément en fondu (opacity: 0 → 1)
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance AnimeJS (pour contrôle si besoin)
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
 *   easing: ANIMATION_EASES.SMOOTH
 * });
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
    from = 0,
    to = 1,
  } = options;

  return anime.animate(element, {
    opacity: [from, to],
    duration: toMilliseconds(duration),  // Conversion secondes → millisecondes
    delay: toMilliseconds(delay),         // Conversion secondes → millisecondes
    easing,
  });
};
