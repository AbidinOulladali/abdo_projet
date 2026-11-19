import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Banner from "./pages/banner";
import Footer from "./pages/footer";
import Acceuil from "./pages/acceuil";
import Produit from "./pages/produit";
import DetailProduit from "./pages/DetailProduit";
import PanierPage from "./pages/PanierPage";
import Contact from "./pages/contact";
import Profil from "./pages/Profil";
import Login from "./auth/login";
import Inscription from "./auth/inscription";

export const CART_STORAGE_KEY = "ma_boutique_panier_v1";
export const AUTH_STORAGE_KEY = "ma_boutique_user_v1";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Banner />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Acceuil />} />
            <Route path="/produits" element={<Produit />} />
            <Route path="/produits/:id" element={<DetailProduit />} />
            <Route path="/panier" element={<PanierPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscription" element={<Inscription />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}