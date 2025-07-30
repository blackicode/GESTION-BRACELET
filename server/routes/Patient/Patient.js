import express from 'express';
import {
    getAllPatients, getPatientById,
    deletePatient, getPatientsBySpecialiteAndDate,
    searchPatients
   
} from '../../controllers/Patient/Patient.js';

// import { verifyToken, isAdmin } from '../../middlewares/protect.js';
import { verifyToken, isMedecinOrAdmin, isMedecin } from '../../middlewares/protect.js'; // ⬅️ Ajout du middleware


const router = express.Router();

router.get('/', getAllPatients);               // medecin/admin
router.delete('/:id', deletePatient); // admin only
// router.get('/mespatients', verifyToken, getPatientsBySpecialiteAndDate);  
// // Récupérer un patient par ID (accessible aux médecins et admins)

// Récupérer les patients par spécialité et date (accessible aux médecins)
router.get("/mespatients", verifyToken, isMedecin, getPatientsBySpecialiteAndDate);
router.get('/search', verifyToken, searchPatients);

router.get("/:id", verifyToken, isMedecinOrAdmin, getPatientById);


export default router;
// Note: The `verifyToken` middleware checks if the user is authenticated,
// and the `isAdmin` middleware checks if the user has admin privileges.    