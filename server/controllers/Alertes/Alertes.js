import Alert from '../../models/Alertes/Alertes.js';
import User from '../../models/User.js';

export const createAlert = async (req, res) => {
  const { patientId, sensorData } = req.body;

  try {
    const patient = await User.findById(patientId);
    if (!patient || patient.userType !== "Patient") {
      return res.status(400).json({ message: "Patient introuvable ou invalide." });
    }

    const typeMaladie = patient.typeMaladie;
    let message = "";
    let seuilDepasse = "";

    // Règles d'alerte par type de maladie
    if (typeMaladie === "diabète") {
      const glycemie = sensorData?.glycemie;
      if (glycemie > 1.8) {
        seuilDepasse = "glycemie > 1.8";
        message = "Hyperglycémie détectée.";
      } else if (glycemie < 0.7) {
        seuilDepasse = "glycemie < 0.7";
        message = "Hypoglycémie détectée.";
      }
    }

    else if (typeMaladie === "tension") {
      const tensionSystolique = sensorData?.tensionSystolique;
      if (tensionSystolique > 140) {
        seuilDepasse = "tension systolique > 140 mmHg";
        message = "Tension artérielle élevée détectée.";
      }
    }

    else if (typeMaladie === "grossesse") {
      const temperature = sensorData?.temperature;
      const rythmeCardiaque = sensorData?.rythmeCardiaque;

      if (temperature > 38) {
        seuilDepasse = "température > 38°C";
        message = "Fièvre détectée chez la patiente enceinte.";
      } else if (rythmeCardiaque > 120) {
        seuilDepasse = "rythme cardiaque > 120 bpm";
        message = "Tachycardie détectée chez la patiente enceinte.";
      }
    }

    // Si aucun seuil n'est dépassé
    if (!message) {
      return res.status(200).json({ message: "Aucune alerte détectée." });
    }

    // Trouver un médecin correspondant
    const specialist = await User.findOne({ userType: "Medecin", specialite: typeMaladie });
    if (!specialist) {
      return res.status(404).json({ message: "Médecin spécialiste non trouvé." });
    }

    // Création de l’alerte
    const newAlert = new Alert({
      patientId,
      typeMaladie,
      message,
      seuilDepasse,
      sensorData,
      specialistId: specialist._id
    });

    await newAlert.save();

    res.status(201).json({
      message: "Alerte créée et envoyée au spécialiste.",
      alert: newAlert
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la création de l'alerte.", error: err.message });
  }
};

// GET : Liste des alertes d’un patient
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ patientId: req.params.patientId });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des alertes." });
  }
};

// PATCH : Résoudre une alerte
export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alerte non trouvée." });

    res.status(200).json({ message: "Alerte résolue.", alert });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la résolution de l’alerte." });
  }
};
