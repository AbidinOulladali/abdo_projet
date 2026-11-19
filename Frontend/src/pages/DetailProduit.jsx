import React, { useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { CART_STORAGE_KEY, FALLBACK_IMAGE } from "../App";
import { PRODUITS_CATALOGUE } from "./produit";
import styles from "../styles/detailProduit.module.css";

export default function DetailProduit() {
  const { id } = useParams();

  const product = useMemo(
    () => PRODUITS_CATALOGUE.find((p) => String(p.id) === String(id)),
    [id]
  );

  const addToCart = useCallback((item) => {
    if (!item) return;
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((p) => p.id === item.id);
      const next = existing
        ? cart.map((p) =>
            p.id === item.id ? { ...p, quantite: p.quantite + 1 } : p
          )
        : [
            ...cart,
            {
              id: item.id,
              nom: item.nom,
              prix: Number(item.prix),
              image: item.image || FALLBACK_IMAGE,
              quantite: 1,
            },
          ];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      // ignorer
    }
  }, []);

  if (!product) {
    return (
      <div className={styles.panel}>
        <h1 className={styles.title}>Produit introuvable</h1>
        <Link to="/produits" className={styles.btnPrimary}>
          Retour aux produits
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.panel} ${styles.card}`}>
      <img
        src={product.image}
        alt={product.nom}
        className={styles.img}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      <div>
        <span className={styles.cat}>{product.categorie}</span>
        <h1 className={styles.title}>{product.nom}</h1>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.price}>{product.prix} €</div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => addToCart(product)}
          >
            Ajouter au panier
          </button>
          <Link to="/produits" className={styles.btnOutline}>
            Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}