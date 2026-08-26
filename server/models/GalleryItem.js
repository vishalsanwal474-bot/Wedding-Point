const mongoose = require('mongoose');
const { GALLERY_CATEGORIES } = require('../utils/constants');

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery title is required'],
      trim: true,
      maxlength: 150,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: GALLERY_CATEGORIES,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    altText: {
      type: String,
      required: [true, 'Alt text is required'],
      trim: true,
      maxlength: 200,
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

galleryItemSchema.index({ category: 1, isActive: 1, displayOrder: 1 });
galleryItemSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
