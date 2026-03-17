import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { BrandView } from './pages/BrandView'
import { RefView } from './pages/RefView'
import { UploadManager } from './pages/UploadManager'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/brand/:name" element={<BrandView />} />
        <Route path="/brand/:name/ref/:ref" element={<RefView />} />
        <Route path="/upload" element={<UploadManager />} />
      </Routes>
    </BrowserRouter>
  )
}
