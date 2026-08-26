import Button from './Button';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/helpers';
import { useSettings } from '../context/SettingsContext';
import './CtaBanner.css';

function CtaBanner() {
  const { settings } = useSettings();
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp);
  const telUrl = buildTelUrl(settings.phone);

  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <div>
          <p className="cta-banner__eyebrow">Begin Your Journey</p>
          <h2>Let’s Create a Wedding You’ll Always Remember</h2>
          <p className="cta-banner__text">
            Share your date, vision, and preferences — we’ll help shape a
            celebration that feels uniquely yours.
          </p>
        </div>

        <div className="cta-banner__actions">
          <Button to="/quote" variant="primary">
            Request a Quote
          </Button>
          {whatsappUrl ? (
            <Button href={whatsappUrl} variant="secondary" target="_blank" rel="noreferrer">
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
    </section>
  );
}

export default CtaBanner;
