import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface RevealUpOptions {
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.NORMAL) */
  duration?: number;
  /** Délai avant le début de l'animation en secondes (défaut: 0) */
  delay?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
  /** Distance en pixels pour le reveal depuis le bas (défaut: 40) */
  distance?: number;
  /** Opacité de départ (défaut: 0) */
  opacity?: number;
}

/**
 * Animation reveal-up réutilisable
 * 
 * Fait apparaître un élément avec un effet de révélation depuis le bas
 * Combine opacity et translateY pour un effet fluide
 * Parfait pour les sections, hero, cards importantes
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Timeline GSAP (pour chaînage si besoin)
 * 
 * @example
 * // Utilisation basique
 * animateRevealUp(sectionRef.current);
 * 
 * @example
 * // Avec options personnalisées
 * animateRevealUp(heroRef.current, {
 *   duration: 0.8,
 *   delay: 0.2,
 *   distance: 60
 * });
 */
export const animateRevealUp = (
  element: gsap.TweenTarget,
  options: RevealUpOptions = {}
): gsap.core.Tween => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    ease = ANIMATION_EASES.DEFAULT,
    distance = 40,
    opacity = 0,
  } = options;

  return gsap.fromTo(
    element,
    { opacity, y: distance },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
    }
  );
};

