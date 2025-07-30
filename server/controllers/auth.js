// import axios from "axios";
// import User from "../models/User.js";
// import bcrypt from "bcrypt";
// import dotenv from 'dotenv';
// import jwt from "jsonwebtoken";
// import sendMail from "../outil/sendMail.js";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import Payment from '../models/Payments/Payments.js';
// import { initiateMobilePayment } from '../services/paymentService.js';

// dotenv.config(); // Charger les variables d’environnement

// /**
//  * Registers a new user with the provided information.
//  * @param {Object} req - The request object containing the user data.
//  * @param {Object} res - The response object to send the result of the registration process.
//  * @returns None
//  * @throws {Error} If there is an error during the registration process.
//  */
// export const register = async (req, res) => {
//   const {
//     userType, firstName, lastName, email, password, photo,
//     langueLocale, typeMaladie, specialite, provider
//   } = req.body;

//   try {
//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json("Cet email est déjà utilisé.");
//     }

//     // Hachage du mot de passe
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     // Générer un code de vérification
//     const code = Math.floor(100000 + Math.random() * 900000);

//     const userData = {
//       userType, firstName, lastName, email,
//       password: hashPassword, photo, verifCode: code,
//     };

//     // Ajout des champs selon le type d'utilisateur
//     if (userType === "Patient") {
//       userData.langueLocale = langueLocale;
//       userData.typeMaladie = typeMaladie;
//     } else if (userType === "Medecin") {
//       userData.specialite = specialite;
//     }

//     const newUser = new User(userData);
//     const user = await newUser.save();
//     const savedUser = await User.findById(user._id).select("-password -verifCode");
//     // Générer un token JWT
//     const token = jwt.sign(
//       { id: savedUser._id, email: savedUser.email, userType: savedUser.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     // Ajouter le token au cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Utiliser secure en production
//       sameSite: "strict", // Sécuriser le cookie contre les attaques CSRF
//       maxAge: 24 * 60 * 60 * 1000, //  // 1 jour
//     }); 
//     // Répondre avec l'utilisateur enregistré et le token
//     res.status(201).json({
//       message: "Inscription réussie.",
//       user: savedUser,
//       token,
//     });   

// // Paiement requis pour inscription Patient
//     if (userType === 'Patient') {
//       const payment = await initiateMobilePayment({ provider, amount: 10000, user: savedUser });
//       const newPayment = new Payment({
//         patientId: savedUser._id,
//         provider,
//         amount: 10000,
//         status: payment.status,
//         transactionId: payment.transactionId
//       });
//       await newPayment.save();
//     }
//     try {
//       await sendMail(user, null, code);
//     } catch (error) {
//       console.error("Erreur lors de l'envoi de l'e-mail :", error);
//       return res.status(500).json("Erreur lors de l'envoi de l'e-mail.");
//     }

//     res.status(201).json("Inscription réussie. Vérifiez votre e-mail.");
//   } catch (error) {
//     console.error("Erreur lors de l'inscription :", error);
//     res.status(500).json("Erreur serveur.");
//   }
// };

// /**
//  * Handles the login functionality by checking the provided email and password against
//  * the user database. If the credentials are valid and the user is verified, a JWT token
//  * is generated and returned along with the user information.
//  * @param {Object} req - The request object containing the email and password.
//  * @param {Object} res - The response object to send the result.
//  * @returns None
//  */

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     // Vérifier si l'utilisateur existe
//     if (!user) {
//       return res.status(400).json({ message: "Email ou mot de passe incorrect. Veuillez réessayer." });
//     }

//     // Vérifier si le compte est bloqué
//     if (user.lockUntil && user.lockUntil > Date.now()) {
//       const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
//       return res.status(400).json({
//         message: `Votre compte est temporairement bloqué. Veuillez réessayer dans ${lockTime} secondes.`,
//         lockTime,
//       });
//     }

//     // Vérifier le mot de passe
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       user.failedAttempts += 1;

//       // Déterminer la durée de blocage selon le nombre d'échecs
//       if (user.failedAttempts === 1) {
//         user.lockUntil = Date.now() + 15000; // 15 sec
//         return res.status(400).json({
//           message: "Mot de passe incorrect. Veuillez patienter pendant 15 secondes.",
//           lockTime: 15,
//         });
//       }
//       if (user.failedAttempts === 2) {
//         user.lockUntil = Date.now() + 30000; // 30 sec
//         return res.status(400).json({
//           message: "Mot de passe incorrect. Veuillez patienter pendant 30 secondes.",
//           lockTime: 30,
//         });
//       }
//       if (user.failedAttempts >= 3) {
//         user.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // 24h
//         return res.status(400).json({
//           message: "Désolé, cher utilisateur. Votre mot de passe incorrect n'est pas valide. Votre compte est bloqué pendant 24 heures. Veuillez contacter l'administrateur.",
//           lockTime: 86400,
//         });
//       }

//       await user.save();
//       const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
//       return res.status(400).json({ lockTime });
//     }

//     // Réinitialiser les tentatives échouées
//     user.failedAttempts = 0;
//     user.lockUntil = null;
//     await user.save();

//     // Connexion réussie
//     return res.status(200).json({ message: "Connexion réussie." });
//   } catch (error) {
//     return res.status(500).json({ message: "Erreur lors de la connexion.", error });
//   }
// };



// export const forgotPassword = async (req, res) => {
//   try {
//       const { email } = req.body;

//       // Vérifier si l'utilisateur existe
//       const user = await User.findOne({ email });

//       if (!user) {
//           return res.status(404).json({ message: "Utilisateur introuvable avec cet email" });
//       }

//       // Générer un token et un code de vérification
//       const resetToken = crypto.randomBytes(32).toString('hex');
//       const resetTokenExpires = Date.now() + 15 * 60 * 1000; // Expiration en 15 min
//       const verifCode = Math.floor(100000 + Math.random() * 900000).toString(); // Code 6 chiffres
//       const verifCodeExpires = Date.now() + 15 * 60 * 1000; // Expiration du code

//       // Stocker dans la base de données
//       user.resetPasswordToken = resetToken;
//       user.resetPasswordExpires = resetTokenExpires;
//       user.verifCode = verifCode;
//       user.verifCodeExpires = verifCodeExpires;

//       await user.save();

//       // Configurer l’envoi d’email
//       const transporter = nodemailer.createTransport({
//           host: process.env.HOST,
//           port: Number(process.env.EMAIL_PORT),
//           secure: process.env.SECURE === "true",
//           auth: {
//               user: process.env.EMAIL_USER,
//               pass: process.env.EMAIL_PASS,
//           },
//       });

//       // Construire le message
//       const resetURL = `${process.env.FRONTEND_URL}/forgotpassword/${resetToken}`;
//       const message = {
//           from: process.env.EMAIL_USER,
//           to: user.email,
//           subject: 'Réinitialisation du mot de passe',
//           html: `
//               <h3>Réinitialisation du mot de passe</h3>
//               <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
//               <a href="${resetURL}">Réinitialiser le mot de passe</a>
//               <p>Ou utilisez ce code de vérification : <strong>${verifCode}</strong></p>
//               <p>Ce code est valable pendant 15 minutes.</p>
//           `,
//       };

//       await transporter.sendMail(message);

//       res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' });

//   } catch (error) {
//       console.error('Erreur lors de la réinitialisation du mot de passe : ', error);
//       res.status(500).json({ message: "Échec de la réinitialisation du mot de passe" });
//   }
// };



// // code de validation de renitilisation
// export const validateCode = async (req, res) => {
//   try {
//       const { email, verifCode } = req.body;

//       // Vérifier si l'utilisateur existe
//       const user = await User.findOne({ email });

//       if (!user) {
//           return res.status(404).json({ message: "Utilisateur introuvable" });
//       }

//       // Vérifier si le code existe et n'a pas expiré
//       if (!user.verifCode || user.verifCodeExpires < Date.now()) {
//           return res.status(400).json({ message: "Code expiré ou non valide. Demandez un nouveau code." });
//       }

//       // Comparer les codes
//       if (user.verifCode !== verifCode) {
//           return res.status(400).json({ message: "Code de vérification incorrect" });
//       }

//       // Supprimer le code après validation
//       user.verifCode = null;
//       user.verifCodeExpires = null;
//       await user.save();

//       res.status(200).json({ success: true, message: "Code validé avec succès" });

//   } catch (error) {
//       console.error('Erreur lors de la validation du code : ', error);
//       res.status(500).json({ message: "Erreur lors de la validation du code" });
//   }
// };




// //Code de vérification par e-mail
// /**
//  * Validates the email and verification code provided in the request body.
//  * If the email and code match a user in the database, the user's "verified" field
//  * is set to true and the response status is set to 200 with a success message.
//  * If the email and code do not match a user in the database, the response status
//  * is set to 400 with an error message.
//  * If an error occurs during the validation process, the response status is set to
//  * 500 with an error message.
//  * @param {Object} req - The request object containing the email and code.
//  * @param {Object} res - The response object to send the result.
//  * @returns None
//  */
// export const validation = async (req, res) => {
//   const { verifCode } = req.body;
//   try {
//     const user = await User.findOne({ verifCode });
//     if (!user) return res.status(400).json({ message: "Code invalide." });

//     await User.findByIdAndUpdate(user._id, { verified: true });
//     res.status(200).json("Email vérifié avec succès.");
//   } catch (error) {
//     res.status(500).json("Erreur lors de la validation.");
//   }
// };

// export const countUsers = async (req, res) => {
//   try {
//     // Vérifier si `User` est bien défini avant d'utiliser `countDocuments`
//     if (!User) {
//       return res.status(500).json({ message: "Le modèle User est introuvable." });
//     }

//     // Compter le nombre total d'utilisateurs dans la base de données
//     const totalUsers = await User.countDocuments();

//     // Répondre avec le nombre total d'utilisateurs
//     res.status(200).json({ totalUsers });
//   } catch (error) {
//     // Gestion des erreurs
//     res.status(500).json({
//       message: "Une erreur s'est produite lors du comptage des utilisateurs.",
//       error: error.message,
//     });
//   }
// };


// /** * Search function to find users by first name or last name.
//  * It uses a case-insensitive regex search on the User model.
//  * @param {Object} req - The request object containing the search query.
//  * @param {Object} res - The response object to send the result.
//  * @returns None
//  */
// // Cette fonction permet de rechercher des utilisateurs par nom ou prénom
// // Elle utilise une recherche regex insensible à la casse sur le modèle User
// // Elle prend en paramètre la requête et la réponse, et renvoie les utilisateurs correspond
// // Si la requête est vide, elle renvoie une erreur 400
// // Si une erreur se produit, elle renvoie une erreur 500 avec un message d'error
// // Exemple d'utilisation :





// //pour rechercher les utilisateurs par nom ou prénom

// export const Search = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ message: "Requête vide" });
//     }

//     const users = await User.find({
//       $or: [
//         { firstName: { $regex: query, $options: "i" } },
//         { lastName: { $regex: query, $options: "i" } },
//       ],
//     });

//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };


// // GET /api/auth/me
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json("Erreur interne");
//   }
// };




import axios from "axios";
import User from "../models/User.js";
import bcrypt from "bcrypt";
// import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import sendMail from "../outil/sendMail.js";
import { sendOtpBySMS } from "../Services/smsService.js";
import QRCode from 'qrcode';

import crypto from "crypto";
import nodemailer from "nodemailer";
// import Payment from '../models/Payments/Payments.js';
// import { initiateMobilePayment } from '../services/paymentService.js';


dotenv.config(); // Charger les variables d’environnement

/**
 * Registers a new user with the provided information.
 * @param {Object} req - The request object containing the user data.
 * @param {Object} res - The response object to send the result of the registration process.
 * @returns None
 * @throws {Error} If there is an error during the registration process.
 */
// export const register = async (req, res) => {
//   const {
//     userType, firstName, lastName, email, password, photo,
//      typeMaladie, specialite, provider
//   } = req.body;

//   try {
//     // Vérifier si l'utilisateur existe déjà
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json("Cet email est déjà utilisé.");
//     }

//     // Hachage du mot de passe
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(password, salt);

//     // Générer un code de vérification
//     const code = Math.floor(100000 + Math.random() * 900000);

//     const userData = {
//       userType, firstName, lastName, email,
//       password: hashPassword, photo, verifCode: code,
//     };

//     // Ajout des champs selon le type d'utilisateur
//     if (userType === "Patient") {
//       userData.langueLocale = langueLocale;
//       userData.typeMaladie = typeMaladie;
//     } else if (userType === "Medecin") {
//       userData.specialite = specialite;
//     }

//     const newUser = new User(userData);
//     const user = await newUser.save();
//     const savedUser = await User.findById(user._id).select("-password -verifCode");
//     // Générer un token JWT
//     const token = jwt.sign(
//       { id: savedUser._id, email: savedUser.email, userType: savedUser.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );
//     // Ajouter le token au cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Utiliser secure en production
//       sameSite: "strict", // Sécuriser le cookie contre les attaques CSRF
//       maxAge: 24 * 60 * 60 * 1000, //  // 1 jour
//     }); 
//     // Répondre avec l'utilisateur enregistré et le token
//     res.status(201).json({
//       message: "Inscription réussie.",
//       user: savedUser,
//       token,
//     });   

// // Paiement requis pour inscription Patient
//     if (userType === 'Patient') {
//       const payment = await initiateMobilePayment({ provider, amount: 10000, user: savedUser });
//       const newPayment = new Payment({
//         patientId: savedUser._id,
//         provider,
//         amount: 10000,
//         status: payment.status,
//         transactionId: payment.transactionId
//       });
//       await newPayment.save();
//     }
//     try {
//       await sendMail(user, null, code);
//     } catch (error) {
//       console.error("Erreur lors de l'envoi de l'e-mail :", error);
//       return res.status(500).json("Erreur lors de l'envoi de l'e-mail.");
//     }

//     res.status(201).json("Inscription réussie. Vérifiez votre e-mail.");
//   } catch (error) {
//     console.error("Erreur lors de l'inscription :", error);
//     res.status(500).json("Erreur serveur.");
//   }
// };


export const register = async (req, res) => {
  try {
    const {
      userType, firstName, lastName, email, phone, password, photo,
      langueLocale, typeMaladie, braceletId, specialite,
      provider, otpMethod // 'sms' ou 'email'
    } = req.body;

    // const existingUser = await User.findOne({
    //   $or: [{ email }, { phone }, { braceletId }],
    // });
    // if (existingUser) {
    //   return res.status(400).json("Email, téléphone ou bracelet déjà utilisé.");
    // }

    // Recherche de conflits spécifiques
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ field: "email", message: "Cet email est déjà utilisé." });
    }

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ field: "phone", message: "Ce numéro de téléphone est déjà utilisé." });
      }
    }

    if (userType === "Patient" && braceletId) {
      const braceletExists = await User.findOne({ braceletId });
      if (braceletExists) {
        return res.status(400).json({ field: "braceletId", message: "Ce bracelet est déjà attribué à un autre patient." });
      }
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verifCode = Math.floor(100000 + Math.random() * 900000);
    const verifCodeExpires = new Date(Date.now() + 60 * 60 * 1000);

    let qrCodeData = "";
    if (userType === "Patient") {
      const qrText = `${firstName} ${lastName} | ID: ${braceletId} | Date: ${new Date().toISOString()}`;
      qrCodeData = await QRCode.toDataURL(qrText);
    }

    const newUser = new User({
      userType,
      firstName,
      lastName,
      email,
      phone,
      password: hashPassword,
      photo,
      langueLocale,
      typeMaladie,
      braceletId,
      qrCodeData,
      specialite,
      verifCode,
      verifCodeExpires,
    });

    const user = await newUser.save();
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Envoi OTP
    if (otpMethod === "sms") {
      await sendOtpBySMS(user.phone, verifCode);
    } else {
      await sendMail(user, null, verifCode);
    }

    // // Paiement si patient
    // if (userType === "Patient") {
    //   const payment = await initiateMobilePayment({ provider, amount: 10000, user });
    //   await new Payment({
    //     patientId: user._id,
    //     provider,
    //     amount: 10000,
    //     status: payment.status,
    //     transactionId: payment.transactionId
    //   }).save();
    // }

    res.status(201).json({
      message: "Inscription réussie. Vérifiez votre email ou SMS.",
      user: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        userType: user.userType,
        email: user.email,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error("Erreur inscription :", error);
    res.status(500).json("Erreur serveur.");
  }
};

export const verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json("Utilisateur introuvable.");
  if (user.isVerified) return res.status(400).json("Déjà vérifié.");

  if (
    user.verifCode !== Number(code) ||
    new Date() > new Date(user.verifCodeExpires)
  ) {
    return res.status(400).json("Code invalide ou expiré.");
  }

  user.isVerified = true;
  user.verifCode = null;
  user.verifCodeExpires = null;
  await user.save();

  res.status(200).json({ message: "Vérification réussie." });
};



/**
 * Handles the login functionality by checking the provided email and password against
 * the user database. If the credentials are valid and the user is verified, a JWT token
 * is generated and returned along with the user information.
 * @param {Object} req - The request object containing the email and password.
 * @param {Object} res - The response object to send the result.
 * @returns None
 */

export const login = async (req, res) => {
  try {
    const { email, password, platform } = req.body;

    if (!["web", "mobile"].includes(platform)) {
      return res.status(400).json({ message: "Plateforme invalide." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Aucun compte trouvé avec cet email. Veuillez vous inscrire.",
      });
    }

    // 🔐 Vérification plateforme vs userType
    if (user.userType === "Patient" && platform !== "mobile") {
      return res.status(403).json({
        message: "Les patients doivent se connecter uniquement via l'application mobile.",
      });
    }

    if (["Medecin", "Administrateur"].includes(user.userType) && platform !== "web") {
      return res.status(403).json({
        message: "Les médecins et administrateurs doivent se connecter uniquement via l'application web.",
      });
    }

    // Vérifier si le compte est actuellement bloqué
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(400).json({
        message: `Votre compte est temporairement bloqué. Veuillez réessayer dans ${lockTime} secondes.`,
        lockTime,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedAttempts += 1;

      // Appliquer blocage progressif
      if (user.failedAttempts === 1) {
        user.lockUntil = Date.now() + 15 * 1000;
        await user.save();
        return res.status(400).json({
          message: "Mot de passe incorrect. Veuillez patienter pendant 15 secondes.",
          lockTime: 15,
        });
      }

      if (user.failedAttempts === 2) {
        user.lockUntil = Date.now() + 30 * 1000;
        await user.save();
        return res.status(400).json({
          message: "Mot de passe incorrect. Veuillez patienter pendant 30 secondes.",
          lockTime: 30,
        });
      }

      if (user.failedAttempts >= 3) {
        user.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
        await user.save();
        return res.status(400).json({
          message: "Désolé, cher utilisateur. Votre mot de passe est incorrect. Votre compte est temporairement bloqué pendant 24 heures. Veuillez contacter l'administrateur.",
          lockTime: 86400,
        });
      }

      await user.save(); // sécurité en fallback
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    // ✅ Connexion réussie
    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();
    // ✅ Génération du token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        userType: user.userType,
        // specialite: user.specialite // ← en bonus si tu veux l’éviter plus tard
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    

    return res.status(200).json({
      message: "Connexion réussie.",
      id: user._id, // ✅ requis pour le frontend
      email: user.email,
      userType: user.userType,
      token,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};







// export const getAllUsers = async (req, res) => {
//   const users = await User.find().select("-password -verifCode");
//   res.status(200).json(users);
// };

// Récupération des infos complètes d’un utilisateur par ID
// export const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Vérifie si l'ID est valide
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "ID utilisateur invalide." });
//     }

//     const user = await User.findById(id).select("-password -verifCode -resetPasswordToken -resetPasswordExpires");

//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé." });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Erreur lors de la récupération de l'utilisateur :", error);
//     res.status(500).json({ message: "Erreur serveur lors de la récupération de l'utilisateur." });
//   }
// };




export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json("Utilisateur supprimé.");
};




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable avec cet email" });
    }

    // Générer un token et un code de vérification
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 15 * 60 * 1000; // Expiration en 15 min
    const verifCode = Math.floor(100000 + Math.random() * 900000).toString(); // Code 6 chiffres
    const verifCodeExpires = Date.now() + 15 * 60 * 1000; // Expiration du code

    // Stocker dans la base de données
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    user.verifCode = verifCode;
    user.verifCodeExpires = verifCodeExpires;

    await user.save();

    // Configurer l’envoi d’email
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construire le message
    const resetURL = `${process.env.FRONTEND_URL}/forgotpassword/${resetToken}`;
    const message = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html: `
              <h3>Réinitialisation du mot de passe</h3>
              <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
              <a href="${resetURL}">Réinitialiser le mot de passe</a>
              <p>Ou utilisez ce code de vérification : <strong>${verifCode}</strong></p>
              <p>Ce code est valable pendant 15 minutes.</p>
          `,
    };

    await transporter.sendMail(message);

    res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe : ', error);
    res.status(500).json({ message: "Échec de la réinitialisation du mot de passe" });
  }
};



// code de validation de renitilisation
export const validateCode = async (req, res) => {
  try {
    const { email, verifCode } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier si le code existe et n'a pas expiré
    if (!user.verifCode || user.verifCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Code expiré ou non valide. Demandez un nouveau code." });
    }

    // Comparer les codes
    if (user.verifCode !== verifCode) {
      return res.status(400).json({ message: "Code de vérification incorrect" });
    }

    // Supprimer le code après validation
    user.verifCode = null;
    user.verifCodeExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: "Code validé avec succès" });

  } catch (error) {
    console.error('Erreur lors de la validation du code : ', error);
    res.status(500).json({ message: "Erreur lors de la validation du code" });
  }
};




//Code de vérification par e-mail
/**
 * Validates the email and verification code provided in the request body.
 * If the email and code match a user in the database, the user's "verified" field
 * is set to true and the response status is set to 200 with a success message.
 * If the email and code do not match a user in the database, the response status
 * is set to 400 with an error message.
 * If an error occurs during the validation process, the response status is set to
 * 500 with an error message.
 * @param {Object} req - The request object containing the email and code.
 * @param {Object} res - The response object to send the result.
 * @returns None
 */
export const validation = async (req, res) => {
  const { verifCode } = req.body;
  try {
    const user = await User.findOne({ verifCode });
    if (!user) return res.status(400).json({ message: "Code invalide." });

    await User.findByIdAndUpdate(user._id, { verified: true });
    res.status(200).json("Email vérifié avec succès.");
  } catch (error) {
    res.status(500).json("Erreur lors de la validation.");
  }
};

export const countUsers = async (req, res) => {
  try {
    // Vérifier si `User` est bien défini avant d'utiliser `countDocuments`
    if (!User) {
      return res.status(500).json({ message: "Le modèle User est introuvable." });
    }

    // Compter le nombre total d'utilisateurs dans la base de données
    const totalUsers = await User.countDocuments();

    // Répondre avec le nombre total d'utilisateurs
    res.status(200).json({ totalUsers });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({
      message: "Une erreur s'est produite lors du comptage des utilisateurs.",
      error: error.message,
    });
  }
};


/** * Search function to find users by first name or last name.
 * It uses a case-insensitive regex search on the User model.
 * @param {Object} req - The request object containing the search query.
 * @param {Object} res - The response object to send the result.
 * @returns None
 */
// Cette fonction permet de rechercher des utilisateurs par nom ou prénom
// Elle utilise une recherche regex insensible à la casse sur le modèle User
// Elle prend en paramètre la requête et la réponse, et renvoie les utilisateurs correspond
// Si la requête est vide, elle renvoie une erreur 400
// Si une erreur se produit, elle renvoie une erreur 500 avec un message d'error
// Exemple d'utilisation :





//pour rechercher les utilisateurs par nom ou prénom

export const Search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Requête vide" });
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// GET /api/auth/me
export const getMe = async (req, res) => {
 try {
    const user = await User.findById(req.user.id)

    .select('firstName lastName photo userType id');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


