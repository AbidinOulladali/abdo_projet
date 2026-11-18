import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Banner from './pages/banner'
import Acceuil from './pages/acceuil'
import Produit from './pages/produit'
import Contact from './pages/contact'
import Login from './auth/login'
import Inscription from './auth/inscription'

import Footer from './pages/footer'
import './App.css'
import PaiementBillet from './components/PaiementBillet'

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Banner />
        
        <Routes>
          <Route path="/" element={
            <div className="mainBody">
              <Acceuil />
              <Produit />
              <Contact />
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/paiement" element={<PaiementBillet />} /> {/* <-- Zid had la route */}
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App