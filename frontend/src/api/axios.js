import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Добавляем токен автоматически
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ГЛОБАЛЬНАЯ ЗАМЕНА http → https (исправляет Mixed Content)
api.interceptors.response.use(
  (response) => {
    // Заменяем http на https во всех строках ответа (особенно для изображений)
    if (response.data && typeof response.data === 'object') {
      const replaceHttp = (obj) => {
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'string' && obj[key].startsWith('http://')) {
            obj[key] = obj[key].replace('http://', 'https://');
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            replaceHttp(obj[key]);
          }
        });
      };
      replaceHttp(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid');
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');

      if (window.toast) {
        window.toast.error('Сессия истекла. Войдите заново.');
      }
    }
    return Promise.reject(error);
  }
);

// Для отладки
console.log('🚀 API Base URL:', import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api');

export default api;