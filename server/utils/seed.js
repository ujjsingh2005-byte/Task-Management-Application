require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { ROLES, TASK_STATUS, TASK_PRIORITY, ACTIVITY_ACTIONS } = require('../config/constants');
const logger = require('./logger');

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
    try {
      await mongoose.connect(connStr, {
        family: 4,
        serverSelectionTimeoutMS: 4000,
      });
    } catch (e) {
      await mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', {
        family: 4,
        serverSelectionTimeoutMS: 4000,
      });
    }
    logger.info('Connected to MongoDB for database seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Task.deleteMany({}),
      Comment.deleteMany({}),
      ActivityLog.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    logger.info('Cleared existing collections.');

    // 1. Create Demo Users
    const adminUser = await User.create({
      name: 'Ujjwal Singh',
      email: 'ujjsingh203@gmail.com',
      password: 'AdminPassword123',
      role: ROLES.ADMIN,
      avatar: '/admin-avatar.jpg',
    });

    const userUjjwal = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@taskflow.dev',
      password: 'UserPassword123',
      role: ROLES.USER,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    });

    const userRahul = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@taskflow.dev',
      password: 'UserPassword123',
      role: ROLES.USER,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    });

    const userAmit = await User.create({
      name: 'Amit Sharma',
      email: 'amit@taskflow.dev',
      password: 'UserPassword123',
      role: ROLES.USER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    logger.info('Created 4 demo users (1 Admin, 3 Collaborators).');

    // 2. Create Sample Tasks
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const task1 = await Task.create({
      title: 'Build Authentication and JWT Security Layer',
      description: 'Implement secure login, registration, token refresh, and bcrypt password hashing with robust role-based middleware.',
      status: TASK_STATUS.COMPLETED,
      priority: TASK_PRIORITY.URGENT,
      createdBy: adminUser._id,
      assignedTo: userUjjwal._id,
      dueDate: yesterday,
      version: 2,
    });

    const task2 = await Task.create({
      title: 'Implement Real-Time WebSocket Task Synchronization',
      description: 'Integrate Socket.IO client and server listeners for instant task status transitions, collaborative comments, and active presence.',
      status: TASK_STATUS.IN_PROGRESS,
      priority: TASK_PRIORITY.HIGH,
      createdBy: userUjjwal._id,
      assignedTo: userRahul._id,
      dueDate: tomorrow,
      version: 1,
    });

    const task3 = await Task.create({
      title: 'Design Responsive Kanban and Dashboard Metrics',
      description: 'Create modern SaaS dashboard cards with active metric counters, priority indicators, and mobile-responsive drawer navigation.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      createdBy: userRahul._id,
      assignedTo: userAmit._id,
      dueDate: inThreeDays,
      version: 1,
    });

    const task4 = await Task.create({
      title: 'Optimistic Concurrency Control (OCC) Testing',
      description: 'Verify 409 Conflict rejection when two clients attempt to modify the same task version simultaneously.',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.LOW,
      createdBy: userUjjwal._id,
      assignedTo: userUjjwal._id,
      dueDate: inThreeDays,
      version: 1,
    });

    logger.info('Created 4 sample tasks.');

    // 3. Create Sample Comments
    await Comment.create([
      {
        taskId: task1._id,
        userId: userUjjwal._id,
        text: 'All JWT authentication tests and role-based checks are passing smoothly!',
      },
      {
        taskId: task1._id,
        userId: adminUser._id,
        text: 'Excellent work on the security headers and rate limiting!',
      },
      {
        taskId: task2._id,
        userId: userRahul._id,
        text: 'Working on room subscriptions and reconnection listeners now.',
      },
    ]);

    // 4. Create Activity Logs
    await ActivityLog.create([
      {
        taskId: task1._id,
        userId: adminUser._id,
        action: ACTIVITY_ACTIONS.CREATED,
        metadata: { title: task1.title },
      },
      {
        taskId: task1._id,
        userId: userUjjwal._id,
        action: ACTIVITY_ACTIONS.STATUS_CHANGED,
        metadata: { from: 'IN_PROGRESS', to: 'COMPLETED' },
      },
      {
        taskId: task2._id,
        userId: userUjjwal._id,
        action: ACTIVITY_ACTIONS.CREATED,
        metadata: { title: task2.title },
      },
    ]);

    logger.info('✅ Database seeding successfully completed!');
    logger.info('\nDemo Credentials:');
    logger.info('-------------------------------------------');
    logger.info('Admin Account: admin@taskflow.dev / AdminPassword123');
    logger.info('User 1:        ujjwal@taskflow.dev / UserPassword123');
    logger.info('User 2:        rahul@taskflow.dev  / UserPassword123');
    logger.info('User 3:        amit@taskflow.dev   / UserPassword123');
    logger.info('-------------------------------------------');

    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
