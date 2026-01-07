import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Notification } from '../../types/notifications';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  duration?: number; // Durée d'affichage en ms (0 = infini)
}

/**
 * Composant Toast pour afficher une notification
 * Style inspiré A-COLD-WALL* : Minimaliste, noir et blanc
 */
export const NotificationToast = ({
  notification,
  onClose,
  duration = 5000,
}: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Attendre l'animation de fermeture
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Déterminer le style selon le type de notification
  const getNotificationStyle = () => {
    switch (notification.type) {
      case 'order.created':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'order.status.changed':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'product.stock.low':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div
      className={`${getNotificationStyle()} border rounded-lg shadow-lg p-4 mb-3 min-w-[300px] max-w-[400px] transition-all duration-300 animate-in slide-in-from-top-5`}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wide">
            {notification.message}
          </p>
          {notification.data && (
            <p className="text-xs mt-1 opacity-75">
              {new Date(notification.timestamp).toLocaleTimeString('fr-FR')}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fermer la notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

