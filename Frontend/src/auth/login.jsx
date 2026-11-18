import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css';

export default function Login() {
  const [constForma, setConstForma] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setConstForma({
      ...constForma,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(constForma.email)) {
      setError('Format d\'email invalide');
      return;
    }

    setError('');

    try {
      const response = await fetch('/api/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(constForma)
      });

      const data = await response.json();

      if (response.ok) {
        // Sauvegarde de l'ID utilisateur pour le module Paiement / Billets
        localStorage.setItem('userId', data.id);
        alert(`Bienvenue ${data.prenom} ! Connexion réussie.`);
        navigate('/'); // Redirection vers la page d'accueil
      } else {
        setError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error(err);
      setError('Impossible de contacter le serveur');
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

        <button type="submit" className={styles.btn}>Se connecter</button>
        
        <div className={styles.linkContainer}>
          <Link to="/inscription">Créer un compte</Link>
        </div>
      </form>
    </div>
  );
}