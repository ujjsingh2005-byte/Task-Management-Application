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
app.set('trust proxy', 1);
const httpServer = http.createServer(app);

// Initialize Database Connection & Auto-sync Admin Credentials
connectDB().then(async () => {
  try {
    const User = require('./models/User');
    const Task = require('./models/Task');
    const ActivityLog = require('./models/ActivityLog');
    const { ROLES, TASK_STATUS, TASK_PRIORITY, ACTIVITY_ACTIONS } = require('./config/constants');

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
      admin = await User.create({
        name: 'Ujjwal Singh',
        email: 'ujjsingh203@gmail.com',
        password: 'Ujjwal@123',
        role: ROLES.ADMIN,
        avatar: '/admin-avatar.jpg',
      });
      logger.info('✅ Admin account created: ujjsingh203@gmail.com');
    }

    // Ensure demo user exists
    let rahul = await User.findOne({ email: 'rahul@taskflow.dev' });
    if (!rahul) {
      rahul = await User.create({
        name: 'Rahul Kumar',
        email: 'rahul@taskflow.dev',
        password: 'UserPassword123',
        role: ROLES.USER,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      });
    }

    let priya = await User.findOne({ email: 'priya@taskflow.dev' });
    if (!priya) {
      priya = await User.create({
        name: 'Priya Sharma',
        email: 'priya@taskflow.dev',
        password: 'UserPassword123',
        role: ROLES.USER,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      });
    }

    let vikram = await User.findOne({ email: 'vikram@taskflow.dev' });
    if (!vikram) {
      vikram = await User.create({
        name: 'Vikram Patel',
        email: 'vikram@taskflow.dev',
        password: 'UserPassword123',
        role: ROLES.USER,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
    }

    // Seed sample tasks and audit logs if task count is low
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      logger.info('🌱 Seeding initial workspace tasks and audit logs...');

      const sampleTasks = [
        {
          title: 'Configure Enterprise SSO & Role Guardrails',
          description: 'Deploy role-based access control with token expiration security.',
          status: TASK_STATUS.COMPLETED,
          priority: TASK_PRIORITY.HIGH,
          createdBy: admin._id,
          assignedTo: rahul._id,
          dueDate: new Date(Date.now() + 86400000 * 3),
        },
        {
          title: 'Deploy Socket.IO Live Telemetry Gateway',
          description: 'Establish real-time state synchronization and live presence indicators across nodes.',
          status: TASK_STATUS.IN_PROGRESS,
          priority: TASK_PRIORITY.URGENT,
          createdBy: admin._id,
          assignedTo: admin._id,
          dueDate: new Date(Date.now() + 86400000 * 2),
        },
        {
          title: 'Implement Optimistic Concurrency Control (OCC)',
          description: 'Eliminate race conditions during high-concurrency editing sessions using version checks.',
          status: TASK_STATUS.COMPLETED,
          priority: TASK_PRIORITY.HIGH,
          createdBy: admin._id,
          assignedTo: priya._id,
          dueDate: new Date(Date.now() + 86400000 * 4),
        },
        {
          title: 'Design Aurora Multi-Theme Design System',
          description: 'Build Ivory Paper and Midnight Obsidian palette tokens with Lucide iconography.',
          status: TASK_STATUS.IN_PROGRESS,
          priority: TASK_PRIORITY.MEDIUM,
          createdBy: admin._id,
          assignedTo: vikram._id,
          dueDate: new Date(Date.now() + 86400000 * 5),
        },
        {
          title: 'Set up Automated Security Audit & SLA Monitors',
          description: 'Implement audit logging hooks to track critical workspace governance mutations.',
          status: TASK_STATUS.TODO,
          priority: TASK_PRIORITY.HIGH,
          createdBy: admin._id,
          assignedTo: rahul._id,
          dueDate: new Date(Date.now() + 86400000 * 7),
        },
      ];

      const createdTasks = await Task.insertMany(sampleTasks);

      // Seed audit activities
      const auditActivities = [
        {
          taskId: createdTasks[0]._id,
          userId: admin._id,
          action: ACTIVITY_ACTIONS.CREATED,
          metadata: { title: createdTasks[0].title },
          createdAt: new Date(Date.now() - 3600000 * 5),
        },
        {
          taskId: createdTasks[0]._id,
          userId: rahul._id,
          action: ACTIVITY_ACTIONS.STATUS_CHANGED,
          metadata: { title: createdTasks[0].title, from: 'IN_PROGRESS', to: 'COMPLETED' },
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
        {
          taskId: createdTasks[1]._id,
          userId: admin._id,
          action: ACTIVITY_ACTIONS.CREATED,
          metadata: { title: createdTasks[1].title },
          createdAt: new Date(Date.now() - 3600000 * 3),
        },
        {
          taskId: createdTasks[1]._id,
          userId: admin._id,
          action: ACTIVITY_ACTIONS.PRIORITY_CHANGED,
          metadata: { title: createdTasks[1].title, from: 'HIGH', to: 'URGENT' },
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
        {
          taskId: createdTasks[2]._id,
          userId: admin._id,
          action: ACTIVITY_ACTIONS.ASSIGNED,
          metadata: { title: createdTasks[2].title, to: 'Priya Sharma' },
          createdAt: new Date(Date.now() - 3600000 * 1.5),
        },
        {
          taskId: createdTasks[3]._id,
          userId: admin._id,
          action: ACTIVITY_ACTIONS.CREATED,
          metadata: { title: createdTasks[3].title },
          createdAt: new Date(Date.now() - 3600000 * 1),
        },
        {
          taskId: createdTasks[4]._id,
          userId: admin._id,
          action: ACTIVITY_ACTIONS.CREATED,
          metadata: { title: createdTasks[4].title },
          createdAt: new Date(Date.now() - 1800000),
        },
      ];

      await ActivityLog.insertMany(auditActivities);
      logger.info('✅ Sample tasks and audit logs successfully seeded!');
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
