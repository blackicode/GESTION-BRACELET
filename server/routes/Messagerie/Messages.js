import express from 'express';
import messageController from "../../controllers/Messagerie/Messages.js";
import { verifyToken  } from '../../middlewares/protect.js';
const router = express.Router();

router.post('/send', verifyToken, messageController.sendMessage);
router.get('/conversation/:recipientId', verifyToken, messageController.getConversation);
router.delete('/message/:messageId', verifyToken, messageController.deleteMessage);
router.patch('/read/:messageId', verifyToken, messageController.markAsRead); // ajout utile
router.get('/unread-count', verifyToken, messageController.getUnreadCount); // ajout utile

export default router;
// Note: This router handles message-related routes, including sending messages, retrieving conversations, deleting messages, marking messages as read, and counting unread messages.
// The `verifyToken` ensures that only authenticated users can access these routes, providing security for the messaging functionality.
// The `messageController` contains the logic for handling these operations, ensuring that messages are processed correctly and securely.
// The router is exported for use in the main application, allowing for modular and organized route management          
// The router is exported for use in the main application, allowing for modular and organized route management.
// The router is exported for use in the main application, allowing for modular and organized route management