import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Block = mongoose.model('Block', blockSchema);
export default Block;
// Note: This schema defines a Block model for a messaging system, allowing users to block each other.
// The schema includes references to the blocker and blocked users, ensuring that both fields are required. 
// The blockedAt field records the time when the block was created, and the timestamps option automatically adds createdAt and updatedAt fields to the documents.
// The model is exported for use in other parts of the application, allowing for block creation,
// retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for block creation,