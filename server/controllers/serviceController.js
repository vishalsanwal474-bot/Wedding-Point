const Service = require('../models/Service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeObjectStrings } = require('../utils/sanitize');

const getServices = asyncHandler(async (req, res) => {
  const filter = {};

  if (!(req.user && req.query.includeInactive === 'true')) {
    filter.isActive = true;
  }

  const services = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: services.length,
    data: { services },
  });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service || (!service.isActive && !req.user)) {
    throw new AppError('Service not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: { service },
  });
});

const createService = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'title',
    'description',
    'shortDescription',
    'icon',
    'image',
  ]);

  if (req.file) {
    payload.image = `/uploads/services/${req.file.filename}`;
  }

  const service = await Service.create(payload);

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: { service },
  });
});

const updateService = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'title',
    'description',
    'shortDescription',
    'icon',
    'image',
  ]);

  if (req.file) {
    payload.image = `/uploads/services/${req.file.filename}`;
  }

  const service = await Service.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    throw new AppError('Service not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: { service },
  });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    throw new AppError('Service not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
  });
});

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
