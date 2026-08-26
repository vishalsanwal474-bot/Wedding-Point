function sanitizeString(value, maxLength = 2000) {
  if (value === undefined || value === null) {
    return value;
  }

  return String(value)
    .replace(/[<>]/g, '')
    .replace(/\0/g, '')
    .trim()
    .slice(0, maxLength);
}

function sanitizeObjectStrings(payload, fields, maxLength = 2000) {
  const next = { ...payload };

  fields.forEach((field) => {
    if (typeof next[field] === 'string') {
      next[field] = sanitizeString(next[field], maxLength);
    }
  });

  return next;
}

module.exports = {
  sanitizeString,
  sanitizeObjectStrings,
};
