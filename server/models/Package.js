const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Package description is required'],
      trim: true,
      maxlength: 2000,
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.every((item) => typeof item === 'string');
        },
        message: 'Features must be an array of strings',
      },
    },
    basePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

packageSchema.index({ isActive: 1, displayOrder: 1 });

packageSchema.pre('validate', function setSlug() {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name);
  }
});

module.exports = mongoose.model('Package', packageSchema);
