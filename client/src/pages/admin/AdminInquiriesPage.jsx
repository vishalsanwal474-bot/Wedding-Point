import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import InquiryFilters from '../../components/admin/InquiryFilters';
import InquiryTable from '../../components/admin/InquiryTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import {
  deleteInquiry,
  fetchInquiries,
  updateInquiry,
} from '../../services/adminApi';
import { INQUIRY_STATUSES, formatAdminDate } from '../../utils/adminHelpers';
import { formatInrOptional } from '../../utils/adminFormatters';
import usePageTitle from '../../hooks/usePageTitle';
import './AdminInquiriesPage.css';
import '../../components/admin/FormModal.css';

function AdminInquiriesPage() {
  usePageTitle('Inquiries');
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [statusFilter, setStatusFilter] = useState('all');
  const [inquiries, setInquiries] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState('');

  const loadInquiries = useCallback(
    async (status, nextPage = 1) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchInquiries({
          status,
          page: nextPage,
          limit: 12,
        });
        setInquiries(result.inquiries);
        setPage(result.page);
        setPages(result.pages);
        setTotal(result.total);

        if (highlightId) {
          const match = result.inquiries.find((item) => item._id === highlightId);
          if (match) {
            setSelected(match);
          }
        }
      } catch (err) {
        setError(err.message || 'Unable to load inquiries.');
      } finally {
        setLoading(false);
      }
    },
    [highlightId]
  );

  useEffect(() => {
    loadInquiries(statusFilter, 1);
  }, [statusFilter, loadInquiries]);

  const handleFilterChange = (status) => {
    setSelected(null);
    setStatusFilter(status);
  };

  const handleStatusChange = async (event) => {
    if (!selected) {
      return;
    }

    const nextStatus = event.target.value;
    setSaving(true);
    setError(null);

    try {
      const updated = await updateInquiry(selected._id, { status: nextStatus });
      setSelected(updated);
      setInquiries((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      );
      setToast('Inquiry status updated.');
    } catch (err) {
      setError(err.message || 'Unable to update status.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setSaving(true);
    try {
      await deleteInquiry(deleteTarget._id);
      setToast('Inquiry deleted.');
      setDeleteTarget(null);
      if (selected?._id === deleteTarget._id) {
        setSelected(null);
      }
      await loadInquiries(statusFilter, page);
    } catch (err) {
      setError(err.message || 'Unable to delete inquiry.');
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-inquiries">
      <header className="admin-inquiries__header">
        <div>
          <p className="admin-inquiries__eyebrow">Pipeline</p>
          <h1>Inquiries</h1>
          <p className="admin-inquiries__intro">
            View customer details, update inquiry status, and remove records when
            needed.
          </p>
        </div>
        <p className="admin-inquiries__count">{total} total</p>
      </header>

      <div className="admin-inquiries__toolbar">
        <InquiryFilters value={statusFilter} onChange={handleFilterChange} />
        <Link to="/admin/dashboard" className="admin-inquiries__back">
          Back to dashboard
        </Link>
      </div>

      {error ? (
        <ErrorMessage
          message={error}
          onRetry={() => loadInquiries(statusFilter, page)}
        />
      ) : null}

      <div className="admin-inquiries__layout">
        <div>
          {loading ? (
            <LoadingSpinner label="Loading inquiries…" />
          ) : (
            <InquiryTable
              inquiries={inquiries}
              onSelect={setSelected}
              selectedId={selected?._id}
            />
          )}

          {pages > 1 ? (
            <div className="admin-inquiries__pagination">
              <Button
                type="button"
                variant="secondary"
                disabled={page <= 1 || loading}
                onClick={() => loadInquiries(statusFilter, page - 1)}
              >
                Previous
              </Button>
              <p>
                Page {page} of {pages}
              </p>
              <Button
                type="button"
                variant="secondary"
                disabled={page >= pages || loading}
                onClick={() => loadInquiries(statusFilter, page + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>

        <aside className="admin-inquiries__detail" aria-live="polite">
          {selected ? (
            <>
              <p className="admin-inquiries__detail-eyebrow">Inquiry detail</p>
              <div className="admin-inquiries__detail-title">
                <h2>{selected.name}</h2>
                <StatusBadge status={selected.status} />
              </div>

              <dl className="admin-inquiries__dl">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a
                      href={`tel:${String(selected.phone || '').replace(/[^\d+]/g, '')}`}
                    >
                      {selected.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Wedding date</dt>
                  <dd>{formatAdminDate(selected.weddingDate)}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{selected.weddingLocation}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{selected.guestCount}</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>{selected.budget}</dd>
                </div>
                <div>
                  <dt>Services</dt>
                  <dd>{(selected.services || []).join(', ')}</dd>
                </div>
                {selected.estimatedCost != null ? (
                  <div>
                    <dt>Estimated package</dt>
                    <dd>{formatInrOptional(selected.estimatedCost)}</dd>
                  </div>
                ) : null}
                {selected.message ? (
                  <div>
                    <dt>Message</dt>
                    <dd className="admin-inquiries__message">{selected.message}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="admin-form__row" style={{ marginTop: '1.25rem' }}>
                <label htmlFor="inquiry-status">Status</label>
                <select
                  id="inquiry-status"
                  value={selected.status}
                  onChange={handleStatusChange}
                  disabled={saving}
                >
                  {INQUIRY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form__actions" style={{ justifyContent: 'flex-start' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDeleteTarget(selected)}
                  disabled={saving}
                >
                  Delete inquiry
                </Button>
              </div>
            </>
          ) : (
            <div className="admin-inquiries__empty-detail">
              <h2>Select an inquiry</h2>
              <p>Choose View on a row to manage customer and wedding details.</p>
            </div>
          )}
        </aside>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this inquiry?"
        message={
          deleteTarget
            ? `This will permanently remove the inquiry from ${deleteTarget.name}.`
            : ''
        }
        confirmLabel="Delete"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default AdminInquiriesPage;
