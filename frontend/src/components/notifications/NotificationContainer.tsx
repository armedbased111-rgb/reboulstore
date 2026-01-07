import { useState, useCallback } from 'react';
import { NotificationToast } from './NotificationToast';
import type { Notification } from '../../types/notifications';

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (index: number) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Container pour afficher plusieurs notifications en toast
 * Position par défaut : top-right
 */
export const NotificationContainer = ({
  notifications,
  onRemove,
  position = 'top-right',
}: NotificationContainerProps) => {
  if (notifications.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`fixed ${getPositionClasses()} z-50 flex flex-col-reverse pointer-events-none`}
    >
      {notifications.map((notification, index) => (
        <div key={index} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onClose={() => onRemove(index)}
            duration={5000}
          />
        </div>
      ))}
    </div>
  );
};

