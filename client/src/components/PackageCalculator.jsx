import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useSettings } from '../context/SettingsContext';
import {
  CALCULATOR_OPTIONS,
  DEFAULT_CALCULATOR_SELECTIONS,
} from '../utils/constants';
import {
  buildQuotePrefillFromCalculator,
  calculateWeddingEstimate,
  formatInr,
  resolvePricingConfig,
} from '../utils/pricing';
import './PackageCalculator.css';

function OptionGroup({ legend, name, options, value, onChange, pricingGroup }) {
  const groupId = useId();

  return (
    <fieldset className="package-calc__fieldset">
      <legend>{legend}</legend>
      <div className="package-calc__options" role="radiogroup" aria-labelledby={`${groupId}-legend`}>
        <span id={`${groupId}-legend`} className="visually-hidden">
          {legend}
        </span>
        {options.map((option) => {
          const inputId = `${groupId}-${option.value}`;
          const price = pricingGroup?.[option.value];
          const isPerGuest = name === 'catering';

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`package-calc__option ${
                value === option.value ? 'package-calc__option--active' : ''
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="package-calc__option-label">{option.label}</span>
              {typeof price === 'number' ? (
                <span className="package-calc__option-price">
                  {formatInr(price)}
                  {isPerGuest ? ' / guest' : ''}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function PackageCalculator() {
  const navigate = useNavigate();
  const { settings, loading } = useSettings();
  const guestsId = useId();
  const [selections, setSelections] = useState(DEFAULT_CALCULATOR_SELECTIONS);

  const pricing = useMemo(
    () => resolvePricingConfig(settings.pricing),
    [settings.pricing]
  );

  const estimate = useMemo(
    () => calculateWeddingEstimate(selections, pricing),
    [selections, pricing]
  );

  const updateSelection = (field, value) => {
    setSelections((current) => ({ ...current, [field]: value }));
  };

  const handleRequestPackage = () => {
    const guestCount = Number(selections.guestCount);
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return;
    }

    navigate('/quote', {
      state: buildQuotePrefillFromCalculator(selections, estimate.total),
    });
  };

  const guestInvalid =
    !selections.guestCount ||
    Number(selections.guestCount) < 1 ||
    Number(selections.guestCount) > 10000;

  return (
    <div className="package-calc">
      <div className="package-calc__intro">
        <p className="package-calc__eyebrow">Package Calculator</p>
        <h3>Estimate Your Wedding Cost</h3>
        <p>
          Adjust guests and service levels for an instant estimate. Pricing is
          configurable by Wedding Point and may change with your final brief.
        </p>
        {loading ? (
          <p className="package-calc__loading">Loading current pricing…</p>
        ) : null}
      </div>

      <div className="package-calc__layout">
        <div className="package-calc__controls">
          <div className="package-calc__guests">
            <label htmlFor={guestsId}>Number of guests</label>
            <input
              id={guestsId}
              type="number"
              min="1"
              max="10000"
              inputMode="numeric"
              value={selections.guestCount}
              onChange={(event) =>
                updateSelection('guestCount', event.target.value)
              }
              aria-invalid={guestInvalid}
            />
          </div>

          <OptionGroup
            legend="Decoration"
            name="decoration"
            options={CALCULATOR_OPTIONS.decoration}
            value={selections.decoration}
            onChange={(value) => updateSelection('decoration', value)}
            pricingGroup={pricing.decoration}
          />

          <OptionGroup
            legend="Photography"
            name="photography"
            options={CALCULATOR_OPTIONS.photography}
            value={selections.photography}
            onChange={(value) => updateSelection('photography', value)}
            pricingGroup={pricing.photography}
          />

          <OptionGroup
            legend="Catering"
            name="catering"
            options={CALCULATOR_OPTIONS.catering}
            value={selections.catering}
            onChange={(value) => updateSelection('catering', value)}
            pricingGroup={pricing.catering}
          />

          <OptionGroup
            legend="Entertainment"
            name="entertainment"
            options={CALCULATOR_OPTIONS.entertainment}
            value={selections.entertainment}
            onChange={(value) => updateSelection('entertainment', value)}
            pricingGroup={pricing.entertainment}
          />
        </div>

        <aside className="package-calc__result" aria-live="polite">
          <p className="package-calc__result-label">Estimated Cost</p>
          <p className="package-calc__result-value">{formatInr(estimate.total)}</p>
          <p className="package-calc__disclaimer">
            Final pricing may vary based on your requirements.
          </p>

          <ul className="package-calc__breakdown">
            <li>
              <span>Base coordination</span>
              <strong>{formatInr(estimate.breakdown.baseGuestCost)}</strong>
            </li>
            <li>
              <span>Decoration</span>
              <strong>{formatInr(estimate.breakdown.decorationCost)}</strong>
            </li>
            <li>
              <span>Photography</span>
              <strong>{formatInr(estimate.breakdown.photographyCost)}</strong>
            </li>
            <li>
              <span>Catering</span>
              <strong>{formatInr(estimate.breakdown.cateringCost)}</strong>
            </li>
            <li>
              <span>Entertainment</span>
              <strong>{formatInr(estimate.breakdown.entertainmentCost)}</strong>
            </li>
          </ul>

          <Button
            type="button"
            variant="primary"
            className="package-calc__cta"
            onClick={handleRequestPackage}
            disabled={guestInvalid}
          >
            Request This Package
          </Button>
        </aside>
      </div>
    </div>
  );
}

export default PackageCalculator;
