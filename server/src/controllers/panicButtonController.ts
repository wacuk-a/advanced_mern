import { Request, Response } from 'express';
import { io } from '../index';
import logger from '../utils/logger';  // Fixed import
import { sendEmergencySMS } from '../services/notificationService';  // Fixed import

export const panicButtonController = {
  async activate(params: any) {
    try {
      const { triggerType = 'button', location, riskLevel = 'high' } = params;
      
      // Mock emergency activation
      const eventData = {
        id: 'event_' + Date.now(),
        triggerType,
        location,
        riskLevel,
        createdAt: new Date(),
        status: 'active' as const
      };
      
      // Notify through socket
      io.emit('emergency:activated', eventData);
      
      logger.info(`Emergency activated: ${eventData.id}`, eventData);
      
      return {
        success: true,
        eventId: eventData.id,
        status: eventData.status,
        countdownSeconds: 300 // 5 minutes countdown
      };
    } catch (error) {
      logger.error('Emergency activate error:', error);
      throw error;
    }
  },

  async deactivate(params: any) {
    try {
      const { eventId, reason = 'false_alarm' } = params;
      
      // Mock deactivation
      io.emit('emergency:deactivated', { eventId, reason });
      
      logger.info(`Emergency deactivated: ${eventId}`, { reason });
      
      return {
        success: true,
        status: reason
      };
    } catch (error) {
      logger.error('Emergency deactivate error:', error);
      throw error;
    }
  },

  async getStatus(params: any) {
    try {
      // Mock status
      const statusData = {
        eventId: 'event_123',
        status: 'active' as const,
        location: { latitude: 0, longitude: 0, timestamp: new Date() },
        riskLevel: 'high' as const,
        emergencyServicesContacted: false,
        createdAt: new Date()
      };
      
      return statusData;
    } catch (error) {
      logger.error('Get status error:', error);
      throw error;
    }
  },

  async recordEvidence(params: any) {
    try {
      const { eventId, evidenceType, data } = params;
      
      // Mock evidence recording
      logger.info(`Evidence recorded for event ${eventId}`, { evidenceType });
      
      return {
        success: true,
        eventId
      };
    } catch (error) {
      logger.error('Record evidence error:', error);
      throw error;
    }
  },

  async updateLocation(params: any) {
    try {
      const { eventId, location } = params;
      
      // Mock location update
      io.emit('emergency:location_updated', { eventId, location });
      
      logger.info(`Location updated for event ${eventId}`, location);
      
      return {
        success: true,
        location
      };
    } catch (error) {
      logger.error('Update location error:', error);
      throw error;
    }
  }
};
