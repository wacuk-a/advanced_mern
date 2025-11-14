import { Safehouse } from '../models/Safehouse';
import { SafehouseBooking } from '../models/SafehouseBooking';
import { logger } from '../utils/logger';
import geolib from 'geolib';
import {
  executeCompleteBookingWorkflow,
  checkAvailabilityAndSafetyMatch,
  arrangeSecureTransportation,
  performDigitalCheckIn,
  activateSupportServices
} from '../services/safehouseBookingWorkflow';

interface SafehouseContext {
  user?: any;
  anonymousSessionId?: string;
}

export const safehouseController = {
  list: async (params: any, context: SafehouseContext) => {
    try {
      const { latitude, longitude, radius = 50000, filters = {} } = params; // radius in meters

      let query: any = {
        'availability.isAvailable': true,
        'capacity.availableBeds': { $gt: 0 }
      };

      // Apply filters
      if (filters.securityLevel) {
        query.securityLevel = filters.securityLevel;
      }
      if (filters.wheelchairAccessible) {
        query['accessibility.wheelchairAccessible'] = true;
      }
      if (filters.petFriendly) {
        query['accessibility.petFriendly'] = true;
      }
      if (filters.childrenFriendly) {
        query['accessibility.childrenFriendly'] = true;
      }

      const safehouses = await Safehouse.find(query);

      // Filter by distance if coordinates provided
      let filteredSafehouses = safehouses;
      if (latitude && longitude) {
        filteredSafehouses = safehouses.filter(safehouse => {
          const distance = geolib.getDistance(
            { latitude, longitude },
            {
              latitude: safehouse.address.coordinates.latitude,
              longitude: safehouse.address.coordinates.longitude
            }
          );
          return distance <= radius;
        });

        // Sort by distance
        filteredSafehouses.sort((a, b) => {
          const distA = geolib.getDistance(
            { latitude, longitude },
            {
              latitude: a.address.coordinates.latitude,
              longitude: a.address.coordinates.longitude
            }
          );
          const distB = geolib.getDistance(
            { latitude, longitude },
            {
              latitude: b.address.coordinates.latitude,
              longitude: b.address.coordinates.longitude
            }
          );
          return distA - distB;
        });
      }

      return {
        safehouses: filteredSafehouses.map(sh => ({
          id: sh._id,
          name: sh.name,
          address: sh.address,
          capacity: sh.capacity,
          resources: sh.resources,
          amenities: sh.amenities,
          securityLevel: sh.securityLevel,
          accessibility: sh.accessibility,
          distance: latitude && longitude ? geolib.getDistance(
            { latitude, longitude },
            {
              latitude: sh.address.coordinates.latitude,
              longitude: sh.address.coordinates.longitude
            }
          ) : null
        }))
      };
    } catch (error: any) {
      logger.error('List safehouses error:', error);
      throw new Error(`Failed to list safehouses: ${error.message}`);
    }
  },

  getAvailability: async (params: any, context: SafehouseContext) => {
    try {
      const { safehouseId } = params;

      const safehouse = await Safehouse.findById(safehouseId);
      if (!safehouse) {
        throw new Error('Safehouse not found');
      }

      // Get pending and active bookings
      const activeBookings = await SafehouseBooking.find({
        safehouseId,
        status: { $in: ['approved', 'checked_in'] }
      });

      return {
        safehouseId: safehouse._id,
        totalBeds: safehouse.capacity.totalBeds,
        availableBeds: safehouse.capacity.availableBeds,
        reservedBeds: safehouse.capacity.reservedBeds,
        occupiedBeds: safehouse.capacity.occupiedBeds,
        isAvailable: safehouse.availability.isAvailable,
        nextAvailableDate: safehouse.availability.nextAvailableDate,
        resources: safehouse.resources,
        activeBookings: activeBookings.length
      };
    } catch (error: any) {
      logger.error('Get availability error:', error);
      throw new Error(`Failed to get availability: ${error.message}`);
    }
  },

  book: async (params: any, context: SafehouseContext) => {
    try {
      const {
        safehouseId,
        requestedCheckIn,
        requestedCheckOut,
        numberOfGuests,
        specialNeeds,
        accessibilityNeeds,
        transportationRequired,
        transportationDetails,
        urgencyLevel
      } = params;
      const { user, anonymousSessionId } = context;

      // Use complete booking workflow
      const result = await executeCompleteBookingWorkflow({
        safehouseId,
        userId: user?._id?.toString(),
        anonymousSessionId: anonymousSessionId || user?.anonymousSessionId,
        requestedCheckIn: new Date(requestedCheckIn),
        requestedCheckOut: requestedCheckOut ? new Date(requestedCheckOut) : undefined,
        numberOfGuests,
        specialNeeds,
        accessibilityNeeds,
        transportationRequired: transportationRequired || false,
        pickupLocation: transportationDetails?.pickupLocation,
        urgencyLevel: urgencyLevel || 'medium'
      });

      // Auto-approve if enabled
      const booking = await SafehouseBooking.findById(result.bookingId);
      if (booking) {
        const safehouse = await Safehouse.findById(safehouseId);
        if (safehouse) {
          const ngo = await import('../models/NGO').then(m => m.NGO.findById(safehouse.ngoId));
          if (ngo?.settings?.autoApproveBookings) {
            booking.status = 'approved';
            booking.approvedBy = user?._id;
            booking.approvedAt = new Date();
            await booking.save();
          }
        }
      }

      return {
        success: true,
        bookingId: result.bookingId,
        status: result.status,
        workflowStep: result.workflowStep,
        nextSteps: result.nextSteps
      };
    } catch (error: any) {
      logger.error('Book safehouse error:', error);
      throw new Error(`Failed to book safehouse: ${error.message}`);
    }
  },

  checkSafetyMatch: async (params: any, context: SafehouseContext) => {
    try {
      const { safehouseId, numberOfGuests, specialNeeds, accessibilityNeeds, urgencyLevel } = params;
      const { user, anonymousSessionId } = context;

      const safetyMatch = await checkAvailabilityAndSafetyMatch({
        safehouseId,
        userId: user?._id?.toString(),
        anonymousSessionId: anonymousSessionId || user?.anonymousSessionId,
        requestedCheckIn: new Date(),
        numberOfGuests,
        specialNeeds,
        accessibilityNeeds,
        transportationRequired: false,
        urgencyLevel: urgencyLevel || 'medium'
      });

      return {
        isMatch: safetyMatch.isMatch,
        safetyScore: safetyMatch.safetyScore,
        reasons: safetyMatch.reasons
      };
    } catch (error: any) {
      logger.error('Check safety match error:', error);
      throw new Error(`Failed to check safety match: ${error.message}`);
    }
  },

  arrangeTransportation: async (params: any, context: SafehouseContext) => {
    try {
      const { bookingId, pickupLocation } = params;
      const { user } = context;

      if (!user || (user.role !== 'safehouse_staff' && user.role !== 'admin' && user.role !== 'counselor')) {
        throw new Error('Unauthorized: Staff access required');
      }

      const result = await arrangeSecureTransportation(bookingId, pickupLocation);

      return {
        success: true,
        bookingId: result.bookingId,
        transportationDetails: result.transportationDetails,
        workflowStep: result.workflowStep
      };
    } catch (error: any) {
      logger.error('Arrange transportation error:', error);
      throw new Error(`Failed to arrange transportation: ${error.message}`);
    }
  },

  digitalCheckIn: async (params: any, context: SafehouseContext) => {
    try {
      const { bookingId, needsAssessment } = params;
      const { user } = context;

      if (!user || (user.role !== 'safehouse_staff' && user.role !== 'admin' && user.role !== 'counselor')) {
        throw new Error('Unauthorized: Staff access required');
      }

      const result = await performDigitalCheckIn(bookingId, needsAssessment, user._id.toString());

      return {
        success: true,
        bookingId: result.bookingId,
        status: result.status,
        needsAssessment: result.needsAssessment,
        workflowStep: result.workflowStep
      };
    } catch (error: any) {
      logger.error('Digital check-in error:', error);
      throw new Error(`Failed to perform digital check-in: ${error.message}`);
    }
  },

  activateServices: async (params: any, context: SafehouseContext) => {
    try {
      const { bookingId } = params;
      const { user } = context;

      if (!user || (user.role !== 'safehouse_staff' && user.role !== 'admin' && user.role !== 'counselor')) {
        throw new Error('Unauthorized: Staff access required');
      }

      const supportServices = await activateSupportServices(bookingId);

      return {
        success: true,
        bookingId,
        supportServices,
        workflowStep: 6
      };
    } catch (error: any) {
      logger.error('Activate services error:', error);
      throw new Error(`Failed to activate support services: ${error.message}`);
    }
  },

  checkIn: async (params: any, context: SafehouseContext) => {
    try {
      const { bookingId } = params;
      const { user } = context;

      if (!user || (user.role !== 'safehouse_staff' && user.role !== 'admin' && user.role !== 'counselor')) {
        throw new Error('Unauthorized: Staff access required');
      }

      const booking = await SafehouseBooking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status !== 'approved') {
        throw new Error('Booking must be approved before check-in');
      }

      const safehouse = await Safehouse.findById(booking.safehouseId);
      if (!safehouse) {
        throw new Error('Safehouse not found');
      }

      booking.status = 'checked_in';
      booking.checkedInAt = new Date();
      booking.checkedInBy = user._id;
      await booking.save();

      // Update safehouse capacity
      safehouse.capacity.occupiedBeds += booking.numberOfGuests;
      safehouse.capacity.reservedBeds -= booking.numberOfGuests;
      
      const bookingIndex = safehouse.bookings.findIndex(b => b.bookingId.toString() === bookingId);
      if (bookingIndex !== -1) {
        safehouse.bookings[bookingIndex].status = 'checked_in';
        safehouse.bookings[bookingIndex].checkInDate = booking.checkedInAt;
      }
      
      await safehouse.save();

      return {
        success: true,
        bookingId: booking._id,
        status: booking.status,
        checkedInAt: booking.checkedInAt
      };
    } catch (error: any) {
      logger.error('Check-in error:', error);
      throw new Error(`Failed to check in: ${error.message}`);
    }
  },

  checkOut: async (params: any, context: SafehouseContext) => {
    try {
      const { bookingId } = params;
      const { user } = context;

      if (!user || (user.role !== 'safehouse_staff' && user.role !== 'admin' && user.role !== 'counselor')) {
        throw new Error('Unauthorized: Staff access required');
      }

      const booking = await SafehouseBooking.findById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status !== 'checked_in') {
        throw new Error('Guest must be checked in before check-out');
      }

      const safehouse = await Safehouse.findById(booking.safehouseId);
      if (!safehouse) {
        throw new Error('Safehouse not found');
      }

      booking.status = 'checked_out';
      booking.checkedOutAt = new Date();
      await booking.save();

      // Update safehouse capacity
      safehouse.capacity.occupiedBeds -= booking.numberOfGuests;
      safehouse.capacity.availableBeds += booking.numberOfGuests;
      
      const bookingIndex = safehouse.bookings.findIndex(b => b.bookingId.toString() === bookingId);
      if (bookingIndex !== -1) {
        safehouse.bookings[bookingIndex].status = 'checked_out';
        safehouse.bookings[bookingIndex].checkOutDate = booking.checkedOutAt;
      }
      
      await safehouse.save();

      return {
        success: true,
        bookingId: booking._id,
        status: booking.status,
        checkedOutAt: booking.checkedOutAt
      };
    } catch (error: any) {
      logger.error('Check-out error:', error);
      throw new Error(`Failed to check out: ${error.message}`);
    }
  },

  getResources: async (params: any, context: SafehouseContext) => {
    try {
      const { safehouseId } = params;

      const safehouse = await Safehouse.findById(safehouseId);
      if (!safehouse) {
        throw new Error('Safehouse not found');
      }

      return {
        safehouseId: safehouse._id,
        resources: safehouse.resources,
        amenities: safehouse.amenities
      };
    } catch (error: any) {
      logger.error('Get resources error:', error);
      throw new Error(`Failed to get resources: ${error.message}`);
    }
  }
};

