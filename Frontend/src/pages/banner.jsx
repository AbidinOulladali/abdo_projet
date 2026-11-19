import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AUTH_STORAGE_KEY, CART_STORAGE_KEY } from "../App";
import styles from "../styles/banner.module.css";

function getCartCount() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items)
      ? items.reduce((acc, item) => acc + Number(item.quantite || 0), 0)
      : 0;
  } catch {
    return 0;
  }
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Banner() {
  const [totalArticles, setTotalArticles] = useState(getCartCount);
  const [user, setUser] = useState(getCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const syncCart = () => setTotalArticles(getCartCount());
    const syncAuth = () => setUser(getCurrentUser());

    window.addEventListener("storage", syncCart);
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-updated", syncAuth);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-updated", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event("auth-updated"));
    } catch {
      // ignorer
    }
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const displayName = user?.nom || user?.name || user?.email || "Profil";

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          Ma boutique
        </NavLink>

        <nav className={styles.links} aria-label="Navigation principale">
          <NavLink to="/" end className={linkClass}>
            Accueil
          </NavLink>
          <NavLink to="/produits" className={linkClass}>
            Produits
          </NavLink>
          <NavLink to="/panier" className={linkClass}>
            Panier
            <span className={styles.badge}>{totalArticles}</span>
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profil" className={linkClass}>
                {displayName}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.link}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/inscription" className={linkClass}>
                Inscription
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}