import React, { useState } from "react";
import styles from "../styles/contact.module.css";

export default function Contact() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ nom: "", email: "", message: "" });
  };

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Contactez-nous</h1>

      {sent && (
        <div className={styles.successBanner}>
          Votre message a bien été envoyé.
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="nom">Nom complet</label>
          <input
            id="nom"
            type="text"
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={4}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Envoyer
        </button>
      </form>
    </div>
  );
}