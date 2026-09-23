const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/taskmanager';

  if (primaryUri) {
    try {
      logger.info(`Attempting primary MongoDB connection...`);
      const conn = await mongoose.connect(primaryUri, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (primaryErr) {
      logger.warn(`Primary MongoDB URI failed: ${primaryErr.message}`);
      logger.info(`Attempting automatic fallback to local MongoDB at ${localUri}...`);
    }
  }

  try {
    const fallbackConn = await mongoose.connect(localUri, {
      family: 4,
      serverSelectionTimeoutMS: 3000,
    });
    logger.info(`MongoDB Connected to Local Database: ${fallbackConn.connection.host}`);
    return fallbackConn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.warn(`Please make sure MongoDB is running locally or provide a valid MONGODB_URI in .env`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
