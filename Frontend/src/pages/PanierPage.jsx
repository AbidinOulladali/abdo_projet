import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CART_STORAGE_KEY, FALLBACK_IMAGE } from "../App";
import styles from "../styles/paiement.module.css";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const PAYMENT_LABELS = {
  carte: "Carte bancaire",
  livraison: "Paiement à la livraison",
  virement: "Virement bancaire",
};

export default function PanierPage() {
  const [cart, setCart] = useState(readCart);
  const [commandeValidee, setCommandeValidee] = useState(false);
  const [lastPaymentLabel, setLastPaymentLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("carte");
  const [cardInfo, setCardInfo] = useState({
    titulaire: "",
    numero: "",
    expiration: "",
    cvv: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const persistCart = useCallback((nextCart) => {
    setCart(nextCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      // ignorer
    }
  }, []);

  const updateQuantity = useCallback(
    (id, delta) => {
      const next = cart
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite + delta } : item
        )
        .filter((item) => item.quantite > 0);
      persistCart(next);
    },
    [cart, persistCart]
  );

  const removeFromCart = useCallback(
    (id) => {
      persistCart(cart.filter((item) => item.id !== id));
    },
    [cart, persistCart]
  );

  const clearCart = useCallback(() => {
    persistCart([]);
    setErrorMsg("");
  }, [persistCart]);

  const summary = useMemo(() => {
    const totalArticles = cart.reduce((acc, item) => acc + item.quantite, 0);
    const sousTotal = cart.reduce(
      (acc, item) => acc + Number(item.prix) * item.quantite,
      0
    );
    const livraison = sousTotal === 0 || sousTotal >= 150 ? 0 : 9;
    const total = sousTotal + livraison;
    return { totalArticles, sousTotal, livraison, total };
  }, [cart]);

  const handleCheckout = useCallback(
    (e) => {
      e.preventDefault();
      if (cart.length === 0) return;

      if (paymentMethod === "carte") {
        const cleanNum = cardInfo.numero.replace(/\s+/g, "");
        if (!cardInfo.titulaire.trim() || cleanNum.length < 12 || !cardInfo.expiration.trim() || cardInfo.cvv.trim().length < 3) {
          setErrorMsg("Veuillez renseigner correctement les informations de la carte.");
          return;
        }
      }

      setErrorMsg("");
      setLastPaymentLabel(PAYMENT_LABELS[paymentMethod]);
      persistCart([]);
      setCardInfo({ titulaire: "", numero: "", expiration: "", cvv: "" });
      setCommandeValidee(true);
    },
    [cart.length, paymentMethod, cardInfo, persistCart]
  );

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Votre Panier</h1>

      {commandeValidee && (
        <div className={styles.successBanner}>
          Commande enregistrée avec succès ({lastPaymentLabel}). Merci pour votre achat !
        </div>
      )}

      {cart.length === 0 ? (
        <div>
          <p className={styles.emptyText}>
            Aucun article dans votre panier pour le moment.
          </p>
          <Link to="/produits" className={styles.btnPrimary}>
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className={styles.row}>
              <div className={styles.itemInfo}>
                <img
                  src={item.image}
                  alt={item.nom}
                  className={styles.thumb}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div>
                  <div className={styles.itemTitle}>{item.nom}</div>
                  <div className={styles.itemSub}>
                    Prix unitaire : {item.prix} € — Sous-total :{" "}
                    {item.prix * item.quantite} €
                  </div>
                </div>
              </div>

              <div className={styles.qtyBox}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span>{item.quantite}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className={styles.delBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <form onSubmit={handleCheckout} className={styles.summary}>
            <div className={styles.line}>
              <span>Articles ({summary.totalArticles})</span>
              <span>{summary.sousTotal} €</span>
            </div>
            <div className={styles.line}>
              <span>Livraison</span>
              <span>
                {summary.livraison === 0 ? "Gratuite" : `${summary.livraison} €`}
              </span>
            </div>
            <div className={styles.total}>
              <span>Total à payer</span>
              <span>{summary.total} €</span>
            </div>

            <div className={styles.paymentBox}>
              <h2 className={styles.paymentTitle}>Mode de paiement</h2>

              <div className={styles.paymentOptions}>
                {Object.entries(PAYMENT_LABELS).map(([key, label]) => (
                  <label
                    key={key}
                    className={
                      paymentMethod === key
                        ? `${styles.paymentOption} ${styles.paymentOptionActive}`
                        : styles.paymentOption
                    }
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={key}
                      checked={paymentMethod === key}
                      onChange={() => {
                        setPaymentMethod(key);
                        setErrorMsg("");
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === "carte" && (
                <div className={styles.cardFields}>
                  <label className={`${styles.fieldLabel} ${styles.cardFieldFull}`}>
                    Nom sur la carte
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Ex: Abidin Oulladali"
                      value={cardInfo.titulaire}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, titulaire: e.target.value })
                      }
                    />
                  </label>

                  <label className={`${styles.fieldLabel} ${styles.cardFieldFull}`}>
                    Numéro de carte
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.numero}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, numero: e.target.value })
                      }
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    Expiration
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="MM/AA"
                      value={cardInfo.expiration}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, expiration: e.target.value })
                      }
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    CVV
                    <input
                      type="password"
                      maxLength={4}
                      className={styles.fieldInput}
                      placeholder="123"
                      value={cardInfo.cvv}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cvv: e.target.value })
                      }
                    />
                  </label>
                </div>
              )}

              {paymentMethod === "livraison" && (
                <p className={styles.paymentNote}>
                  Vous réglerez le montant total ({summary.total} €) en espèces
                  ou par TPE lors de la réception de votre commande.
                </p>
              )}

              {paymentMethod === "virement" && (
                <p className={styles.paymentNote}>
                  Un récapitulatif avec les coordonnées bancaires vous sera
                  fourni après validation de la commande.
                </p>
              )}

              {errorMsg && <p className={styles.itemSub} style={{ color: "var(--danger)", marginBottom: "10px" }}>{errorMsg}</p>}
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.btnPrimary}>
                Valider la commande
              </button>
              <button
                type="button"
                className={styles.btnOutline}
                onClick={clearCart}
              >
                Vider
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}