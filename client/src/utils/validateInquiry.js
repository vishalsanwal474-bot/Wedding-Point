import {
  INQUIRY_BUDGET_OPTIONS,
  INQUIRY_SERVICE_OPTIONS,
} from './constants';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,19}$/;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function validateInquiryForm(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = 'Name is required.';
  } else if (values.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.phone?.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!values.weddingDate) {
    errors.weddingDate = 'Wedding date is required.';
  } else {
    const selected = new Date(`${values.weddingDate}T00:00:00`);
    if (Number.isNaN(selected.getTime())) {
      errors.weddingDate = 'Enter a valid wedding date.';
    }
  }

  if (!values.weddingLocation?.trim()) {
    errors.weddingLocation = 'Wedding location is required.';
  } else if (values.weddingLocation.trim().length > 200) {
    errors.weddingLocation = 'Location must be 200 characters or fewer.';
  }

  const guestCount = Number(values.guestCount);
  if (!values.guestCount && values.guestCount !== 0) {
    errors.guestCount = 'Guest count is required.';
  } else if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10000) {
    errors.guestCount = 'Guest count must be between 1 and 10,000.';
  }

  if (!Array.isArray(values.services) || values.services.length === 0) {
    errors.services = 'Select at least one service.';
  } else if (values.services.some((item) => !INQUIRY_SERVICE_OPTIONS.includes(item))) {
    errors.services = 'One or more selected services are invalid.';
  }

  if (!values.budget) {
    errors.budget = 'Please select a budget range.';
  } else if (!INQUIRY_BUDGET_OPTIONS.includes(values.budget)) {
    errors.budget = 'Please select a valid budget option.';
  }

  if (values.message && values.message.length > 3000) {
    errors.message = 'Message must be 3,000 characters or fewer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildInquiryPayload(values, extras = {}) {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    weddingDate: values.weddingDate,
    weddingLocation: values.weddingLocation.trim(),
    guestCount: Number(values.guestCount),
    services: values.services,
    budget: values.budget,
    message: values.message?.trim() || '',
  };

  if (extras.estimatedCost !== undefined && extras.estimatedCost !== null && extras.estimatedCost !== '') {
    payload.estimatedCost = Number(extras.estimatedCost);
  }

  if (extras.calculatorSelections && typeof extras.calculatorSelections === 'object') {
    payload.calculatorSelections = extras.calculatorSelections;
  }

  return payload;
}

export function getMinWeddingDate() {
  return todayIsoDate();
}
