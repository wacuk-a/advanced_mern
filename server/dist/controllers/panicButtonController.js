"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.panicButtonController = void 0;
const index_1 = require("../index");
const logger_1 = __importDefault(require("../utils/logger")); // Fixed import
exports.panicButtonController = {
    async activate(params) {
        try {
            const { triggerType = 'button', location, riskLevel = 'high' } = params;
            // Mock emergency activation
            const eventData = {
                id: 'event_' + Date.now(),
                triggerType,
                location,
                riskLevel,
                createdAt: new Date(),
                status: 'active'
            };
            // Notify through socket
            index_1.io.emit('emergency:activated', eventData);
            logger_1.default.info(`Emergency activated: ${eventData.id}`, eventData);
            return {
                success: true,
                eventId: eventData.id,
                status: eventData.status,
                countdownSeconds: 300 // 5 minutes countdown
            };
        }
        catch (error) {
            logger_1.default.error('Emergency activate error:', error);
            throw error;
        }
    },
    async deactivate(params) {
        try {
            const { eventId, reason = 'false_alarm' } = params;
            // Mock deactivation
            index_1.io.emit('emergency:deactivated', { eventId, reason });
            logger_1.default.info(`Emergency deactivated: ${eventId}`, { reason });
            return {
                success: true,
                status: reason
            };
        }
        catch (error) {
            logger_1.default.error('Emergency deactivate error:', error);
            throw error;
        }
    },
    async getStatus(params) {
        try {
            // Mock status
            const statusData = {
                eventId: 'event_123',
                status: 'active',
                location: { latitude: 0, longitude: 0, timestamp: new Date() },
                riskLevel: 'high',
                emergencyServicesContacted: false,
                createdAt: new Date()
            };
            return statusData;
        }
        catch (error) {
            logger_1.default.error('Get status error:', error);
            throw error;
        }
    },
    async recordEvidence(params) {
        try {
            const { eventId, evidenceType, data } = params;
            // Mock evidence recording
            logger_1.default.info(`Evidence recorded for event ${eventId}`, { evidenceType });
            return {
                success: true,
                eventId
            };
        }
        catch (error) {
            logger_1.default.error('Record evidence error:', error);
            throw error;
        }
    },
    async updateLocation(params) {
        try {
            const { eventId, location } = params;
            // Mock location update
            index_1.io.emit('emergency:location_updated', { eventId, location });
            logger_1.default.info(`Location updated for event ${eventId}`, location);
            return {
                success: true,
                location
            };
        }
        catch (error) {
            logger_1.default.error('Update location error:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=panicButtonController.js.map