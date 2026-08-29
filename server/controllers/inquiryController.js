const Inquiry = require('../models/Inquiry');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeObjectStrings, sanitizeString } = require('../utils/sanitize');
const { INQUIRY_STATUSES } = require('../utils/constants');

const createInquiry = asyncHandler(async (req, res) => {
  const payload = sanitizeObjectStrings(req.body, [
    'name',
    'email',
    'phone',
    'weddingLocation',
    'budget',
    'message',
  ]);

  if (Array.isArray(payload.services)) {
    payload.services = payload.services.map((item) => sanitizeString(item, 100));
  }

  if (payload.calculatorSelections && typeof payload.calculatorSelections === 'object') {
    payload.calculatorSelections = {
      guestCount: Number(payload.calculatorSelections.guestCount) || undefined,
      decoration: sanitizeString(payload.calculatorSelections.decoration || '', 50),
      photography: sanitizeString(payload.calculatorSelections.photography || '', 50),
      catering: sanitizeString(payload.calculatorSelections.catering || '', 50),
      entertainment: sanitizeString(payload.calculatorSelections.entertainment || '', 50),
    };
  }

  const inquiry = await Inquiry.create(payload);

  res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully. We will contact you soon.',
    data: { inquiry },
  });
});

const getInquiries = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status && INQUIRY_STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Inquiry.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: inquiries.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: { inquiries },
  });
});

const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    throw new AppError('Inquiry not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: { inquiry },
  });
});

const updateInquiry = asyncHandler(async (req, res) => {
  const allowed = {};

  if (req.body.status !== undefined) {
    allowed.status = req.body.status;
  }

  if (req.body.message !== undefined) {
    allowed.message = sanitizeString(req.body.message, 3000);
  }

  if (req.body.estimatedCost !== undefined) {
    allowed.estimatedCost = req.body.estimatedCost;
  }

  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, allowed, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!inquiry) {
    throw new AppError('Inquiry not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Inquiry updated successfully',
    data: { inquiry },
  });
});

const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    throw new AppError('Inquiry not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Inquiry deleted successfully',
  });
});

const getInquiryStats = asyncHandler(async (_req, res) => {
  const now = new Date();

  const [total, byStatus, upcomingWeddings] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Inquiry.countDocuments({
      weddingDate: { $gte: now },
      status: { $nin: ['cancelled', 'completed'] },
    }),
  ]);

  const statusCounts = INQUIRY_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  byStatus.forEach((row) => {
    statusCounts[row._id] = row.count;
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      newInquiries: statusCounts.new || 0,
      upcomingWeddings,
      byStatus: statusCounts,
    },
  });
});

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
  getInquiryStats,
};
