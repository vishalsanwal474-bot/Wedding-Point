const express = require('express');
const galleryController = require('../controllers/galleryController');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const coerceFormFields = require('../middleware/coerceFormFields');
const { upload, setUploadFolder } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  mongoIdParam,
  galleryRules,
  galleryUpdateRules,
  galleryQueryRules,
} = require('../middleware/validationRules');

const router = express.Router();

router.get('/', optionalAuth, galleryQueryRules, validate, galleryController.getGallery);
router.get('/:id', optionalAuth, mongoIdParam, validate, galleryController.getGalleryItem);

router.post(
  '/',
  protect,
  adminOnly,
  uploadLimiter,
  setUploadFolder('gallery'),
  upload.single('image'),
  coerceFormFields,
  galleryRules,
  validate,
  galleryController.createGalleryItem
);

router.put(
  '/:id',
  protect,
  adminOnly,
  uploadLimiter,
  mongoIdParam,
  setUploadFolder('gallery'),
  upload.single('image'),
  coerceFormFields,
  galleryUpdateRules,
  validate,
  galleryController.updateGalleryItem
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  validate,
  galleryController.deleteGalleryItem
);

module.exports = router;
