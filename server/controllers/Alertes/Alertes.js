// controllers/alerts.js
import Alert from '../../models/Alertes/Alertes.js';

// export const getAlerts = async (req, res) => {
//   const alerts = await Alert.find({ patientId: req.params.patientId });
//   res.json(alerts);
// };

// export const resolveAlert = async (req, res) => {
//   await Alert.findByIdAndUpdate(req.params.id, { resolved: true });
//   res.json("Alerte marquée comme résolue.");
// };


export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ patientId: req.params.patientId });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des alertes" });
  }
};

// PATCH /api/alerts/:id/resolve
export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    if (!alert) return res.status(404).json({ message: "Alerte non trouvée" });
    res.status(200).json({ message: "Alerte marquée comme résolue", alert });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la résolution de l’alerte" });
  }
};