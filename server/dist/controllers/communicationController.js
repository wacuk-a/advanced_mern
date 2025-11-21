"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicationController = void 0;
const index_1 = require("../index");
const logger_1 = __importDefault(require("../utils/logger"));
exports.communicationController = {
    async sendMessage(params) {
        try {
            const { conversationId, message, from, to } = params;
            const messageData = {
                id: 'temp_' + Date.now(),
                conversationId,
                message,
                from,
                to,
                timestamp: new Date()
            };
            index_1.io.to(conversationId).emit('chat:message', messageData);
            logger_1.default.info(`Message sent in conversation ${conversationId}`);
            return {
                success: true,
                messageId: messageData.id,
                conversationId,
                timestamp: messageData.timestamp
            };
        }
        catch (error) {
            logger_1.default.error('Send message error:', error);
            throw error;
        }
    },
    async getMessages(params) {
        try {
            const { conversationId, limit = 50, offset = 0 } = params;
            const messages = []; // Explicitly typed array
            logger_1.default.info(`Retrieved messages for conversation ${conversationId}`);
            return {
                messages,
                total: messages.length
            };
        }
        catch (error) {
            logger_1.default.error('Get messages error:', error);
            throw error;
        }
    },
    async shareLocation(params) {
        try {
            const { conversationId, latitude, longitude, address } = params;
            const locationData = {
                latitude,
                longitude,
                address,
                timestamp: new Date()
            };
            index_1.io.to(conversationId).emit('location:shared', locationData);
            logger_1.default.info(`Location shared in conversation ${conversationId}`);
            return {
                success: true,
                messageId: 'loc_' + Date.now(),
                location: locationData
            };
        }
        catch (error) {
            logger_1.default.error('Share location error:', error);
            throw error;
        }
    },
    async initiateVideo(params) {
        try {
            const { from, to } = params;
            const sessionId = 'vid_' + Date.now();
            index_1.io.to(to).emit('video:invite', {
                sessionId,
                from,
                timestamp: new Date()
            });
            logger_1.default.info(`Video call initiated from ${from} to ${to}`);
            return {
                success: true,
                sessionId,
                from
            };
        }
        catch (error) {
            logger_1.default.error('Initiate video error:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=communicationController.js.map