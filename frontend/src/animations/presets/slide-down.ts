import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface SlideDownOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
  /** Distance en pixels pour le slide depuis le haut (défaut: -30) */
  distance?: number;
}

/**
 * Animation slide-down avec fade-in réutilisable
 * 
 * Fait apparaître un élément depuis le haut avec un fondu (opacity: 0, y: distance → opacity: 1, y: 0)
 * Parfait pour les menus, dropdowns, modals qui apparaissent depuis le haut
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
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
  element: gsap.TweenTarget,
  options: SlideDownOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
    distance = -30,
  } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, y: distance },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
    }
  );
};

