import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Product } from './pages/Product'
import { Cart } from './pages/cart'
import { Checkout } from './pages/Checkout'
import { About } from './pages/About'
import { TestApi } from './components/TestApi'
import { TestServices } from './components/TestServices'
import { TestHooks } from './components/TestHooks'

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
          path="/about" 
          element={
            <Layout>
              <About />
            </Layout>
          } 
        />
        
        {/* Pages de test sans Layout */}
        <Route path="/test-api" element={<TestApi />} />
        <Route path="/test-services" element={<TestServices />} />
        <Route path="/test-hooks" element={<TestHooks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App