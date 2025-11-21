import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const userController = {
  async generateAnonymousToken(params: any) {
    try {
      const { anonymousSessionId } = params;
      
      // Create anonymous user or use existing
      let user = await User.findOne({ email: `anonymous_${anonymousSessionId}@temp.com` });
      
      if (!user) {
        user = new User({
          name: 'Anonymous User',
          email: `anonymous_${anonymousSessionId}@temp.com`,
          password: 'anonymous_password', // In real app, use proper auth
          role: 'user',
          isVerified: false
        });
        await user.save();
      }

      // Create token with proper options
      const token = jwt.sign(
        { userId: user._id, anonymous: true }, 
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        userId: user._id,
        isAnonymous: true
      };
    } catch (error) {
      console.error('Generate anonymous token error:', error);
      throw error;
    }
  },

  async updateEmergencyContacts(params: any) {
    try {
      const { userId, contacts } = params;
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // In a real implementation, you would store emergency contacts
      // For now, we'll just return success
      console.log('Emergency contacts updated for user:', userId, contacts);

      return {
        success: true,
        emergencyContacts: contacts
      };
    } catch (error) {
      console.error('Update emergency contacts error:', error);
      throw error;
    }
  },

  async updateSafetyPlan(params: any) {
    try {
      const { userId, safetyPlan } = params;
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // In a real implementation, you would store safety plan
      // For now, we'll just return success
      console.log('Safety plan updated for user:', userId, safetyPlan);

      return {
        success: true,
        safetyPlan: safetyPlan
      };
    } catch (error) {
      console.error('Update safety plan error:', error);
      throw error;
    }
  }
};
