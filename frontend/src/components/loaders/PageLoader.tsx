// frontend/src/components/loaders/PageLoader.tsx
import { useEffect, useRef, useState } from 'react'
import * as anime from 'animejs'
import { toMilliseconds, convertEasing } from '../../animations/utils/constants'

type LoaderState = 'default' | 'loaded'

interface PageLoaderProps {
  /**
   * State du loader tel que défini dans Figma :
   * - "default" : animation en boucle (chargement en cours)
   * - "loaded" : état chargé (barre remplie, animation stoppée)
   */
  state?: LoaderState
  /**
   * Étapes textuelles affichées sous le pourcentage,
   * uniquement utilisées pour le loader d'ouverture du site.
   */
  steps?: string[]
}

/**
 * Loader centré Reboul (design Figma type "Apple loading")
 *
 * - Overlay plein écran
 * - Logo centré
 * - Barre de progression sous le logo
 */
export const PageLoader = ({ state = 'default', steps }: PageLoaderProps) => {
  const centerBarRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const progressTextRef = useRef<HTMLSpanElement | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    if (!centerBarRef.current || !logoRef.current) {
      return
    }

    // État "loaded" : on force la barre à 100% sans animation, le logo reste statique
    if (state === 'loaded') {
      if (centerBarRef.current) {
        centerBarRef.current.style.transform = 'scaleX(1)'
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = 'CHARGEMENT : 100%'
      }
      return
    }

    // Durée totale de l'animation : 2s (plus courte)
    const totalDuration = toMilliseconds(2)
    const startTime = Date.now()
    let animationFrameId: number | null = null
    let isCancelled = false

    // Fonction pour mettre à jour le pourcentage
    const updateProgress = () => {
      if (isCancelled || !progressTextRef.current) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
      const value = Math.round(progress)
      
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `CHARGEMENT : ${value}%`
      }

      // Continuer la mise à jour si on n'a pas atteint 100%
      if (progress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress)
      } else {
        // S'assurer qu'on affiche 100% à la fin
        if (progressTextRef.current) {
          progressTextRef.current.textContent = 'CHARGEMENT : 100%'
        }
      }
    }

    // Démarrer la mise à jour du pourcentage
    animationFrameId = requestAnimationFrame(updateProgress)

    // Timeline pour la barre et le logo
    const tl = anime.createTimeline({
      // Pas de loop : animation unique de 0% à 100%
    })

    // Barre : remplissage progressif de 0% à 100%
    // Durée totale : 3.5s (correspond au timeout dans App.tsx)
    tl.add(centerBarRef.current, {
      scaleX: [0, 1],
      duration: totalDuration,
      easing: convertEasing('power2.out'),
    })

    // Logo : breathing (démarre en même temps que la barre)
    tl.add(logoRef.current, {
      opacity: [0.85, 1],
      scale: [0.98, 1],
      duration: totalDuration,
      easing: convertEasing('power1.out'),
    }, 0) // Démarre en même temps que la barre

    return () => {
      // Annuler la mise à jour du pourcentage
      isCancelled = true
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      // Nettoyer toutes les animations
      if (centerBarRef.current) anime.remove(centerBarRef.current)
      if (logoRef.current) anime.remove(logoRef.current)
    }
  }, [state])

  // Avancer dans les étapes textuelles (pour le loader d'ouverture)
  useEffect(() => {
    if (!steps || steps.length === 0) return

    // On fait défiler les steps toutes les ~1.1s (durée du remplissage)
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) return prev
        return prev + 1
      })
    }, 1100)

    return () => clearInterval(interval)
  }, [steps])

  return (
    <>
      {/* Overlay centré plein écran */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/75 backdrop-blur-sm">
        <div ref={logoRef} className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <img
              src="/webdesign/logo/logo_w_hzhfoc.png"
              alt="Reboulstore logo"
              className="w-full h-full object-contain"
              style={{ filter: 'invert(1)' }}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-[2px] w-40 bg-black/10 overflow-hidden rounded-full">
              <div
                ref={centerBarRef}
                className="h-full w-full bg-black"
                style={{ transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
              />
            </div>
            <span
              ref={progressTextRef}
              className="text-[10px] tracking-[0.2em] uppercase text-black/70"
            >
              CHARGEMENT : 0%
            </span>
            {steps && steps.length > 0 && (
              <span className="text-[10px] tracking-[0.18em] uppercase text-black/50">
                {`${currentStepIndex + 1}x ${steps[currentStepIndex]}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}