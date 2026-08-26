const express = require('express');
const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const packageRoutes = require('./packageRoutes');
const galleryRoutes = require('./galleryRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/packages', packageRoutes);
router.use('/gallery', galleryRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
