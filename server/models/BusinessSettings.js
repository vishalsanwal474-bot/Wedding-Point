const mongoose = require('mongoose');
const { DEFAULT_PRICING } = require('../utils/constants');

const pricingTierSchema = new mongoose.Schema(
  {
    basic: { type: Number, min: 0, default: 0 },
    classic: { type: Number, min: 0, default: 0 },
    premium: { type: Number, min: 0, default: 0 },
    standard: { type: Number, min: 0, default: 0 },
    cinematic: { type: Number, min: 0, default: 0 },
    vegetarian: { type: Number, min: 0, default: 0 },
    none: { type: Number, min: 0, default: 0 },
    dj: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    perGuestBase: {
      type: Number,
      min: 0,
      default: DEFAULT_PRICING.perGuestBase,
    },
    decoration: {
      type: pricingTierSchema,
      default: () => ({ ...DEFAULT_PRICING.decoration }),
    },
    photography: {
      type: pricingTierSchema,
      default: () => ({ ...DEFAULT_PRICING.photography }),
    },
    catering: {
      type: pricingTierSchema,
      default: () => ({ ...DEFAULT_PRICING.catering }),
    },
    entertainment: {
      type: pricingTierSchema,
      default: () => ({ ...DEFAULT_PRICING.entertainment }),
    },
  },
  { _id: false }
);

const businessSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
      default: 'Wedding Point',
      maxlength: 120,
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Creating Beautiful Weddings, Making Memories Last Forever',
      maxlength: 250,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: 30,
    },
    whatsapp: {
      type: String,
      trim: true,
      default: '',
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      maxlength: 150,
    },
    address: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    instagram: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    facebook: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    youtube: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    yearsExperience: {
      type: Number,
      min: 0,
      default: 10,
    },
    weddingsCompleted: {
      type: Number,
      min: 0,
      default: 500,
    },
    venuesServed: {
      type: Number,
      min: 0,
      default: 50,
    },
    commitmentText: {
      type: String,
      trim: true,
      default: '100%',
      maxlength: 50,
    },
    pricing: {
      type: pricingSchema,
      default: () => ({ ...DEFAULT_PRICING }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);
