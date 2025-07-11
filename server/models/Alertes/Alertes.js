import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

export default mongoose.model('Alert', alertSchema);
// Note: This schema defines an Alert model that stores alerts for patients.
// It includes fields for patient ID, alert message, creation timestamp, and a resolved status. 