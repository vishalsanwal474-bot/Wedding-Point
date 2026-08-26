import api from './api';

export async function fetchSettings() {
  const { data } = await api.get('/settings');
  return data.data.settings;
}

export async function fetchServices() {
  const { data } = await api.get('/services');
  return data.data.services;
}

export async function fetchPackages() {
  const { data } = await api.get('/packages');
  return data.data.packages;
}

export async function fetchGallery(params = {}) {
  const { data } = await api.get('/gallery', { params });
  return data.data.items;
}

export async function fetchTestimonials() {
  const { data } = await api.get('/testimonials');
  return data.data.testimonials;
}

export async function createInquiry(payload) {
  const { data } = await api.post('/inquiries', payload);
  return data;
}
