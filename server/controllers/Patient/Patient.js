// controllers/patients.js
import User from '../../models/User.js';

export const getAllPatients = async (req, res) => {
  const patients = await User.find({ userType: 'Patient' }).select('-password');
  res.json(patients);
};

export const getPatientById = async (req, res) => {
  const patient = await User.findById(req.params.id).select('-password');
  if (!patient) return res.status(404).json("Patient non trouvé");
  res.json(patient);
};

export const deletePatient = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Patient supprimé avec succès.");
};





