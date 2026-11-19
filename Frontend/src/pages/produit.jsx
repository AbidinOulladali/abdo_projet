import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CART_STORAGE_KEY, FALLBACK_IMAGE } from "../App";
import styles from "../styles/produit.module.css";

const API_URL = "http://localhost:3000/api/produits";

export const PRODUITS_CATALOGUE = [
  // ================= CLAVIERS (9 produits) =================
  {
    id: 1,
    nom: "Clavier Mécanique RGB",
    categorie: "Claviers",
    prix: 49,
    description:
      "Switches réactifs, rétroéclairage LED et châssis aluminium compact.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    nom: "Clavier Compact 65% Wireless",
    categorie: "Claviers",
    prix: 69,
    description:
      "Connexion Bluetooth & USB-C, frappe silencieuse idéale bureau et gaming.",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    nom: "Clavier TKL Switches Bleus",
    categorie: "Claviers",
    prix: 59,
    description:
      "Format tenkeyless sans pavé numérique avec retour tactile franc.",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    nom: "Clavier Custom Keycaps Pastel",
    categorie: "Claviers",
    prix: 89,
    description:
      "Touches PBT doubles injections et stabilisateurs lubrifiés pour un son doux.",
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    nom: "Clavier Slim Bureautique Silencieux",
    categorie: "Claviers",
    prix: 35,
    description:
      "Profil ultra-fin, touches ciseaux confortables et autonomie prolongée.",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    nom: "Clavier Gaming Full-Size Alu",
    categorie: "Claviers",
    prix: 99,
    description:
      "Pavé numérique complet, repose-poignets magnétique et anti-ghosting total.",
    image:
      "https://images.unsplash.com/photo-1560762484-813fc97650a0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    nom: "Clavier Sans Fil Multi-Appareils",
    categorie: "Claviers",
    prix: 54,
    description:
      "Basculez instantanément entre PC, tablette et ordinateur portable.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    nom: "Clavier Mécanique Switches Rouges",
    categorie: "Claviers",
    prix: 74,
    description:
      "Frappe linéaire fluide et rapide conçue pour les sessions de jeu intenses.",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    nom: "Clavier Compact Rétroéclairé Blanc",
    categorie: "Claviers",
    prix: 64,
    description:
      "Design épuré blanc mat, câble USB-C détachable et pieds réglables.",
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=800&q=80",
  },

  // ================= SOURIS (9 produits) =================
  {
    id: 10,
    nom: "Souris Sans Fil Ergonomique",
    categorie: "Souris",
    prix: 25,
    description:
      "Capteur précis 16000 DPI, autonomie longue durée et prise en main confortable.",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 11,
    nom: "Souris Gaming Ultra-Légère",
    categorie: "Souris",
    prix: 39,
    description:
      "63 grammes, câble souple et boutons programmables haute réactivité.",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 12,
    nom: "Souris Verticale Anti-Fatigue",
    categorie: "Souris",
    prix: 42,
    description:
      "Position naturelle du poignet pour réduire les tensions au bureau.",
    image:
      "https://images.unsplash.com/photo-1563297007-0d82b71d3f22?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 13,
    nom: "Souris Pro Wireless 25K DPI",
    categorie: "Souris",
    prix: 79,
    description:
      "Latence ultra-faible, patins PTFE glisse rapide et batterie rechargeable.",
    image:
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 14,
    nom: "Souris Filaire Précision Studio",
    categorie: "Souris",
    prix: 22,
    description:
      "Molette crantée précise et suivi fiable sur la plupart des surfaces.",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 15,
    nom: "Souris Gaming RGB 8 Boutons",
    categorie: "Souris",
    prix: 34,
    description:
      "Éclairage personnalisable, DPI réglable à la volée et coque antidérapante.",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 16,
    nom: "Souris Compacte Nomade Bluetooth",
    categorie: "Souris",
    prix: 29,
    description:
      "Format compact facile à glisser dans une sacoche pour déplacements.",
    image:
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 17,
    nom: "Souris Silencieuse Bureau Plus",
    categorie: "Souris",
    prix: 27,
    description:
      "Clics discrets à faible bruit, idéale open-space et travail de nuit.",
    image:
      "https://images.unsplash.com/photo-1563297007-0d82b71d3f22?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 18,
    nom: "Souris Symétrique Ambivalente",
    categorie: "Souris",
    prix: 45,
    description:
      "Conception équilibrée adaptée aux droitiers comme aux gauchers.",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
  },

  // ================= ÉCRANS (9 produits) =================
  {
    id: 19,
    nom: 'Écran Gaming 27" IPS 144Hz',
    categorie: "Écrans",
    prix: 219,
    description:
      "Dalle IPS Full HD 144Hz, temps de réponse 1ms et bords ultra-fins.",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 20,
    nom: 'Écran Ultrawide 34" Bureau & Créa',
    categorie: "Écrans",
    prix: 329,
    description:
      "Format panoramique 21:9, couleurs fidèles et mode confort visuel.",
    image:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 21,
    nom: 'Écran 24" Full HD Anti-Reflet',
    categorie: "Écrans",
    prix: 149,
    description:
      "Écran polyvalent 24 pouces avec filtre lumière bleue et pied inclinable.",
    image:
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 22,
    nom: 'Écran 27" QHD 165Hz HDR',
    categorie: "Écrans",
    prix: 279,
    description:
      "Résolution 2560x1440 nette, fluidité 165Hz et contraste dynamique.",
    image:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 23,
    nom: 'Écran Incurvé 32" Immersion',
    categorie: "Écrans",
    prix: 299,
    description:
      "Courbure immersive pour films, multitâche et jeux d'aventure.",
    image:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 24,
    nom: 'Écran USB-C 27" Station Bureau',
    categorie: "Écrans",
    prix: 259,
    description:
      "Connectique USB-C pratique pour relier votre ordinateur portable en un câble.",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 25,
    nom: 'Écran 4K UHD 28" Graphisme',
    categorie: "Écrans",
    prix: 369,
    description:
      "Haute densité de pixels pour montage vidéo, design et développement.",
    image:
      "https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 26,
    nom: 'Écran Gaming 24.5" 240Hz Esport',
    categorie: "Écrans",
    prix: 249,
    description:
      "Taux de rafraîchissement 240Hz pensé pour la réactivité compétitive.",
    image:
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 27,
    nom: 'Écran Bureau 27" Ergonomique Pivot',
    categorie: "Écrans",
    prix: 189,
    description:
      "Réglage hauteur, inclinaison et rotation pour un poste de travail sur mesure.",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
];

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Produit() {
  const [products, setProducts] = useState(PRODUITS_CATALOGUE);
  const [loading, setLoading] = useState(true);
  const [sourceNote, setSourceNote] = useState(
    "Catalogue de 27 produits (9 par catégorie)"
  );
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function fetchCatalogue() {
      setLoading(true);
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.produits || data.products;

        if (active && Array.isArray(list) && list.length > 0) {
          const normalized = list.map((item, idx) => ({
            id: item.id ?? idx + 1,
            nom: item.nom || item.name || item.title || `Produit ${idx + 1}`,
            categorie: item.categorie || item.category || "Écrans",
            prix: Number(item.prix ?? item.price ?? 49),
            description:
              item.description ||
              "Produit sélectionné pour votre setup informatique.",
            image:
              item.image ||
              item.imageUrl ||
              PRODUITS_CATALOGUE[idx % PRODUITS_CATALOGUE.length].image,
          }));
          setProducts(normalized);
          setSourceNote("Produits chargés depuis le backend (localhost:3000)");
        }
      } catch {
        if (active) {
          setProducts(PRODUITS_CATALOGUE);
          setSourceNote("Catalogue de 27 produits (9 par catégorie)");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCatalogue();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const saveCart = useCallback((nextCart) => {
    setCart(nextCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextCart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      // ignorer
    }
  }, []);

  const addToCart = useCallback(
    (product) => {
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
      saveCart(next);
    },
    [cart, saveCart]
  );

  const updateQuantity = useCallback(
    (id, delta) => {
      const next = cart
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite + delta } : item
        )
        .filter((item) => item.quantite > 0);
      saveCart(next);
    },
    [cart, saveCart]
  );

  const removeFromCart = useCallback(
    (id) => {
      saveCart(cart.filter((item) => item.id !== id));
    },
    [cart, saveCart]
  );

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.categorie).filter(Boolean));
    return ["Tous", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "Tous" || p.categorie === selectedCategory;
      const matchSearch =
        !q ||
        p.nom.toLowerCase().includes(q) ||
        p.categorie.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const sideSummary = useMemo(() => {
    const totalArticles = cart.reduce((acc, item) => acc + item.quantite, 0);
    const totalPrix = cart.reduce(
      (acc, item) => acc + Number(item.prix) * item.quantite,
      0
    );
    return { totalArticles, totalPrix };
  }, [cart]);

  return (
    <div>
      <div className={styles.infoBanner}>{sourceNote}</div>

      <div className={styles.layout}>
        <aside className={styles.panel}>
          <h2 className={styles.panelTitle}>Catégories</h2>
          <ul className={styles.catList}>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className={
                    selectedCategory === cat
                      ? `${styles.catBtn} ${styles.catActive}`
                      : styles.catBtn
                  }
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.panel}>
          <div className={styles.catalogHeader}>
            <h1 className={styles.panelTitle} style={{ marginBottom: 0 }}>
              Produits ({filteredProducts.length})
            </h1>
            <input
              type="search"
              className={styles.search}
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Chargement des produits...</p>
          ) : filteredProducts.length === 0 ? (
            <p>Aucun produit ne correspond à votre filtre.</p>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((item) => (
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
                    <h2 className={styles.name}>{item.nom}</h2>
                    <p className={styles.desc}>{item.description}</p>
                    <div className={styles.price}>{item.prix} €</div>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.btnAdd}
                        onClick={() => addToCart(item)}
                      >
                        Ajouter
                      </button>
                      <Link
                        to={`/produits/${item.id}`}
                        className={styles.btnDetail}
                      >
                        Détails
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className={styles.panel}>
          <h2 className={styles.panelTitle}>Panier</h2>

          {cart.length === 0 ? (
            <p className={styles.cartSub}>Votre panier est vide.</p>
          ) : (
            <>
              <div>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div>
                      <div className={styles.cartTitle}>{item.nom}</div>
                      <div className={styles.cartSub}>
                        {item.prix * item.quantite} €
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
                      <span className={styles.qtyVal}>{item.quantite}</span>
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
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryLine}>
                <span>{sideSummary.totalArticles} articles</span>
                <span>{sideSummary.totalPrix} €</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total :</span>
                <span>{sideSummary.totalPrix} €</span>
              </div>

              <Link to="/panier" className={styles.cartLinkBtn}>
                Voir le panier complet
              </Link>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}