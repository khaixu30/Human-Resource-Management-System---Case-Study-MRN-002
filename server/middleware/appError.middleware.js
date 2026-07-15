// errors/AppError.js
// Thrown anywhere in the app to produce a consistent { success:false, error:{code,message} }
// response via middlewares/errorHandler.js

class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;