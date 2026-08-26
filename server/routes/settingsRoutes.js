const express = require('express');
const settingsController = require('../controllers/settingsController');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const { settingsRules } = require('../middleware/validationRules');

const router = express.Router();

router.get('/', settingsController.getSettings);
router.get('/dashboard', protect, adminOnly, settingsController.getDashboardStats);

router.put(
  '/',
  protect,
  adminOnly,
  settingsRules,
  validate,
  settingsController.updateSettings
);

module.exports = router;
