import * as anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds } from '../utils/constants';

export interface SlideDownOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  easing?: string;
  /** Distance en pixels pour le slide depuis le haut (défaut: -30) */
  distance?: number;
}

/**
 * Animation slide-down avec fade-in réutilisable (AnimeJS)
 * 
 * Fait apparaître un élément depuis le haut avec un fondu (opacity: 0, translateY: distance → opacity: 1, translateY: 0)
 * Parfait pour les menus, dropdowns, modals qui apparaissent depuis le haut
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance AnimeJS (pour contrôle si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateSlideDown(menuRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateSlideDown(dropdownRef.current, {
 *   duration: 0.4,
 *   delay: 0.1,
 *   distance: -40
 * });
 */
export const animateSlideDown = (
  element: HTMLElement | string | null,
  options: SlideDownOptions = {}
): ReturnType<typeof anime.animate> | null => {
  if (!element) return null;

  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    easing = ANIMATION_EASES.DEFAULT,
    distance = -30,
  } = options;

  return anime.animate(element, {
    
    opacity: [0, 1],
    translateY: [distance, 0],
    duration: toMilliseconds(duration),
    delay: toMilliseconds(delay),
    easing,
  });
};
