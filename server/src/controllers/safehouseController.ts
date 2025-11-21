import { Request, Response } from 'express';
import logger from '../utils/logger';  // Fixed import

export const safehouseController = {
  async list(params: any) {
    try {
      const { latitude, longitude, radius = 50 } = params;
      
      // Mock safehouses data
      const safehouses = [{
        id: 'safehouse_1',
        name: 'Nairobi Safe Shelter',
        address: {
          street: '123 Safety Street',
          city: 'Nairobi',
          state: 'Nairobi County',
          zipCode: '00100',
          country: 'Kenya'
        },
        coordinates: {
          latitude: -1.2921,
          longitude: 36.8219
        },
        capacity: 20,
        availableBeds: 5,
        contact: '+254 700 123 456',
        services: ['shelter', 'counseling', 'legal'],
        distance: 2.5
      }];
      
      logger.info(`Retrieved ${safehouses.length} safehouses`);
      
      return { safehouses };
    } catch (error) {
      logger.error('List safehouses error:', error);
      throw error;
    }
  },

  async getAvailability(params: any) {
    try {
      const { safehouseId } = params;
      
      // Mock availability
      const availability = {
        safehouseId,
        totalBeds: 20,
        availableBeds: 5,
        reservedBeds: 3,
        occupiedBeds: 12,
        isAvailable: true,
        nextAvailableDate: undefined
      };
      
      return availability;
    } catch (error) {
      logger.error('Get availability error:', error);
      throw error;
    }
  },

  async book(params: any) {
    try {
      const { safehouseId, userId, checkInDate } = params;
      
      // Mock booking
      const booking = {
        success: true,
        bookingId: 'booking_' + Date.now(),
        status: 'pending' as const,
        workflowStep: 1,
        nextSteps: ['Complete intake form', 'Schedule transportation']
      };
      
      logger.info(`Safehouse booking created: ${booking.bookingId}`);
      
      return booking;
    } catch (error) {
      logger.error('Book safehouse error:', error);
      throw error;
    }
  },

  async checkSafetyMatch(params: any) {
    try {
      const { safehouseId, userNeeds } = params;
      
      // Mock safety match
      const match = {
        isMatch: true,
        safetyScore: 85,
        reasons: ['Location matches', 'Services available', 'Capacity available']
      };
      
      return match;
    } catch (error) {
      logger.error('Check safety match error:', error);
      throw error;
    }
  },

  async arrangeTransportation(params: any) {
    try {
      const { bookingId, pickupLocation } = params;
      
      // Mock transportation
      const transportation = {
        success: true,
        bookingId,
        transportationDetails: {
          pickupLocation,
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: 'pending' as const,
          distance: 15.5
        }
      };
      
      logger.info(`Transportation arranged for booking: ${bookingId}`);
      
      return transportation;
    } catch (error) {
      logger.error('Arrange transportation error:', error);
      throw error;
    }
  },

  async digitalCheckIn(params: any) {
    try {
      const { bookingId } = params;
      
      // Mock check-in
      const checkIn = {
        success: true,
        bookingId,
        status: 'checked_in' as const,
        needsAssessment: {
          medicalNeeds: [],
          legalNeeds: [],
          counselingNeeds: ['trauma'],
          children: 0,
          pets: false,
          safetyConcerns: ['stalker']
        },
        workflowStep: 3
      };
      
      logger.info(`Digital check-in completed for booking: ${bookingId}`);
      
      return checkIn;
    } catch (error) {
      logger.error('Digital check-in error:', error);
      throw error;
    }
  },

  async activateServices(params: any) {
    try {
      const { bookingId, services } = params;
      
      // Mock services activation
      const activated = {
        success: true,
        bookingId,
        supportServices: {
          food: true,
          medical: true,
          legal: true,
          counseling: true,
          childcare: false,
          security: true
        },
        workflowStep: 4
      };
      
      logger.info(`Services activated for booking: ${bookingId}`);
      
      return activated;
    } catch (error) {
      logger.error('Activate services error:', error);
      throw error;
    }
  },

  async checkIn(params: any) {
    try {
      const { bookingId } = params;
      
      // Mock physical check-in
      const checkIn = {
        success: true,
        bookingId,
        status: 'checked_in' as const,
        checkedInAt: new Date()
      };
      
      logger.info(`Physical check-in completed for booking: ${bookingId}`);
      
      return checkIn;
    } catch (error) {
      logger.error('Check-in error:', error);
      throw error;
    }
  },

  async checkOut(params: any) {
    try {
      const { bookingId } = params;
      
      // Mock check-out
      const checkOut = {
        success: true,
        bookingId,
        status: 'checked_out' as const,
        checkedOutAt: new Date()
      };
      
      logger.info(`Check-out completed for booking: ${bookingId}`);
      
      return checkOut;
    } catch (error) {
      logger.error('Check-out error:', error);
      throw error;
    }
  },

  async getResources(params: any) {
    try {
      const { safehouseId } = params;
      
      // Mock resources
      const resources = {
        safehouseId,
        resources: {
          food: { available: true, capacity: 50, currentStock: 35 },
          medical: { available: true, staffOnSite: true, equipment: ['first_aid', 'medications'] },
          legal: { available: true, services: ['consultation', 'court_accompaniment'] },
          counseling: { available: true, types: ['individual', 'group', 'crisis'] },
          security: { available: true, features: ['cctv', 'guards', 'panic_buttons'] }
        }
      };
      
      return resources;
    } catch (error) {
      logger.error('Get resources error:', error);
      throw error;
    }
  }
};
