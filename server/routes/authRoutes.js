const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { loginRules } = require('../middleware/validationRules');
const { protect, adminOnly } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/login', authLimiter, loginRules, validate, authController.login);
router.get('/me', protect, adminOnly, authController.me);

module.exports = router;
