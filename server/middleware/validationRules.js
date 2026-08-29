const { body, param, query } = require('express-validator');
const {
  INQUIRY_STATUSES,
  GALLERY_CATEGORIES,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
} = require('../utils/constants');

const mongoIdParam = param('id').isMongoId().withMessage('Invalid ID format');

const loginRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const serviceRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 300 }),
  body('icon').optional().trim().isLength({ max: 50 }),
  body('image').optional().trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('displayOrder must be a non-negative integer'),
];

const serviceUpdateRules = [
  body('title').optional().trim().notEmpty().isLength({ max: 120 }),
  body('description').optional().trim().notEmpty().isLength({ max: 5000 }),
  body('shortDescription').optional().trim().notEmpty().isLength({ max: 300 }),
  body('icon').optional().trim().isLength({ max: 50 }),
  body('image').optional().trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const packageRules = [
  body('name').trim().notEmpty().withMessage('Package name is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('features.*').optional().isString().trim().isLength({ max: 200 }),
  body('basePrice').optional().isFloat({ min: 0 }).withMessage('basePrice must be a non-negative number'),
  body('isPopular').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const packageUpdateRules = [
  body('name').optional().trim().notEmpty().isLength({ max: 120 }),
  body('description').optional().trim().notEmpty().isLength({ max: 2000 }),
  body('features').optional().isArray(),
  body('features.*').optional().isString().trim().isLength({ max: 200 }),
  body('basePrice').optional().isFloat({ min: 0 }),
  body('isPopular').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const galleryRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('category').isIn(GALLERY_CATEGORIES).withMessage('Invalid gallery category'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('altText').trim().notEmpty().withMessage('Alt text is required').isLength({ max: 200 }),
  body('imageUrl').optional().trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const galleryUpdateRules = [
  body('title').optional().trim().notEmpty().isLength({ max: 150 }),
  body('category').optional().isIn(GALLERY_CATEGORIES),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('altText').optional().trim().notEmpty().isLength({ max: 200 }),
  body('imageUrl').optional().trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const testimonialRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('coupleName').trim().notEmpty().withMessage('Couple name is required').isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('image').optional().trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const testimonialUpdateRules = [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('coupleName').optional().trim().notEmpty().isLength({ max: 150 }),
  body('message').optional().trim().notEmpty().isLength({ max: 2000 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('image').optional().trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

const inquiryCreateRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone')
    .trim()
    .matches(/^[+\d][\d\s()-]{7,19}$/)
    .withMessage('A valid phone number is required'),
  body('weddingDate')
    .isISO8601()
    .withMessage('Wedding date must be a valid date')
    .toDate(),
  body('weddingLocation').trim().notEmpty().withMessage('Wedding location is required').isLength({ max: 200 }),
  body('guestCount')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Guest count must be between 1 and 10000'),
  body('services')
    .isArray({ min: 1 })
    .withMessage('Select at least one service'),
  body('services.*').isIn(SERVICE_OPTIONS).withMessage('Invalid service selected'),
  body('budget').isIn(BUDGET_OPTIONS).withMessage('Invalid budget option'),
  body('message').optional().trim().isLength({ max: 3000 }),
  body('estimatedCost').optional({ nullable: true }).isFloat({ min: 0 }),
  body('calculatorSelections').optional().isObject(),
];

const inquiryUpdateRules = [
  body('status').optional().isIn(INQUIRY_STATUSES).withMessage('Invalid inquiry status'),
  body('message').optional().trim().isLength({ max: 3000 }),
  body('estimatedCost').optional({ nullable: true }).isFloat({ min: 0 }),
];

const settingsRules = [
  body('businessName').optional().trim().isLength({ min: 1, max: 120 }),
  body('tagline').optional().trim().isLength({ max: 250 }),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('whatsapp').optional().trim().isLength({ max: 30 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid business email'),
  body('address').optional().trim().isLength({ max: 300 }),
  body('mapEmbedUrl').optional().trim().isLength({ max: 2000 }),
  body('mapLatitude')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('mapLongitude')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('instagram').optional().trim().isLength({ max: 300 }),
  body('facebook').optional().trim().isLength({ max: 300 }),
  body('youtube').optional().trim().isLength({ max: 300 }),
  body('yearsExperience').optional().isInt({ min: 0 }),
  body('weddingsCompleted').optional().isInt({ min: 0 }),
  body('venuesServed').optional().isInt({ min: 0 }),
  body('commitmentText').optional().trim().isLength({ max: 50 }),
  body('pricing').optional().isObject(),
];

const galleryQueryRules = [
  query('category').optional().isIn(['All', ...GALLERY_CATEGORIES]),
];

module.exports = {
  mongoIdParam,
  loginRules,
  serviceRules,
  serviceUpdateRules,
  packageRules,
  packageUpdateRules,
  galleryRules,
  galleryUpdateRules,
  testimonialRules,
  testimonialUpdateRules,
  inquiryCreateRules,
  inquiryUpdateRules,
  settingsRules,
  galleryQueryRules,
};
