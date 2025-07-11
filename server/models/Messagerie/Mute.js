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
// Note: This schema defines a Mute model for a messaging system, allowing users to mute each other.
// The schema includes references to the muter and muted users, ensuring that both fields are required.
// The mutedAt field records the time when the mute was created, and the timestamps option automatically adds createdAt and updatedAt fields to the documents.
// The model is exported for use in other parts of the application, allowing for mute creation, 
// retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for mute creation, 