const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  let token;

  if (header && header.startsWith('Bearer ')) {
    token = header.slice(7).trim();
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError('Server authentication is not configured.', 500);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please log in again.', 401);
    }
    throw new AppError('Invalid authentication token.', 401);
  }

  const user = await User.findById(decoded.id).select('-password');

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive.', 401);
  }

  req.user = user;
  next();
});

const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Admin access required.', 403));
  }
  return next();
};

module.exports = {
  protect,
  adminOnly,
};
