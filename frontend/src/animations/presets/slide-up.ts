import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface SlideUpOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
  /** Distance en pixels pour le slide depuis le bas (défaut: 20) */
  distance?: number;
}

/**
 * Animation slide-up avec fade-in réutilisable
 * 
 * Fait apparaître un élément depuis le bas avec un fondu (opacity: 0, y: distance → opacity: 1, y: 0)
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
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
  element: gsap.TweenTarget,
  options: SlideUpOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
    distance = 20,
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

