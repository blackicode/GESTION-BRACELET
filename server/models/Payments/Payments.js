import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, enum: ['OrangeMoney', 'MoMo'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
