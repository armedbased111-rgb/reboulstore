import { useEffect, useRef } from 'react';
import { websocketService } from '../services/websocket.service';
import type { Notification } from '../types/notifications';

/**
 * Hook pour utiliser WebSocket dans un composant React
 * 
 * @param userId - ID de l'utilisateur (optionnel)
 * @param role - Rôle de l'utilisateur ('admin', 'super_admin', ou undefined)
 * @param onNotification - Callback appelé quand une notification est reçue
 * @param notificationTypes - Types de notifications à écouter (optionnel, tous par défaut)
 */
export const useWebSocket = (
  userId?: string,
  role?: string,
  onNotification?: (notification: Notification) => void,
  notificationTypes?: string[],
) => {
  const callbackRef = useRef(onNotification);

  // Mettre à jour la référence du callback
  useEffect(() => {
    callbackRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    // Se connecter au WebSocket
    websocketService.connect(userId, role);

    // Ajouter les listeners
    const cleanupFunctions: (() => void)[] = [];

    if (callbackRef.current) {
      if (notificationTypes && notificationTypes.length > 0) {
        // Écouter seulement les types spécifiés
        notificationTypes.forEach((type) => {
          const cleanup = websocketService.on(type, (notification) => {
            callbackRef.current?.(notification);
          });
          cleanupFunctions.push(cleanup);
        });
      } else {
        // Écouter toutes les notifications
        const cleanup = websocketService.on('*', (notification) => {
          callbackRef.current?.(notification);
        });
        cleanupFunctions.push(cleanup);
      }
    }

    // Nettoyage à la déconnexion
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
      // Ne pas déconnecter complètement car d'autres composants peuvent utiliser le service
    };
  }, [userId, role, notificationTypes?.join(',')]);

  return {
    isConnected: websocketService.isConnected(),
    ping: () => websocketService.ping(),
  };
};

