require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../config/constants');
const logger = require('./logger');

const updateAdmin = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
    await mongoose.connect(connStr, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('Connected to MongoDB.');

    // Look for existing admin or user with email ujjsingh203@gmail.com
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
      logger.info('✅ Successfully updated Admin account: ujjsingh203@gmail.com with password: Ujjwal@123');
    } else {
      admin = await User.create({
        name: 'Ujjwal Singh',
        email: 'ujjsingh203@gmail.com',
        password: 'Ujjwal@123',
        role: ROLES.ADMIN,
        avatar: '/admin-avatar.jpg',
      });
      logger.info('✅ Successfully created Admin account: ujjsingh203@gmail.com with password: Ujjwal@123');
    }

    process.exit(0);
  } catch (err) {
    logger.error(`Error updating admin password: ${err.message}`);
    process.exit(1);
  }
};

updateAdmin();
