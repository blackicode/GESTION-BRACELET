import express from 'express';
import {
  createAlert,
  getAlerts,
  resolveAlert
} from '../../controllers/Alertes/Alertes.js';

const router = express.Router();

// Créer une alerte automatiquement à partir des données capteurs
router.post('/alertes', createAlert);

// Récupérer les alertes d’un patient
router.get('/alertes/:patientId', getAlerts);

// Marquer une alerte comme résolue
router.patch('/alertes/:id/resolve', resolveAlert);

export default router;
