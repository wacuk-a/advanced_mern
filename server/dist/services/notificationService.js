"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmergencySMS = sendEmergencySMS;
exports.sendPushNotification = sendPushNotification;
exports.sendEmailNotification = sendEmailNotification;
const logger_1 = __importDefault(require("../utils/logger")); // Fixed import
async function sendEmergencySMS(to, message) {
    try {
        // Mock SMS sending
        logger_1.default.info(`Sending emergency SMS to ${to}`, { message });
        // In real implementation, integrate with SMS service like Twilio
        console.log(`[SMS] To: ${to}, Message: ${message}`);
    }
    catch (error) {
        logger_1.default.error('Send emergency SMS error:', error);
        throw error;
    }
}
async function sendPushNotification(userId, title, body) {
    try {
        // Mock push notification
        logger_1.default.info(`Sending push notification to user ${userId}`, { title, body });
        // In real implementation, integrate with push notification service
        console.log(`[PUSH] User: ${userId}, Title: ${title}, Body: ${body}`);
    }
    catch (error) {
        logger_1.default.error('Send push notification error:', error);
        throw error;
    }
}
async function sendEmailNotification(to, subject, body) {
    try {
        // Mock email sending
        logger_1.default.info(`Sending email to ${to}`, { subject });
        // In real implementation, integrate with email service
        console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
    }
    catch (error) {
        logger_1.default.error('Send email notification error:', error);
        throw error;
    }
}
//# sourceMappingURL=notificationService.js.map