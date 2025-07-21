import Rapport from '../models/Rapport.js';

// POST /rapports
export const enregistrerRapport = async (req, res) => {
  try {
    const { patientId, dateRapport, dataCapteurs } = req.body;
    if (!patientId || !dateRapport || !dataCapteurs) {
      return res.status(400).json({ message: "Informations manquantes." });
    }
    const rapport = new Rapport({
      patientId,
      dateRapport: new Date(dateRapport),
      dataCapteurs
    });
    await rapport.save();
    res.status(201).json({ message: "Rapport journalier enregistré.", rapport });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};

// GET /rapports/patient/:patientId
export const getRapportsByPatient = async (req, res) => {
  try {
    const rapports = await Rapport.find({ patientId: req.params.patientId }).sort({ dateRapport: -1 });
    res.status(200).json(rapports);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération rapports." });
  }
};

// PATCH /rapports/:id/envoye
export const marquerCommeEnvoye = async (req, res) => {
  try {
    const rapport = await Rapport.findByIdAndUpdate(req.params.id, { envoye: true }, { new: true });
    if (!rapport) {
      return res.status(404).json({ message: "Rapport non trouvé." });
    }
    res.status(200).json({ message: "Rapport marqué comme envoyé.", rapport });
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour rapport." });
  }
};
