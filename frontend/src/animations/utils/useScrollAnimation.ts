import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export interface UseScrollAnimationOptions {
  /** Seuil de visibilité (0-1) pour déclencher l'animation (défaut: 0.2) */
  threshold?: number;
  /** Marge de déclenchement en px ou string (défaut: '0px') */
  rootMargin?: string;
  /** Désactiver l'animation après la première fois (défaut: true) */
  once?: boolean;
}

/**
 * Hook personnalisé pour déclencher des animations au scroll (AnimeJS)
 * 
 * Utilise Intersection Observer pour détecter quand un élément entre dans le viewport
 * Retourne une ref à attacher à l'élément et appelle le callback avec l'élément quand il devient visible
 * 
 * Compatible avec toutes les bibliothèques d'animation (AnimeJS, GSAP, etc.)
 * 
 * @param callback - Fonction à appeler quand l'élément devient visible (reçoit l'élément en paramètre)
 * @param options - Options de l'Intersection Observer
 * @returns Ref à attacher à l'élément
 * 
 * @example
 * import { animateRevealUp } from '../../animations';
 * 
 * const elementRef = useScrollAnimation((element) => {
 *   animateRevealUp(element);
 * }, { threshold: 0.2 });
 * 
 * return <div ref={elementRef}>Content</div>;
 */
export const useScrollAnimation = (
  callback: (element: HTMLDivElement) => void,
  options: UseScrollAnimationOptions = {}
): RefObject<HTMLDivElement | null> => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const {
    threshold = 0.2,
    rootMargin = '0px',
    once = true,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Si déjà animé et once=true, ne pas créer l'observer
    if (hasAnimated.current && once) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === element) {
            callback(element);
            if (once) {
              hasAnimated.current = true;
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, threshold, rootMargin, once]);

  return elementRef;
};

