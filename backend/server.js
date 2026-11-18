// Importe Express (framework web pour Node.js)
import express from "express";
// Importe les routeurs
import authRoutes from "./routes/auth.routes.js";
import produitsRoutes from "./routes/produits.routes.js";
import paiementRoutes from "./routes/paiement.routes.js";

// Crée l'application Express
const app = express();

// Middleware global : lit le JSON envoyé par React
app.use(express.json());

// Routes de l'application
app.use("/api", authRoutes);            // /api/inscription, /api/connexion
app.use("/api/produits", produitsRoutes); // /api/produits
app.use("/api", paiementRoutes);          // /api/commande/paiement, /api/commande/:id/billets

// Démarre le serveur sur le port 3000
app.listen(3000, () => console.log("API démarrée sur http://localhost:3000"));