const express = require('express');
const inquiryController = require('../controllers/inquiryController');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const { inquiryLimiter } = require('../middleware/rateLimiter');
const {
  mongoIdParam,
  inquiryCreateRules,
  inquiryUpdateRules,
} = require('../middleware/validationRules');

const router = express.Router();

router.post('/', inquiryLimiter, inquiryCreateRules, validate, inquiryController.createInquiry);

router.get('/stats', protect, adminOnly, inquiryController.getInquiryStats);
router.get('/', protect, adminOnly, inquiryController.getInquiries);
router.get('/:id', protect, adminOnly, mongoIdParam, validate, inquiryController.getInquiryById);

router.put(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  inquiryUpdateRules,
  validate,
  inquiryController.updateInquiry
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  mongoIdParam,
  validate,
  inquiryController.deleteInquiry
);

module.exports = router;
