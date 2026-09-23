const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_replace_in_production_min_32_chars'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return ApiResponse.unauthorized(res, 'User session not found or invalid');
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Authentication token has expired');
      }
      return ApiResponse.unauthorized(res, 'Invalid authentication token');
    }
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'No token provided, authorization denied');
  }
};

module.exports = { protect };
