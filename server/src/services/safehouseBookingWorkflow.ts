import { Safehouse } from '../models/Safehouse';
import { SafehouseBooking } from '../models/SafehouseBooking';
import { User } from '../models/User';
import { io } from '../index';
import { logger } from '../utils/logger';
import { sendEmergencySMS, sendEmergencyEmail } from './notificationService';
import geolib from 'geolib';

interface BookingRequest {
  safehouseId: string;
  userId?: string;
  anonymousSessionId?: string;
  requestedCheckIn: Date;
  requestedCheckOut?: Date;
  numberOfGuests: number;
  specialNeeds?: string[];
  accessibilityNeeds?: {
    wheelchairAccessible?: boolean;
    petFriendly?: boolean;
    childrenFriendly?: boolean;
    lgbtqFriendly?: boolean;
  };
  transportationRequired: boolean;
  pickupLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface SafetyMatchResult {
  isMatch: boolean;
  reasons: string[];
  safetyScore: number;
}

interface NeedsAssessment {
  medicalNeeds?: string[];
  legalNeeds?: string[];
  counselingNeeds?: string[];
  foodAssistance?: boolean;
  clothingAssistance?: boolean;
  documentationHelp?: boolean;
  safetyConcerns?: string[];
}

interface SupportServices {
  medical: boolean;
  legal: boolean;
  counseling: boolean;
  food: boolean;
  transportation: boolean;
  assignedServices: Array<{
    serviceType: string;
    providerId?: string;
    scheduledDate?: Date;
    status: 'pending' | 'active' | 'completed';
  }>;
}

/**
 * Step 1: User Requests Safehouse Placement
 * Validates request and initiates workflow
 */
export async function initiateBookingRequest(request: BookingRequest) {
  try {
    logger.info(`Initiating safehouse booking request for safehouse ${request.safehouseId}`);

    // Validate safehouse exists
    const safehouse = await Safehouse.findById(request.safehouseId);
    if (!safehouse) {
      throw new Error('Safehouse not found');
    }

    // Validate user or anonymous session
    if (!request.userId && !request.anonymousSessionId) {
      throw new Error('User identification required');
    }

    return {
      success: true,
      safehouseId: request.safehouseId,
      workflowStep: 1,
      message: 'Booking request initiated'
    };
  } catch (error: any) {
    logger.error('Failed to initiate booking request:', error);
    throw error;
  }
}

/**
 * Step 2: System Checks Availability & Safety Match
 * Validates capacity, safety requirements, and accessibility needs
 */
export async function checkAvailabilityAndSafetyMatch(
  request: BookingRequest
): Promise<SafetyMatchResult> {
  try {
    const safehouse = await Safehouse.findById(request.safehouseId);
    if (!safehouse) {
      throw new Error('Safehouse not found');
    }

    const reasons: string[] = [];
    let safetyScore = 100;

    // Check availability
    if (!safehouse.availability.isAvailable) {
      reasons.push('Safehouse is currently unavailable');
      safetyScore -= 50;
    }

    if (safehouse.capacity.availableBeds < request.numberOfGuests) {
      reasons.push(`Insufficient beds. Available: ${safehouse.capacity.availableBeds}, Required: ${request.numberOfGuests}`);
      safetyScore -= 30;
    }

    // Check accessibility needs
    if (request.accessibilityNeeds) {
      if (request.accessibilityNeeds.wheelchairAccessible && !safehouse.accessibility.wheelchairAccessible) {
        reasons.push('Wheelchair accessibility not available');
        safetyScore -= 20;
      }

      if (request.accessibilityNeeds.petFriendly && !safehouse.accessibility.petFriendly) {
        reasons.push('Pet-friendly accommodation not available');
        safetyScore -= 15;
      }

      if (request.accessibilityNeeds.childrenFriendly && !safehouse.accessibility.childrenFriendly) {
        reasons.push('Children-friendly accommodation not available');
        safetyScore -= 25;
      }

      if (request.accessibilityNeeds.lgbtqFriendly && !safehouse.accessibility.lgbtqFriendly) {
        reasons.push('LGBTQ-friendly accommodation not available');
        safetyScore -= 20;
      }
    }

    // Check special needs against available resources
    if (request.specialNeeds && request.specialNeeds.length > 0) {
      const needs = request.specialNeeds.map(n => n.toLowerCase());
      
      if (needs.some(n => n.includes('medical')) && !safehouse.resources.medical.available) {
        reasons.push('Medical resources not available');
        safetyScore -= 15;
      }

      if (needs.some(n => n.includes('legal')) && !safehouse.resources.legal.available) {
        reasons.push('Legal resources not available');
        safetyScore -= 10;
      }

      if (needs.some(n => n.includes('counseling')) && !safehouse.resources.counseling.available) {
        reasons.push('Counseling resources not available');
        safetyScore -= 10;
      }
    }

    // Check security level for high-risk cases
    if (request.urgencyLevel === 'critical' && safehouse.securityLevel === 'standard') {
      reasons.push('Standard security may not be sufficient for critical cases');
      safetyScore -= 20;
    }

    const isMatch = safetyScore >= 50 && reasons.length === 0;

    return {
      isMatch,
      reasons,
      safetyScore
    };
  } catch (error: any) {
    logger.error('Failed to check availability and safety match:', error);
    throw error;
  }
}

/**
 * Step 3: Anonymous Reservation Created
 * Creates secure, anonymous booking record
 */
export async function createAnonymousReservation(request: BookingRequest) {
  try {
    const safehouse = await Safehouse.findById(request.safehouseId);
    if (!safehouse) {
      throw new Error('Safehouse not found');
    }

    // Create anonymous booking
    const booking = new SafehouseBooking({
      userId: request.userId ? (request.userId as any) : undefined,
      anonymousSessionId: request.anonymousSessionId,
      safehouseId: request.safehouseId as any,
      requestedCheckIn: new Date(request.requestedCheckIn),
      requestedCheckOut: request.requestedCheckOut ? new Date(request.requestedCheckOut) : undefined,
      numberOfGuests: request.numberOfGuests,
      specialNeeds: request.specialNeeds || [],
      transportationRequired: request.transportationRequired,
      transportationDetails: request.transportationRequired && request.pickupLocation ? {
        pickupLocation: {
          latitude: request.pickupLocation.latitude,
          longitude: request.pickupLocation.longitude,
          address: request.pickupLocation.address
        },
        status: 'pending'
      } : undefined,
      status: 'pending',
      workflowStep: 3
      // needsAssessment and supportServices will be filled during check-in
    });

    await booking.save();

    // Update safehouse capacity (reserve beds)
    safehouse.capacity.reservedBeds += request.numberOfGuests;
    safehouse.capacity.availableBeds -= request.numberOfGuests;
    safehouse.bookings.push({
      bookingId: booking._id,
      checkInDate: booking.requestedCheckIn,
      checkOutDate: booking.requestedCheckOut,
      status: 'pending'
    });
    await safehouse.save();

    // Notify safehouse staff
    io.to(`safehouse:${request.safehouseId}`).emit('booking:created', {
      bookingId: booking._id,
      numberOfGuests: request.numberOfGuests,
      requestedCheckIn: booking.requestedCheckIn,
      urgencyLevel: request.urgencyLevel
    });

    logger.info(`Anonymous reservation created: ${booking._id}`);

    return {
      success: true,
      bookingId: booking._id,
      status: booking.status,
      workflowStep: 3
    };
  } catch (error: any) {
    logger.error('Failed to create anonymous reservation:', error);
    throw error;
  }
}

/**
 * Step 4: Secure Transportation Arranged
 * Coordinates safe transportation to safehouse
 */
export async function arrangeSecureTransportation(
  bookingId: string,
  pickupLocation: { latitude: number; longitude: number; address?: string }
) {
  try {
    const booking = await SafehouseBooking.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const safehouse = await Safehouse.findById(booking.safehouseId);
    if (!safehouse) {
      throw new Error('Safehouse not found');
    }

    // Check if safehouse has transportation available
    if (!safehouse.resources.transportation.available) {
      // Coordinate with external transportation service
      logger.info('Safehouse does not have transportation, coordinating external service');
    }

    // Calculate distance and estimated travel time
    const distance = geolib.getDistance(
      { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
      {
        latitude: safehouse.address.coordinates.latitude,
        longitude: safehouse.address.coordinates.longitude
      }
    );

    const estimatedTravelTime = Math.ceil(distance / 1000 / 50 * 60); // Assuming 50 km/h average speed

    // Schedule transportation
    const scheduledTime = new Date();
    scheduledTime.setMinutes(scheduledTime.getMinutes() + 15); // 15 minutes buffer

    booking.transportationDetails = {
      pickupLocation: {
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
        address: pickupLocation.address
      },
      scheduledTime,
      status: 'scheduled',
      distance: distance / 1000, // in kilometers
      estimatedTravelTime // in minutes
    };

    booking.workflowStep = 4;
    await booking.save();

    // Notify transportation coordinator
    io.to(`safehouse:${booking.safehouseId}`).emit('transportation:scheduled', {
      bookingId: booking._id,
      pickupLocation,
      scheduledTime,
      estimatedTravelTime
    });

    logger.info(`Secure transportation arranged for booking ${bookingId}`);

    return {
      success: true,
      bookingId: booking._id,
      transportationDetails: booking.transportationDetails,
      workflowStep: 4
    };
  } catch (error: any) {
    logger.error('Failed to arrange secure transportation:', error);
    throw error;
  }
}

/**
 * Step 5: Digital Check-in & Needs Assessment
 * Performs anonymous check-in and assesses needs
 */
export async function performDigitalCheckIn(
  bookingId: string,
  needsAssessment: NeedsAssessment,
  checkedInBy?: string
) {
  try {
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

    // Perform check-in
    booking.status = 'checked_in';
    booking.checkedInAt = new Date();
    booking.checkedInBy = checkedInBy ? (checkedInBy as any) : undefined;
    booking.needsAssessment = needsAssessment;
    booking.workflowStep = 5;

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

    // Notify staff
    io.to(`safehouse:${booking.safehouseId}`).emit('booking:checked_in', {
      bookingId: booking._id,
      needsAssessment,
      checkedInAt: booking.checkedInAt
    });

    logger.info(`Digital check-in completed for booking ${bookingId}`);

    return {
      success: true,
      bookingId: booking._id,
      status: booking.status,
      needsAssessment: booking.needsAssessment,
      workflowStep: 5
    };
  } catch (error: any) {
    logger.error('Failed to perform digital check-in:', error);
    throw error;
  }
}

/**
 * Step 6: Support Services Activated
 * Activates required support services based on needs assessment
 */
export async function activateSupportServices(
  bookingId: string
): Promise<SupportServices> {
  try {
    const booking = await SafehouseBooking.findById(bookingId).populate('safehouseId');
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'checked_in') {
      throw new Error('Guest must be checked in before activating services');
    }

    const safehouse = booking.safehouseId as any;
    const needsAssessment = booking.needsAssessment as any;
    const assignedServices: SupportServices['assignedServices'] = [];

    // Activate medical services if needed
    if (needsAssessment?.medicalNeeds && needsAssessment.medicalNeeds.length > 0) {
      if (safehouse.resources.medical.available) {
        assignedServices.push({
          serviceType: 'medical',
          status: 'active',
          scheduledDate: new Date()
        });
      } else {
        // Coordinate with external medical provider
        assignedServices.push({
          serviceType: 'medical',
          status: 'pending',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Schedule for next day
        });
      }
    }

    // Activate legal services if needed
    if (needsAssessment?.legalNeeds && needsAssessment.legalNeeds.length > 0) {
      if (safehouse.resources.legal.available) {
        assignedServices.push({
          serviceType: 'legal',
          status: 'active'
        });
      } else {
        assignedServices.push({
          serviceType: 'legal',
          status: 'pending'
        });
      }
    }

    // Activate counseling services if needed
    if (needsAssessment?.counselingNeeds && needsAssessment.counselingNeeds.length > 0) {
      if (safehouse.resources.counseling.available) {
        assignedServices.push({
          serviceType: 'counseling',
          status: 'active',
          scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // Schedule within 2 hours
        });
      }
    }

    // Activate food assistance if needed
    if (needsAssessment?.foodAssistance) {
      if (safehouse.resources.food.available) {
        assignedServices.push({
          serviceType: 'food',
          status: 'active'
        });
      }
    }

    // Activate clothing assistance if needed
    if (needsAssessment?.clothingAssistance) {
      assignedServices.push({
        serviceType: 'clothing',
        status: 'pending'
      });
    }

    // Activate documentation help if needed
    if (needsAssessment?.documentationHelp) {
      assignedServices.push({
        serviceType: 'documentation',
        status: 'pending'
      });
    }

    const supportServices: SupportServices = {
      medical: needsAssessment?.medicalNeeds ? needsAssessment.medicalNeeds.length > 0 : false,
      legal: needsAssessment?.legalNeeds ? needsAssessment.legalNeeds.length > 0 : false,
      counseling: needsAssessment?.counselingNeeds ? needsAssessment.counselingNeeds.length > 0 : false,
      food: needsAssessment?.foodAssistance || false,
      transportation: booking.transportationRequired || false,
      assignedServices
    };

    booking.supportServices = supportServices;
    booking.workflowStep = 6;
    await booking.save();

    // Notify relevant service providers
    io.to(`safehouse:${booking.safehouseId}`).emit('services:activated', {
      bookingId: booking._id,
      supportServices
    });

    logger.info(`Support services activated for booking ${bookingId}`);

    return supportServices;
  } catch (error: any) {
    logger.error('Failed to activate support services:', error);
    throw error;
  }
}

/**
 * Complete Booking Workflow
 * Executes all steps in sequence
 */
export async function executeCompleteBookingWorkflow(request: BookingRequest) {
  try {
    logger.info('Executing complete safehouse booking workflow');

    // Step 1: Initiate request
    await initiateBookingRequest(request);

    // Step 2: Check availability and safety match
    const safetyMatch = await checkAvailabilityAndSafetyMatch(request);
    if (!safetyMatch.isMatch) {
      throw new Error(`Safety match failed: ${safetyMatch.reasons.join(', ')}`);
    }

    // Step 3: Create anonymous reservation
    const reservation = await createAnonymousReservation(request);

    // Step 4: Arrange transportation if needed
    if (request.transportationRequired && request.pickupLocation) {
      await arrangeSecureTransportation(reservation.bookingId, request.pickupLocation);
    }

    return {
      success: true,
      bookingId: reservation.bookingId,
      status: reservation.status,
      workflowStep: request.transportationRequired ? 4 : 3,
      nextSteps: request.transportationRequired 
        ? ['Awaiting transportation', 'Digital check-in', 'Support services activation']
        : ['Digital check-in', 'Support services activation']
    };
  } catch (error: any) {
    logger.error('Complete booking workflow failed:', error);
    throw error;
  }
}

