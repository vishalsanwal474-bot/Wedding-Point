const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const coerceFormFields = require('../middleware/coerceFormFields');
const { upload, setUploadFolder } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  mongoIdParam,
  testimonialRules,
  testimonialUpdateRules,
} = require('../middleware/validationRules');

const router = express.Router();

router.get('/', optionalAuth, testimonialController.getTestimonials);
router.get(
  '/:id',
  optionalAuth,
  mongoIdParam,
  validate,
  testimonialController.getTestimonialById
);

router.post(
  '/',
  protect,
  adminOnly,
  uploadLimiter,
  setUploadFolder('testimonials'),
  upload.single('image'),
  coerceFormFields,
  testimonialRules,
  validate,
  testimonialController.createTestimonial
);

router.put(
  '/:id',
  protect,
  adminOnly,
  uploadLimiter,
  mongoIdParam,
  setUploadFolder('testimonials'),
  upload.single('image'),
  coerceFormFields,
  testimonialUpdateRules,
  validate,
  testimonialController.updateTestimonial
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  validate,
  testimonialController.deleteTestimonial
);

module.exports = router;
