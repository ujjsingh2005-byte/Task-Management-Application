const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES } = require('../config/constants');
const ApiResponse = require('../utils/apiResponse');

const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : user.toString();
  const role = user.role || 'USER';
  return jwt.sign(
    { id: userId, userId, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_replace_in_production_min_32_chars',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

const authController = {
  /**
   * Register a new user
   * Default role is forced to USER.
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return ApiResponse.conflict(
          res,
          'An account with this email address already exists',
          'EMAIL_EXISTS'
        );
      }

      // Explicitly enforce USER role on public registration
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: ROLES.USER,
      });

      const token = generateToken(user);

      return ApiResponse.created(res, 'User registered successfully', {
        user: user.toSafeObject(),
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login with email and password
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return ApiResponse.unauthorized(res, 'Invalid email or password');
      }

      const token = generateToken(user);

      return ApiResponse.success(res, 'Login successful', {
        user: user.toSafeObject(),
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return ApiResponse.notFound(res, 'User profile not found');
      }
      return ApiResponse.success(res, 'Profile retrieved', {
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get list of registered users (for task assignment selection)
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find().select('name email avatar role').sort({ name: 1 });
      return ApiResponse.success(res, 'Users fetched', { users });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
