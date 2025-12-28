import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAnimeJS, cleanupAnimation } from '../animations/utils/animejs-helpers';
import { ANIMATION_DURATIONS, ANIMATION_EASES } from '../animations/utils/constants';

interface AnimationContextType {
  /**
   * Indique si les animations doivent être réduites (prefers-reduced-motion)
   */
  prefersReducedMotion: boolean;
  /**
   * Fonction pour nettoyer une animation
   */
  cleanup: (target: HTMLElement | string | null) => void;
  /**
   * Hook pour utiliser AnimeJS avec nettoyage automatique
   */
  useAnimation: typeof useAnimeJS;
  /**
   * Durées d'animation standards
   */
  durations: typeof ANIMATION_DURATIONS;
  /**
   * Types d'easing standards
   */
  eases: typeof ANIMATION_EASES;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
}

/**
 * Provider pour gérer les animations dans toute l'application
 * 
 * Fonctionnalités :
 * - Détection de prefers-reduced-motion
 * - Nettoyage centralisé des animations
 * - Configuration centralisée (durées, easings)
 * - Helpers pour les animations
 */
export const AnimationProvider = ({ children }: AnimationProviderProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /**
   * Détecter la préférence prefers-reduced-motion
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Écouter les changements de préférence
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Fonction de nettoyage centralisée
   */
  const cleanup = useCallback((target: HTMLElement | string | null) => {
    if (!target) return;
    cleanupAnimation(target);
  }, []);

  const value: AnimationContextType = {
    prefersReducedMotion,
    cleanup,
    useAnimation: useAnimeJS,
    durations: ANIMATION_DURATIONS,
    eases: ANIMATION_EASES,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'animation
 * 
 * @example
 * ```tsx
 * const { prefersReducedMotion, cleanup, durations } = useAnimation();
 * 
 * useEffect(() => {
 *   if (prefersReducedMotion) return;
 *   
 *   const anim = animateFadeIn(elementRef.current);
 *   return () => cleanup(elementRef.current);
 * }, [prefersReducedMotion, cleanup]);
 * ```
 */
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

