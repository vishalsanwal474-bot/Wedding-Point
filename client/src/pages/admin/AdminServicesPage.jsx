import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import FormModal from '../../components/admin/FormModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import {
  createService,
  deleteService,
  fetchAdminServices,
  updateService,
} from '../../services/adminApi';
import { SERVICE_ICON_OPTIONS } from '../../utils/constants';
import { resolveMediaUrl } from '../../utils/content';
import usePageTitle from '../../hooks/usePageTitle';
import '../../components/admin/FormModal.css';

const EMPTY_SERVICE = {
  title: '',
  shortDescription: '',
  description: '',
  icon: 'Heart',
  displayOrder: 0,
  isActive: true,
};

function AdminServicesPage() {
  usePageTitle('Services');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [imageFile, setImageFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchAdminServices());
    } catch (err) {
      setError(err.message || 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_SERVICE);
    setImageFile(null);
    setFormOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title || '',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      icon: service.icon || 'Heart',
      displayOrder: service.displayOrder ?? 0,
      isActive: service.isActive !== false,
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
      payload.append('title', form.title.trim());
      payload.append('shortDescription', form.shortDescription.trim());
      payload.append('description', form.description.trim());
      payload.append('icon', form.icon);
      payload.append('displayOrder', String(Number(form.displayOrder) || 0));
      payload.append('isActive', String(Boolean(form.isActive)));
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editing) {
        await updateService(editing._id, payload);
        setToast('Service updated.');
      } else {
        await createService(payload);
        setToast('Service created.');
      }

      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save service.');
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
      await deleteService(deleteTarget._id);
      setToast('Service deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete service.');
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="admin-crud__header">
        <div>
          <p className="admin-crud__eyebrow">Content</p>
          <h1>Services</h1>
          <p className="admin-crud__intro">
            Create and manage wedding services shown on the public website.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={openCreate}>
          Add service
        </Button>
      </header>

      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {loading ? <LoadingSpinner label="Loading services…" /> : null}

      {!loading ? (
        <div className="admin-crud__table-wrap">
          <table className="admin-crud__table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((service) => (
                <tr key={service._id}>
                  <td>
                    <strong>{service.title}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(43,37,34,0.65)' }}>
                      {service.shortDescription}
                    </div>
                  </td>
                  <td>{service.displayOrder}</td>
                  <td>
                    <span
                      className={`admin-crud__badge ${
                        service.isActive ? 'admin-crud__badge--on' : 'admin-crud__badge--off'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-crud__actions">
                      <button type="button" onClick={() => openEdit(service)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(service)}>
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
        title={editing ? 'Edit service' : 'Add service'}
        onClose={() => setFormOpen(false)}
        wide
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="service-title">Title</label>
              <input
                id="service-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="service-icon">Icon</label>
              <select
                id="service-icon"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              >
                {SERVICE_ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-form__row">
            <label htmlFor="service-short">Short description</label>
            <input
              id="service-short"
              required
              maxLength={300}
              value={form.shortDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortDescription: e.target.value }))
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="service-desc">Description</label>
            <textarea
              id="service-desc"
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="service-order">Display order</label>
              <input
                id="service-order"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, displayOrder: e.target.value }))
                }
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="service-image">Image</label>
              <input
                id="service-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {editing?.image ? (
                <p className="admin-form__error" style={{ color: 'rgba(43,37,34,0.65)' }}>
                  Current: {resolveMediaUrl(editing.image)}
                </p>
              ) : null}
            </div>
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
              {saving ? 'Saving…' : 'Save service'}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete service?"
        message={deleteTarget ? `Remove “${deleteTarget.title}” permanently?` : ''}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default AdminServicesPage;
