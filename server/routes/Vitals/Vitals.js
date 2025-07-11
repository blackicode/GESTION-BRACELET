import express from 'express';
import { addVitals, getVitalsByPatient } from '../../controllers/Vitals/Vitals.js';
import { verifyToken } from '../../middlewares/protect.js';

const router = express.Router();

router.post('/', verifyToken, addVitals); // patient/medecin
router.get('/:patientId', verifyToken, getVitalsByPatient); // medecin/admin

export default router;
// Note: The `verifyToken` middleware checks if the user is authenticated.
// The `addVitals` controller is used to add vitals for a patient, and the `getVitalsByPatient` controller retrieves the vitals for a specific patient.
// The routes are protected, meaning only authenticated users can access them.