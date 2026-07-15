import jwt from 'jsonwebtoken';
import authIdentity from '../models/authIdentity.model.js';
import AppError from './appError.middleware.js';

export const verifyAuthIdentityForOTP = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(400).json({
                success: false, 
                message: "Plase login first!",
                errorCode: "LOGIN_REQUIRED"
            });
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await authIdentity.findById(decoded.id);
        const otpData = foundUser.otp;

        const now = new Date();
        if(now.getTime() < otpData.expiresIn){
            return res.status(400).json({
                success: false,
                message: "OTP has expired, try loggin in again!",
                errorCode: "OTP_EXPIRED"
            });
        }

        req.user = { 
            id: decoded.id, 
            email: decoded.email, 
            payload: decoded.payload || {},
            dbOtp: otpData.otp
        };
        next();
    }catch(err){
        console.log("Middleware Error:", err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Invalid or session-expired token. Please login again.",
                errorCode: "INVALID_TOKEN"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error, (midware)",
            errorCode: "SERVER_FAULT"
        });
    }
}

// middlewares/authenticate.js
// npm i jsonwebtoken
// Applied to all protected routes. Verifies the access JWT and attaches req.user.
// Never trusts a client-supplied user id — req.user is derived only from the
// verified token payload (per B.5 design notes).
//
// Note: this is the standing authenticate() used after login is complete.
// The temp-token check that gates /auth/verify-otp (TC-AUTH-04/05) is
// intentionally left out here, as requested.

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Access token is required'));
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: payload.sub,
      role: payload.role,
      employeeId: payload.employeeId || null,
    };

    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError(401, 'TOKEN_EXPIRED', 'Access token has expired'));
    }
    return next(new AppError(401, 'INVALID_TOKEN', 'Access token is invalid'));
  }
}


// middlewares/authorize.js
// Applied to all role-restricted routes, after authenticate().
// Role-only check — fails fast before any DB hit, per B.5 design notes.
// Usage: authorize('SuperAdmin', 'HRAdmin')


export function authorize(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) {
      return next(new AppError(401, 'UNAUTHENTICATED', 'Access token is required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to perform this action'));
    }

    return next();
  };
}