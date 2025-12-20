// frontend/src/components/loaders/TopBarLoader.tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

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

    const tl = gsap.timeline({ repeat: -1, yoyo: true })

    tl.fromTo(
      barRef.current,
      { scaleX: 0, transformOrigin: '0% 50%' },
      { scaleX: 1, duration: 0.8, ease: 'power2.out' },
    )

    return () => {
      tl.kill()
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


