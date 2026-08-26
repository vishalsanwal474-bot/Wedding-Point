const BusinessSettings = require('../models/BusinessSettings');
const { DEFAULT_PRICING } = require('../utils/constants');

async function getOrCreateSettings() {
  let settings = await BusinessSettings.findOne();

  if (!settings) {
    settings = await BusinessSettings.create({
      businessName: 'Wedding Point',
      tagline: 'Creating Beautiful Weddings, Making Memories Last Forever',
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      email: 'hello@weddingpoint.example',
      address: 'Your City, India',
      yearsExperience: 10,
      weddingsCompleted: 500,
      venuesServed: 50,
      commitmentText: '100%',
      pricing: DEFAULT_PRICING,
    });
  }

  return settings;
}

module.exports = {
  getOrCreateSettings,
};
