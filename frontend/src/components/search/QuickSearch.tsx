import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { SearchCombobox } from './SearchCombobox';
import * as anime from 'animejs';
import { toMilliseconds, ANIMATION_EASES } from '../../animations/utils/constants';
import { useQuickSearchContext } from '../../contexts/QuickSearchContext';

interface QuickSearchProps {
  /** Contrôle si le QuickSearch est ouvert */
  open: boolean;
  /** Callback quand l'état d'ouverture change */
  onOpenChange: (open: boolean) => void;
}

/**
 * Composant QuickSearch - Recherche rapide avec overlay full-screen
 * Accessible via Cmd/Ctrl + K
 */
export const QuickSearch = ({ open, onOpenChange }: QuickSearchProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation d'ouverture/fermeture
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (open) {
      setIsAnimating(true);
      // Animation overlay (fade in)
      anime.animate(overlayRef.current, {
        opacity: [0, 1],
        duration: toMilliseconds(0.3),
        easing: ANIMATION_EASES.DEFAULT,
      });

      // Animation contenu (scale + fade)
      anime.animate(contentRef.current, {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: toMilliseconds(0.4),
        easing: ANIMATION_EASES.DEFAULT,
        complete: () => {
          setIsAnimating(false);
        },
      });
    } else {
      setIsAnimating(true);
      // Animation de fermeture
      const timeline = anime.createTimeline();

      timeline.add(contentRef.current, {
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: toMilliseconds(0.2),
        easing: ANIMATION_EASES.DEFAULT,
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      timeline.add(overlayRef.current, {
        opacity: [1, 0],
        duration: toMilliseconds(0.2),
        easing: ANIMATION_EASES.DEFAULT,
      }, '-=100');
    }
  }, [open]);

  // Fermer avec Escape
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  // Empêcher le scroll du body quand ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open && !isAnimating) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Fermer uniquement si on clique directement sur l'overlay (pas sur le contenu)
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-start justify-center pt-8 md:pt-16 px-4 pointer-events-none"
      >
        <div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium uppercase text-gray-900">
              Recherche rapide
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* SearchCombobox intégré */}
          <div className="p-2" onClick={(e) => e.stopPropagation()}>
            <SearchCombobox
              open={true}
              onOpenChange={() => {
                // Ne pas fermer le QuickSearch quand le Popover interne change d'état
                // Le QuickSearch reste toujours ouvert
              }}
              width="w-full"
              disableOutsideClick={true}
              renderWithoutPopover={true}
            />
          </div>

          {/* Footer avec raccourci clavier */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                    Esc
                  </kbd>
                  <span>pour fermer</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  ↑↓
                </kbd>
                <span>pour naviguer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

