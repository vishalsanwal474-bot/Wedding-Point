import {
  DEFAULT_PRICING,
  INQUIRY_BUDGET_OPTIONS,
} from './constants';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolvePricingConfig(pricing) {
  return {
    perGuestBase: toNumber(pricing?.perGuestBase, DEFAULT_PRICING.perGuestBase),
    decoration: {
      basic: toNumber(pricing?.decoration?.basic, DEFAULT_PRICING.decoration.basic),
      classic: toNumber(pricing?.decoration?.classic, DEFAULT_PRICING.decoration.classic),
      premium: toNumber(pricing?.decoration?.premium, DEFAULT_PRICING.decoration.premium),
    },
    photography: {
      basic: toNumber(pricing?.photography?.basic, DEFAULT_PRICING.photography.basic),
      standard: toNumber(
        pricing?.photography?.standard,
        DEFAULT_PRICING.photography.standard
      ),
      cinematic: toNumber(
        pricing?.photography?.cinematic,
        DEFAULT_PRICING.photography.cinematic
      ),
    },
    catering: {
      vegetarian: toNumber(
        pricing?.catering?.vegetarian,
        DEFAULT_PRICING.catering.vegetarian
      ),
      standard: toNumber(pricing?.catering?.standard, DEFAULT_PRICING.catering.standard),
      premium: toNumber(pricing?.catering?.premium, DEFAULT_PRICING.catering.premium),
    },
    entertainment: {
      none: toNumber(pricing?.entertainment?.none, DEFAULT_PRICING.entertainment.none),
      dj: toNumber(pricing?.entertainment?.dj, DEFAULT_PRICING.entertainment.dj),
      premium: toNumber(
        pricing?.entertainment?.premium,
        DEFAULT_PRICING.entertainment.premium
      ),
    },
  };
}

export function calculateWeddingEstimate(selections, pricingInput) {
  const pricing = resolvePricingConfig(pricingInput);
  const guestCount = Math.max(0, Math.floor(toNumber(selections.guestCount, 0)));

  const decorationCost = pricing.decoration[selections.decoration] ?? 0;
  const photographyCost = pricing.photography[selections.photography] ?? 0;
  const cateringPerGuest = pricing.catering[selections.catering] ?? 0;
  const entertainmentCost = pricing.entertainment[selections.entertainment] ?? 0;

  const baseGuestCost = guestCount * pricing.perGuestBase;
  const cateringCost = guestCount * cateringPerGuest;

  const total =
    baseGuestCost +
    decorationCost +
    photographyCost +
    cateringCost +
    entertainmentCost;

  return {
    guestCount,
    breakdown: {
      baseGuestCost,
      decorationCost,
      photographyCost,
      cateringCost,
      entertainmentCost,
      cateringPerGuest,
      perGuestBase: pricing.perGuestBase,
    },
    total,
  };
}

export function formatInr(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function mapCalculatorToInquiryServices(selections) {
  const services = ['Wedding Planning'];

  if (selections.decoration) {
    services.push('Decoration');
  }

  if (selections.photography) {
    services.push('Photography');
    if (selections.photography === 'cinematic') {
      services.push('Videography');
    }
  }

  if (selections.catering) {
    services.push('Catering');
  }

  if (selections.entertainment && selections.entertainment !== 'none') {
    services.push('DJ & Entertainment');
  }

  return [...new Set(services)];
}

export function suggestBudgetFromEstimate(total) {
  if (total < 200000) {
    return INQUIRY_BUDGET_OPTIONS[0];
  }
  if (total < 500000) {
    return INQUIRY_BUDGET_OPTIONS[1];
  }
  if (total < 1000000) {
    return INQUIRY_BUDGET_OPTIONS[2];
  }
  return INQUIRY_BUDGET_OPTIONS[3];
}

export function buildQuotePrefillFromCalculator(selections, estimatedCost) {
  return {
    estimatedCost,
    calculatorSelections: {
      guestCount: Number(selections.guestCount) || 0,
      decoration: selections.decoration,
      photography: selections.photography,
      catering: selections.catering,
      entertainment: selections.entertainment,
    },
    formValues: {
      guestCount: String(selections.guestCount || ''),
      services: mapCalculatorToInquiryServices(selections),
      budget: suggestBudgetFromEstimate(estimatedCost),
      message: [
        'I used the package calculator on your website.',
        `Guests: ${selections.guestCount}`,
        `Decoration: ${selections.decoration}`,
        `Photography: ${selections.photography}`,
        `Catering: ${selections.catering}`,
        `Entertainment: ${selections.entertainment}`,
        `Estimated cost shown: ${formatInr(estimatedCost)}`,
      ].join('\n'),
    },
  };
}
