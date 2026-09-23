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

// Initialize Database Connection & Auto-sync Admin Credentials
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const { ROLES } = require('./config/constants');
    let admin = await User.findOne({
      $or: [
        { email: 'ujjsingh203@gmail.com' },
        { email: 'admin@taskflow.dev' },
        { role: ROLES.ADMIN },
      ],
    });

    if (admin) {
      admin.name = 'Ujjwal Singh';
      admin.email = 'ujjsingh203@gmail.com';
      admin.password = 'Ujjwal@123';
      admin.role = ROLES.ADMIN;
      admin.avatar = '/admin-avatar.jpg';
      await admin.save();
      logger.info('✅ Admin account synced: ujjsingh203@gmail.com');
    } else {
      await User.create({
        name: 'Ujjwal Singh',
        email: 'ujjsingh203@gmail.com',
        password: 'Ujjwal@123',
        role: ROLES.ADMIN,
        avatar: '/admin-avatar.jpg',
      });
      logger.info('✅ Admin account created: ujjsingh203@gmail.com');
    }

    // Ensure demo user exists
    let demoUser = await User.findOne({ email: 'rahul@taskflow.dev' });
    if (!demoUser) {
      await User.create({
        name: 'Rahul Kumar',
        email: 'rahul@taskflow.dev',
        password: 'UserPassword123',
        role: ROLES.USER,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      });
    }
  } catch (err) {
    logger.warn(`Initial data sync note: ${err.message}`);
  }
});

// Initialize Socket.IO with Server
const io = initSocket(httpServer);
registerSocketHandlers(io);

// Security & General Middlewares
app.use(helmet());
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

app.use(
  cors({
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
      return callback(null, true); // Allow origin fallback for preview deployments
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root route handler for deployment verification (Render/Vercel/Railway)
app.get('/', (req, res) => {
  return ApiResponse.success(res, 'TaskFlow API is running smoothly', {
    name: 'TaskFlow Real-Time Collaborative Task Management API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    documentation: {
      health: '/health',
      apiHealth: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      notifications: '/api/notifications',
      dashboard: '/api/dashboard',
      admin: '/api/admin',
    },
  });
});

// Health check endpoints
const healthCheck = (req, res) => {
  return ApiResponse.success(res, 'Task Management API Server is running smoothly', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

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
