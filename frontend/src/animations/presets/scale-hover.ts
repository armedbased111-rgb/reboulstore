import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../utils/constants';

export interface ScaleHoverOptions {
  /** Échelle au hover (défaut: 1.05) */
  scale?: number;
  /** Durée de l'animation en secondes (défaut: ANIMATION_DURATIONS.FAST) */
  duration?: number;
  /** Type d'easing (défaut: ANIMATION_EASES.DEFAULT) */
  ease?: string;
}

/**
 * Animation scale au hover réutilisable
 * 
 * Ajoute un effet de zoom au survol d'un élément
 * Nettoie automatiquement les event listeners au démontage
 * 
 * @param element - Élément DOM, ref React, ou sélecteur CSS
 * @param options - Options d'animation
 * @returns Fonction de nettoyage à appeler dans useEffect cleanup
 * 
 * @example
 * useEffect(() => {
 *   const cleanup = animateScaleHover(buttonRef.current);
 *   return cleanup;
 * }, []);
 */
export const animateScaleHover = (
  element: gsap.TweenTarget | null,
  options: ScaleHoverOptions = {}
): (() => void) => {
  if (!element) {
    return () => {}; // Retourne une fonction vide si pas d'élément
  }

  const {
    scale = 1.05,
    duration = ANIMATION_DURATIONS.FAST,
    ease = ANIMATION_EASES.DEFAULT,
  } = options;

  const handleMouseEnter = () => {
    gsap.to(element, {
      scale,
      duration,
      ease,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      scale: 1,
      duration,
      ease,
    });
  };

  // Ajouter les event listeners
  if (element instanceof Element) {
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
  }

  // Retourner fonction de nettoyage
  return () => {
    if (element instanceof Element) {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      // Réinitialiser le scale
      gsap.set(element, { scale: 1 });
    }
  };
};

