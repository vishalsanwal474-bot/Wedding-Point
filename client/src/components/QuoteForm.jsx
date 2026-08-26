import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Button from './Button';
import ErrorMessage from './ErrorMessage';
import { createInquiry } from '../services/publicApi';
import {
  EMPTY_INQUIRY_FORM,
  INQUIRY_BUDGET_OPTIONS,
  INQUIRY_SERVICE_OPTIONS,
} from '../utils/constants';
import {
  buildInquiryPayload,
  getMinWeddingDate,
  validateInquiryForm,
} from '../utils/validateInquiry';
import './QuoteForm.css';

function formatCurrency(amount) {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return null;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function QuoteForm({
  initialValues = {},
  estimatedCost = null,
  calculatorSelections = null,
}) {
  const formId = useId();
  const successRef = useRef(null);
  const [values, setValues] = useState(() => ({
    ...EMPTY_INQUIRY_FORM,
    ...initialValues,
    services: Array.isArray(initialValues.services)
      ? initialValues.services
      : EMPTY_INQUIRY_FORM.services,
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(null);

  const minDate = useMemo(() => getMinWeddingDate(), []);
  const estimatedLabel = formatCurrency(estimatedCost);

  useEffect(() => {
    if (success) {
      successRef.current?.focus();
    }
  }, [success]);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const toggleService = (service) => {
    setValues((current) => {
      const exists = current.services.includes(service);
      return {
        ...current,
        services: exists
          ? current.services.filter((item) => item !== service)
          : [...current.services, service],
      };
    });
    setErrors((current) => {
      if (!current.services) {
        return current;
      }
      const next = { ...current };
      delete next.services;
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const result = validateInquiryForm(values);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = buildInquiryPayload(values, {
        estimatedCost,
        calculatorSelections,
      });
      const response = await createInquiry(payload);

      setSuccess({
        message:
          response.message ||
          'Inquiry submitted successfully. We will contact you soon.',
        name: values.name.trim(),
      });
      setValues({ ...EMPTY_INQUIRY_FORM });
    } catch (error) {
      if (Array.isArray(error.details) && error.details.length > 0) {
        setSubmitError(error.details.join(' '));
      } else {
        setSubmitError(
          error.message || 'Unable to submit your inquiry. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="quote-success"
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <p className="quote-success__eyebrow">Inquiry received</p>
        <h2>Thank you{success.name ? `, ${success.name}` : ''}.</h2>
        <p>{success.message}</p>
        <p className="quote-success__note">
          Our team will review your details and reach out shortly to continue
          planning your celebration.
        </p>
        <div className="quote-success__actions">
          <Button
            type="button"
            variant="primary"
            onClick={() => setSuccess(null)}
          >
            Send Another Inquiry
          </Button>
          <Button to="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      {(estimatedLabel || calculatorSelections) && (
        <aside className="quote-form__summary" aria-label="Package estimate">
          {estimatedLabel ? (
            <p>
              Estimated cost from calculator:{' '}
              <strong>{estimatedLabel}</strong>
            </p>
          ) : null}
          {calculatorSelections ? (
            <p className="quote-form__summary-note">
              Your calculator selections will be included with this inquiry.
              Final pricing may vary based on your requirements.
            </p>
          ) : null}
        </aside>
      )}

      {submitError ? <ErrorMessage message={submitError} /> : null}

      <div className="quote-form__grid">
        <div className="quote-field">
          <label htmlFor={`${formId}-name`}>Full name</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          />
          {errors.name ? (
            <p id={`${formId}-name-error`} className="quote-field__error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="quote-field">
          <label htmlFor={`${formId}-email`}>Email</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          />
          {errors.email ? (
            <p id={`${formId}-email-error`} className="quote-field__error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="quote-field">
          <label htmlFor={`${formId}-phone`}>Phone</label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={values.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
          />
          {errors.phone ? (
            <p id={`${formId}-phone-error`} className="quote-field__error">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="quote-field">
          <label htmlFor={`${formId}-date`}>Wedding date</label>
          <input
            id={`${formId}-date`}
            name="weddingDate"
            type="date"
            min={minDate}
            value={values.weddingDate}
            onChange={(event) => updateField('weddingDate', event.target.value)}
            aria-invalid={Boolean(errors.weddingDate)}
            aria-describedby={
              errors.weddingDate ? `${formId}-date-error` : undefined
            }
          />
          {errors.weddingDate ? (
            <p id={`${formId}-date-error`} className="quote-field__error">
              {errors.weddingDate}
            </p>
          ) : null}
        </div>

        <div className="quote-field quote-field--wide">
          <label htmlFor={`${formId}-location`}>Wedding location</label>
          <input
            id={`${formId}-location`}
            name="weddingLocation"
            type="text"
            placeholder="City, venue, or area"
            value={values.weddingLocation}
            onChange={(event) =>
              updateField('weddingLocation', event.target.value)
            }
            aria-invalid={Boolean(errors.weddingLocation)}
            aria-describedby={
              errors.weddingLocation ? `${formId}-location-error` : undefined
            }
          />
          {errors.weddingLocation ? (
            <p id={`${formId}-location-error`} className="quote-field__error">
              {errors.weddingLocation}
            </p>
          ) : null}
        </div>

        <div className="quote-field">
          <label htmlFor={`${formId}-guests`}>Number of guests</label>
          <input
            id={`${formId}-guests`}
            name="guestCount"
            type="number"
            min="1"
            max="10000"
            inputMode="numeric"
            value={values.guestCount}
            onChange={(event) => updateField('guestCount', event.target.value)}
            aria-invalid={Boolean(errors.guestCount)}
            aria-describedby={
              errors.guestCount ? `${formId}-guests-error` : undefined
            }
          />
          {errors.guestCount ? (
            <p id={`${formId}-guests-error`} className="quote-field__error">
              {errors.guestCount}
            </p>
          ) : null}
        </div>

        <div className="quote-field">
          <label htmlFor={`${formId}-budget`}>Budget</label>
          <select
            id={`${formId}-budget`}
            name="budget"
            value={values.budget}
            onChange={(event) => updateField('budget', event.target.value)}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={
              errors.budget ? `${formId}-budget-error` : undefined
            }
          >
            <option value="">Select a budget range</option>
            {INQUIRY_BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.budget ? (
            <p id={`${formId}-budget-error`} className="quote-field__error">
              {errors.budget}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset
        className="quote-fieldset"
        aria-describedby={errors.services ? `${formId}-services-error` : undefined}
      >
        <legend>Services interested in</legend>
        <div className="quote-services">
          {INQUIRY_SERVICE_OPTIONS.map((service) => {
            const checked = values.services.includes(service);
            const inputId = `${formId}-service-${service.replace(/\s+/g, '-').toLowerCase()}`;

            return (
              <label key={service} htmlFor={inputId} className="quote-check">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleService(service)}
                />
                <span>{service}</span>
              </label>
            );
          })}
        </div>
        {errors.services ? (
          <p id={`${formId}-services-error`} className="quote-field__error">
            {errors.services}
          </p>
        ) : null}
      </fieldset>

      <div className="quote-field quote-field--wide">
        <label htmlFor={`${formId}-message`}>Message</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows="5"
          placeholder="Tell us about your vision, preferred style, or any special requests."
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${formId}-message-error` : undefined
          }
        />
        {errors.message ? (
          <p id={`${formId}-message-error`} className="quote-field__error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="quote-form__footer">
        <p className="quote-form__privacy">
          We use your details only to respond to this wedding inquiry.
        </p>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Inquiry'}
        </Button>
      </div>
    </form>
  );
}

export default QuoteForm;
