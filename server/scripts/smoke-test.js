#!/usr/bin/env node
/* Simple production/dev smoke checks for the Wedding Point API. */

const base = process.env.API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (_error) {
    body = text;
  }

  return { status: response.status, body };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  console.log(`Smoke testing ${base}`);

  const health = await request('/health');
  assert(health.status === 200 && health.body?.success, 'Health check failed');

  const settings = await request('/settings');
  assert(settings.status === 200 && settings.body?.data?.settings, 'Settings failed');

  const services = await request('/services');
  assert(services.status === 200 && Array.isArray(services.body?.data?.services), 'Services failed');

  const packages = await request('/packages');
  assert(packages.status === 200 && Array.isArray(packages.body?.data?.packages), 'Packages failed');

  const gallery = await request('/gallery');
  assert(gallery.status === 200 && Array.isArray(gallery.body?.data?.items), 'Gallery failed');

  const testimonials = await request('/testimonials');
  assert(
    testimonials.status === 200 && Array.isArray(testimonials.body?.data?.testimonials),
    'Testimonials failed'
  );

  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || 'admin@weddingpoint.local',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    }),
  });
  assert(login.status === 200 && login.body?.data?.token, 'Admin login failed');

  const token = login.body.data.token;
  const me = await request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(me.status === 200 && me.body?.data?.user?.email, 'Auth me failed');

  const stats = await request('/inquiries/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(stats.status === 200 && typeof stats.body?.data?.total === 'number', 'Inquiry stats failed');

  const unauthorized = await request('/inquiries');
  assert(unauthorized.status === 401, 'Inquiries should require auth');

  const invalid = await request('/inquiries', {
    method: 'POST',
    body: JSON.stringify({ name: '' }),
  });
  assert(invalid.status === 422, 'Invalid inquiry should return 422');

  console.log('All smoke checks passed.');
}

run().catch((error) => {
  console.error('Smoke test failed:', error.message);
  process.exit(1);
});
