import * as anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds } from '../utils/constants';

export interface FadeOutOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.FAST) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  easing?: string;
  /** Distance en pixels pour le slide (défaut: -10) */
  distance?: number;
}

/**
 * Animation fade-out avec slide réutilisable (AnimeJS)
 * 
 * Fait disparaître un élément avec un fondu et slide (opacity: 1 → 0, translateY: 0 → distance)
 * Parfait pour fermer des menus, dropdowns, modals
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance AnimeJS (pour contrôle si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateFadeOut(menuRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateFadeOut(dropdownRef.current, {
 *   duration: 0.2,
 *   distance: -20
 * });
 */
export const animateFadeOut = (
  element: HTMLElement | string | null,
  options: FadeOutOptions = {}
): ReturnType<typeof anime.animate> | null => {
  if (!element) return null;

  const {
    duration = ANIMATION_DURATIONS.FAST,
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
    distance = -10,
  } = options;

  return anime.animate(element, {
    
    opacity: [1, 0],
    translateY: [0, distance],
    duration: toMilliseconds(duration),
    delay: toMilliseconds(delay),
    easing,
  });
};

