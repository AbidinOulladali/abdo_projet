import { Router } from "express";
import { effectuerPaiement, ObtenirBilletParCommande } from "../controllers/paiement.controller.js";

const router = Router();

// Endpoint conforme au cahier des charges : POST /commande/paiement
router.post("/commande/paiement", effectuerPaiement);

// Endpoint conforme au cahier des charges : GET /commande/:id/billets
router.get("/commande/:id/billets", ObtenirBilletParCommande);

export default router;