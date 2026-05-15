import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматическое добавление токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Для отладки в консоли (можно убрать позже)
console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api');

export default api;