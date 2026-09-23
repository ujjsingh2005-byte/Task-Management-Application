const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Evaluates express-validator results and returns standard badRequest envelope if errors exist
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return ApiResponse.badRequest(res, 'Validation failed for incoming data', formattedErrors);
  }
  next();
};

module.exports = validate;
