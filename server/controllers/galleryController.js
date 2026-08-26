const GalleryItem = require('../models/GalleryItem');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeObjectStrings } = require('../utils/sanitize');

const getGallery = asyncHandler(async (req, res) => {
  const filter = {};

  if (!(req.user && req.query.includeInactive === 'true')) {
    filter.isActive = true;
  }

  if (req.query.category && req.query.category !== 'All') {
    filter.category = req.query.category;
  }

  const items = await GalleryItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    data: { items },
  });
});

const getGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);

  if (!item || (!item.isActive && !req.user)) {
    throw new AppError('Gallery item not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: { item },
  });
});

const createGalleryItem = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'title',
    'category',
    'description',
    'altText',
    'imageUrl',
  ]);

  if (req.file) {
    payload.imageUrl = `/uploads/gallery/${req.file.filename}`;
  }

  if (!payload.imageUrl) {
    throw new AppError('An image file or imageUrl is required.', 400);
  }

  const item = await GalleryItem.create(payload);

  res.status(201).json({
    success: true,
    message: 'Gallery item created successfully',
    data: { item },
  });
});

const updateGalleryItem = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'title',
    'category',
    'description',
    'altText',
    'imageUrl',
  ]);

  if (req.file) {
    payload.imageUrl = `/uploads/gallery/${req.file.filename}`;
  }

  const item = await GalleryItem.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    throw new AppError('Gallery item not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: { item },
  });
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);

  if (!item) {
    throw new AppError('Gallery item not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully',
  });
});

module.exports = {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
