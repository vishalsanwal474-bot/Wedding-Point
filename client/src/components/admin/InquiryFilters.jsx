import { INQUIRY_STATUS_FILTERS, formatStatusLabel } from '../../utils/adminHelpers';
import './InquiryFilters.css';

function InquiryFilters({ value = 'all', onChange }) {
  return (
    <div className="inquiry-filters" role="tablist" aria-label="Filter inquiries by status">
      {INQUIRY_STATUS_FILTERS.map((status) => (
        <button
          key={status}
          type="button"
          role="tab"
          aria-selected={value === status}
          className={`inquiry-filters__btn ${
            value === status ? 'inquiry-filters__btn--active' : ''
          }`}
          onClick={() => onChange(status)}
        >
          {status === 'all' ? 'All' : formatStatusLabel(status)}
        </button>
      ))}
    </div>
  );
}

export default InquiryFilters;
