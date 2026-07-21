import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';

export let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL, /\.myshopify\.com$/],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}, User: ${socket.data.user?.userId}`);

    // Join user to their specific room
    if (socket.data.user?.userId) {
      socket.join(`user:${socket.data.user.userId}`);
    }

    // Join store room if applicable
    if (socket.data.user?.storeId) {
      socket.join(`store:${socket.data.user.storeId}`);
    }

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Event Emitters
export const emitNewOrder = (storeId: string, orderData: any) => {
  if (io) io.to(`store:${storeId}`).emit('newOrder', orderData);
};

export const emitNewMessage = (storeId: string, messageData: any) => {
  if (io) io.to(`store:${storeId}`).emit('newMessage', messageData);
};

export const emitAutomationUpdate = (storeId: string, updateData: any) => {
  if (io) io.to(`store:${storeId}`).emit('automationUpdate', updateData);
};

export const emitStatusUpdate = (storeId: string, statusData: any) => {
  if (io) io.to(`store:${storeId}`).emit('statusUpdate', statusData);
};
