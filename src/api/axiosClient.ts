import axios from 'axios';
import { refreshToken } from '../services/user';
import { secureStorage } from '../utils/secureDataUtils';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api-ithelp.fly.dev',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true
});

// Request interceptor - Thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem('token'); // Use secureStorage instead of localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý token hết hạn
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.message && error.message.includes('Network Error')) {
      console.error('Có thể đang gặp lỗi CORS:', error);
    }
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        
        if (newToken) {
          // Use secureStorage instead of localStorage
          secureStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Use secureStorage.removeItem
        secureStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;