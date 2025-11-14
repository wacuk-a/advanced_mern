import { User } from '../models/User';
import { Report } from '../models/Report';
import { PanicEvent } from '../models/PanicEvent';
import { Message } from '../models/Message';
import { generateAnonymousSessionId } from '../utils/encryption';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface UserContext {
  user?: any;
  anonymousSessionId?: string;
}

export const userController = {
  createAnonymous: async (params: any, context: UserContext) => {
    try {
      const anonymousSessionId = generateAnonymousSessionId();

      // Create anonymous user session
      const anonymousUser = new User({
        anonymousSessionId,
        role: 'anonymous',
        isAnonymous: true,
        safeModeEnabled: false,
        quickExitEnabled: true,
        locationSharingEnabled: false
      });

      await anonymousUser.save();

      // Generate token for anonymous session
      const token = jwt.sign(
        { userId: anonymousUser._id, anonymousSessionId },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return {
        success: true,
        anonymousSessionId,
        token,
        user: {
          id: anonymousUser._id,
          role: anonymousUser.role,
          isAnonymous: anonymousUser.isAnonymous
        }
      };
    } catch (error: any) {
      logger.error('Create anonymous user error:', error);
      throw new Error(`Failed to create anonymous session: ${error.message}`);
    }
  },

  updateProfile: async (params: any, context: UserContext) => {
    try {
      const { emergencyContacts, safeModeEnabled, quickExitEnabled, locationSharingEnabled } = params;
      const { user, anonymousSessionId } = context;

      let userDoc;
      if (user) {
        userDoc = await User.findById(user._id);
      } else if (anonymousSessionId) {
        userDoc = await User.findOne({ anonymousSessionId });
      } else {
        throw new Error('User identification required');
      }

      if (!userDoc) {
        throw new Error('User not found');
      }

      if (emergencyContacts) {
        userDoc.emergencyContacts = emergencyContacts;
      }
      if (safeModeEnabled !== undefined) {
        userDoc.safeModeEnabled = safeModeEnabled;
      }
      if (quickExitEnabled !== undefined) {
        userDoc.quickExitEnabled = quickExitEnabled;
      }
      if (locationSharingEnabled !== undefined) {
        userDoc.locationSharingEnabled = locationSharingEnabled;
      }

      await userDoc.save();

      return {
        success: true,
        user: {
          id: userDoc._id,
          role: userDoc.role,
          safeModeEnabled: userDoc.safeModeEnabled,
          quickExitEnabled: userDoc.quickExitEnabled,
          locationSharingEnabled: userDoc.locationSharingEnabled,
          emergencyContacts: userDoc.emergencyContacts
        }
      };
    } catch (error: any) {
      logger.error('Update profile error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  getProfile: async (params: any, context: UserContext) => {
    try {
      const { user, anonymousSessionId } = context;

      let userDoc;
      if (user) {
        userDoc = await User.findById(user._id).select('-password');
      } else if (anonymousSessionId) {
        userDoc = await User.findOne({ anonymousSessionId }).select('-password');
      } else {
        throw new Error('User identification required');
      }

      if (!userDoc) {
        throw new Error('User not found');
      }

      return {
        user: {
          id: userDoc._id,
          email: userDoc.email,
          role: userDoc.role,
          isAnonymous: userDoc.isAnonymous,
          safeModeEnabled: userDoc.safeModeEnabled,
          quickExitEnabled: userDoc.quickExitEnabled,
          locationSharingEnabled: userDoc.locationSharingEnabled,
          emergencyContacts: userDoc.emergencyContacts
        }
      };
    } catch (error: any) {
      logger.error('Get profile error:', error);
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  },

  emergencyWipe: async (params: any, context: UserContext) => {
    try {
      const { user, anonymousSessionId } = context;

      let userDoc;
      let userId;
      let sessionId;

      if (user) {
        userDoc = await User.findById(user._id);
        userId = user._id;
      } else if (anonymousSessionId) {
        userDoc = await User.findOne({ anonymousSessionId });
        sessionId = anonymousSessionId;
      } else {
        throw new Error('User identification required');
      }

      if (!userDoc) {
        throw new Error('User not found');
      }

      // Delete all user data
      const deletePromises = [];

      // Delete reports
      if (userId) {
        deletePromises.push(Report.deleteMany({ userId }));
      }
      if (sessionId) {
        deletePromises.push(Report.deleteMany({ anonymousSessionId: sessionId }));
      }

      // Delete panic events
      if (userId) {
        deletePromises.push(PanicEvent.deleteMany({ userId }));
      }
      if (sessionId) {
        deletePromises.push(PanicEvent.deleteMany({ anonymousSessionId: sessionId }));
      }

      // Delete messages
      if (userId) {
        deletePromises.push(Message.deleteMany({ $or: [{ from: userId }, { to: userId }] }));
      }
      if (sessionId) {
        deletePromises.push(Message.deleteMany({ $or: [{ from: sessionId }, { to: sessionId }] }));
      }

      // Delete user account
      deletePromises.push(User.deleteOne({ _id: userDoc._id }));

      await Promise.all(deletePromises);

      logger.warn(`Emergency data wipe completed for user: ${userId || sessionId}`);

      return {
        success: true,
        message: 'All data has been permanently deleted'
      };
    } catch (error: any) {
      logger.error('Emergency wipe error:', error);
      throw new Error(`Failed to perform emergency wipe: ${error.message}`);
    }
  }
};

