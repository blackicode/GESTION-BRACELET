import Notification from '../../models/Notifications/Notification.js';
import User from '../../models/User.js';

// Create notification for patient registration
export const createNotification = async (patient) => {
  const medecins = await User.find({
    userType: 'Medecin',
    specialite: patient.typeMaladie,
  });

  const notification = new Notification({
    patientId: patient._id,
    specialite: patient.typeMaladie,
    envoyeeA: medecins.map((m) => m._id),
    dateExpiration: new Date(Date.now() + 24 * 3600 * 1000), // 24 hours
  });

  await notification.save();
};

// Approve patient by a doctor
export const approvePatient = async (req, res) => {
  const { notificationId, medecinId, patientId } = req.body;

  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      statut: 'en_attente',
    });

    if (!notification) {
      return res.status(400).json({ message: 'Notification déjà attribuée ou expirée.' });
    }

    notification.approuvePar = medecinId;
    notification.statut = 'approuve';
    await notification.save();

    await User.findByIdAndUpdate(patientId, {
      statut: 'attribue',
      medecinAttribue: medecinId,
    });

    res.json({ message: 'Patient approuvé avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// Get notifications for a specific doctor
export const getNotificationsForMedecin = async (req, res) => {
  const { medecinId } = req.params;

  try {
    const notifications = await Notification.find({
      envoyeeA: medecinId,
      statut: 'en_attente',
    }).populate('patientId', 'firstName lastName email typeMaladie');

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// Get notification status for a patient
export const getNotificationForPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const notification = await Notification.findOne({ patientId })
      .populate('patientId', 'firstName lastName email typeMaladie')
      .populate('approuvePar', 'firstName lastName specialite email');

    if (!notification) {
      return res.status(404).json({ message: 'Aucune notification trouvée.' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', error: err.message });
  }
};

// Check and update expired notifications
export const checkExpiredNotifications = async () => {
  try {
    const expiredNotifications = await Notification.find({
      statut: 'en_attente',
      dateExpiration: { $lt: new Date() },
    });

    for (const notification of expiredNotifications) {
      notification.statut = 'expire';
      await notification.save();
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des notifications expirées:', err.message);
  }
};