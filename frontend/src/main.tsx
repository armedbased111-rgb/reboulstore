import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { AnimationProvider } from './contexts/AnimationContext'
import { QuickSearchProvider } from './contexts/QuickSearchContext'
import { NotificationsProvider } from './components/notifications/NotificationsProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <CartProvider>
          <ToastProvider>
            <AnimationProvider>
              <QuickSearchProvider>
                <NotificationsProvider position="top-right">
                  <App />
                </NotificationsProvider>
              </QuickSearchProvider>
            </AnimationProvider>
          </ToastProvider>
        </CartProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
)
