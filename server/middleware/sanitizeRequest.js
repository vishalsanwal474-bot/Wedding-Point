const mongoSanitize = require('express-mongo-sanitize');

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === 'object') {
    return mongoSanitize.sanitize({ ...value }, { replaceWith: '_' });
  }

  return value;
}

function sanitizeRequest(req, _res, next) {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body);
    }

    if (req.params && typeof req.params === 'object') {
      const cleanedParams = sanitizeValue({ ...req.params });
      Object.keys(req.params).forEach((key) => {
        delete req.params[key];
      });
      Object.assign(req.params, cleanedParams);
    }

    if (req.query && typeof req.query === 'object') {
      const cleanedQuery = sanitizeValue({ ...req.query });
      for (const key of Object.keys(req.query)) {
        try {
          delete req.query[key];
        } catch (_error) {
          // Express may expose immutable query in some versions.
        }
      }

      try {
        Object.assign(req.query, cleanedQuery);
      } catch (_error) {
        // If query is fully immutable, skip mutation; validators still protect inputs.
      }
    }
  } catch (_error) {
    // Never block the request because of sanitizer edge cases.
  }

  next();
}

module.exports = sanitizeRequest;
