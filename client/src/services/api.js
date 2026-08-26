import axios from 'axios';
import {
  clearAuthSession,
  emitAuthExpired,
  getStoredToken,
} from '../utils/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      clearAuthSession();
      emitAuthExpired();
    }

    const normalized = new Error(message);
    normalized.status = status;
    normalized.details = error.response?.data?.details || null;
    normalized.original = error;

    return Promise.reject(normalized);
  }
);

export default api;
