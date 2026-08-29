const Package = require('../models/Package');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeObjectStrings, sanitizeString } = require('../utils/sanitize');

const getPackages = asyncHandler(async (req, res) => {
  const filter = {};

  if (!(req.user && req.query.includeInactive === 'true')) {
    filter.isActive = true;
  }

  const packages = await Package.find(filter).sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: packages.length,
    data: { packages },
  });
});

const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg || (!pkg.isActive && !req.user)) {
    throw new AppError('Package not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: { package: pkg },
  });
});

const createPackage = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, ['name', 'description']);

  if (Array.isArray(payload.features)) {
    payload.features = payload.features.map((item) => sanitizeString(item, 200)).filter(Boolean);
  }

  const pkg = await Package.create(payload);

  res.status(201).json({
    success: true,
    message: 'Package created successfully',
    data: { package: pkg },
  });
});

const updatePackage = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, ['name', 'description']);

  if (Array.isArray(payload.features)) {
    payload.features = payload.features.map((item) => sanitizeString(item, 200)).filter(Boolean);
  }

  const pkg = await Package.findByIdAndUpdate(req.params.id, payload, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!pkg) {
    throw new AppError('Package not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Package updated successfully',
    data: { package: pkg },
  });
});

const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndDelete(req.params.id);

  if (!pkg) {
    throw new AppError('Package not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Package deleted successfully',
  });
});

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
