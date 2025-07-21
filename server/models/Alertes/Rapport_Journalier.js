import mongoose from 'mongoose';

const rapportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateRapport: { type: Date, required: true },
  dataCapteurs: { type: Object, required: true },
  envoye: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Rapport', rapportSchema);
