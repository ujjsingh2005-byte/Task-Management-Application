const { ROLES } = require('../config/constants');
const ApiResponse = require('../utils/apiResponse');

/**
 * Authorize only specific roles (e.g. ADMIN)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Role (${req.user?.role || 'Guest'}) is not authorized to access this resource`
      );
    }
    next();
  };
};

const requireAdmin = authorize(ROLES.ADMIN);

module.exports = { authorize, requireAdmin };
