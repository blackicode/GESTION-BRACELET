import express from 'express';
import { getAllMedecins, getMedecinById, deleteMedecin } from '../../controllers/Medecin/Medecin.js';
import { verifyToken, isAdmin } from '../../middlewares/protect.js';

const router = express.Router();

router.get('/', verifyToken, getAllMedecins);               // admin
router.get('/:id', verifyToken, getMedecinById);            // admin
router.delete('/:id', verifyToken, isAdmin, deleteMedecin); // admin only

export default router;
// Note: The `verifyToken` middleware checks if the user is authenticated,
// and the `isAdmin` middleware checks if the user has admin privileges.    