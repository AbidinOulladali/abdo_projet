import React, { useState } from 'react';
import styles from '../styles/paiement.module.css';

export default function PaiementBillet() {
  const [montant, setMontant] = useState('');
  const [detailsTrajet, setDetailsTrajet] = useState('');
  
  // Champs pour la carte bancaire
  const [numCarte, setNumCarte] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  
  // États de gestion de l'affichage
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [billetInfo, setBilletInfo] = useState(null);

  // Récupération de l'ID utilisateur connecté (1 par défaut pour le test)
  const userId = localStorage.getItem('userId') || 1;

  const handlePaiement = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setBilletInfo(null);

    try {
      // Requête conforme au cahier des charges : POST /commande/paiement
      const response = await fetch('/api/commande/paiement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          montant: Number(montant),
          detailsTrajet: detailsTrajet,
          numeroCarte: numCarte // Permet de simuler les échecs si la carte finit par '00'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage(data.message);
        setBilletInfo({
          paiementId: data.paiementId,
          billetId: data.billetId,
          montant,
          detailsTrajet,
          date: new Date().toLocaleDateString('fr-FR')
        });
      } else {
        setIsError(true);
        setMessage(data.message || 'Échec lors du traitement du paiement');
      }
    } catch (err) {
      console.error('Erreur client :', err);
      setIsError(true);
      setMessage('Impossible de contacter le serveur backend');
    }
  };

  // Fonction pour imprimer / télécharger le billet sous format PDF
  const handleTelechargerPDF = () => {
    window.print();
  };

  return (
    <div className={styles.paiementContainer}>
      <h2>Paiement et Émission des Billets</h2>
      
      <form onSubmit={handlePaiement} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Détails du Trajet / Billets :</label>
          <input 
            type="text" 
            value={detailsTrajet} 
            onChange={(e) => setDetailsTrajet(e.target.value)} 
            placeholder="Ex: Paris - Madrid, Place A12" 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Montant (€) :</label>
          <input 
            type="number" 
            value={montant} 
            onChange={(e) => setMontant(e.target.value)} 
            placeholder="Ex: 150" 
            required 
          />
        </div>

        {/* --- Champs de Carte Bancaire (Sécurisés & Visuels) --- */}
        <div className={styles.inputGroup}>
          <label>Numéro de Carte Bancaire :</label>
          <input 
            type="text" 
            maxLength="16" 
            value={numCarte} 
            onChange={(e) => setNumCarte(e.target.value)} 
            placeholder="4532 •••• •••• 8890 (Astuce: finir par '00' pour tester l'échec)" 
            required 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>Expiration (MM/YY) :</label>
            <input 
              type="text" 
              maxLength="5" 
              value={expDate} 
              onChange={(e) => setExpDate(e.target.value)} 
              placeholder="12/28" 
              required 
            />
          </div>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>CVC :</label>
            <input 
              type="password" 
              maxLength="3" 
              value={cvc} 
              onChange={(e) => setCvc(e.target.value)} 
              placeholder="123" 
              required 
            />
          </div>
        </div>

        <button type="submit" className={styles.btnPay}>
          Valider et Payer
        </button>
      </form>

      {/* --- Message de confirmation ou d'erreur --- */}
      {message && (
        <div className={`${styles.message} ${isError ? styles.errorMessage : ''}`}>
          {message}
        </div>
      )}

      {/* --- Carte Billet Électronique --- */}
      {billetInfo && (
        <div className={styles.billetCard}>
          <h3>🎟️ Billet Électronique Officiel</h3>
          <p><strong>N° de Billet :</strong> #{billetInfo.billetId}</p>
          <p><strong>N° de Transaction :</strong> #{billetInfo.paiementId}</p>
          <p><strong>Trajet / Détails :</strong> {billetInfo.detailsTrajet}</p>
          <p><strong>Montant Payé :</strong> {billetInfo.montant} €</p>
          <p><strong>Date d'Émission :</strong> {billetInfo.date}</p>
          
          <span className={styles.validStatus}>Statut : Payé & Émis ✅</span>

          <button 
            onClick={handleTelechargerPDF} 
            className={styles.btnDownload}
          >
            📥 Télécharger / Imprimer le Billet (PDF)
          </button>
        </div>
      )}
    </div>
  );
}