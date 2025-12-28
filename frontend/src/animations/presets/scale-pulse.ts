import * as anime from 'animejs';
import { ANIMATION_DURATIONS, ANIMATION_EASES, toMilliseconds } from '../utils/constants';

export interface ScalePulseOptions {
  /** Échelle maximale (défaut: 1.1) */
  scale?: number;
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.FAST) */
  duration?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  easing?: string;
  /** Nombre de répétitions (défaut: 1) */
  iterations?: number;
}

/**
 * Animation scale pulse réutilisable (AnimeJS)
 * 
 * Fait pulser un élément (scale: 1 → scale → 1) avec répétition
 * Parfait pour les badges, notifications, éléments qui attirent l'attention
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Instance AnimeJS (pour contrôle si besoin)
 * 
 * @example
 * // Utilisation basique (1 pulse)
 * animateScalePulse(badgeRef.current);
 * 
 * @example
 * // Avec options personnalisées (2 pulses)
 * animateScalePulse(badgeRef.current, {
 *   scale: 1.2,
 *   duration: 0.3,
 *   iterations: 2
 * });
 */
export const animateScalePulse = (
  element: HTMLElement | string | null,
  options: ScalePulseOptions = {}
): ReturnType<typeof anime.createTimeline> | null => {
  if (!element) return null;

  const {
    scale = 1.1,
    duration = ANIMATION_DURATIONS.FAST,
    easing = ANIMATION_EASES.DEFAULT,
    iterations = 1,
  } = options;

  // Créer une timeline pour le pulse (scale up → scale down)
  const tl = anime.createTimeline({
    loop: iterations > 1 ? iterations - 1 : false,
  });

  // Scale up
  tl.add(element, {
    scale,
    duration: toMilliseconds(duration) / 2,
    easing,
  });

  // Scale down
  tl.add(element, {
    scale: 1,
    duration: toMilliseconds(duration) / 2,
    easing,
  });

  return tl;
};

