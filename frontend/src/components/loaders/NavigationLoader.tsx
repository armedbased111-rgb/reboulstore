// frontend/src/components/loaders/NavigationLoader.tsx
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageLoader } from './PageLoader'

/**
 * NavigationLoader
 *
 * Affiche le loader inter-page à chaque changement de route.
 * Ne gère pas (pour l'instant) la durée réelle des requêtes,
 * mais offre un feedback visuel fluide lors des transitions.
 */
export const NavigationLoader = () => {
  // Utiliser useLocation avec gestion d'erreur
  let location: ReturnType<typeof useLocation>;
  try {
    location = useLocation();
  } catch (error) {
    // Si le contexte Router n'est pas disponible, ne rien afficher
    console.warn('NavigationLoader: Router context not available');
    return null;
  }

  const [isVisible, setIsVisible] = useState(false)
  const firstRenderRef = useRef(true)

  useEffect(() => {
    // Ne pas afficher le loader au tout premier rendu
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    setIsVisible(true)

    // Laisse le loader affiché un court instant (anim "premium" visible)
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, 900)

    return () => clearTimeout(timeout)
  }, [location])

  if (!isVisible) return null

  return <PageLoader state="default" />
}


