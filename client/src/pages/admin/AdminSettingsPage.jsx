import { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Toast from '../../components/admin/Toast';
import { fetchAdminSettings, updateAdminSettings } from '../../services/adminApi';
import { useSettings } from '../../context/SettingsContext';
import { DEFAULT_PRICING } from '../../utils/constants';
import { normalizeMapEmbedUrl, resolveContactMapUrl } from '../../utils/helpers';
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
        mapEmbedUrl: settings.mapEmbedUrl || '',
        mapLatitude:
          settings.mapLatitude === null || settings.mapLatitude === undefined
            ? ''
            : String(settings.mapLatitude),
        mapLongitude:
          settings.mapLongitude === null || settings.mapLongitude === undefined
            ? ''
            : String(settings.mapLongitude),
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

    const mapEmbedUrl = normalizeMapEmbedUrl(form.mapEmbedUrl);
    if (form.mapEmbedUrl.trim() && mapEmbedUrl === null) {
      setError(
        'Map embed must be a Google Maps embed URL, place link, or iframe HTML from Google Maps Share → Embed a map.'
      );
      return;
    }

    const mapLatitude =
      form.mapLatitude === '' || form.mapLatitude === null
        ? null
        : Number(form.mapLatitude);
    const mapLongitude =
      form.mapLongitude === '' || form.mapLongitude === null
        ? null
        : Number(form.mapLongitude);

    if (
      form.mapLatitude !== '' &&
      (mapLatitude === null ||
        Number.isNaN(mapLatitude) ||
        mapLatitude < -90 ||
        mapLatitude > 90)
    ) {
      setError('Latitude must be a number between -90 and 90.');
      return;
    }

    if (
      form.mapLongitude !== '' &&
      (mapLongitude === null ||
        Number.isNaN(mapLongitude) ||
        mapLongitude < -180 ||
        mapLongitude > 180)
    ) {
      setError('Longitude must be a number between -180 and 180.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        businessName: form.businessName,
        tagline: form.tagline,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
        mapEmbedUrl: mapEmbedUrl || '',
        mapLatitude,
        mapLongitude,
        instagram: form.instagram,
        facebook: form.facebook,
        youtube: form.youtube,
        yearsExperience: Number(form.yearsExperience) || 0,
        weddingsCompleted: Number(form.weddingsCompleted) || 0,
        venuesServed: Number(form.venuesServed) || 0,
        commitmentText: form.commitmentText,
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
        businessName: saved.businessName || '',
        tagline: saved.tagline || '',
        phone: saved.phone || '',
        whatsapp: saved.whatsapp || '',
        email: saved.email || '',
        address: saved.address || '',
        mapEmbedUrl: saved.mapEmbedUrl || '',
        mapLatitude:
          saved.mapLatitude === null || saved.mapLatitude === undefined
            ? ''
            : String(saved.mapLatitude),
        mapLongitude:
          saved.mapLongitude === null || saved.mapLongitude === undefined
            ? ''
            : String(saved.mapLongitude),
        instagram: saved.instagram || '',
        facebook: saved.facebook || '',
        youtube: saved.youtube || '',
        yearsExperience: saved.yearsExperience ?? 0,
        weddingsCompleted: saved.weddingsCompleted ?? 0,
        venuesServed: saved.venuesServed ?? 0,
        commitmentText: saved.commitmentText || '',
        pricing: resolvePricingConfig(saved.pricing),
      });
      await refreshSettings();
      setToast('Settings saved. Map updated on Contact page.');
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

  const mapPreviewUrl = resolveContactMapUrl(form);

  return (
    <div className="admin-settings">
      <header className="admin-crud__header">
        <div>
          <p className="admin-crud__eyebrow">Business</p>
          <h1>Settings</h1>
          <p className="admin-crud__intro">
            Update contact details, map location, statistics, social links, and
            calculator pricing used across the website.
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
        </section>

        <section className="admin-settings__section">
          <h2>Location &amp; map</h2>
          <p className="admin-settings__hint">
            This address and map are saved with your settings and shown on the
            public Contact page.
          </p>
          <div className="admin-form__row">
            <label htmlFor="set-address">Address</label>
            <input
              id="set-address"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Street, City, State"
            />
          </div>
          <div className="admin-form__grid admin-form__grid--2">
            <div className="admin-form__row">
              <label htmlFor="set-lat">Map latitude</label>
              <input
                id="set-lat"
                type="number"
                step="any"
                min="-90"
                max="90"
                value={form.mapLatitude}
                onChange={(e) => updateField('mapLatitude', e.target.value)}
                placeholder="28.6139"
              />
            </div>
            <div className="admin-form__row">
              <label htmlFor="set-lng">Map longitude</label>
              <input
                id="set-lng"
                type="number"
                step="any"
                min="-180"
                max="180"
                value={form.mapLongitude}
                onChange={(e) => updateField('mapLongitude', e.target.value)}
                placeholder="77.2090"
              />
            </div>
          </div>
          <p className="admin-settings__hint">
            Right-click your place on Google Maps and copy the coordinates here
            for an exact pin.
          </p>
          <div className="admin-form__row">
            <label htmlFor="set-map">Google Maps embed (optional)</label>
            <textarea
              id="set-map"
              rows={4}
              value={form.mapEmbedUrl}
              onChange={(e) => updateField('mapEmbedUrl', e.target.value)}
              placeholder="Paste embed URL, place link, or iframe from Google Maps → Share → Embed a map"
            />
            <p className="admin-settings__hint">
              Optional. If set, this overrides coordinates / address for the map.
            </p>
          </div>
          {mapPreviewUrl ? (
            <div className="admin-settings__map-block">
              <h3>Saved map preview</h3>
              {form.address ? (
                <p className="admin-settings__map-address">{form.address}</p>
              ) : null}
              <div className="admin-settings__map-preview">
                <iframe
                  title="Map preview"
                  src={mapPreviewUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <p className="admin-settings__hint">
              Add an address, coordinates, or embed URL to preview and save the
              map.
            </p>
          )}
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
