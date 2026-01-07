import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { AnimationProvider } from './contexts/AnimationContext'
import { QuickSearchProvider } from './contexts/QuickSearchContext'
import { NotificationsProvider } from './components/notifications/NotificationsProvider'

// Composant interne pour accéder à AuthContext
function AppWithNotifications() {
  const { user } = useAuth();
  
  return (
    <NotificationsProvider
      userId={user?.id}
      role={user?.role}
      position="top-right"
    >
      <App />
    </NotificationsProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AnimationProvider>
              <QuickSearchProvider>
                <AppWithNotifications />
              </QuickSearchProvider>
            </AnimationProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
