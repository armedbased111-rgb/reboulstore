import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
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
        <Route path="/catalog" element={<Layout><div className="p-8"><h1 className="text-4xl font-bold">Catalogue</h1><p className="mt-4">Page catalogue à venir</p></div></Layout>} />
        <Route path="/about" element={<Layout><div className="p-8"><h1 className="text-4xl font-bold">À propos</h1><p className="mt-4">Page à propos à venir</p></div></Layout>} />
        <Route path="/cart" element={<Layout><div className="p-8"><h1 className="text-4xl font-bold">Panier</h1><p className="mt-4">Page panier à venir</p></div></Layout>} />
        
        {/* Pages de test sans Layout */}
        <Route path="/test-api" element={<TestApi />} />
        <Route path="/test-services" element={<TestServices />} />
        <Route path="/test-hooks" element={<TestHooks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
