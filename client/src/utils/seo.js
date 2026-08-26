const DEFAULT_DESCRIPTION =
  'Wedding Point creates beautiful weddings with planning, décor, photography, catering, and entertainment — making memories last forever.';

const PAGE_DESCRIPTIONS = {
  Home: DEFAULT_DESCRIPTION,
  About:
    'Learn about Wedding Point — elegant wedding planning built around your vision, details, and celebration style.',
  Services:
    'Explore Wedding Point services including planning, decorations, photography, catering, entertainment, and venue setup.',
  Packages:
    'Compare Essential, Classic, and Royal wedding packages, then estimate your cost with our interactive calculator.',
  Gallery:
    'Browse Wedding Point gallery moments across weddings, décor, mehndi, haldi, reception, and engagement celebrations.',
  Testimonials:
    'Read what couples say about Wedding Point — thoughtful planning, calm coordination, and beautiful celebrations.',
  Contact:
    'Contact Wedding Point by phone, WhatsApp, or email to begin planning your wedding celebration.',
  'Get a Quote':
    'Request a personalized wedding quote from Wedding Point. Share your date, guest count, services, and budget.',
  'Admin Login': 'Secure admin sign-in for Wedding Point content and inquiry management.',
  'Page Not Found':
    'This Wedding Point page could not be found. Return home to explore services and packages.',
};

function upsertMeta(attr, key, content) {
  if (!content) {
    return;
  }

  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function getPageDescription(pageName) {
  return PAGE_DESCRIPTIONS[pageName] || DEFAULT_DESCRIPTION;
}

export function applyPageSeo({
  pageName,
  businessName = 'Wedding Point',
  description,
  path = '/',
}) {
  const title =
    pageName && pageName !== 'Home'
      ? `${pageName} | ${businessName}`
      : businessName;
  const metaDescription = description || getPageDescription(pageName);
  const origin = window.location.origin;
  const canonical = `${origin}${path}`;

  document.title = title;
  upsertMeta('name', 'description', metaDescription);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', metaDescription);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', metaDescription);
  upsertCanonical(canonical);
}

export function buildLocalBusinessJsonLd(settings = {}) {
  const name = settings.businessName || 'Wedding Point';
  const description =
    settings.tagline ||
    'Creating Beautiful Weddings, Making Memories Last Forever';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    image: typeof window !== 'undefined' ? `${window.location.origin}/og-cover.svg` : undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
        }
      : undefined,
    sameAs: [settings.instagram, settings.facebook, settings.youtube].filter(
      Boolean
    ),
    priceRange: '₹₹₹',
    areaServed: 'IN',
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined || (Array.isArray(data[key]) && !data[key].length)) {
      delete data[key];
    }
  });

  return data;
}
