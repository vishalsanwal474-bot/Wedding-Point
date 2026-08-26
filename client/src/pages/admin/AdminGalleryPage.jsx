import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import FormModal from '../../components/admin/FormModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import {
  createGalleryItem,
  deleteGalleryItem,
  fetchAdminGallery,
  updateGalleryItem,
} from '../../services/adminApi';
import { GALLERY_CATEGORIES } from '../../utils/constants';
import { resolveMediaUrl } from '../../utils/content';
import usePageTitle from '../../hooks/usePageTitle';
import '../../components/admin/FormModal.css';

const EMPTY_ITEM = {
  title: '',
  category: 'Weddings',
  description: '',
  altText: '',
  displayOrder: 0,
  isActive: true,
};

function AdminGalleryPage() {
  usePageTitle('Gallery');
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
      setItems(await fetchAdminGallery());
    } catch (err) {
      setError(err.message || 'Unable to load gallery.');
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
      title: item.title || '',
      category: item.category || 'Weddings',
      description: item.description || '',
      altText: item.altText || '',
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive !== false,
    });
    setImageFile(null);
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing && !imageFile) {
      setError('Please choose an image to upload.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('title', form.title.trim());
      payload.append('category', form.category);
      payload.append('description', form.description.trim());
      payload.append('altText', form.altText.trim());
      payload.append('displayOrder', String(Number(form.displayOrder) || 0));
      payload.append('isActive', String(Boolean(form.isActive)));
      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editing) {
        await updateGalleryItem(editing._id, payload);
        setToast('Gallery item updated.');
      } else {
        await createGalleryItem(payload);
        setToast('Gallery item created.');
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save gallery item.');
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
      await deleteGalleryItem(deleteTarget._id);
      setToast('Gallery item deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete gallery item.');
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="admin-crud__header">
        <div>
          <p className="admin-crud__eyebrow">Media</p>
          <h1>Gallery</h1>
          <p className="admin-crud__intro">
            Upload images with categories, descriptions, and accessible alt text.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={openCreate}>
          Add image
        </Button>
      </header>

      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {loading ? <LoadingSpinner label="Loading gallery…" /> : null}

      {!loading ? (
        <div className="admin-crud__table-wrap">
          <table className="admin-crud__table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.imageUrl ? (
                      <img
                        src={resolveMediaUrl(item.imageUrl)}
                        alt={item.altText || item.title}
                        style={{ width: '4rem', height: '4rem', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
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
        title={editing ? 'Edit gallery item' : 'Add gallery item'}
        onClose={() => setFormOpen(false)}
        wide
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="gal-title">Title</label>
              <input
                id="gal-title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="gal-category">Category</label>
              <select
                id="gal-category"
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {GALLERY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form__row">
            <label htmlFor="gal-alt">Alt text</label>
            <input
              id="gal-alt"
              required
              value={form.altText}
              onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
            />
          </div>
          <div className="admin-form__row">
            <label htmlFor="gal-desc">Description</label>
            <textarea
              id="gal-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="gal-order">Display order</label>
              <input
                id="gal-order"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="gal-image">Image file</label>
              <input
                id="gal-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required={!editing}
              />
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
              {saving ? 'Saving…' : 'Save item'}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete gallery item?"
        message={deleteTarget ? `Remove “${deleteTarget.title}” permanently?` : ''}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default AdminGalleryPage;
