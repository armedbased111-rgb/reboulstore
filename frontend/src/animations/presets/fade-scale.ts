import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface FadeScaleOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.FAST) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
  /** Échelle initiale (défaut: 0.9) */
  scaleFrom?: number;
  /** Échelle finale (défaut: 1) */
  scaleTo?: number;
}

/**
 * Animation fade-scale réutilisable
 * 
 * Combine opacity et scale pour un effet d'apparition zoomée
 * Parfait pour les boutons, badges, éléments qui apparaissent avec un effet zoom
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateFadeScale(buttonRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateFadeScale(badgeRef.current, {
 *   duration: 0.3,
 *   scaleFrom: 0.8,
 *   scaleTo: 1
 * });
 */
export const animateFadeScale = (
  element: gsap.TweenTarget,
  options: FadeScaleOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.FAST,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
    scaleFrom = 0.9,
    scaleTo = 1,
  } = options;

  return gsap.fromTo(
    element,
    { opacity: 0, scale: scaleFrom },
    {
      opacity: 1,
      scale: scaleTo,
      duration,
      delay,
      ease,
    }
  );
};

