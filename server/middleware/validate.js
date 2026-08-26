const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validate(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const details = result.array().map((item) => item.msg);
    return next(new AppError('Validation failed', 422, details));
  }

  return next();
}

module.exports = validate;
