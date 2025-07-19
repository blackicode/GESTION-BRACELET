// // controllers/patients.js
// import Patient from "../../models/Patient/Patient.js";
// import OTP from "../../models/Patient/OTP.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { sendOtpByEmail } from "../../Services/emailService.js";
// import { sendOtpBySMS } from "../../Services/smsService.js";
// import qr from "qrcode";

// export const registerPatient = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       password,
//       langueLocale,
//       typeMaladie,
//       braceletId,
//       otpMethod // 'sms' ou 'email'
//     } = req.body;

//     // Vérification doublons
//     const existing = await Patient.findOne({
//       $or: [{ email }, { phone }, { braceletId }],
//     });

//     if (existing) {
//       return res.status(400).json("Email, téléphone ou bracelet déjà utilisé.");
//     }

//     // Hash du mot de passe
//     const hash = await bcrypt.hash(password, 10);

//     // Génération OTP
//     const code = Math.floor(100000 + Math.random() * 900000);
//     const otpExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

//     // Génération du QR Code data (texte chiffré à afficher plus tard)
//     const qrText = `${firstName} ${lastName} | ID: ${braceletId} | Date: ${new Date().toISOString()}`;
//     const qrCodeData = await qr.toDataURL(qrText);

//     // Création patient
//     const patient = await Patient.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       password: hash,
//       langueLocale,
//       typeMaladie,
//       braceletId,
//       verifCode: code,
//       verifCodeExpires: otpExpires,
//       qrCodeData,
//     });

//     // Envoi OTP
//     if (otpMethod === "sms") {
//       await sendOtpBySMS(phone, code);
//     } else {
//       await sendOtpByEmail(email, code);
//     }

//     res.status(201).json({
//       message: "Patient enregistré. Code OTP envoyé.",
//       patientId: patient._id,
//     });
//   } catch (error) {
//     console.error("Erreur inscription patient:", error);
//     res.status(500).json("Erreur serveur.");
//   }
// };

// export const verifyOtp = async (req, res) => {
//   try {
//     const { patientId, code } = req.body;
//     const patient = await Patient.findById(patientId);

//     if (!patient) return res.status(404).json("Patient introuvable.");
//     if (patient.isVerified) return res.status(400).json("Déjà vérifié.");

//     if (
//       patient.verifCode !== Number(code) ||
//       new Date() > new Date(patient.verifCodeExpires)
//     ) {
//       return res.status(400).json("Code invalide ou expiré.");
//     }

//     patient.isVerified = true;
//     patient.verifCode = null;
//     patient.verifCodeExpires = null;
//     await patient.save();

//     res.status(200).json({ message: "Vérification réussie." });
//   } catch (error) {
//     res.status(500).json("Erreur vérification.");
//   }
// };

// export const loginWithBracelet = async (req, res) => {
//   try {
//     const { braceletId, code } = req.body;
//     const patient = await Patient.findOne({ braceletId });

//     if (!patient) return res.status(404).json("Bracelet inconnu.");
//     if (!patient.isVerified) return res.status(400).json("Compte non vérifié.");

//     if (
//       patient.verifCode !== Number(code) ||
//       new Date() > new Date(patient.verifCodeExpires)
//     ) {
//       return res.status(400).json("OTP invalide ou expiré.");
//     }

//     // Générer le token JWT
//     const token = jwt.sign(
//       {
//         id: patient._id,
//         email: patient.email,
//         braceletId: patient.braceletId,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Connexion réussie.",
//       token,
//       patient: {
//         id: patient._id,
//         fullName: `${patient.firstName} ${patient.lastName}`,
//         email: patient.email,
//         qrCodeData: patient.qrCodeData,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur connexion bracelet:", error);
//     res.status(500).json("Erreur serveur.");
//   }
// };







// export const getAllPatients = async (req, res) => {
//   const patients = await User.find({ userType: 'Patient' }).select('-password');
//   res.json(patients);
// };

// export const getPatientById = async (req, res) => {
//   const patient = await User.findById(req.params.id).select('-password');
//   if (!patient) return res.status(404).json("Patient non trouvé");
//   res.json(patient);
// };

// export const deletePatient = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json("Patient supprimé avec succès.");
// };





















import User from '../../models/User.js';

export const getAllPatients = async (req, res) => {
  const patients = await User.find({ userType: 'Patient' }).select('-password');
  res.json(patients);
};

export const getPatientById = async (req, res) => {
  const patient = await User.findById(req.params.id).select('-password');
  if (!patient) return res.status(404).json("Patient non trouvé");
  res.json(patient);
};

export const deletePatient = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Patient supprimé avec succès.");
};





