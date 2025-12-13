import { useEffect, useRef, RefObject, DependencyList } from 'react';
import gsap from 'gsap';

/**
 * Hook personnalisé pour utiliser GSAP avec React
 * 
 * Nettoie automatiquement les animations au démontage
 * Utilise gsap.context() pour un nettoyage propre
 * 
 * @param callback - Fonction qui contient les animations GSAP
 * @param deps - Dépendances pour le useEffect
 * @returns Ref à attacher au container parent
 * 
 * @example
 * const scopeRef = useGSAP(() => {
 *   gsap.from(".fade-in", { opacity: 0, duration: 0.5 });
 * }, [data]);
 * 
 * return <div ref={scopeRef}>...</div>;
 */
export const useGSAP = (
  callback: (ctx: gsap.Context) => void,
  deps: DependencyList = []
): RefObject<HTMLDivElement> => {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scopeRef.current) {
      const ctx = gsap.context(() => {
        callback(ctx);
      }, scopeRef.current);

      return () => ctx.revert(); // Nettoyage automatique
    }
  }, deps);

  return scopeRef;
};

