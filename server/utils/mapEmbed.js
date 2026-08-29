/**
 * Accept a Google Maps embed URL or full iframe HTML and return a safe embed src.
 * Returns '' for empty input, or null when the value is not a valid Google Maps URL.
 */
function normalizeMapEmbedUrl(value) {
  if (value === undefined || value === null) {
    return '';
  }

  const raw = String(value).trim();
  if (!raw) {
    return '';
  }

  let candidate = raw;

  const iframeSrcMatch = raw.match(/src\s*=\s*["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    candidate = iframeSrcMatch[1].trim();
  }

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.toLowerCase();
  const isGoogleMapsHost =
    host === 'www.google.com' ||
    host === 'google.com' ||
    host === 'maps.google.com' ||
    host.endsWith('.google.com');

  if (!isGoogleMapsHost) {
    return null;
  }

  if (path.includes('/maps/embed')) {
    return candidate;
  }

  if (path.includes('/maps') || host.startsWith('maps.')) {
    const atMatch = candidate.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (atMatch) {
      return buildQueryEmbedUrl(`${atMatch[1]},${atMatch[2]}`);
    }

    const placeMatch = path.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return buildQueryEmbedUrl(place);
    }

    const q = parsed.searchParams.get('q') || parsed.searchParams.get('query');
    if (q) {
      return buildQueryEmbedUrl(q);
    }

    if (parsed.searchParams.get('output') === 'embed') {
      return candidate;
    }

    return buildQueryEmbedUrl(candidate);
  }

  return null;
}

function buildQueryEmbedUrl(query) {
  const q = encodeURIComponent(String(query).trim());
  return `https://maps.google.com/maps?q=${q}&hl=en&z=15&ie=UTF8&iwloc=B&output=embed`;
}

function parseCoordinate(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

/**
 * Resolve map iframe src from embed URL, coordinates, or address.
 * Priority: embed URL → lat/lng → address.
 */
function resolveContactMapUrl({ mapEmbedUrl, mapLatitude, mapLongitude, address } = {}) {
  const fromEmbed = normalizeMapEmbedUrl(mapEmbedUrl);
  if (fromEmbed) {
    return fromEmbed;
  }

  const lat = parseCoordinate(mapLatitude);
  const lng = parseCoordinate(mapLongitude);
  if (lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    return buildQueryEmbedUrl(`${lat},${lng}`);
  }

  const trimmedAddress = String(address || '').trim();
  if (!trimmedAddress) {
    return '';
  }

  return buildQueryEmbedUrl(trimmedAddress);
}

function buildGoogleMapsLink({ mapLatitude, mapLongitude, address } = {}) {
  const lat = parseCoordinate(mapLatitude);
  const lng = parseCoordinate(mapLongitude);
  if (lat !== null && lng !== null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const trimmedAddress = String(address || '').trim();
  if (!trimmedAddress) {
    return '';
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmedAddress)}`;
}

module.exports = {
  normalizeMapEmbedUrl,
  resolveContactMapUrl,
  buildGoogleMapsLink,
  buildQueryEmbedUrl,
  parseCoordinate,
};
