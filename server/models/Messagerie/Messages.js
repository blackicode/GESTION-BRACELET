import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  filePath: String,
  fileSize: Number
}, { _id: false });

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: function () {
      return !this.attachment;
    }
  },
  attachment: {
    type: attachmentSchema,
    default: null
  },
  iv: String, // vecteur d'initialisation pour le chiffrement
  isRead: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
