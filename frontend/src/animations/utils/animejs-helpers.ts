import { useEffect, useRef } from 'react';
import type { RefObject, DependencyList } from 'react';
import * as anime from 'animejs';

/**
 * Hook personnalisé pour utiliser AnimeJS avec React
 * 
 * Nettoie automatiquement les animations au démontage
 * 
 * @param callback - Fonction qui contient les animations AnimeJS
 * @param deps - Dépendances pour le useEffect
 * @returns Ref à attacher au container parent
 * 
 * @example
 * const scopeRef = useAnimeJS(() => {
 *   anime({ anime.animate('.fade-in', { opacity: [0, 1], duration: 500 });
 * }, [data]);
 * 
 * return <div ref={scopeRef}>...</div>;
 */
export const useAnimeJS = (
  callback: () => void,
  deps: DependencyList = []
): RefObject<HTMLDivElement | null> => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const animationsRef = useRef<ReturnType<typeof anime.animate>[]>([]);

  useEffect(() => {
    if (scopeRef.current) {
      // Exécuter le callback (créer les animations)
      callback();

      // Nettoyage au démontage
      return () => {
        // Nettoyer toutes les animations créées dans le scope
        if (scopeRef.current) {
          anime.remove(scopeRef.current);
        }
        animationsRef.current.forEach(anim => {
          if (anim) anime.remove(anim);
        });
        animationsRef.current = [];
      };
    }
  }, deps);

  return scopeRef;
};

/**
 * Nettoie toutes les animations AnimeJS d'un élément
 * 
 * @param element - Élément DOM ou sélecteur CSS
 * 
 * @example
 * cleanupAnimation(elementRef.current);
 */
export const cleanupAnimation = (element: HTMLElement | string | null): void => {
  if (!element) return;
  anime.remove(element);
};

