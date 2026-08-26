require('dotenv').config();

const { connectDatabase } = require('../config/db');
const User = require('../models/User');
const Service = require('../models/Service');
const Package = require('../models/Package');
const Testimonial = require('../models/Testimonial');
const { getOrCreateSettings } = require('../services/settingsService');

async function seed() {
  await connectDatabase();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@weddingpoint.local').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'Wedding Point Admin';

  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);
  } else {
    console.log(`Admin already exists: ${admin.email}`);
  }

  const settings = await getOrCreateSettings();
  console.log(`Business settings ready: ${settings.businessName}`);

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: 'Wedding Planning',
        shortDescription: 'Complete planning and coordination from idea to celebration.',
        description:
          'Complete wedding planning and coordination from the first idea to the final celebration.',
        icon: 'ClipboardList',
        displayOrder: 1,
      },
      {
        title: 'Wedding Decorations',
        shortDescription: 'Custom décor designed around your theme and personality.',
        description:
          'Beautiful and customized decorations designed around your wedding theme and personality.',
        icon: 'Sparkles',
        displayOrder: 2,
      },
      {
        title: 'Photography & Videography',
        shortDescription: 'Capture every emotional moment for years to come.',
        description:
          'Capture every emotional moment and preserve your memories for years to come.',
        icon: 'Camera',
        displayOrder: 3,
      },
      {
        title: 'Catering',
        shortDescription: 'Delicious menus and professional catering for your guests.',
        description: 'Delicious menus and professional catering services for your guests.',
        icon: 'UtensilsCrossed',
        displayOrder: 4,
      },
      {
        title: 'DJ & Entertainment',
        shortDescription: 'Professional music and entertainment for an energetic celebration.',
        description: 'Keep your celebration energetic with professional music and entertainment.',
        icon: 'Music',
        displayOrder: 5,
      },
      {
        title: 'Venue & Event Setup',
        shortDescription: 'Venue styling, stage, lighting, seating and arrangements.',
        description:
          'Complete venue styling, stage setup, lighting, seating and event arrangements.',
        icon: 'Building2',
        displayOrder: 6,
      },
    ]);
    console.log('Default services seeded.');
  }

  const packageCount = await Package.countDocuments();
  if (packageCount === 0) {
    await Package.insertMany([
      {
        name: 'Essential',
        description: 'Perfect for intimate celebrations.',
        features: [
          'Basic decoration',
          'Event coordination',
          'Guest assistance',
          'Basic photography',
        ],
        isPopular: false,
        displayOrder: 1,
      },
      {
        name: 'Classic',
        description: 'Our most popular complete wedding package.',
        features: [
          'Complete decoration',
          'Wedding planning',
          'Photography & videography',
          'DJ & entertainment',
          'Event coordination',
        ],
        isPopular: true,
        displayOrder: 2,
      },
      {
        name: 'Royal',
        description: 'A premium celebration with dedicated event management.',
        features: [
          'Premium decoration',
          'Complete wedding planning',
          'Premium photography',
          'Cinematic videography',
          'Entertainment',
          'Catering coordination',
          'Dedicated event manager',
        ],
        isPopular: false,
        displayOrder: 3,
      },
    ]);
    console.log('Default packages seeded.');
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.create({
      name: 'Priya',
      coupleName: 'Priya & Rahul',
      message:
        'Wedding Point made our wedding absolutely beautiful. Everything was organized perfectly, and we could simply enjoy our special day.',
      rating: 5,
      displayOrder: 1,
    });
    console.log('Default testimonial seeded.');
  }

  console.log('\nSeed complete.');
  console.log(`Login with: ${adminEmail}`);
  console.log('Change ADMIN_PASSWORD in server/.env for production.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
