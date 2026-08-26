function coerceFormFields(req, _res, next) {
  const booleanFields = ['isActive', 'isPopular'];
  const numberFields = [
    'displayOrder',
    'rating',
    'basePrice',
    'guestCount',
    'estimatedCost',
    'yearsExperience',
    'weddingsCompleted',
    'venuesServed',
  ];

  booleanFields.forEach((field) => {
    if (req.body[field] === 'true') {
      req.body[field] = true;
    } else if (req.body[field] === 'false') {
      req.body[field] = false;
    }
  });

  numberFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
      const value = Number(req.body[field]);
      if (!Number.isNaN(value)) {
        req.body[field] = value;
      }
    }
  });

  if (typeof req.body.features === 'string') {
    try {
      const parsed = JSON.parse(req.body.features);
      if (Array.isArray(parsed)) {
        req.body.features = parsed;
      } else {
        req.body.features = req.body.features
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch (_error) {
      req.body.features = req.body.features
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (typeof req.body.services === 'string') {
    try {
      const parsed = JSON.parse(req.body.services);
      if (Array.isArray(parsed)) {
        req.body.services = parsed;
      }
    } catch (_error) {
      // leave as-is; validation will reject invalid shapes
    }
  }

  next();
}

module.exports = coerceFormFields;
