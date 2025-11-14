import { PanicEvent } from '../models/PanicEvent';
import { User } from '../models/User';
import { io } from '../index';
import { logger } from '../utils/logger';
import { sendEmergencySMS, sendEmergencyEmail } from '../services/notificationService';
import { contactEmergencyServices } from '../services/emergencyService';

interface PanicContext {
  user?: any;
  anonymousSessionId?: string;
}

export const panicButtonController = {
  activate: async (params: any, context: PanicContext) => {
    try {
      const { triggerType, location, countdownSeconds, riskLevel } = params;
      const { user, anonymousSessionId } = context;

      // Create panic event
      const panicEvent = new PanicEvent({
        userId: user?._id,
        anonymousSessionId: anonymousSessionId || user?.anonymousSessionId,
        triggerType: triggerType || 'button',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: new Date()
        },
        locationHistory: [{
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date()
        }],
        status: 'active',
        riskLevel: riskLevel || 'medium',
        countdownSeconds: countdownSeconds || 30,
        emergencyServicesContacted: false
      });

      await panicEvent.save();

      // Get user's emergency contacts
      let emergencyContacts: any[] = [];
      if (user) {
        const userDoc = await User.findById(user._id);
        if (userDoc) {
          emergencyContacts = userDoc.emergencyContacts || [];
        }
      }

      // Notify emergency contacts
      const notificationPromises = emergencyContacts.map(async (contact) => {
        try {
          if (contact.phone) {
            await sendEmergencySMS(
              contact.phone,
              `EMERGENCY ALERT: ${user?.email || 'User'} has activated their panic button. Location: ${location.latitude}, ${location.longitude}`
            );
            panicEvent.emergencyContactsNotified.push({
              contactId: contact.phone,
              method: 'sms',
              status: 'sent',
              timestamp: new Date()
            });
          }
          if (contact.email) {
            await sendEmergencyEmail(
              contact.email,
              'Emergency Alert - Panic Button Activated',
              `An emergency alert has been triggered. Location: ${location.latitude}, ${location.longitude}`
            );
            panicEvent.emergencyContactsNotified.push({
              contactId: contact.email,
              method: 'email',
              status: 'sent',
              timestamp: new Date()
            });
          }
        } catch (error) {
          logger.error('Failed to notify emergency contact:', error);
        }
      });

      await Promise.all(notificationPromises);
      await panicEvent.save();

      // Emit real-time alert to counselors
      io.emit('panic:activated', {
        eventId: panicEvent._id,
        location: panicEvent.location,
        riskLevel: panicEvent.riskLevel,
        triggerType: panicEvent.triggerType,
        timestamp: panicEvent.createdAt
      });

      // If critical risk, contact emergency services immediately
      if (riskLevel === 'critical') {
        try {
          const emergencyResponse = await contactEmergencyServices({
            location: panicEvent.location,
            eventId: panicEvent._id.toString(),
            riskLevel: 'critical'
          });
          
          panicEvent.emergencyServicesContacted = true;
          panicEvent.emergencyServicesResponse = {
            contactedAt: new Date(),
            serviceType: emergencyResponse.serviceType || 'police',
            responseId: emergencyResponse.responseId
          };
          await panicEvent.save();
        } catch (error) {
          logger.error('Failed to contact emergency services:', error);
        }
      }

      return {
        success: true,
        eventId: panicEvent._id,
        status: panicEvent.status,
        countdownSeconds: panicEvent.countdownSeconds
      };
    } catch (error: any) {
      logger.error('Panic button activation error:', error);
      throw new Error(`Failed to activate panic button: ${error.message}`);
    }
  },

  deactivate: async (params: any, context: PanicContext) => {
    try {
      const { eventId, reason } = params;
      const { user, anonymousSessionId } = context;

      const panicEvent = await PanicEvent.findOne({
        _id: eventId,
        $or: [
          { userId: user?._id },
          { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
        ]
      });

      if (!panicEvent) {
        throw new Error('Panic event not found');
      }

      if (panicEvent.status !== 'active') {
        throw new Error('Panic event is not active');
      }

      panicEvent.status = reason === 'false_alarm' ? 'false_alarm' : 'aborted';
      panicEvent.abortedAt = new Date();
      await panicEvent.save();

      // Notify counselors
      io.emit('panic:deactivated', {
        eventId: panicEvent._id,
        reason: reason || 'aborted'
      });

      return {
        success: true,
        status: panicEvent.status
      };
    } catch (error: any) {
      logger.error('Panic button deactivation error:', error);
      throw new Error(`Failed to deactivate panic button: ${error.message}`);
    }
  },

  getStatus: async (params: any, context: PanicContext) => {
    try {
      const { eventId } = params;
      const { user, anonymousSessionId } = context;

      const panicEvent = await PanicEvent.findOne({
        _id: eventId,
        $or: [
          { userId: user?._id },
          { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
        ]
      });

      if (!panicEvent) {
        throw new Error('Panic event not found');
      }

      return {
        eventId: panicEvent._id,
        status: panicEvent.status,
        location: panicEvent.location,
        riskLevel: panicEvent.riskLevel,
        emergencyServicesContacted: panicEvent.emergencyServicesContacted,
        createdAt: panicEvent.createdAt
      };
    } catch (error: any) {
      logger.error('Get panic status error:', error);
      throw new Error(`Failed to get panic status: ${error.message}`);
    }
  },

  recordEvidence: async (params: any, context: PanicContext) => {
    try {
      const { eventId, evidence } = params;
      const { user, anonymousSessionId } = context;

      const panicEvent = await PanicEvent.findOne({
        _id: eventId,
        $or: [
          { userId: user?._id },
          { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
        ]
      });

      if (!panicEvent) {
        throw new Error('Panic event not found');
      }

      if (evidence.audio) panicEvent.evidence.audio = evidence.audio;
      if (evidence.video) panicEvent.evidence.video = evidence.video;
      if (evidence.photos) panicEvent.evidence.photos = [...(panicEvent.evidence.photos || []), ...evidence.photos];
      if (evidence.notes) panicEvent.evidence.notes = evidence.notes;

      await panicEvent.save();

      return {
        success: true,
        eventId: panicEvent._id
      };
    } catch (error: any) {
      logger.error('Record evidence error:', error);
      throw new Error(`Failed to record evidence: ${error.message}`);
    }
  },

  updateLocation: async (params: any, context: PanicContext) => {
    try {
      const { eventId, location } = params;
      const { user, anonymousSessionId } = context;

      const panicEvent = await PanicEvent.findOne({
        _id: eventId,
        status: 'active',
        $or: [
          { userId: user?._id },
          { anonymousSessionId: anonymousSessionId || user?.anonymousSessionId }
        ]
      });

      if (!panicEvent) {
        throw new Error('Active panic event not found');
      }

      // Update current location
      panicEvent.location = {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: new Date()
      };

      // Add to location history
      panicEvent.locationHistory.push({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date()
      });

      await panicEvent.save();

      // Emit location update to counselors
      io.emit('panic:location_update', {
        eventId: panicEvent._id,
        location: panicEvent.location
      });

      return {
        success: true,
        location: panicEvent.location
      };
    } catch (error: any) {
      logger.error('Update location error:', error);
      throw new Error(`Failed to update location: ${error.message}`);
    }
  }
};

