import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialite: { type: String, required: true },
  envoyeeA: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  approuvePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  statut: { type: String, enum: ['en_attente', 'approuve', 'expire'], default: 'en_attente' },
  dateEnvoi: { type: Date, default: Date.now },
  dateExpiration: { type: Date, required: true },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;