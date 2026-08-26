const INQUIRY_STATUSES = [
  'new',
  'contacted',
  'quoted',
  'confirmed',
  'completed',
  'cancelled',
];

const GALLERY_CATEGORIES = [
  'Weddings',
  'Decoration',
  'Mehndi',
  'Haldi',
  'Reception',
  'Engagement',
];

const SERVICE_OPTIONS = [
  'Wedding Planning',
  'Decoration',
  'Photography',
  'Videography',
  'Catering',
  'DJ & Entertainment',
  'Venue Setup',
];

const BUDGET_OPTIONS = [
  '₹1–2 Lakhs',
  '₹2–5 Lakhs',
  '₹5–10 Lakhs',
  '₹10+ Lakhs',
  'Not Sure Yet',
];

const DEFAULT_PRICING = {
  perGuestBase: 500,
  decoration: {
    basic: 25000,
    classic: 50000,
    premium: 100000,
  },
  photography: {
    basic: 20000,
    standard: 45000,
    cinematic: 90000,
  },
  catering: {
    vegetarian: 800,
    standard: 1200,
    premium: 1800,
  },
  entertainment: {
    none: 0,
    dj: 25000,
    premium: 60000,
  },
};

module.exports = {
  INQUIRY_STATUSES,
  GALLERY_CATEGORIES,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  DEFAULT_PRICING,
};
