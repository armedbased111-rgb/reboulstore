import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8"><h1 className="text-4xl font-bold">Reboul Store</h1><p className="mt-4">Bienvenue sur le site e-commerce Reboul Store</p></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
