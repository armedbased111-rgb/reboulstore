// frontend/src/components/loaders/TopBarLoader.tsx
import { useEffect, useRef } from 'react'
import * as anime from 'animejs'
import { toMilliseconds, convertEasing } from '../../animations/utils/constants'

/**
 * Loader barre fine en haut de page (design Figma type "progress bar")
 *
 * À utiliser pour les transitions inter-pages.
 */
export const TopBarLoader = () => {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!barRef.current) return

    if (prefersReducedMotion) {
      barRef.current.style.transform = 'scaleX(1)'
      return
    }

    anime.animate(barRef.current, {
      scaleX: [0, 1],
      duration: toMilliseconds(0.8),
      easing: convertEasing('power2.out'),
      loop: true,
      direction: 'alternate', // Équivalent yoyo
    })

    return () => {
      if (barRef.current) anime.remove(barRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[9998] flex justify-center pointer-events-none">
      <div className="w-full max-w-5xl px-4">
        <div className="h-[2px] w-full bg-black/10 overflow-hidden rounded-full">
          <div
            ref={barRef}
            className="h-full w-full bg-black"
            style={{ transform: 'scaleX(0)', transformOrigin: '0% 50%' }}
          />
        </div>
      </div>
    </div>
  )
}


