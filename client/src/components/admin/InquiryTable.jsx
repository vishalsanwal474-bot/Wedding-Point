import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import EmptyState from '../EmptyState';
import { formatAdminDate } from '../../utils/adminHelpers';
import './InquiryTable.css';

function InquiryTable({
  inquiries = [],
  showViewLink = false,
  onSelect,
  selectedId,
}) {
  if (!inquiries.length) {
    return (
      <EmptyState
        title="No inquiries found"
        description="Try another status filter, or wait for new wedding inquiries to arrive."
      />
    );
  }

  return (
    <div className="inquiry-table-wrap">
      <table className="inquiry-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Wedding Date</th>
            <th scope="col">Location</th>
            <th scope="col">Services</th>
            <th scope="col">Budget</th>
            <th scope="col">Status</th>
            {showViewLink || onSelect ? (
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            const isSelected = selectedId === inquiry._id;

            return (
              <tr
                key={inquiry._id}
                className={isSelected ? 'inquiry-table__row--selected' : undefined}
              >
                <td data-label="Name">
                  <span className="inquiry-table__name">{inquiry.name}</span>
                  <span className="inquiry-table__meta">{inquiry.email}</span>
                </td>
                <td data-label="Wedding Date">
                  {formatAdminDate(inquiry.weddingDate)}
                </td>
                <td data-label="Location">{inquiry.weddingLocation || '—'}</td>
                <td data-label="Services">
                  <span className="inquiry-table__services">
                    {(inquiry.services || []).join(', ') || '—'}
                  </span>
                </td>
                <td data-label="Budget">{inquiry.budget || '—'}</td>
                <td data-label="Status">
                  <StatusBadge status={inquiry.status} />
                </td>
                {showViewLink || onSelect ? (
                  <td data-label="Actions">
                    {onSelect ? (
                      <button
                        type="button"
                        className="inquiry-table__link"
                        onClick={() => onSelect(inquiry)}
                      >
                        View
                      </button>
                    ) : null}
                    {showViewLink ? (
                      <Link
                        className="inquiry-table__link"
                        to={`/admin/inquiries?highlight=${inquiry._id}`}
                      >
                        Open
                      </Link>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InquiryTable;
