// controllers/vitals.js
import Vital from '../../models/Vitals/Vitals.js';
import Alert from '../../models/Alertes/Alertes.js';

// POST /api/vitals
export const addVitals = async (req, res) => {
  try {
    const { patientId, temperature, tension, glycemie, battementCardiaque } = req.body;

    const vital = new Vital({
      patientId,
      temperature,
      tension,
      glycemie,
      battementCardiaque,
    });

    await vital.save();

    // 🚨 Générer alerte automatique si seuil dépassé
    let message = null;

    if (temperature > 39) message = `Température élevée (${temperature}°C)`;
    else if (glycemie > 1.4) message = `Taux de glycémie anormal (${glycemie} g/L)`;
    else if (battementCardiaque > 120) message = `Fréquence cardiaque élevée (${battementCardiaque} bpm)`;

    if (message) {
      const alert = new Alert({
        patientId,
        message,
        resolved: false
      });
      await alert.save();
    }

    res.status(201).json({ message: "Données vitales enregistrées avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l’enregistrement des données vitales." });
  }
};

// GET /api/vitals/:patientId
export const getVitalsByPatient = async (req, res) => {
  try {
    const vitals = await Vital.find({ patientId: req.params.patientId });
    res.status(200).json(vitals);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des données vitales." });
  }
};
// export const addVitals = async (req, res) => {
//   const vital = new Vital(req.body);
//   await vital.save();
//   res.status(201).json("Données vitales enregistrées.");
// };

// export const getVitalsByPatient = async (req, res) => {
//   const vitals = await Vital.find({ patientId: req.params.patientId });
//   res.json(vitals);
// };