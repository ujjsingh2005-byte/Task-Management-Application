require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const registerSocketHandlers = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const logger = require('./utils/logger');
const ApiResponse = require('./utils/apiResponse');

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express
const app = express();
const httpServer = http.createServer(app);

// Initialize Database Connection
connectDB();

// Initialize Socket.IO with Server
const io = initSocket(httpServer);
registerSocketHandlers(io);

// Security & General Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  return ApiResponse.success(res, 'Task Management API Server is running smoothly', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API Routes with Rate Limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/:id/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  return ApiResponse.notFound(res, `Endpoint ${req.originalUrl} does not exist on this server`);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server Listener
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  logger.info(`🌐 REST API: http://localhost:${PORT}/api`);
  logger.info(`⚡ Socket.IO Gateway active at http://localhost:${PORT}`);
  logger.info(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
});
