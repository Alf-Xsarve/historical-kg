import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд
});

// Добавляем токен автоматически
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок (особенно 401 - токен истёк)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid');
      
      // Очищаем токены
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');

      // Можно добавить редирект на логин (по желанию)
      // window.location.href = '/login';
      
      // Показываем уведомление (если используется toast)
      if (window.toast) {
        window.toast.error('Сессия истекла. Пожалуйста, войдите заново.');
      }
    }
    return Promise.reject(error);
  }
);

// Для отладки
console.log('🚀 API Base URL:', import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api');

export default api;