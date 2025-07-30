import mongoose from 'mongoose';

const muteSchema = new mongoose.Schema({
  muter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  muted: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mutedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Mute = mongoose.model('Mute', muteSchema);
export default Mute;