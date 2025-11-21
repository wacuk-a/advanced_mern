"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safehouseController = void 0;
const logger_1 = __importDefault(require("../utils/logger")); // Fixed import
exports.safehouseController = {
    async list(params) {
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
            logger_1.default.info(`Retrieved ${safehouses.length} safehouses`);
            return { safehouses };
        }
        catch (error) {
            logger_1.default.error('List safehouses error:', error);
            throw error;
        }
    },
    async getAvailability(params) {
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
        }
        catch (error) {
            logger_1.default.error('Get availability error:', error);
            throw error;
        }
    },
    async book(params) {
        try {
            const { safehouseId, userId, checkInDate } = params;
            // Mock booking
            const booking = {
                success: true,
                bookingId: 'booking_' + Date.now(),
                status: 'pending',
                workflowStep: 1,
                nextSteps: ['Complete intake form', 'Schedule transportation']
            };
            logger_1.default.info(`Safehouse booking created: ${booking.bookingId}`);
            return booking;
        }
        catch (error) {
            logger_1.default.error('Book safehouse error:', error);
            throw error;
        }
    },
    async checkSafetyMatch(params) {
        try {
            const { safehouseId, userNeeds } = params;
            // Mock safety match
            const match = {
                isMatch: true,
                safetyScore: 85,
                reasons: ['Location matches', 'Services available', 'Capacity available']
            };
            return match;
        }
        catch (error) {
            logger_1.default.error('Check safety match error:', error);
            throw error;
        }
    },
    async arrangeTransportation(params) {
        try {
            const { bookingId, pickupLocation } = params;
            // Mock transportation
            const transportation = {
                success: true,
                bookingId,
                transportationDetails: {
                    pickupLocation,
                    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                    status: 'pending',
                    distance: 15.5
                }
            };
            logger_1.default.info(`Transportation arranged for booking: ${bookingId}`);
            return transportation;
        }
        catch (error) {
            logger_1.default.error('Arrange transportation error:', error);
            throw error;
        }
    },
    async digitalCheckIn(params) {
        try {
            const { bookingId } = params;
            // Mock check-in
            const checkIn = {
                success: true,
                bookingId,
                status: 'checked_in',
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
            logger_1.default.info(`Digital check-in completed for booking: ${bookingId}`);
            return checkIn;
        }
        catch (error) {
            logger_1.default.error('Digital check-in error:', error);
            throw error;
        }
    },
    async activateServices(params) {
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
            logger_1.default.info(`Services activated for booking: ${bookingId}`);
            return activated;
        }
        catch (error) {
            logger_1.default.error('Activate services error:', error);
            throw error;
        }
    },
    async checkIn(params) {
        try {
            const { bookingId } = params;
            // Mock physical check-in
            const checkIn = {
                success: true,
                bookingId,
                status: 'checked_in',
                checkedInAt: new Date()
            };
            logger_1.default.info(`Physical check-in completed for booking: ${bookingId}`);
            return checkIn;
        }
        catch (error) {
            logger_1.default.error('Check-in error:', error);
            throw error;
        }
    },
    async checkOut(params) {
        try {
            const { bookingId } = params;
            // Mock check-out
            const checkOut = {
                success: true,
                bookingId,
                status: 'checked_out',
                checkedOutAt: new Date()
            };
            logger_1.default.info(`Check-out completed for booking: ${bookingId}`);
            return checkOut;
        }
        catch (error) {
            logger_1.default.error('Check-out error:', error);
            throw error;
        }
    },
    async getResources(params) {
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
        }
        catch (error) {
            logger_1.default.error('Get resources error:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=safehouseController.js.map