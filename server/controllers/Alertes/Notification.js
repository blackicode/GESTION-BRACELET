import Notification from '../../models/Alertes/Notification.js';
import User from '../../models/User.js'; // pour récupérer langue locale ou infos médecin

// POST /notifications/medicament
export const createMedicamentNotification = async (req, res) => {
  try {
    const { patientId, emetteurId, message, audioUrl } = req.body;
    if (!patientId || !emetteurId || !message) {
      return res.status(400).json({ message: "Informations manquantes." });
    }

    const notif = new Notification({
      patientId,
      emetteurId,
      type: 'medicament',
      message,
      audioUrl
    });

    await notif.save();
    res.status(201).json({ message: "Notification médicament créée.", notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};

// POST /notifications/rendezvous
export const createRendezvousNotification = async (req, res) => {
  try {
    const { patientId, emetteurId, message, audioUrl, horaireRdv } = req.body;
    if (!patientId || !emetteurId || !message || !horaireRdv) {
      return res.status(400).json({ message: "Informations manquantes." });
    }

    const notif = new Notification({
      patientId,
      emetteurId,
      type: 'rendez-vous',
      message,
      audioUrl,
      horaireRdv
    });

    await notif.save();
    res.status(201).json({ message: "Notification rendez-vous créée.", notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};

// PATCH /notifications/:id/reponse-medecin
export const repondreRendezvousMedecin = async (req, res) => {
  try {
    const { maintien, nouvelleDate } = req.body;
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notification non trouvée." });

    notif.reponseMedecin = {
      maintien,
      nouvelleDate: maintien ? null : nouvelleDate,
      repondu: true
    };

    await notif.save();
    res.status(200).json({ message: "Réponse médecin enregistrée.", notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l’enregistrement de la réponse." });
  }
};

// PATCH /notifications/:id/reponse-patient
export const repondreRendezvousPatient = async (req, res) => {
  try {
    const { maintien, nouvelleDate } = req.body;
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notification non trouvée." });

    notif.reponsePatient = {
      maintien,
      nouvelleDate: maintien ? null : nouvelleDate,
      repondu: true
    };

    await notif.save();
    res.status(200).json({ message: "Réponse patient enregistrée.", notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l’enregistrement de la réponse." });
  }
};

// GET /notifications/patient/:patientId
export const getNotificationsByPatient = async (req, res) => {
  try {
    const notifications = await Notification.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération notifications." });
  }
};

// PATCH /notifications/:id/markread
export const markNotificationAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { lu: true }, { new: true });
    if (!notif) return res.status(404).json({ message: "Notification non trouvée." });
    res.status(200).json({ message: "Notification marquée comme lue.", notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour notification." });
  }
};
export const sendNotificationToPatient = async (patient, notification) => {
  // TODO : Implémenter l'envoi réel (ex: push, email, SMS, etc.)
  console.log(`Notification envoyée au patient ${patient?.nom || patient?._id} : ${notification.message}`);
};

export const sendNotificationToMedecin = async (medecin, notification) => {
  // TODO : Implémenter l'envoi réel
  console.log(`Notification envoyée au médecin ${medecin?.nom || medecin?._id} : ${notification.message}`);
};

