import axiosClient from '../api/axiosClient';
import { secureStorage } from '../utils/secureDataUtils';

// Kiểm tra quyền người dùng
export const checkPermission = (requiredRole) => {
  const user = secureStorage.getItem('user');
  if (!user || !user.role) return false;
  
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  
  return true; // Mặc định cho người dùng thông thường
};

// Ghi log sự cố bảo mật
export const logSecurityEvent = async (eventType, details) => {
  try {
    const user = secureStorage.getItem('user');
    const userId = user?.id || 'unauthenticated';
    
    await axiosClient.post('/security-log', {
      eventType,
      userId,
      timestamp: new Date().toISOString(),
      details,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // IP thực được ghi nhận ở server
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Kiểm tra tính hợp lệ của dữ liệu đầu vào
export const validateInput = (value, type) => {
  if (value === null || value === undefined) return false;
  
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'password':
      // Mật khẩu ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số
      return value.length >= 8 && 
        /[A-Z]/.test(value) && 
        /[a-z]/.test(value) && 
        /[0-9]/.test(value);
    case 'text':
      return typeof value === 'string' && value.trim().length > 0;
    case 'number':
      return !isNaN(parseFloat(value)) && isFinite(value);
    case 'phone':
      return /^\+?[0-9]{10,15}$/.test(value.replace(/\s+/g, ''));
    case 'date':
      return !isNaN(Date.parse(value));
    default:
      return true;
  }
};