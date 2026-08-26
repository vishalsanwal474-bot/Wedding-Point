import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import QuoteForm from '../components/QuoteForm';
import Button from '../components/Button';
import { useSettings } from '../context/SettingsContext';
import { buildTelUrl, buildWhatsAppUrl } from '../utils/helpers';
import { EMPTY_INQUIRY_FORM } from '../utils/constants';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';
import './QuotePage.css';

function QuotePage() {
  usePageTitle('Get a Quote');
  const location = useLocation();
  const { settings } = useSettings();

  const prefill = location.state || {};

  const initialValues = useMemo(
    () => ({
      ...EMPTY_INQUIRY_FORM,
      ...(prefill.formValues || {}),
      guestCount:
        prefill.formValues?.guestCount ??
        prefill.calculatorSelections?.guestCount ??
        '',
    }),
    [prefill]
  );

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    'Hello Wedding Point, I would like to request a wedding quote.'
  );
  const telUrl = buildTelUrl(settings.phone);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Get a Quote</p>
          <h1>Tell Us About Your Celebration</h1>
          <p>
            Share your date, location, guest count, and the services you need.
            We’ll respond with a thoughtful plan for your wedding.
          </p>
        </div>
      </header>

      <section className="section-block">
        <div className="container quote-page">
          <div className="quote-page__form">
            <QuoteForm
              initialValues={initialValues}
              estimatedCost={prefill.estimatedCost ?? null}
              calculatorSelections={prefill.calculatorSelections ?? null}
            />
          </div>

          <aside className="quote-page__aside">
            <h2>Prefer to talk first?</h2>
            <p>
              You’re welcome to call or message us directly. For a detailed
              estimate, the inquiry form helps us prepare the right questions.
            </p>

            <ul className="quote-page__contact">
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

            <div className="quote-page__actions">
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
              <Button to="/packages" variant="secondary">
                View Packages
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default QuotePage;
