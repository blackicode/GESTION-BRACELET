import express from 'express';
import { getAllPatients, getPatientById, deletePatient } from '../../controllers/Patient/Patient.js';
import { verifyToken, isAdmin } from '../../middlewares/protect.js';

const router = express.Router();

router.get('/', verifyToken, getAllPatients);               // medecin/admin
router.get('/:id', verifyToken, getPatientById);            // medecin/admin
router.delete('/:id', verifyToken, isAdmin, deletePatient); // admin only

export default router;
// Note: The `verifyToken` middleware checks if the user is authenticated,
// and the `isAdmin` middleware checks if the user has admin privileges.    