// middlewares/errorHandler.js
// Global, last in the middleware chain. No route should hand-roll its own
// error response — this keeps the API contract consistent for the frontend
// and Postman tests alike (B.5).

import multer from 'multer';
import AppError from './appError.middleware.js';
import  {logger} from './requestLogger.middleware.js';

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong. Please try again later.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    code = err.code;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Mongoose schema validation
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.message;
  } else if (err.code === 11000) {
    // Mongo duplicate key (e.g. duplicate CNIC — TC-EMP-02)
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    message = 'A record with this value already exists';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'Invalid identifier format';
  }

  logger.error('unhandled_error', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

module.exports = errorHandler;