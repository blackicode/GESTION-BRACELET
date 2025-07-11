import mongoose from 'mongoose';

const vitalSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temperature: Number,
  tension: String,
  glycemie: Number,
  battementCardiaque: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Vital', vitalSchema);
// Note: This schema defines a Vital model that stores vital signs data for patients.
// It includes fields for patient ID, temperature, blood pressure (tension), blood sugar level (glycemie), heart rate (battementCardiaque), and a timestamp for when the data was recorded.
// The patientId field references the User model, linking each vital record to a specific patient.
// The schema is designed to capture essential health metrics that can be used for monitoring and analysis in a healthcare application.
// The timestamp field defaults to the current date and time when a new record is created, ensuring that each vital sign entry is time-stamped for accurate tracking of patient health over time.
// This model can be used in conjunction with other models and controllers to manage patient health data effectively
// and provide insights for healthcare providers.   