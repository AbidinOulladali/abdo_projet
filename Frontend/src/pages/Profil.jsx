import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_STORAGE_KEY } from "../App";
import styles from "../styles/contact.module.css";

export default function Profil() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
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

  if (!user) {
    return (
      <div className={styles.panel}>
        <h1 className={styles.title}>Aucun compte connecté</h1>
        <p style={{ marginBottom: "14px", color: "var(--muted)" }}>
          Veuillez vous connecter pour accéder à votre profil.
        </p>
        <Link to="/login" className={styles.submitBtn}>
          Aller à Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Mon Profil</h1>
      <div style={{ display: "grid", gap: "8px", marginBottom: "18px" }}>
        {user.nom && (
          <p>
            <strong>Nom :</strong> {user.nom}
          </p>
        )}
        {user.email && (
          <p>
            <strong>Email :</strong> {user.email}
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Link to="/produits" className={styles.submitBtn}>
          Voir les produits
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "#fff",
            color: "var(--danger)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}