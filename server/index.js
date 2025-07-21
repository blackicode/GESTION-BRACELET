import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import morgan from 'morgan';
import helmet from 'helmet';


import authRoutes from "./routes/auth.js";
import patientRoutes from './routes/Patient/Patient.js';
import medecinRoutes from './routes/Medecin/Medecin.js';
import vitalsRoutes from './routes/Vitals/Vitals.js';
import alertsRoutes from './routes/Alertes/Alertes.js';
import paymentsRoutes from './routes/Payments/Payment.js';
import { verifyToken } from './middlewares/protect.js';
import notificationRoutes from './routes/Alertes/Notification.js';
// server.js ou app.js
import './jobs/NotificationCron.js'; // juste pour que les cron jobs se déclenchent



dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(helmet());
app.use(morgan('dev'));

// ✅ Configuration unique de CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "HEAD", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// // ✅ Middleware pour vérifier le token d'authentification
// app.use((req, res, next) => {
//   const token = req.headers.authorization;
//   if (token) {
//     const splitToken = token.split(" ")[1];
//     try {
//       const decoded = verifyToken(splitToken, process.env.JWT_SECRET);
//       req.user = decoded; // Ajouter les informations de l'utilisateur à la requête
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Token expiré ou invalide." });
//     }
//   } else {
//     return res.status(401).json({ message: "Token manquant." });
//   }
// });
// ✅ Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🟢 Connexion à MongoDB réussie"))
  .catch((error) => {
    console.error("❌ Erreur de connexion à MongoDB:", error.message);
    process.exit(1); // Arrêter le serveur si MongoDB ne se connecte pas
  });

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 Nouveau client connecté: ${socket.id}`);

  socket.on("sendMessage", (message) => {
    console.log(`📩 Message reçu: ${message}`);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Déconnexion: ${socket.id}`);
  });
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// ✅ Gestion des erreurs MongoDB
mongoose.connection.on("error", (err) => {
  console.error("❌ Erreur MongoDB:", err);
});
// ✅ Routes
app.use("/auth", authRoutes);
app.use("/patient", patientRoutes);
app.use("/medecin", medecinRoutes);
app.use("/vitals", vitalsRoutes);
app.use("/", alertsRoutes);
app.use("/payments", paymentsRoutes);
app.use('/notifications', notificationRoutes);

// ✅ Middleware pour gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err.stack);
  res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
});

// ✅ Lancement du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
