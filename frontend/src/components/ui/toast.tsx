import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  onClose: () => void;
}

/**
 * Composant Toast - Notification temporaire style A-COLD-WALL*
 * 
 * Affiche une notification en bas à gauche avec :
 * - Message principal
 * - Action optionnelle (lien cliquable)
 * - Icône de validation
 * - Auto-dismiss après durée définie
 */
export const Toast = ({
  message,
  actionLabel,
  onAction,
  duration = 2000,
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timerShow = setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    const timerHide = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }, duration);

    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
    };
  }, [duration, onClose]);

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-black text-white px-4 py-3 rounded-[10px] shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      {/* Icône de validation */}
      <div className="flex-shrink-0">
        <Check className="w-5 h-5" />
      </div>

      {/* Message et action */}
      <div className="flex items-center gap-3">
        <span className="font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] uppercase">
          {message}
        </span>

        {actionLabel && onAction && (
          <button
            onClick={handleAction}
            className="font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] uppercase underline hover:no-underline transition-all"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

