import api from './api';
import { clearAuthSession, storeAuthSession } from '../utils/authStorage';

export async function loginAdmin({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  const session = data.data;
  storeAuthSession(session);
  return session;
}

export async function fetchCurrentAdmin() {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}

export function logoutAdmin() {
  clearAuthSession();
}
