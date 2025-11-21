"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = socketHandler;
const logger_1 = __importDefault(require("../utils/logger")); // Fixed import
function socketHandler(io) {
    io.use(async (socket, next) => {
        try {
            // Mock authentication
            const token = socket.handshake.auth.token;
            if (token) {
                // In real implementation, verify JWT token
                socket.userId = 'user_' + Date.now();
                socket.isAuthenticated = true;
            }
            else {
                // Anonymous session
                socket.anonymousSessionId = 'anon_' + Date.now();
                socket.isAuthenticated = false;
            }
            next();
        }
        catch (error) {
            logger_1.default.error('Socket authentication error:', error);
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        logger_1.default.info(`Socket connected: ${socket.id}`);
        // Emergency events
        socket.on('emergency:activate', async (data) => {
            try {
                logger_1.default.info(`Emergency activated: ${socket.id}`, data);
                // Broadcast to all connected clients (including counselors)
                io.emit('emergency:activated', {
                    ...data,
                    socketId: socket.id,
                    timestamp: new Date()
                });
            }
            catch (error) {
                logger_1.default.error('Emergency activate error:', error);
                socket.emit('error', { message: 'Failed to activate emergency' });
            }
        });
        socket.on('emergency:location_update', async (data) => {
            try {
                logger_1.default.info(`Location update from ${socket.id}:`, data);
                // Broadcast location update
                io.emit('emergency:location_updated', {
                    ...data,
                    socketId: socket.id,
                    timestamp: new Date()
                });
            }
            catch (error) {
                logger_1.default.error('Location update error:', error);
            }
        });
        // Location sharing
        socket.on('location:start_sharing', async (data) => {
            try {
                logger_1.default.info(`Location sharing started: ${socket.id}`);
                // Join location sharing room
                socket.join('location_sharing');
                socket.emit('location:sharing_started', { success: true });
            }
            catch (error) {
                logger_1.default.error('Location start sharing error:', error);
                socket.emit('error', { message: 'Failed to start location sharing' });
            }
        });
        socket.on('location:stop_sharing', async () => {
            try {
                logger_1.default.info(`Location sharing stopped: ${socket.id}`);
                // Leave location sharing room
                socket.leave('location_sharing');
                socket.emit('location:sharing_stopped', { success: true });
            }
            catch (error) {
                logger_1.default.error('Location stop sharing error:', error);
                socket.emit('error', { message: 'Failed to stop location sharing' });
            }
        });
        socket.on('location:update', async (location) => {
            try {
                // Broadcast to location sharing room
                socket.to('location_sharing').emit('location:updated', {
                    socketId: socket.id,
                    location,
                    timestamp: new Date()
                });
            }
            catch (error) {
                logger_1.default.error('Location update error:', error);
            }
        });
        socket.on('location:get_shared', async () => {
            try {
                // Get all sockets in location sharing room
                const sharedSockets = await io.in('location_sharing').fetchSockets();
                const sharedLocations = sharedSockets.map(s => ({
                    socketId: s.id,
                    // In real implementation, get last known location from storage
                    location: { latitude: 0, longitude: 0 }
                }));
                socket.emit('location:shared_list', sharedLocations);
            }
            catch (error) {
                logger_1.default.error('Get shared locations error:', error);
            }
        });
        // Chat functionality
        socket.on('chat:join_room', (roomId) => {
            try {
                socket.join(roomId);
                logger_1.default.info(`Socket ${socket.id} joined chat room: ${roomId}`);
                socket.emit('chat:room_joined', { roomId });
            }
            catch (error) {
                logger_1.default.error('Chat join room error:', error);
            }
        });
        socket.on('chat:message', (data) => {
            try {
                logger_1.default.info(`Chat message in ${data.roomId}: ${data.message}`);
                // Broadcast to room
                socket.to(data.roomId).emit('chat:message', {
                    ...data,
                    socketId: socket.id,
                    timestamp: new Date()
                });
            }
            catch (error) {
                logger_1.default.error('Chat message error:', error);
            }
        });
        socket.on('chat:typing_start', (data) => {
            try {
                socket.to(data.roomId).emit('chat:typing_start', {
                    socketId: socket.id,
                    ...data
                });
            }
            catch (error) {
                logger_1.default.error('Chat typing start error:', error);
            }
        });
        socket.on('chat:typing_stop', (data) => {
            try {
                socket.to(data.roomId).emit('chat:typing_stop', {
                    socketId: socket.id,
                    ...data
                });
            }
            catch (error) {
                logger_1.default.error('Chat typing stop error:', error);
            }
        });
        socket.on('chat:read_receipt', (data) => {
            try {
                const { messageId, roomId } = data;
                socket.to(roomId).emit('chat:read_receipt', {
                    messageId,
                    readBy: socket.id,
                    timestamp: new Date()
                });
                logger_1.default.info(`Message ${messageId} marked as read by ${socket.id}`);
            }
            catch (error) {
                logger_1.default.error('Chat read receipt error:', error);
            }
        });
        // Disconnection
        socket.on('disconnect', (reason) => {
            logger_1.default.info(`Socket disconnected: ${socket.id}`, { reason });
        });
        socket.on('error', (error) => {
            logger_1.default.error(`Socket error for ${socket.id}:`, error);
        });
    });
    logger_1.default.info('Socket.io handler initialized');
}
//# sourceMappingURL=socketHandler.js.map