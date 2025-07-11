import mongoose from 'mongoose';
import crypto from 'crypto';
import Message from '../../models/Messagerie/Messages.js';
import User from '../../models/User.js';
import Block from '../../models/Messagerie/Block.js';
import Mute from '../../models/Messagerie/Mute.js';

// En production, stocker dans un coffre-fort sécurisé
const keyStore = {};

const messageController = {
    async sendMessage(req, res) {
        try {
            const { recipientId, content, attachment } = req.body;
            const senderId = req.user._id;

            if (!recipientId || !senderId)
                return res.status(400).json({ message: 'Sender and recipient IDs are required' });

            if (!mongoose.Types.ObjectId.isValid(recipientId) || !mongoose.Types.ObjectId.isValid(senderId))
                return res.status(400).json({ message: 'Invalid user ID(s)' });

            if (senderId.toString() === recipientId.toString())
                return res.status(400).json({ message: 'Sender and recipient cannot be the same' });

            if (!content && !attachment)
                return res.status(400).json({ message: 'Message content or attachment is required' });

            if (attachment) {
                const { fileName, fileType, filePath, fileSize } = attachment;
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'audio/mpeg'];
                if (!fileName || !fileType || !filePath || typeof fileSize !== 'number')
                    return res.status(400).json({ message: 'Attachment fields are invalid or missing' });

                if (!allowedTypes.includes(fileType))
                    return res.status(400).json({ message: 'Invalid attachment file type' });

                if (fileSize > 5 * 1024 * 1024)
                    return res.status(400).json({ message: 'Attachment file size exceeds 5MB limit' });
            }

            const sender = await User.findById(senderId);
            const recipient = await User.findById(recipientId);
            if (!sender || !recipient)
                return res.status(404).json({ message: 'Sender or recipient not found' });

            if (!['Patient', 'Medecin'].includes(sender.userType) || !['Patient', 'Medecin'].includes(recipient.userType))
                return res.status(403).json({ message: 'Unauthorized user type' });

            if (sender.userType === recipient.userType)
                return res.status(403).json({ message: 'Cannot message same user type' });

            const conversationId = [senderId, recipientId].sort().join('-');

            const isBlocked = await Block.exists({
                $or: [
                    { blocker: senderId, blocked: recipientId },
                    { blocker: recipientId, blocked: senderId }
                ]
            });

            if (isBlocked)
                return res.status(403).json({ message: 'Messaging blocked with this user' });

            const isMuted = await Mute.exists({
                $or: [
                    { muter: senderId, muted: recipientId },
                    { muter: recipientId, muted: senderId }
                ]
            });

            if (isMuted)
                return res.status(403).json({ message: 'Messaging muted with this user' });

            // Chiffrement
            const key = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedContent = cipher.update(content || '', 'utf8', 'hex');
            encryptedContent += cipher.final('hex');

            const newMessage = new Message({
                sender: senderId,
                recipient: recipientId,
                content: encryptedContent,
                iv: iv.toString('hex'),
                conversationId,
                ...(attachment && { attachment })
            });

            await newMessage.save();

            // Stocker la clé (à remplacer par AWS KMS, etc.)
            keyStore[conversationId] = key.toString('hex');

            res.status(201).json({ message: 'Message sent successfully', messageId: newMessage._id });
        } catch (error) {
            res.status(500).json({ message: 'Internal error', error: error.message });
        }
    },

    async markAsRead(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user._id;

            const message = await Message.findOne({ _id: messageId, recipient: userId, isRead: false });
            if (!message) {
                return res.status(404).json({ message: 'Message not found or already read' });
            }

            message.isRead = true;
            await message.save();
            res.status(200).json({ message: 'Message marked as read' });
        } catch (error) {
            res.status(500).json({ message: 'Error marking as read', error: error.message });
        }
    },
    async getConversation(req, res) {
        try {
            const { recipientId } = req.params;
            const userId = req.user._id;

            if (!recipientId || !userId)
                return res.status(400).json({ message: 'Recipient ID is required' });

            if (!mongoose.Types.ObjectId.isValid(recipientId) || !mongoose.Types.ObjectId.isValid(userId))
                return res.status(400).json({ message: 'Invalid user ID(s)' });

            const conversationId = [userId, recipientId].sort().join('-');

            const messages = await Message.find({
                conversationId,
                $or: [{ sender: userId }, { recipient: userId }]
            }).sort({ createdAt: 1 });

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Internal error', error: error.message });
        }
    },
    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user._id;

            if (!messageId || !userId)
                return res.status(400).json({ message: 'Message ID is required' });

            if (!mongoose.Types.ObjectId.isValid(messageId))
                return res.status(400).json({ message: 'Invalid message ID' });

            const message = await Message.findOneAndDelete({
                _id: messageId,
                $or: [{ sender: userId }, { recipient: userId }]
            });

            if (!message) {
                return res.status(404).json({ message: 'Message not found or unauthorized' });
            }

            res.status(200).json({ message: 'Message deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal error', error: error.message });
        }
    },
    async getUnreadCount(req, res) {
        try {
            const userId = req.user._id;
            const count = await Message.countDocuments({ recipient: userId, isRead: false });
            res.status(200).json({ unreadCount: count });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }

    // Note: This controller handles sending messages, marking them as read, retrieving conversations, and deleting messages.
    // Note: This controller handles sending messages, marking them as read, retrieving conversations, and deleting messages.
    // The sendMessage method includes validation for user IDs, content, and attachments, and implements encryption for message content.
    // The markAsRead method allows users to mark messages as read, while the getConversation
    // method retrieves all messages in a conversation between two users, and the deleteMessage method allows users to delete their own messages.

};

export default messageController;
