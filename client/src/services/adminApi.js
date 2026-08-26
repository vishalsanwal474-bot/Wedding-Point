import api from './api';

export async function fetchInquiryStats() {
  const { data } = await api.get('/inquiries/stats');
  return data.data;
}

export async function fetchDashboardMeta() {
  const { data } = await api.get('/settings/dashboard');
  return data.data;
}

export async function fetchInquiries({ status = 'all', page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (status && status !== 'all') {
    params.status = status;
  }

  const { data } = await api.get('/inquiries', { params });
  return {
    inquiries: data.data.inquiries || [],
    total: data.total || 0,
    page: data.page || 1,
    pages: data.pages || 1,
    count: data.count || 0,
  };
}

export async function fetchInquiryById(id) {
  const { data } = await api.get(`/inquiries/${id}`);
  return data.data.inquiry;
}

export async function updateInquiry(id, payload) {
  const { data } = await api.put(`/inquiries/${id}`, payload);
  return data.data.inquiry;
}

export async function deleteInquiry(id) {
  const { data } = await api.delete(`/inquiries/${id}`);
  return data;
}

function withInactive(params = {}) {
  return { ...params, includeInactive: 'true' };
}

export async function fetchAdminServices() {
  const { data } = await api.get('/services', { params: withInactive() });
  return data.data.services || [];
}

export async function createService(formData) {
  const { data } = await api.post('/services', formData);
  return data.data.service;
}

export async function updateService(id, formData) {
  const { data } = await api.put(`/services/${id}`, formData);
  return data.data.service;
}

export async function deleteService(id) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}

export async function fetchAdminPackages() {
  const { data } = await api.get('/packages', { params: withInactive() });
  return data.data.packages || [];
}

export async function createPackage(payload) {
  const { data } = await api.post('/packages', payload);
  return data.data.package;
}

export async function updatePackage(id, payload) {
  const { data } = await api.put(`/packages/${id}`, payload);
  return data.data.package;
}

export async function deletePackage(id) {
  const { data } = await api.delete(`/packages/${id}`);
  return data;
}

export async function fetchAdminGallery() {
  const { data } = await api.get('/gallery', { params: withInactive() });
  return data.data.items || [];
}

export async function createGalleryItem(formData) {
  const { data } = await api.post('/gallery', formData);
  return data.data.item;
}

export async function updateGalleryItem(id, formData) {
  const { data } = await api.put(`/gallery/${id}`, formData);
  return data.data.item;
}

export async function deleteGalleryItem(id) {
  const { data } = await api.delete(`/gallery/${id}`);
  return data;
}

export async function fetchAdminTestimonials() {
  const { data } = await api.get('/testimonials', { params: withInactive() });
  return data.data.testimonials || [];
}

export async function createTestimonial(formData) {
  const { data } = await api.post('/testimonials', formData);
  return data.data.testimonial;
}

export async function updateTestimonial(id, formData) {
  const { data } = await api.put(`/testimonials/${id}`, formData);
  return data.data.testimonial;
}

export async function deleteTestimonial(id) {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
}

export async function fetchAdminSettings() {
  const { data } = await api.get('/settings');
  return data.data.settings;
}

export async function updateAdminSettings(payload) {
  const { data } = await api.put('/settings', payload);
  return data.data.settings;
}
