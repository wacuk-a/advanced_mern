import { Request, Response } from 'express';
import { io } from '../index';
import logger from '../utils/logger';

export const communicationController = {
  async sendMessage(params: any) {
    try {
      const { conversationId, message, from, to } = params;
      
      const messageData = {
        id: 'temp_' + Date.now(),
        conversationId,
        message,
        from,
        to,
        timestamp: new Date()
      };

      io.to(conversationId).emit('chat:message', messageData);
      
      logger.info(`Message sent in conversation ${conversationId}`);
      
      return {
        success: true,
        messageId: messageData.id,
        conversationId,
        timestamp: messageData.timestamp
      };
    } catch (error) {
      logger.error('Send message error:', error);
      throw error;
    }
  },

  async getMessages(params: any) {
    try {
      const { conversationId, limit = 50, offset = 0 } = params;
      
      const messages: any[] = [];  // Explicitly typed array
      
      logger.info(`Retrieved messages for conversation ${conversationId}`);
      
      return {
        messages,
        total: messages.length
      };
    } catch (error) {
      logger.error('Get messages error:', error);
      throw error;
    }
  },

  async shareLocation(params: any) {
    try {
      const { conversationId, latitude, longitude, address } = params;
      
      const locationData = {
        latitude,
        longitude,
        address,
        timestamp: new Date()
      };

      io.to(conversationId).emit('location:shared', locationData);
      
      logger.info(`Location shared in conversation ${conversationId}`);
      
      return {
        success: true,
        messageId: 'loc_' + Date.now(),
        location: locationData
      };
    } catch (error) {
      logger.error('Share location error:', error);
      throw error;
    }
  },

  async initiateVideo(params: any) {
    try {
      const { from, to } = params;
      
      const sessionId = 'vid_' + Date.now();
      
      io.to(to).emit('video:invite', {
        sessionId,
        from,
        timestamp: new Date()
      });
      
      logger.info(`Video call initiated from ${from} to ${to}`);
      
      return {
        success: true,
        sessionId,
        from
      };
    } catch (error) {
      logger.error('Initiate video error:', error);
      throw error;
    }
  }
};
