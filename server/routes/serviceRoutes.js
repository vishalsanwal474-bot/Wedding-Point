const express = require('express');
const serviceController = require('../controllers/serviceController');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const coerceFormFields = require('../middleware/coerceFormFields');
const { upload, setUploadFolder } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  mongoIdParam,
  serviceRules,
  serviceUpdateRules,
} = require('../middleware/validationRules');

const router = express.Router();

router.get('/', optionalAuth, serviceController.getServices);
router.get('/:id', optionalAuth, mongoIdParam, validate, serviceController.getServiceById);

router.post(
  '/',
  protect,
  adminOnly,
  uploadLimiter,
  setUploadFolder('services'),
  upload.single('image'),
  coerceFormFields,
  serviceRules,
  validate,
  serviceController.createService
);

router.put(
  '/:id',
  protect,
  adminOnly,
  uploadLimiter,
  mongoIdParam,
  setUploadFolder('services'),
  upload.single('image'),
  coerceFormFields,
  serviceUpdateRules,
  validate,
  serviceController.updateService
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  validate,
  serviceController.deleteService
);

module.exports = router;
