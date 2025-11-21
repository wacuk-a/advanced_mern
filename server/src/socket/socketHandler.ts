import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';  // Fixed import

export default function socketHandler(io: Server) {
  io.use(async (socket, next) => {
    try {
      // Mock authentication
      const token = socket.handshake.auth.token;
      
      if (token) {
        // In real implementation, verify JWT token
        (socket as any).userId = 'user_' + Date.now();
        (socket as any).isAuthenticated = true;
      } else {
        // Anonymous session
        (socket as any).anonymousSessionId = 'anon_' + Date.now();
        (socket as any).isAuthenticated = false;
      }
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Emergency events
    socket.on('emergency:activate', async (data) => {
      try {
        logger.info(`Emergency activated: ${socket.id}`, data);
        
        // Broadcast to all connected clients (including counselors)
        io.emit('emergency:activated', {
          ...data,
          socketId: socket.id,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Emergency activate error:', error);
        socket.emit('error', { message: 'Failed to activate emergency' });
      }
    });

    socket.on('emergency:location_update', async (data) => {
      try {
        logger.info(`Location update from ${socket.id}:`, data);
        
        // Broadcast location update
        io.emit('emergency:location_updated', {
          ...data,
          socketId: socket.id,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Location update error:', error);
      }
    });

    // Location sharing
    socket.on('location:start_sharing', async (data) => {
      try {
        logger.info(`Location sharing started: ${socket.id}`);
        
        // Join location sharing room
        socket.join('location_sharing');
        socket.emit('location:sharing_started', { success: true });
      } catch (error) {
        logger.error('Location start sharing error:', error);
        socket.emit('error', { message: 'Failed to start location sharing' });
      }
    });

    socket.on('location:stop_sharing', async () => {
      try {
        logger.info(`Location sharing stopped: ${socket.id}`);
        
        // Leave location sharing room
        socket.leave('location_sharing');
        socket.emit('location:sharing_stopped', { success: true });
      } catch (error) {
        logger.error('Location stop sharing error:', error);
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
      } catch (error) {
        logger.error('Location update error:', error);
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
      } catch (error) {
        logger.error('Get shared locations error:', error);
      }
    });

    // Chat functionality
    socket.on('chat:join_room', (roomId: string) => {
      try {
        socket.join(roomId);
        logger.info(`Socket ${socket.id} joined chat room: ${roomId}`);
        socket.emit('chat:room_joined', { roomId });
      } catch (error) {
        logger.error('Chat join room error:', error);
      }
    });

    socket.on('chat:message', (data) => {
      try {
        logger.info(`Chat message in ${data.roomId}: ${data.message}`);
        
        // Broadcast to room
        socket.to(data.roomId).emit('chat:message', {
          ...data,
          socketId: socket.id,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Chat message error:', error);
      }
    });

    socket.on('chat:typing_start', (data) => {
      try {
        socket.to(data.roomId).emit('chat:typing_start', {
          socketId: socket.id,
          ...data
        });
      } catch (error) {
        logger.error('Chat typing start error:', error);
      }
    });

    socket.on('chat:typing_stop', (data) => {
      try {
        socket.to(data.roomId).emit('chat:typing_stop', {
          socketId: socket.id,
          ...data
        });
      } catch (error) {
        logger.error('Chat typing stop error:', error);
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
        
        logger.info(`Message ${messageId} marked as read by ${socket.id}`);
      } catch (error) {
        logger.error('Chat read receipt error:', error);
      }
    });

    // Disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id}`, { reason });
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('Socket.io handler initialized');
}
