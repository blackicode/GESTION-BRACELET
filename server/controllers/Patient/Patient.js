
// controllers/patients.js
import mongoose from "mongoose"; // Ajout de l'importation
import User from '../../models/User.js';




// GET /patient/mespatients
export const getPatientsBySpecialiteAndDate = async (req, res) => {
  try {
    const id = req.user.id; // Changement ici : utiliser req.user.id au lieu de req.user._id
    console.log("ID utilisateur depuis req.user :", id);
    const medecin = await User.findById(id);

    if (!medecin) {
      console.log("Utilisateur non trouvé pour l'ID :", id);
      return res.status(403).json({ message: "Accès non autorisé : utilisateur non trouvé." });
    }
    if (medecin.userType !== "Medecin") {
      console.log("Type d'utilisateur non valide :", medecin.userType);
      return res.status(403).json({ message: "Accès non autorisé : l'utilisateur n'est pas un médecin." });
    }

    const { filterType, date, page = 1, limit = 10 } = req.query;

    if (filterType && !["day", "week", "month", "year"].includes(filterType)) {
      return res.status(400).json({ message: "Type de filtre invalide." });
    }

    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: "Date invalide." });
    }

    let start, end;
    const baseDate = new Date(date || new Date());

    switch (filterType) {
      case "day":
        start = new Date(baseDate.setHours(0, 0, 0, 0));
        end = new Date(baseDate.setHours(23, 59, 59, 999));
        break;
      case "week":
        start = new Date(baseDate); // Create a new Date object to avoid mutating baseDate
        start.setDate(baseDate.getDate() - baseDate.getDay()); // Set to Sunday of the current week
        start.setHours(0, 0, 0, 0); // Midnight of Sunday
        end = new Date(start);
        end.setDate(start.getDate() + 6); // Set to Saturday
        end.setHours(23, 59, 59, 999); // Last millisecond of Saturday
        break;
      case "month":
        start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case "year":
        start = new Date(baseDate.getFullYear(), 0, 1);
        end = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = null;
        end = null;
    }

    const query = {
      userType: "Patient",
      typeMaladie: medecin.specialite,
    };

    if (start && end) {
      query.createdAt = { $gte: start, $lte: end };
    }

    const patients = await User.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("firstName lastName braceletId phone createdAt");

    const totalPatients = await User.countDocuments(query);

    res.status(200).json({
      patients,
      totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Erreur dans getPatientsBySpecialiteAndDate :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



export const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Requête de recherche reçue:', { query, trimmed: query?.trim() });

    if (!query) {
      console.log('Requête invalide: query manquant');
      return res.status(400).json({ message: 'La requête est manquante' });
    }
    if (typeof query !== 'string') {
      console.log('Requête invalide: query n\'est pas une chaîne');
      return res.status(400).json({ message: 'La requête doit être une chaîne de caractères' });
    }
    if (query.trim().length < 2) {
      console.log('Requête invalide: query trop court après trim', { trimmedLength: query.trim().length });
      return res.status(400).json({ message: 'La requête doit contenir au moins 2 caractères' });
    }

    const patients = await User.find({
      $or: [
        { firstName: { $regex: query.trim(), $options: 'i' } },
        { lastName: { $regex: query.trim(), $options: 'i' } },
        { braceletId: { $regex: query.trim(), $options: 'i' } }
      ]
    }).select('firstName lastName braceletId _id').limit(10);

    console.log('Résultats trouvés:', patients.length);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Erreur lors de la recherche des patients:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche' });
  }
};



// GET /patient/:id
export const getPatientById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const user = await User.findById(req.params.id).select(
      "firstName lastName braceletId phone typeMaladie photo userType"
    );

    if (!user || user.userType !== "Patient") {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    // Formater les données pour s'assurer qu'elles sont propres
    const formattedUser = {
      _id: user._id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      braceletId: user.braceletId || null,
      phone: user.phone || null,
      typeMaladie: user.typeMaladie || null,
      photo: user.photo || null,
      userType: user.userType,
    };

    res.status(200).json(formattedUser);
  } catch (err) {
    console.error("Erreur dans getPatientById :", {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: "Erreur serveur lors de la récupération du patient" });
  }
};

export const getAllPatients = async (req, res) => {
  const patients = await User.find({ userType: 'Patient' }).select('-password');
  res.json(patients);
};


export const deletePatient = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Patient supprimé avec succès.");
};

