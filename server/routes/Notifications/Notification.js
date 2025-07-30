import express from 'express';
import {
  approvePatient,
  getNotificationsForMedecin,
  getNotificationForPatient,
} from '../../controllers/Notifications/notification.js';

const router = express.Router();

// Route to approve a patient
router.post('/approuver', approvePatient);

// Route to get notifications for a doctor
router.get('/medecin/:medecinId', getNotificationsForMedecin);

// Route to get notification status for a patient
router.get('/patient/:patientId', getNotificationForPatient);

export default router;