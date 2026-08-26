import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import FormModal from '../../components/admin/FormModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import {
  createTestimonial,
  deleteTestimonial,
  fetchAdminTestimonials,
  updateTestimonial,
} from '../../services/adminApi';
import usePageTitle from '../../hooks/usePageTitle';
import '../../components/admin/FormModal.css';

const EMPTY_ITEM = {
  name: '',
  coupleName: '',
  message: '',
  rating: 5,
  displayOrder: 0,
  isActive: true,
};

function AdminTestimonialsPage() {
  usePageTitle('Testimonials');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [imageFile, setImageFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchAdminTestimonials());
    } catch (err) {
      setError(err.message || 'Unable to load testimonials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_ITEM);
    setImageFile(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      coupleName: item.coupleName || '',
      message: item.message || '',
      rating: item.rating ?? 5,
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive !== false,
    });
    setImageFile(null);
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('name', form.name.trim());
      payload.append('coupleName', form.coupleName.trim());
      payload.append('message', form.message.trim());
      payload.append('rating', String(Number(form.rating) || 5));
      payload.append('displayOrder', String(Number(form.displayOrder) || 0));
      payload.append('isActive', String(Boolean(form.isActive)));
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editing) {
        await updateTestimonial(editing._id, payload);
        setToast('Testimonial updated.');
      } else {
        await createTestimonial(payload);
        setToast('Testimonial created.');
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save testimonial.');
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
      await deleteTestimonial(deleteTarget._id);
      setToast('Testimonial deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete testimonial.');
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="admin-crud__header">
        <div>
          <p className="admin-crud__eyebrow">Social proof</p>
          <h1>Testimonials</h1>
          <p className="admin-crud__intro">
            Manage couple stories, ratings, and optional profile images.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={openCreate}>
          Add testimonial
        </Button>
      </header>

      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {loading ? <LoadingSpinner label="Loading testimonials…" /> : null}

      {!loading ? (
        <div className="admin-crud__table-wrap">
          <table className="admin-crud__table">
            <thead>
              <tr>
                <th>Couple</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.coupleName}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(43,37,34,0.65)' }}>
                      {item.message?.slice(0, 90)}
                      {item.message?.length > 90 ? '…' : ''}
                    </div>
                  </td>
                  <td>{item.rating}/5</td>
                  <td>
                    <span
                      className={`admin-crud__badge ${
                        item.isActive ? 'admin-crud__badge--on' : 'admin-crud__badge--off'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-crud__actions">
                      <button type="button" onClick={() => openEdit(item)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(item)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <FormModal
        open={formOpen}
        title={editing ? 'Edit testimonial' : 'Add testimonial'}
        onClose={() => setFormOpen(false)}
        wide
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="tm-name">Name</label>
              <input
                id="tm-name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="tm-couple">Couple name</label>
              <input
                id="tm-couple"
                required
                value={form.coupleName}
                onChange={(e) => setForm((f) => ({ ...f, coupleName: e.target.value }))}
              />
            </div>
          </div>
          <div className="admin-form__row">
            <label htmlFor="tm-message">Message</label>
            <textarea
              id="tm-message"
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="tm-rating">Rating</label>
              <select
                id="tm-rating"
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form__row">
              <label htmlFor="tm-order">Display order</label>
              <input
                id="tm-order"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
              />
            </div>
          </div>
          <div className="admin-form__row">
            <label htmlFor="tm-image">Couple image</label>
            <input
              id="tm-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
          <label className="admin-form__check">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active on website
          </label>
          <div className="admin-form__actions">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save testimonial'}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete testimonial?"
        message={
          deleteTarget ? `Remove “${deleteTarget.coupleName}” permanently?` : ''
        }
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default AdminTestimonialsPage;
