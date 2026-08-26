export function buildWhatsAppUrl(whatsapp, message) {
  if (!whatsapp) {
    return null;
  }

  const digits = String(whatsapp).replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  const text = encodeURIComponent(
    message ||
      'Hello Wedding Point, I would like to know more about your wedding services.'
  );

  return `https://wa.me/${digits}?text=${text}`;
}

export function buildTelUrl(phone) {
  if (!phone) {
    return null;
  }

  const cleaned = String(phone).replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : null;
}

export function formatPageTitle(pageName, businessName = 'Wedding Point') {
  if (!pageName) {
    return businessName;
  }
  return `${pageName} | ${businessName}`;
}
