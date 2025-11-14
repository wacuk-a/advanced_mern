import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { PanicEvent } from '../models/PanicEvent';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  anonymousSessionId?: string;
  userRole?: string;
}

export function socketHandler(io: Server) {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      const anonymousSessionId = socket.handshake.auth.anonymousSessionId || socket.handshake.headers['x-anonymous-session-id'];

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          const user = await User.findById(decoded.userId).select('-password');
          
          if (user) {
            socket.userId = user._id.toString();
            socket.userRole = user.role;
            socket.anonymousSessionId = user.anonymousSessionId;
          }
        } catch (error) {
          // Token invalid, try anonymous session
        }
      }

      if (!socket.userId && anonymousSessionId) {
        const user = await User.findOne({ anonymousSessionId });
        if (user) {
          socket.anonymousSessionId = anonymousSessionId;
          socket.userRole = user.role;
        }
      }

      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }
    if (socket.anonymousSessionId) {
      socket.join(`anon:${socket.anonymousSessionId}`);
    }

    // Join role-specific rooms
    if (socket.userRole === 'counselor' || socket.userRole === 'admin') {
      socket.join('counselors');
    }
    if (socket.userRole === 'safehouse_staff' || socket.userRole === 'admin') {
      socket.join('safehouse_staff');
    }

    // Panic button events
    socket.on('panic:activate', async (data) => {
      try {
        // This would typically be handled through the JSON-RPC API
        // But we can also handle real-time updates here
        logger.info(`Panic button activated: ${socket.id}`);
        
        // Broadcast to counselors
        io.to('counselors').emit('panic:activated', {
          ...data,
          socketId: socket.id,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Panic activate error:', error);
      }
    });

    // Location tracking for active panic events
    socket.on('panic:location_update', async (data) => {
      try {
        const { eventId, location } = data;
        
        // Update panic event location
        await PanicEvent.findByIdAndUpdate(eventId, {
          $set: {
            location: {
              ...location,
              timestamp: new Date()
            }
          },
          $push: {
            locationHistory: {
              latitude: location.latitude,
              longitude: location.longitude,
              timestamp: new Date()
            }
          }
        });

        // Broadcast to counselors
        io.to('counselors').emit('panic:location_update', {
          eventId,
          location,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Location update error:', error);
      }
    });

    // Real-time messaging
    socket.on('message:typing', (data) => {
      const { to, conversationId } = data;
      socket.to(`user:${to}`).emit('message:typing', {
        from: socket.userId || socket.anonymousSessionId,
        conversationId
      });
    });

    socket.on('message:stop_typing', (data) => {
      const { to, conversationId } = data;
      socket.to(`user:${to}`).emit('message:stop_typing', {
        from: socket.userId || socket.anonymousSessionId,
        conversationId
      });
    });

    // WebRTC signaling
    socket.on('webrtc:offer', (data) => {
      const { to, offer } = data;
      socket.to(`user:${to}`).emit('webrtc:offer', {
        from: socket.userId || socket.anonymousSessionId,
        offer
      });
    });

    socket.on('webrtc:answer', (data) => {
      const { to, answer } = data;
      socket.to(`user:${to}`).emit('webrtc:answer', {
        from: socket.userId || socket.anonymousSessionId,
        answer
      });
    });

    socket.on('webrtc:ice_candidate', (data) => {
      const { to, candidate } = data;
      socket.to(`user:${to}`).emit('webrtc:ice_candidate', {
        from: socket.userId || socket.anonymousSessionId,
        candidate
      });
    });

    // Safehouse updates
    socket.on('safehouse:subscribe', (safehouseId) => {
      socket.join(`safehouse:${safehouseId}`);
    });

    socket.on('safehouse:unsubscribe', (safehouseId) => {
      socket.leave(`safehouse:${safehouseId}`);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('Socket.io handler initialized');
}

