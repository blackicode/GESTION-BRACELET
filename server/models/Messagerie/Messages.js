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

// Note: This schema defines a Message model for a messaging system, including fields for sender and recipient references, content, optional attachments, encryption details, read status, and conversation identification.     
// The schema uses Mongoose's ObjectId type for references to the User model, ensuring that messages are linked to valid users. The content field is conditionally required based on the presence of an attachment, allowing for flexibility in message types. The timestamps option automatically adds createdAt and updatedAt fields to the documents.
// The schema also includes an initialization vector (iv) for encryption purposes, enhancing the security of the messages. The isRead field tracks whether a message has been read, and the conversationId field associates messages with specific conversations, facilitating organized communication.
// The model is exported for use in other parts of the application, allowing for message creation, retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for message creation, retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for message creation, retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for message creation, retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for message creation, retrieval, and management within the messaging system.
// The model is exported for use in other parts of the application, allowing for message creation, retrieval, and management within the messaging system.