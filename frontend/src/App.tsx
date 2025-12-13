import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { TestApi } from './components/TestApi'
import { TestServices } from './components/TestServices'
import { TestHooks } from './components/TestHooks'
import { TestAuth } from './components/TestAuth'

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/test-api" element={<TestApi />} />
        <Route path="/test-services" element={<TestServices />} />
        <Route path="/test-hooks" element={<TestHooks />} />
        <Route path="/test-auth" element={<TestAuth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App