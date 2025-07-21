import express from 'express';
import {
  enregistrerRapport,
  getRapportsByPatient,
  marquerCommeEnvoye
} from '../controllers/rapportController.js';

const router = express.Router();

router.post('/', enregistrerRapport);
router.get('/patient/:patientId', getRapportsByPatient);
router.patch('/:id/envoye', marquerCommeEnvoye);

export default router;
