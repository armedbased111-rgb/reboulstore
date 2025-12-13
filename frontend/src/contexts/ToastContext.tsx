import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '../components/ui/toast';

interface ToastData {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Rendre les toasts (on prend le dernier pour éviter l'empilement) */}
      {toasts.length > 0 &&
        toasts.map((toast, index) => {
          // Afficher uniquement le dernier toast
          if (index === toasts.length - 1) {
            return (
              <Toast
                key={toast.id}
                message={toast.message}
                actionLabel={toast.actionLabel}
                onAction={toast.onAction}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            );
          }
          return null;
        })}
    </ToastContext.Provider>
  );
};

