import Button from '../components/Button';
import { useSettings } from '../context/SettingsContext';
import {
  buildGoogleMapsLink,
  buildTelUrl,
  buildWhatsAppUrl,
  resolveContactMapUrl,
} from '../utils/helpers';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function ContactPage() {
  usePageTitle('Contact');
  const { settings } = useSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp);
  const telUrl = buildTelUrl(settings.phone);
  const mapEmbedUrl = resolveContactMapUrl(settings);
  const mapsLink = buildGoogleMapsLink(settings);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Contact</p>
          <h1>Let’s Talk About Your Wedding</h1>
          <p>
            Reach out by phone, WhatsApp, or email — or send a detailed inquiry
            through our quote form.
          </p>
        </div>
      </header>

      <section className="section-block">
        <div className="container contact-page">
          <div className="contact-page__details">
            <h2>Contact Details</h2>
            <ul>
              {settings.phone ? (
                <li>
                  <span>Phone</span>
                  <a href={telUrl || undefined}>{settings.phone}</a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <span>Email</span>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              ) : null}
              {settings.address ? (
                <li>
                  <span>Location</span>
                  {mapsLink ? (
                    <a href={mapsLink} target="_blank" rel="noreferrer">
                      {settings.address}
                    </a>
                  ) : (
                    <p>{settings.address}</p>
                  )}
                </li>
              ) : null}
            </ul>

            <div className="contact-page__actions">
              <Button to="/quote" variant="primary">
                Get a Quote
              </Button>
              {whatsappUrl ? (
                <Button
                  href={whatsappUrl}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp
                </Button>
              ) : null}
              {telUrl ? (
                <Button href={telUrl} variant="secondary">
                  Call Us
                </Button>
              ) : null}
            </div>
          </div>

          {mapEmbedUrl ? (
            <div className="contact-page__map">
              <h2>Find Us</h2>
              {settings.address ? (
                <p className="contact-page__map-address">{settings.address}</p>
              ) : null}
              <div className="contact-page__map-frame">
                <iframe
                  title={`${settings.businessName || 'Wedding Point'} location`}
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              {mapsLink ? (
                <a
                  className="contact-page__map-link"
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
