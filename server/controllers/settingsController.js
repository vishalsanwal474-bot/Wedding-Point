const Service = require('../models/Service');
const Package = require('../models/Package');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getOrCreateSettings } = require('../services/settingsService');
const { sanitizeObjectStrings } = require('../utils/sanitize');
const { normalizeMapEmbedUrl, parseCoordinate } = require('../utils/mapEmbed');

const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  const data = settings.toObject();

  res.status(200).json({
    success: true,
    data: {
      settings: {
        ...data,
        mapEmbedUrl: data.mapEmbedUrl || '',
        mapLatitude: data.mapLatitude ?? null,
        mapLongitude: data.mapLongitude ?? null,
      },
    },
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

  // Normalize map embed from the raw body so iframe HTML is not damaged by sanitizers.
  if (Object.prototype.hasOwnProperty.call(req.body, 'mapEmbedUrl')) {
    const normalized = normalizeMapEmbedUrl(req.body.mapEmbedUrl);
    if (req.body.mapEmbedUrl && !normalized) {
      throw new AppError(
        'Map embed must be a Google Maps embed URL, place link, or iframe HTML from Google Maps Share → Embed a map.',
        400
      );
    }
    payload.mapEmbedUrl = normalized || '';
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'mapLatitude')) {
    const lat = parseCoordinate(req.body.mapLatitude);
    if (req.body.mapLatitude !== '' && req.body.mapLatitude !== null && lat === null) {
      throw new AppError('Latitude must be a valid number between -90 and 90.', 400);
    }
    if (lat !== null && (lat < -90 || lat > 90)) {
      throw new AppError('Latitude must be between -90 and 90.', 400);
    }
    payload.mapLatitude = lat;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'mapLongitude')) {
    const lng = parseCoordinate(req.body.mapLongitude);
    if (req.body.mapLongitude !== '' && req.body.mapLongitude !== null && lng === null) {
      throw new AppError('Longitude must be a valid number between -180 and 180.', 400);
    }
    if (lng !== null && (lng < -180 || lng > 180)) {
      throw new AppError('Longitude must be between -180 and 180.', 400);
    }
    payload.mapLongitude = lng;
  }

  const scalarFields = [
    'businessName',
    'tagline',
    'phone',
    'whatsapp',
    'email',
    'address',
    'mapEmbedUrl',
    'mapLatitude',
    'mapLongitude',
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
      settings.set(field, payload[field]);
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
  const data = settings.toObject();

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: {
      settings: {
        ...data,
        mapEmbedUrl: data.mapEmbedUrl || '',
        mapLatitude: data.mapLatitude ?? null,
        mapLongitude: data.mapLongitude ?? null,
      },
    },
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
