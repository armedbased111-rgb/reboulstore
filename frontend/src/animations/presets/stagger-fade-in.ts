import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES, ANIMATION_STAGGER } from '../utils/constants';

export interface StaggerFadeInOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai initial avant le début de l'animation (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
  /** Délai entre chaque élément (stagger) en secondes (défaut: ANIMATION_STAGGER.NORMAL) */
  stagger?: number;
  /** Distance en pixels pour le slide depuis le bas (défaut: 20) */
  distance?: number;
}

/**
 * Animation stagger fade-in avec slide-up réutilisable
 * 
 * Anime plusieurs éléments en cascade avec un fondu et slide depuis le bas
 * Parfait pour animer des listes d'éléments (cards, items, etc.)
 * 
 * @param elements - Éléments DOM, refs React, ou sélecteur CSS (plusieurs éléments)
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateStaggerFadeIn('.product-card');
 * 
 * @example
 * // Avec options personnalisées
 * animateStaggerFadeIn('.items', {
 *   duration: 0.4,
 *   stagger: 0.1,
 *   distance: 30
 * });
 */
export const animateStaggerFadeIn = (
  elements: gsap.TweenTarget,
  options: StaggerFadeInOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
    stagger = ANIMATION_STAGGER.NORMAL,
    distance = 20,
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y: distance },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

