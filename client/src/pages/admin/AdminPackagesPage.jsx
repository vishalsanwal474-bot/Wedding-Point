import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import FormModal from '../../components/admin/FormModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Toast from '../../components/admin/Toast';
import {
  createPackage,
  deletePackage,
  fetchAdminPackages,
  updatePackage,
} from '../../services/adminApi';
import usePageTitle from '../../hooks/usePageTitle';
import '../../components/admin/FormModal.css';

const EMPTY_PACKAGE = {
  name: '',
  description: '',
  featuresText: '',
  basePrice: 0,
  displayOrder: 0,
  isPopular: false,
  isActive: true,
};

function AdminPackagesPage() {
  usePageTitle('Packages');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PACKAGE);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchAdminPackages());
    } catch (err) {
      setError(err.message || 'Unable to load packages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PACKAGE);
    setFormOpen(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    setForm({
      name: pkg.name || '',
      description: pkg.description || '',
      featuresText: (pkg.features || []).join('\n'),
      basePrice: pkg.basePrice ?? 0,
      displayOrder: pkg.displayOrder ?? 0,
      isPopular: Boolean(pkg.isPopular),
      isActive: pkg.isActive !== false,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      features: form.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      basePrice: Number(form.basePrice) || 0,
      displayOrder: Number(form.displayOrder) || 0,
      isPopular: Boolean(form.isPopular),
      isActive: Boolean(form.isActive),
    };

    try {
      if (editing) {
        await updatePackage(editing._id, payload);
        setToast('Package updated.');
      } else {
        await createPackage(payload);
        setToast('Package created.');
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to save package.');
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
      await deletePackage(deleteTarget._id);
      setToast('Package deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to delete package.');
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
          <h1>Packages</h1>
          <p className="admin-crud__intro">
            Manage Essential, Classic, Royal and custom wedding packages.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={openCreate}>
          Add package
        </Button>
      </header>

      {error ? <ErrorMessage message={error} onRetry={load} /> : null}
      {loading ? <LoadingSpinner label="Loading packages…" /> : null}

      {!loading ? (
        <div className="admin-crud__table-wrap">
          <table className="admin-crud__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Features</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((pkg) => (
                <tr key={pkg._id}>
                  <td>
                    <strong>{pkg.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(43,37,34,0.65)' }}>
                      Order {pkg.displayOrder}
                    </div>
                  </td>
                  <td>{(pkg.features || []).length} items</td>
                  <td>
                    <div style={{ display: 'grid', gap: '0.35rem' }}>
                      <span
                        className={`admin-crud__badge ${
                          pkg.isActive ? 'admin-crud__badge--on' : 'admin-crud__badge--off'
                        }`}
                      >
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {pkg.isPopular ? (
                        <span className="admin-crud__badge admin-crud__badge--on">
                          Popular
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div className="admin-crud__actions">
                      <button type="button" onClick={() => openEdit(pkg)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(pkg)}>
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
        title={editing ? 'Edit package' : 'Add package'}
        onClose={() => setFormOpen(false)}
        wide
      >
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__row">
            <label htmlFor="pkg-name">Name</label>
            <input
              id="pkg-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="admin-form__row">
            <label htmlFor="pkg-desc">Description</label>
            <textarea
              id="pkg-desc"
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="admin-form__row">
            <label htmlFor="pkg-features">Features (one per line)</label>
            <textarea
              id="pkg-features"
              value={form.featuresText}
              onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
            />
          </div>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="pkg-price">Base price (optional reference)</label>
              <input
                id="pkg-price"
                type="number"
                min="0"
                value={form.basePrice}
                onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="pkg-order">Display order</label>
              <input
                id="pkg-order"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
              />
            </div>
          </div>
          <label className="admin-form__check">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))}
            />
            Mark as most popular
          </label>
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
              {saving ? 'Saving…' : 'Save package'}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete package?"
        message={deleteTarget ? `Remove “${deleteTarget.name}” permanently?` : ''}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default AdminPackagesPage;
