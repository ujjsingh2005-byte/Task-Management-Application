const rateLimit = require('express-rate-limit');

// Limiter for authentication routes (Login/Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Generous 100 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after a few moments.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

// Limiter for standard API endpoints
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2000, // Generous 2000 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

module.exports = { authLimiter, apiLimiter };
