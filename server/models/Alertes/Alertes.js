import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  typeMaladie: {
    type: String,
    enum: ["diabète", "grossesse", "tension"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  seuilDepasse: {
    type: String,
    required: true
  },
  sensorData: {
    type: Object,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  specialistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Alert', alertSchema);
