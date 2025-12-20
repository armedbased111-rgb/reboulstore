// frontend/src/components/loaders/PageLoader.tsx
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

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

    // Timeline "premium" type Webflow/Apple :
    // - Barre : remplissage progressif, petite pause, reset discret
    // - Logo : léger breathing (opacity/scale subtil)
    const tl = gsap.timeline({ repeat: -1 })
    const progressObj = { value: 0 }

    tl.fromTo(
      centerBarRef.current,
      { scaleX: 0, transformOrigin: '0% 50%' },
      {
        scaleX: 1,
        duration: 1.1,
        ease: 'power2.out',
      },
    )
      // micro-pause en fin de barre pleine
      .to(centerBarRef.current, {
        scaleX: 1,
        duration: 0.15,
        ease: 'none',
      })
      // reset discret (retour à 0 sans flash)
      .to(centerBarRef.current, {
        scaleX: 0,
        duration: 0.25,
        ease: 'power1.inOut',
      })

    // Texte de progression "CHARGEMENT : 0–100%"
    tl.fromTo(
      progressObj,
      { value: 0 },
      {
        value: 100,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          if (progressTextRef.current) {
            const value = Math.round(progressObj.value)
            progressTextRef.current.textContent = `CHARGEMENT : ${value}%`
          }
        },
      },
      0,
    )

    tl.fromTo(
      logoRef.current,
      { opacity: 0.85, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        ease: 'power1.out',
      },
      0, // démarre en même temps que la barre
    ).to(logoRef.current, {
      opacity: 0.9,
      scale: 0.985,
      duration: 0.5,
      ease: 'power1.inOut',
    })

    return () => {
      tl.kill()
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