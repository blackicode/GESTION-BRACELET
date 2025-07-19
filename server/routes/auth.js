import express from 'express';
import multer from "multer";
import { register, login, countUsers, verifyOtp, forgotPassword, 
  validation, Search,validateCode, getUserById, getAllUsers,
  getMe, deleteUser
  } from '../controllers/auth.js';
// import { verifyToken } from '../middlewares/protect.js';
import path from 'path';


const router = express.Router()


// Configuration de Multer pour stocker les images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.get('/count',countUsers);
router.post('/forgotpassword', forgotPassword);
router.post('/validatecode', validateCode);
router.get('/me',  getMe); // infos utilisateur connecté verifyToken
// Vérification OTP
router.post("/verify-otp", verifyOtp);
// Récupérer tous les utilisateurs (admin uniquement)
router.get("/getusers", getAllUsers);
// Obtenir un utilisateur par ID
router.get("/userparid/:id", getUserById);

// Supprimer un utilisateur
router.delete("/delete/:id", deleteUser);

router.patch('/validation', validation);



// recherche
router.get("/search", Search);




export default router