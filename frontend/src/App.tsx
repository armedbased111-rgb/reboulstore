import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Search } from './pages/Search'
import { Product } from './pages/Product'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Stores } from './pages/Stores'
import { ShippingReturns } from './pages/ShippingReturns'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { NotFound } from './pages/NotFound'
import { ServerError } from './pages/ServerError'
// ErrorBoundary importé mais non utilisé pour l'instant
// import { ErrorBoundary } from './components/ErrorBoundary'
import { NavigationLoader } from './components/loaders/NavigationLoader'
import { PageLoader } from './components/loaders/PageLoader'
import { LoaderPlayground } from './pages/LoaderPlayground'
import ProductStitchDemo from './pages/ProductStitchDemo'
import { HeaderPlayground } from './pages/HeaderPlayground'
function App() {
  const [showInitialLoader, setShowInitialLoader] = useState(true)

  useEffect(() => {
    // Précharger le logo du loader (ressource critique)
    const img = new Image()
    img.src = '/webdesign/logo/logo_w_hzhfoc.png'

    const timeout = setTimeout(() => {
      setShowInitialLoader(false)
    }, 2000) // Loader d'ouverture plus court (2s)

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
          path="/search" 
          element={
            <Layout>
              <Search />
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
          path="/contact" 
          element={
            <Layout>
              <Contact />
            </Layout>
          } 
        />
        <Route 
          path="/stores" 
          element={
            <Layout>
              <Stores />
            </Layout>
          } 
        />
        <Route 
          path="/shipping-returns" 
          element={
            <Layout>
              <ShippingReturns />
            </Layout>
          } 
        />
        <Route 
          path="/terms" 
          element={
            <Layout>
              <Terms />
            </Layout>
          } 
        />
        <Route 
          path="/privacy" 
          element={
            <Layout>
              <Privacy />
            </Layout>
          } 
        />
        
        {/* Pages d'erreur */}
        <Route 
          path="/500" 
          element={
            <Layout>
              <ServerError />
            </Layout>
          } 
        />
        
        {/* Route 404 - Doit être en dernier */}
        <Route 
          path="*" 
          element={
            <Layout>
              <NotFound />
            </Layout>
          } 
        />
        
        {/* Pages de test sans Layout */}
        <Route path="/loader-playground" element={<LoaderPlayground />} />
        <Route path="/product-stitch-demo" element={<ProductStitchDemo />} />
        <Route path="/header-playground" element={<HeaderPlayground />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App