import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_STORAGE_KEY } from "../App";
import styles from "../styles/login.module.css";

const API_INSCRIPTION = "http://localhost:3000/api/inscription";

export default function Inscription() {
  const [constForma, setConstForma] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmationPwd: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(constForma.email)) {
      setError("Format d'email invalide");
      return;
    }

    if (constForma.password !== constForma.confirmationPwd) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (constForma.password.length < 12) {
      setError("Le mot de passe doit contenir au moins 12 caractères");
      return;
    }

    setError("");

    try {
      const response = await fetch(API_INSCRIPTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(constForma),
      });

      const data = await response.json();

      if (response.ok) {
        const connectedUser = {
          id: data.id ?? data.user?.id ?? Date.now(),
          nom: data.nom || data.user?.nom || constForma.nom,
          prenom: data.prenom || data.user?.prenom || constForma.prenom,
          email: data.email || data.user?.email || constForma.email,
        };

        try {
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify(connectedUser)
          );
          if (connectedUser.id != null) {
            localStorage.setItem("userId", String(connectedUser.id));
          }
          window.dispatchEvent(new Event("auth-updated"));
        } catch {
          // ignorer
        }

        navigate("/profil");
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Inscription</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            id="nom"
            placeholder="Entrez votre nom"
            value={constForma.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="prenom">Prénom :</label>
          <input
            type="text"
            id="prenom"
            placeholder="Entrez votre prénom"
            value={constForma.prenom}
            onChange={handleChange}
            required
          />
        </div>

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
          <label htmlFor="password">Password (12 car. min) :</label>
          <input
            type="password"
            id="password"
            placeholder="Créez un mot de passe"
            value={constForma.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmationPwd">Confirmation Password :</label>
          <input
            type="password"
            id="confirmationPwd"
            placeholder="Confirmez le mot de passe"
            value={constForma.confirmationPwd}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "13px", margin: "0" }}>
            {error}
          </p>
        )}

        <button type="submit" className={styles.btn}>
          S&apos;inscrire
        </button>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Link
            to="/login"
            style={{ fontSize: "14px", color: "#1e3a60" }}
          >
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
}