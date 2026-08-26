const AppError = require('../utils/AppError');

function notFound(req, _res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let details = err.details || null;

  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    details = Object.values(err.errors).map((item) => item.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier.';
  }

  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file is too large. Maximum size is 5MB.';
    } else {
      message = err.message;
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const isOperational = err.isOperational === true;

  if (!isOperational && statusCode === 500) {
    if (!isProduction) {
      console.error(err);
    } else {
      console.error('Unexpected server error');
    }
    message = isProduction ? 'Internal server error' : err.message;
    details = null;
  } else if (!isProduction && statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(!isProduction && !isOperational ? { stack: err.stack } : {}),
  });
}

module.exports = {
  notFound,
  errorHandler,
};
