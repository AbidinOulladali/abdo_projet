import { db } from "../db.js";

// POST /commande/paiement
export function effectuerPaiement(req, res) {
  const { userId, montant, detailsTrajet, numeroCarte } = req.body;

  if (!userId || !montant || !detailsTrajet) {
    return res.status(400).json({ message: "Données de paiement incomplètes" });
  }

  try {
    // Simulation de l'API du prestataire de paiement (Ex: carte finissant par '00' = refusée)
    let statutPaiement = "payée";
    if (numeroCarte && numeroCarte.endsWith("00")) {
      statutPaiement = "échouée";
    }

    // 1. Enregistrement du paiement avec son statut (payée ou échouée)
    const insertPaiement = db.prepare(
      "INSERT INTO paiements (user_id, montant, statut) VALUES (?, ?, ?)"
    );
    const resultPaiement = insertPaiement.run(userId, montant, statutPaiement);
    const paiementId = resultPaiement.lastInsertRowid;

    // Si le paiement a échoué
    if (statutPaiement === "échouée") {
      return res.status(400).json({
        message: "Échec du paiement : Carte refusée par la banque.",
        statut: "échouée",
        paiementId
      });
    }

    // 2. Déclenchement de l'émission du billet uniquement si le paiement est réussi
    const insertBillet = db.prepare(
      "INSERT INTO billets (user_id, paiement_id, details_trajet) VALUES (?, ?, ?)"
    );
    const resultBillet = insertBillet.run(userId, paiementId, detailsTrajet);

    res.status(201).json({
      message: "Paiement réussi et billet émis avec succès !",
      statut: "payée",
      paiementId: paiementId,
      billetId: resultBillet.lastInsertRowid
    });

  } catch (err) {
    console.error("LOG ERREUR (Échec d'envoi/traitement) :", err);
    res.status(500).json({ message: "Erreur serveur lors du traitement du paiement" });
  }
}

// GET /commande/:id/billets
export function ObtenirBilletParCommande(req, res) {
  const { id } = req.params; // id de la commande / paiement

  try {
    const billet = db.prepare(
      "SELECT * FROM billets WHERE paiement_id = ?"
    ).get(id);

    if (!billet) {
      return res.status(404).json({ message: "Aucun billet trouvé pour ce paiement" });
    }

    res.json(billet);
  } catch (err) {
    console.error("LOG ERREUR lors de la récupération :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}