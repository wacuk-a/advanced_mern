import { Message } from '../models/Message';
import { io } from '../index';
import { logger } from '../utils/logger';
import { encrypt, decrypt } from '../utils/encryption';

interface CommunicationContext {
  user?: any;
  anonymousSessionId?: string;
}

const ENCRYPTION_KEY = process.env.MESSAGE_ENCRYPTION_KEY || 'default-key-change-in-production';

export const communicationController = {
  sendMessage: async (params: any, context: CommunicationContext) => {
    try {
      const { to, content, messageType, attachments, location } = params;
      const { user, anonymousSessionId } = context;

      const from = user?._id || anonymousSessionId;
      if (!from) {
        throw new Error('Sender identification required');
      }

      // Generate conversation ID
      const conversationId = [from, to].sort().join('_');

      // Encrypt message content
      const encryptedContent = encrypt(content, ENCRYPTION_KEY);

      // Create message
      const message = new Message({
        from,
        to,
        conversationId,
        content: encryptedContent,
        encrypted: true,
        messageType: messageType || 'text',
        attachments,
        location,
        read: false,
        delivered: false
      });

      await message.save();

      // Emit real-time message to recipient
      io.to(`user:${to}`).emit('message:new', {
        messageId: message._id,
        from,
        content: content, // Send decrypted content for display
        messageType: message.messageType,
        timestamp: message.createdAt
      });

      // Mark as delivered if recipient is online
      const sockets = await io.in(`user:${to}`).fetchSockets();
      if (sockets.length > 0) {
        message.delivered = true;
        message.deliveredAt = new Date();
        await message.save();
      }

      return {
        success: true,
        messageId: message._id,
        conversationId,
        timestamp: message.createdAt
      };
    } catch (error: any) {
      logger.error('Send message error:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },

  getMessages: async (params: any, context: CommunicationContext) => {
    try {
      const { conversationId, limit = 50, offset = 0 } = params;
      const { user, anonymousSessionId } = context;

      const userId = user?._id || anonymousSessionId;
      if (!userId) {
        throw new Error('User identification required');
      }

      const messages = await Message.find({
        conversationId,
        deleted: false,
        $or: [
          { from: userId },
          { to: userId }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      // Decrypt messages
      const decryptedMessages = messages.map(msg => {
        let decryptedContent = msg.content;
        if (msg.encrypted) {
          try {
            decryptedContent = decrypt(msg.content, ENCRYPTION_KEY);
          } catch (error) {
            logger.error('Failed to decrypt message:', error);
            decryptedContent = '[Encrypted message - decryption failed]';
          }
        }

        return {
          id: msg._id,
          from: msg.from,
          to: msg.to,
          content: decryptedContent,
          messageType: msg.messageType,
          attachments: msg.attachments,
          location: msg.location,
          read: msg.read,
          delivered: msg.delivered,
          createdAt: msg.createdAt
        };
      });

      return {
        messages: decryptedMessages.reverse(), // Reverse to show oldest first
        total: messages.length
      };
    } catch (error: any) {
      logger.error('Get messages error:', error);
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  },

  shareLocation: async (params: any, context: CommunicationContext) => {
    try {
      const { to, location } = params;
      const { user, anonymousSessionId } = context;

      const from = user?._id || anonymousSessionId;
      if (!from) {
        throw new Error('Sender identification required');
      }

      // Generate conversation ID
      const conversationId = [from, to].sort().join('_');

      // Create location message
      const message = new Message({
        from,
        to,
        conversationId,
        content: `Location shared: ${location.latitude}, ${location.longitude}`,
        encrypted: false,
        messageType: 'location',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        },
        read: false,
        delivered: false
      });

      await message.save();

      // Emit real-time location to recipient
      io.to(`user:${to}`).emit('location:shared', {
        messageId: message._id,
        from,
        location: message.location,
        timestamp: message.createdAt
      });

      return {
        success: true,
        messageId: message._id,
        location: message.location
      };
    } catch (error: any) {
      logger.error('Share location error:', error);
      throw new Error(`Failed to share location: ${error.message}`);
    }
  },

  initiateVideo: async (params: any, context: CommunicationContext) => {
    try {
      const { to } = params;
      const { user, anonymousSessionId } = context;

      const from = user?._id || anonymousSessionId;
      if (!from) {
        throw new Error('Sender identification required');
      }

      // Generate WebRTC session ID
      const sessionId = `webrtc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Emit video call initiation
      io.to(`user:${to}`).emit('video:initiate', {
        from,
        sessionId,
        timestamp: new Date()
      });

      return {
        success: true,
        sessionId,
        from
      };
    } catch (error: any) {
      logger.error('Initiate video error:', error);
      throw new Error(`Failed to initiate video: ${error.message}`);
    }
  }
};

