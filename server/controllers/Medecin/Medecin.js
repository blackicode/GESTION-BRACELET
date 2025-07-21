// controllers/Medecins.js
import User from '../../models/User.js';

export const getAllMedecins = async (req, res) => {
  const medecins = await User.find({ userType: 'Medecin' }).select('-password');
  res.json(medecins);
};
// Route Express (dans routes/user.js par exemple)

export const getMedecinById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("firstName lastName email specialite photo userType");
    if (!user || user.userType !== "Medecin") {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// export const getMedecinById = async (req, res) => {
//   const medecin = await User.findById(req.params.id).select('-password');
//   if (!medecin) return res.status(404).json("Medecin non trouvé");
//   res.json(medecin);
// };

export const deleteMedecin = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Medecin supprimé avec succès.");
};





