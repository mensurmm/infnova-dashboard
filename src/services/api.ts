// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://infnova-intern.vercel.app/api',
});

// 1. Request Interceptor: Automatically attach Bearer token to all API calls
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('infnova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 2. Response Interceptor: Catch 401 errors to gracefully handle Expired Sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Wipe the dead token out of memory
        localStorage.removeItem('infnova_token');
        // Instantly kick the admin out to the login page with an alert tag
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);