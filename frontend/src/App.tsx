import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Product } from './pages/Product'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { Orders } from './pages/Orders'
import { OrderDetail } from './pages/OrderDetail'
import { About } from './pages/About'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NavigationLoader } from './components/loaders/NavigationLoader'
import { PageLoader } from './components/loaders/PageLoader'
import { LoaderPlayground } from './pages/LoaderPlayground'

function App() {
  const [showInitialLoader, setShowInitialLoader] = useState(true)

  useEffect(() => {
    // Précharger le logo du loader (ressource critique)
    const img = new Image()
    img.src = '/webdesign/logo/logo_w_hzhfoc.png'

    const timeout = setTimeout(() => {
      setShowInitialLoader(false)
    }, 3500) // Loader d'ouverture légèrement plus long (~3,5s)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <BrowserRouter>
      {showInitialLoader && (
        <PageLoader
          state="default"
          steps={[
            'MISE EN PLACE DES STOCKS',
            'CHARGEMENT DES COLLECTIONS',
            'INITIALISATION DES BOUTIQUES',
            'CONFIGURATION DES PARAMÈTRES',
            'TESTING ET VALIDATION',
            'LANCEMENT OFFICIEL',
          ]}
        />
      )}
      <NavigationLoader />
      <Routes>
        {/* Pages avec Layout */}
        <Route 
          path="/" 
          element={
            <Layout>
              <Home />
            </Layout>
          } 
        />
        <Route 
          path="/catalog" 
          element={
            <Layout>
              <Catalog />
            </Layout>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <Layout>
              <Product />
            </Layout>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <Layout>
              <Cart />
            </Layout>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <Layout>
              <Checkout />
            </Layout>
          } 
        />
        <Route 
          path="/order-confirmation" 
          element={
            <Layout>
              <OrderConfirmation />
            </Layout>
          } 
        />
        <Route 
          path="/about" 
          element={
            <Layout>
              <About />
            </Layout>
          } 
        />
        <Route 
          path="/login" 
          element={
            <Layout>
              <Login />
            </Layout>
          } 
        />
        <Route 
          path="/register" 
          element={
            <Layout>
              <Register />
            </Layout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <Layout>
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/orders/:id" 
          element={
            <Layout>
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            </Layout>
          } 
        />
        
        {/* Pages de test sans Layout */}

        <Route path="/loader-playground" element={<LoaderPlayground />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App