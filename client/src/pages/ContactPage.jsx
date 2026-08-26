import Button from '../components/Button';
import { useSettings } from '../context/SettingsContext';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/helpers';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';

function ContactPage() {
  usePageTitle('Contact');
  const { settings } = useSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp);
  const telUrl = buildTelUrl(settings.phone);

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
                  <p>{settings.address}</p>
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
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
