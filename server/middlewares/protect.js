import jwt from "jsonwebtoken";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Accès refusé : aucun token fourni", { url: req.originalUrl });
    return res.status(403).json({ message: "Accès refusé. Aucun token fourni." });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    logger.error("JWT_SECRET non défini dans les variables d'environnement");
    return res.status(500).json({ message: "Erreur serveur : configuration manquante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Token vérifié avec succès", { userId: decoded.id });
    req.user = decoded;
    next();
  } catch (err) {
    logger.error("Erreur de vérification du token", {
      error: err.message,
      url: req.originalUrl,
    });
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

// Les autres middlewares (isAdmin, isMedecin, isPatient, isMedecinOrAdmin) restent inchangés

export const isAdmin = (req, res, next) => {
  if (req.user.userType !== "Administrateur") {
    return res.status(403).json({ message: "Accès réservé à l’administrateur." });
  }
  next();
};

export const isMedecin = (req, res, next) => {
  if (req.user.userType !== "Medecin") {
    return res.status(403).json({ message: "Accès réservé aux médecins." });
  }
  next();
};

export const isPatient = (req, res, next) => {
  if (req.user.userType !== "Patient") {
    return res.status(403).json({ message: "Accès réservé aux patients." });
  }
  next();
};

export const isMedecinOrAdmin = (req, res, next) => {
  if (req.user.userType !== "Medecin" && req.user.userType !== "Administrateur") {
    return res.status(403).json({ message: "Accès réservé aux médecins et administrateurs." });
  }
  next();
};

