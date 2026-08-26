import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/admin/Toast';
import { fetchAdminSettings, updateAdminSettings } from '../../services/adminApi';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_PRICING } from '../../utils/constants';
import { resolvePricingConfig } from '../../utils/pricing';
import usePageTitle from '../../hooks/usePageTitle';
import '../../components/admin/FormModal.css';
import './AdminSettingsPage.css';

function AdminSettingsPage() {
  usePageTitle('Settings');
  const { refreshSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await fetchAdminSettings();
      setForm({
        businessName: settings.businessName || '',
        tagline: settings.tagline || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        address: settings.address || '',
        instagram: settings.instagram || '',
        facebook: settings.facebook || '',
        youtube: settings.youtube || '',
        yearsExperience: settings.yearsExperience ?? 10,
        weddingsCompleted: settings.weddingsCompleted ?? 500,
        venuesServed: settings.venuesServed ?? 50,
        commitmentText: settings.commitmentText || '100%',
        pricing: resolvePricingConfig(settings.pricing || DEFAULT_PRICING),
      });
    } catch (err) {
      setError(err.message || 'Unable to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updatePricing = (group, key, value) => {
    setForm((current) => {
      if (group === 'perGuestBase') {
        return {
          ...current,
          pricing: { ...current.pricing, perGuestBase: value },
        };
      }

      return {
        ...current,
        pricing: {
          ...current.pricing,
          [group]: {
            ...current.pricing[group],
            [key]: value,
          },
        },
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        yearsExperience: Number(form.yearsExperience) || 0,
        weddingsCompleted: Number(form.weddingsCompleted) || 0,
        venuesServed: Number(form.venuesServed) || 0,
        pricing: {
          perGuestBase: Number(form.pricing.perGuestBase) || 0,
          decoration: {
            basic: Number(form.pricing.decoration.basic) || 0,
            classic: Number(form.pricing.decoration.classic) || 0,
            premium: Number(form.pricing.decoration.premium) || 0,
          },
          photography: {
            basic: Number(form.pricing.photography.basic) || 0,
            standard: Number(form.pricing.photography.standard) || 0,
            cinematic: Number(form.pricing.photography.cinematic) || 0,
          },
          catering: {
            vegetarian: Number(form.pricing.catering.vegetarian) || 0,
            standard: Number(form.pricing.catering.standard) || 0,
            premium: Number(form.pricing.catering.premium) || 0,
          },
          entertainment: {
            none: Number(form.pricing.entertainment.none) || 0,
            dj: Number(form.pricing.entertainment.dj) || 0,
            premium: Number(form.pricing.entertainment.premium) || 0,
          },
        },
      };

      const saved = await updateAdminSettings(payload);
      setForm({
        ...payload,
        pricing: resolvePricingConfig(saved.pricing),
      });
      await refreshSettings();
      setToast('Settings saved.');
    } catch (err) {
      setError(err.message || 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading settings…" />;
  }

  if (!form) {
    return <ErrorMessage message={error || 'Settings unavailable.'} onRetry={load} />;
  }

  return (
    <div className="admin-settings">
      <header className="admin-crud__header">
        <div>
          <p className="admin-crud__eyebrow">Business</p>
          <h1>Settings</h1>
          <p className="admin-crud__intro">
            Update contact details, statistics, social links, and calculator
            pricing used across the website.
          </p>
        </div>
      </header>

      {error ? <ErrorMessage message={error} /> : null}

      <form className="admin-form admin-settings__form" onSubmit={handleSubmit}>
        <section className="admin-settings__section">
          <h2>Business profile</h2>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="set-name">Business name</label>
              <input
                id="set-name"
                required
                value={form.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-email">Email</label>
              <input
                id="set-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
          </div>
          <div className="admin-form__row">
            <label htmlFor="set-tagline">Tagline</label>
            <input
              id="set-tagline"
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
            />
          </div>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="set-phone">Phone</label>
              <input
                id="set-phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-whatsapp">WhatsApp</label>
              <input
                id="set-whatsapp"
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                placeholder="919876543210"
              />
            </div>
          </div>
          <div className="admin-form__row">
            <label htmlFor="set-address">Address</label>
            <input
              id="set-address"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
            />
          </div>
        </section>

        <section className="admin-settings__section">
          <h2>Statistics</h2>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="set-years">Years of experience</label>
              <input
                id="set-years"
                type="number"
                min="0"
                value={form.yearsExperience}
                onChange={(e) => updateField('yearsExperience', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-weddings">Weddings completed</label>
              <input
                id="set-weddings"
                type="number"
                min="0"
                value={form.weddingsCompleted}
                onChange={(e) => updateField('weddingsCompleted', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-venues">Venues served</label>
              <input
                id="set-venues"
                type="number"
                min="0"
                value={form.venuesServed}
                onChange={(e) => updateField('venuesServed', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-commit">Commitment text</label>
              <input
                id="set-commit"
                value={form.commitmentText}
                onChange={(e) => updateField('commitmentText', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="admin-settings__section">
          <h2>Social links</h2>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="set-ig">Instagram</label>
              <input
                id="set-ig"
                value={form.instagram}
                onChange={(e) => updateField('instagram', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-fb">Facebook</label>
              <input
                id="set-fb"
                value={form.facebook}
                onChange={(e) => updateField('facebook', e.target.value)}
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-yt">YouTube</label>
              <input
                id="set-yt"
                value={form.youtube}
                onChange={(e) => updateField('youtube', e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="admin-settings__section">
          <h2>Package calculator pricing</h2>
          <p className="admin-settings__hint">
            These values power the public package calculator. Amounts are in INR.
          </p>

          <div className="admin-form__row">
            <label htmlFor="price-base">Per guest base</label>
            <input
              id="price-base"
              type="number"
              min="0"
              value={form.pricing.perGuestBase}
              onChange={(e) => updatePricing('perGuestBase', null, e.target.value)}
            />
          </div>

          {[
            ['decoration', ['basic', 'classic', 'premium']],
            ['photography', ['basic', 'standard', 'cinematic']],
            ['catering', ['vegetarian', 'standard', 'premium']],
            ['entertainment', ['none', 'dj', 'premium']],
          ].map(([group, keys]) => (
            <div key={group} className="admin-settings__price-group">
              <h3>{group}</h3>
              <div className="admin-form__grid admin-form__grid--2">
                {keys.map((key) => (
                  <div className="admin-form__row" key={`${group}-${key}`}>
                    <label htmlFor={`price-${group}-${key}`}>{key}</label>
                    <input
                      id={`price-${group}-${key}`}
                      type="number"
                      min="0"
                      value={form.pricing[group][key]}
                      onChange={(e) => updatePricing(group, key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="admin-form__actions">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}

export default AdminSettingsPage;
