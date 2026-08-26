const Testimonial = require('../models/Testimonial');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeObjectStrings } = require('../utils/sanitize');

const getTestimonials = asyncHandler(async (req, res) => {
  const filter = {};

  if (!(req.user && req.query.includeInactive === 'true')) {
    filter.isActive = true;
  }

  const testimonials = await Testimonial.find(filter).sort({
    displayOrder: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: { testimonials },
  });
});

const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial || (!testimonial.isActive && !req.user)) {
    throw new AppError('Testimonial not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: { testimonial },
  });
});

const createTestimonial = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'name',
    'coupleName',
    'message',
    'image',
  ]);

  if (req.file) {
    payload.image = `/uploads/testimonials/${req.file.filename}`;
  }

  const testimonial = await Testimonial.create(payload);

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: { testimonial },
  });
});

const updateTestimonial = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'name',
    'coupleName',
    'message',
    'image',
  ]);

  if (req.file) {
    payload.image = `/uploads/testimonials/${req.file.filename}`;
  }

  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    throw new AppError('Testimonial not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Testimonial updated successfully',
    data: { testimonial },
  });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    throw new AppError('Testimonial not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully',
  });
});

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
