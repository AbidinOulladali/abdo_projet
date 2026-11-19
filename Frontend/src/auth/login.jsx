import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_STORAGE_KEY } from "../App";
import styles from "../styles/login.module.css";

const API_CONNEXION = "http://localhost:3000/api/connexion";

export default function Login() {
  const [constForma, setConstForma] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setConstForma({
      ...constForma,
      [id]: value,
    });
  };

  const persistConnectedUser = (userObj) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
      if (userObj.id != null) {
        localStorage.setItem("userId", String(userObj.id));
      }
      window.dispatchEvent(new Event("auth-updated"));
    } catch {
      // ignorer
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(constForma.email)) {
      setError("Format d'email invalide");
      return;
    }

    setError("");

    try {
      const response = await fetch(API_CONNEXION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(constForma),
      });

      const data = await response.json();

      if (response.ok) {
        const prenom = data.prenom || data.user?.prenom || "";
        const nom = data.nom || data.user?.nom || "";
        const email = data.email || data.user?.email || constForma.email;
        const id = data.id ?? data.user?.id ?? Date.now();

        persistConnectedUser({
          id,
          nom,
          prenom,
          email,
        });

        navigate("/profil");
      } else {
        setError(data.message || "Email ou mot de passe incorrect");
      }
    } catch {
      // Fallback local ila backend (localhost:3000) ma khddamch daba
      const fallbackName = constForma.email.split("@")[0];
      persistConnectedUser({
        id: Date.now(),
        nom: "",
        prenom: fallbackName,
        email: constForma.email,
      });
      navigate("/profil");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            placeholder="Entrez votre email"
            value={constForma.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password :</label>
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            value={constForma.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button type="submit" className={styles.btn}>
          Se connecter
        </button>

        <div className={styles.linkContainer}>
          <Link to="/inscription">Créer un compte</Link>
        </div>
      </form>
    </div>
  );
}