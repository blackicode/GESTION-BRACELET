import express from 'express';
import {
  createMedicamentNotification,
  createRendezvousNotification,
  getNotificationsByPatient,
  markNotificationAsRead,
  repondreRendezvousMedecin as repondreMedecin,
  repondreRendezvousPatient as repondrePatient,
} from '../../controllers/Alertes/Notification.js';



const router = express.Router();

// 💊 Créer une notification de médicament
router.post('/medicament', createMedicamentNotification);

// 📅 Créer une notification de rendez-vous (avec audio, date, etc.)
router.post('/rendezvous', createRendezvousNotification);

// 📩 Liste des notifications d’un patient
router.get('/patient/:patientId', getNotificationsByPatient);

// ✅ Marquer une notification comme lue
router.patch('/:id/markread', markNotificationAsRead);

// 🧑‍⚕️ Répondre à un rappel de rendez-vous côté médecin
router.patch('/:id/reponse-medecin', repondreMedecin);

// 👤 Répondre à un rappel de rendez-vous côté patient
router.patch('/:id/reponse-patient', repondrePatient);

// GET toutes les notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().populate('patientId emetteurId');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement des notifications' });
  }
});

// POST - Créer une nouvelle notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création' });
  }
});

// PUT - Marquer comme répondu (par patient ou médecin)
router.put('/:id/reponse', async (req, res) => {
  try {
    const { role } = req.body; // 'patient' ou 'medecin'
    const champ = role === 'patient' ? 'reponsePatient' : 'reponseMedecin';
    const update = {
      [`${champ}.repondu`]: true,
      [`${champ}.dateReponse`]: new Date()
    };

    const notif = await Notification.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour' });
  }
});

export default router;
