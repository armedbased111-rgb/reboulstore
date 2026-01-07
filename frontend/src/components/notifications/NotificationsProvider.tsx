import { useState, useCallback, ReactNode } from 'react';
import { NotificationContainer } from './NotificationContainer';
import type { Notification } from '../../types/notifications';
import { useWebSocket } from '../../hooks/useWebSocket';

interface NotificationsProviderProps {
  children: ReactNode;
  userId?: string;
  role?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Provider pour gérer les notifications WebSocket globalement
 * 
 * Utilisation :
 * ```tsx
 * <NotificationsProvider userId={user?.id} role={user?.role}>
 *   <App />
 * </NotificationsProvider>
 * ```
 */
export const NotificationsProvider = ({
  children,
  userId,
  role,
  position = 'top-right',
}: NotificationsProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Callback appelé quand une notification est reçue
  const handleNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Limiter à 5 notifications maximum
    setNotifications((prev) => prev.slice(0, 5));
  }, []);

  // Utiliser le hook WebSocket
  useWebSocket(userId, role, handleNotification);

  // Supprimer une notification
  const removeNotification = useCallback((index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position={position}
      />
    </>
  );
};

