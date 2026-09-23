/**
 * Standardized API Response Envelopes
 */
class ApiResponse {
  static success(res, message = 'Success', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, message = 'Resource created successfully', data = {}) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, error = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      error,
    });
  }

  static badRequest(res, message = 'Invalid request data', details = []) {
    return res.status(400).json({
      success: false,
      message,
      error: {
        code: 'BAD_REQUEST',
        details,
      },
    });
  }

  static unauthorized(res, message = 'Authentication required') {
    return res.status(401).json({
      success: false,
      message,
      error: {
        code: 'UNAUTHORIZED',
      },
    });
  }

  static forbidden(res, message = 'You do not have permission to perform this action') {
    return res.status(403).json({
      success: false,
      message,
      error: {
        code: 'FORBIDDEN',
      },
    });
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
      error: {
        code: 'NOT_FOUND',
      },
    });
  }

  static conflict(res, message = 'Conflict detected', code = 'CONFLICT', details = {}) {
    return res.status(409).json({
      success: false,
      message,
      error: {
        code,
        ...details,
      },
    });
  }
}

module.exports = ApiResponse;
