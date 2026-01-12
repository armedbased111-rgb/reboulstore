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
  // Les hooks doivent être appelés inconditionnellement
  const [isVisible, setIsVisible] = useState(false)
  const firstRenderRef = useRef(true)
  
  // Utiliser useLocation - peut échouer si Router context n'est pas disponible
  let location: ReturnType<typeof useLocation> | null = null;
  try {
    location = useLocation();
  } catch {
    // Si le contexte Router n'est pas disponible, ne rien afficher
    return null;
  }

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
  }, [location?.pathname])

  if (!isVisible) return null

  return <PageLoader state="default" />
}


