const mongoose = require('mongoose');
const {
  INQUIRY_STATUSES,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
} = require('../utils/constants');

const calculatorSelectionsSchema = new mongoose.Schema(
  {
    guestCount: { type: Number, min: 0 },
    decoration: { type: String, trim: true },
    photography: { type: String, trim: true },
    catering: { type: String, trim: true },
    entertainment: { type: String, trim: true },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[+\d][\d\s()-]{7,19}$/, 'Please provide a valid phone number'],
    },
    weddingDate: {
      type: Date,
      required: [true, 'Wedding date is required'],
    },
    weddingLocation: {
      type: String,
      required: [true, 'Wedding location is required'],
      trim: true,
      maxlength: 200,
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
      max: [10000, 'Guest count is too large'],
    },
    services: {
      type: [String],
      required: [true, 'At least one service is required'],
      validate: {
        validator(value) {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every((item) => SERVICE_OPTIONS.includes(item))
          );
        },
        message: 'Services must be selected from the allowed list',
      },
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
      enum: BUDGET_OPTIONS,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },
    estimatedCost: {
      type: Number,
      min: 0,
      default: null,
    },
    calculatorSelections: {
      type: calculatorSelectionsSchema,
      default: undefined,
    },
    status: {
      type: String,
      enum: INQUIRY_STATUSES,
      default: 'new',
    },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ weddingDate: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
