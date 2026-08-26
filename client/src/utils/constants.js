export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Packages', path: '/packages' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
];

export const FOOTER_SERVICE_LINKS = [
  { label: 'Wedding Planning', path: '/services' },
  { label: 'Decoration', path: '/services' },
  { label: 'Photography', path: '/services' },
  { label: 'Catering', path: '/services' },
  { label: 'Entertainment', path: '/services' },
];

export const DEFAULT_PRICING = {
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

export const DEFAULT_SETTINGS = {
  businessName: 'Wedding Point',
  tagline: 'Creating Beautiful Weddings, Making Memories Last Forever',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
  youtube: '',
  yearsExperience: 10,
  weddingsCompleted: 500,
  venuesServed: 50,
  commitmentText: '100%',
  pricing: DEFAULT_PRICING,
};

export const CALCULATOR_OPTIONS = {
  decoration: [
    { value: 'basic', label: 'Basic' },
    { value: 'classic', label: 'Classic' },
    { value: 'premium', label: 'Premium' },
  ],
  photography: [
    { value: 'basic', label: 'Basic' },
    { value: 'standard', label: 'Standard' },
    { value: 'cinematic', label: 'Cinematic' },
  ],
  catering: [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
  ],
  entertainment: [
    { value: 'none', label: 'None' },
    { value: 'dj', label: 'DJ' },
    { value: 'premium', label: 'Premium Entertainment' },
  ],
};

export const DEFAULT_CALCULATOR_SELECTIONS = {
  guestCount: 150,
  decoration: 'classic',
  photography: 'standard',
  catering: 'standard',
  entertainment: 'dj',
};

export const INQUIRY_SERVICE_OPTIONS = [
  'Wedding Planning',
  'Decoration',
  'Photography',
  'Videography',
  'Catering',
  'DJ & Entertainment',
  'Venue Setup',
];

export const INQUIRY_BUDGET_OPTIONS = [
  '₹1–2 Lakhs',
  '₹2–5 Lakhs',
  '₹5–10 Lakhs',
  '₹10+ Lakhs',
  'Not Sure Yet',
];

export const EMPTY_INQUIRY_FORM = {
  name: '',
  email: '',
  phone: '',
  weddingDate: '',
  weddingLocation: '',
  guestCount: '',
  services: [],
  budget: '',
  message: '',
};

export const GALLERY_CATEGORIES = [
  'Weddings',
  'Decoration',
  'Mehndi',
  'Haldi',
  'Reception',
  'Engagement',
];

export const SERVICE_ICON_OPTIONS = [
  'ClipboardList',
  'Sparkles',
  'Camera',
  'UtensilsCrossed',
  'Music',
  'Building2',
  'Heart',
];

