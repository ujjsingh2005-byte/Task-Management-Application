const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose Bad ObjectId Cast Error
  if (err.name === 'CastError') {
    return ApiResponse.error(res, `Resource not found with ID: ${err.value}`, 404, {
      code: 'INVALID_ID',
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.conflict(
      res,
      `Duplicate value entered for ${field}. Please use another value.`,
      'DUPLICATE_FIELD',
      { field, value: err.keyValue[field] }
    );
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return ApiResponse.badRequest(res, 'Validation error', details);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Authentication token has expired');
  }

  // Default Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  return ApiResponse.error(res, message, statusCode, {
    code: err.code || 'SERVER_ERROR',
  });
};

module.exports = errorHandler;
