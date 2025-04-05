import axios from 'axios';
import { refreshToken } from '../services/user';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api-ithelp.fly.dev',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Tăng timeout lên 15 giây
  withCredentials: true // Quan trọng để gửi cookies qua các domain khác nhau
});

// Request interceptor - Thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    
    // Xử lý lỗi CORS (nếu có)
    if (error.message && error.message.includes('Network Error')) {
      console.error('Có thể đang gặp lỗi CORS:', error);
      // Có thể thực hiện các hành động phù hợp ở đây
    }
    
    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Thử refresh token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Cập nhật token trong header và thử lại request
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Chuyển đến trang đăng nhập nếu không thể refresh token
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;