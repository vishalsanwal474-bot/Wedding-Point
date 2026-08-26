const Service = require('../models/Service');
const Package = require('../models/Package');
const asyncHandler = require('../utils/asyncHandler');
const { getOrCreateSettings } = require('../services/settingsService');
const { sanitizeObjectStrings } = require('../utils/sanitize');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();

  res.status(200).json({
    success: true,
    data: { settings },
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const payload = sanitizeObjectStrings(req.body, [
    'businessName',
    'tagline',
    'phone',
    'whatsapp',
    'email',
    'address',
    'instagram',
    'facebook',
    'youtube',
    'commitmentText',
  ]);

  const scalarFields = [
    'businessName',
    'tagline',
    'phone',
    'whatsapp',
    'email',
    'address',
    'instagram',
    'facebook',
    'youtube',
    'yearsExperience',
    'weddingsCompleted',
    'venuesServed',
    'commitmentText',
  ];

  scalarFields.forEach((field) => {
    if (payload[field] !== undefined) {
      settings[field] = payload[field];
    }
  });

  if (payload.pricing && typeof payload.pricing === 'object') {
    settings.pricing = {
      ...settings.pricing.toObject?.() || settings.pricing,
      ...payload.pricing,
      decoration: {
        ...(settings.pricing.decoration?.toObject?.() || settings.pricing.decoration || {}),
        ...(payload.pricing.decoration || {}),
      },
      photography: {
        ...(settings.pricing.photography?.toObject?.() || settings.pricing.photography || {}),
        ...(payload.pricing.photography || {}),
      },
      catering: {
        ...(settings.pricing.catering?.toObject?.() || settings.pricing.catering || {}),
        ...(payload.pricing.catering || {}),
      },
      entertainment: {
        ...(settings.pricing.entertainment?.toObject?.() || settings.pricing.entertainment || {}),
        ...(payload.pricing.entertainment || {}),
      },
    };
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: { settings },
  });
});

const getDashboardStats = asyncHandler(async (_req, res) => {
  const [settings, servicesCount, packagesCount] = await Promise.all([
    getOrCreateSettings(),
    Service.countDocuments({ isActive: true }),
    Package.countDocuments({ isActive: true }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      services: servicesCount,
      packages: packagesCount,
      business: {
        yearsExperience: settings.yearsExperience,
        weddingsCompleted: settings.weddingsCompleted,
        venuesServed: settings.venuesServed,
        commitmentText: settings.commitmentText,
      },
    },
  });
});

module.exports = {
  getSettings,
  updateSettings,
  getDashboardStats,
};
