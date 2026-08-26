const express = require('express');
const packageController = require('../controllers/packageController');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const coerceFormFields = require('../middleware/coerceFormFields');
const {
  mongoIdParam,
  packageRules,
  packageUpdateRules,
} = require('../middleware/validationRules');

const router = express.Router();

router.get('/', optionalAuth, packageController.getPackages);
router.get('/:id', optionalAuth, mongoIdParam, validate, packageController.getPackageById);

router.post(
  '/',
  protect,
  adminOnly,
  coerceFormFields,
  packageRules,
  validate,
  packageController.createPackage
);

router.put(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  coerceFormFields,
  packageUpdateRules,
  validate,
  packageController.updatePackage
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  validate,
  packageController.deletePackage
);

module.exports = router;
