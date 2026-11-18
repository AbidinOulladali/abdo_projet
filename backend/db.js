import Database from "better-sqlite3";
 
export const db = new Database("boutique.db"); // créé automatiquement
//db.pragma("journal_mode = WAL");   // meilleures performances en lecture
db.pragma("foreign_keys = ON");    // active les clés étrangères

//initialisation de la BD 
db.exec(`
  CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    cree_le TEXT DEFAULT (datetime('now'))
  );
 
  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prix REAL NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS paiements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    montant REAL NOT NULL,
    statut TEXT DEFAULT 'Validé',
    cree_le TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
  );

  CREATE TABLE IF NOT EXISTS billets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    paiement_id INTEGER,
    details_trajet TEXT NOT NULL,
    cree_le TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
    FOREIGN KEY (paiement_id) REFERENCES paiements(id)
  );
`);


 
// Données de départ si la table est vide
const { total } = db.prepare("SELECT COUNT(*) AS total FROM produits").get();
if (total === 0) {
  const ajouter = db.prepare("INSERT INTO produits (nom, prix) VALUES (?, ?)");
  ajouter.run("Clavier", 49);
  ajouter.run("Souris", 25);
}