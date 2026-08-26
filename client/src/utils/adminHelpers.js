export const INQUIRY_STATUS_FILTERS = [
  'all',
  'new',
  'contacted',
  'quoted',
  'confirmed',
  'completed',
  'cancelled',
];

export const INQUIRY_STATUSES = INQUIRY_STATUS_FILTERS.filter(
  (status) => status !== 'all'
);

export function formatAdminDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatStatusLabel(status) {
  if (!status) {
    return 'Unknown';
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}
