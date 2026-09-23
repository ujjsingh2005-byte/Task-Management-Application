const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

let io = null;

const initSocket = (httpServer) => {
  const getAllowedOrigins = () => {
    const envOrigins = process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
      : [];
    return [
      ...envOrigins,
      'https://task-management-application-green-mu.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
    ];
  };

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowed = getAllowedOrigins();
        if (
          allowed.includes('*') ||
          allowed.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          process.env.NODE_ENV !== 'production'
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1] ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication token required for WebSocket'));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_replace_in_production_min_32_chars'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      logger.warn(`Socket authentication failed: ${error.message}`);
      next(new Error('Invalid or expired socket token'));
    }
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
};

module.exports = { initSocket, getIO };
