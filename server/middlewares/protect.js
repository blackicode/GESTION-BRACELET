// // middleware to handle authentication and authorization
// import jwt from "jsonwebtoken";

// const protect = async (req, res, next) => {
//   //get token from header
//   const token = req.headers.authorization;
//   const secret = process.env.JWT_SECRET;
//   try {
//     if (token) {
//       const splitToken = token.split(" ")[1];
//       const decoded = jwt.verify(splitToken, secret);
//       const { id, email } = decoded;
//       req.user = { id, email };
//       next();
//     } else {
//       res.status(401).json({ message: "Non autorisé" });
//     }
//   } catch (error) {
//     res.status(401).json({ message: "Non autorisé", error: error.message });
//   }
// };

// export default protect;


import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token expiré ou invalide.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.userType !== 'Administrateur') {
    return res.status(403).json({ message: 'Accès réservé à l’administrateur.' });
  }
  next();
};

export const isMedecin = (req, res, next) => {
  if (req.user.userType !== 'Medecin') {
    return res.status(403).json({ message: 'Accès réservé aux médecins.' });
  }
  next();
};
export const isPatient = (req, res, next) => {
  if (req.user.userType !== 'Patient') {
    return res.status(403).json({ message: 'Accès réservé aux patients.' });
  }
  next();
};
export const isMedecinOrAdmin = (req, res, next) => {
  if (req.user.userType !== 'Medecin' && req.user.userType !== 'Administrateur') {
    return res.status(403).json({ message: 'Accès réservé aux médecins et administrateurs.' });
  }
  next();
};
export const isPatientOrMedecin = (req, res, next) => {
  if (req.user.userType !== 'Patient' && req.user.userType !== 'Medecin') {
    return res.status(403).json({ message: 'Accès réservé aux patients et médecins.' });
  }
  next();
};
export const isAdminOrMedecin = (req, res, next) => {
  if (req.user.userType !== 'Administrateur' && req.user.userType !== 'Medecin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs et médecins.' });
  }
  next();
};
export const isAdminOrPatient = (req, res, next) => {
  if (req.user.userType !== 'Administrateur' && req.user.userType !== 'Patient') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs et patients.' });
  }
  next();
};
export const isAdminOrMedecinOrPatient = (req, res, next) => {
  if (req.user.userType !== 'Administrateur' && req.user.userType !== 'Medecin' && req.user.userType !== 'Patient') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs, médecins et patients.' });
  }
  next();
};
export const isMedecinOrAdminOrPatient = (req, res, next) => {
  if (req.user.userType !== 'Medecin' && req.user.userType !== 'Administrateur' && req.user.userType !== 'Patient') {
    return res.status(403).json({ message: 'Accès réservé aux médecins, administrateurs et patients.' });
  }
  next();
};
