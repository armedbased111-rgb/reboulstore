import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { AnimationProvider } from './contexts/AnimationContext'
import { QuickSearchProvider } from './contexts/QuickSearchContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AnimationProvider>
            <QuickSearchProvider>
          <App />
            </QuickSearchProvider>
          </AnimationProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
