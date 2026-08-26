import { formatInr } from './pricing';
import { formatAdminDate } from './adminHelpers';

export { formatAdminDate };

export function formatInrOptional(value) {
  if (value === undefined || value === null || value === '') {
    return '—';
  }
  return formatInr(value);
}
