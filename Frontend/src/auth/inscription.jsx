import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css';

export default function Inscription() {
  const [constForma, setConstForma] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmationPwd: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Bach n-dirou redirection mra wrah t-ssajel

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

    if (constForma.password !== constForma.confirmationPwd) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Le backend exige au moins 12 caractères pour le mot de passe
    if (constForma.password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      return;
    }

    setError('');

    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(constForma)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inscription réussie ! Connectez-vous.');
        navigate('/login'); // Rediriger vers la page de connexion
      } else {
        setError(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error(err);
      setError('Impossible de contacter le serveur');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Inscription</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="nom">Nom :</label>
          <input type="text" id="nom" placeholder="Entrez votre nom" value={constForma.nom} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="prenom">Prénom :</label>
          <input type="text" id="prenom" placeholder="Entrez votre prénom" value={constForma.prenom} onChange={handleChange} required />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email :</label>
          <input type="email" id="email" placeholder="Entrez votre email" value={constForma.email} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password (12 car. min) :</label>
          <input type="password" id="password" placeholder="Créez un mot de passe" value={constForma.password} onChange={handleChange} required />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmationPwd">Confirmation Password :</label>
          <input type="password" id="confirmationPwd" placeholder="Confirmez le mot de passe" value={constForma.confirmationPwd} onChange={handleChange} required />
        </div>

        {error && <p style={{ color: 'red', fontSize: '13px', margin: '0' }}>{error}</p>}

        <button type="submit" className={styles.btn}>S'inscrire</button>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/login" style={{ fontSize: '14px', color: '#1e3a60' }}>Déjà un compte ? Se connecter</Link>
        </div>
      </form>
    </div>
  );
}