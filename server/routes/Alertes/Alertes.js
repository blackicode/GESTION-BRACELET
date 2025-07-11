import express from 'express';
import { getAlerts, resolveAlert } from '../../controllers/Alertes/Alertes.js';
import { verifyToken } from '../../middlewares/protect.js';

const router = express.Router();

router.get('/:patientId', verifyToken, getAlerts);
router.patch('/:id/resolve', verifyToken, resolveAlert);


export default router;
// Note: The `verifyToken` middleware checks if the user is authenticated.
// The `getAlerts` controller retrieves alerts for a specific patient, and the `resolveAlert    ` controller marks an alert as resolved.
// The routes are protected, meaning only authenticated users can access them.