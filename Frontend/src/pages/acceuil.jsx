import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { CART_STORAGE_KEY, FALLBACK_IMAGE } from "../App";
import { PRODUITS_CATALOGUE } from "./produit";
import styles from "../styles/acceuil.module.css";

export default function Acceuil() {
  const featuredProducts = useMemo(
    () => PRODUITS_CATALOGUE.slice(0, 3),
    []
  );

  const addToCart = useCallback((product) => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((item) => item.id === product.id);
      const next = existing
        ? cart.map((item) =>
            item.id === product.id
              ? { ...item, quantite: item.quantite + 1 }
              : item
          )
        : [
            ...cart,
            {
              id: product.id,
              nom: product.nom,
              prix: Number(product.prix),
              image: product.image || FALLBACK_IMAGE,
              quantite: 1,
            },
          ];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      // ignorer
    }
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <div>
          <h1 className={styles.heroTitle}>
            Équipez votre bureau avec du matériel fiable
          </h1>
          <p className={styles.heroText}>
            Claviers mécaniques, souris précises et écrans haute fréquence.
            Parcourez le catalogue, ajoutez vos articles au panier et gérez votre
            commande facilement.
          </p>
          <div className={styles.actions}>
            <Link to="/produits" className={styles.btnLight}>
              Voir tous les produits
            </Link>
            <Link to="/panier" className={styles.btnPrimary}>
              Accéder au panier
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80"
          alt="Setup informatique moderne"
          className={styles.heroImg}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Sélection populaire</h2>
          <Link to="/produits" className={styles.btnOutline}>
            Tout afficher
          </Link>
        </div>

        <div className={styles.grid}>
          {featuredProducts.map((item) => (
            <article key={item.id} className={styles.card}>
              <img
                src={item.image}
                alt={item.nom}
                className={styles.cardImg}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className={styles.cardBody}>
                <span className={styles.cat}>{item.categorie}</span>
                <h3 className={styles.name}>{item.nom}</h3>
                <p className={styles.desc}>{item.description}</p>
                <div className={styles.price}>{item.prix} €</div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => addToCart(item)}
                  >
                    Ajouter au panier
                  </button>
                  <Link
                    to={`/produits/${item.id}`}
                    className={styles.btnOutline}
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}