import { secureStorage } from './secureDataUtils';

// Thời gian không hoạt động tối đa trước khi phiên hết hạn (milliseconds)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 phút

// Lưu thời gian hoạt động cuối cùng
export const updateLastActivity = () => {
  secureStorage.setItem('lastActivityTime', Date.now());
};

// Kiểm tra xem phiên có hết hạn do không hoạt động không
export const isSessionExpired = () => {
  const lastActivity = secureStorage.getItem('lastActivityTime');
  if (!lastActivity) return true;
  
  const now = Date.now();
  return now - lastActivity > INACTIVITY_TIMEOUT;
};

// Thiết lập sự kiện người dùng để cập nhật hoạt động
export const setupActivityTracking = () => {
  // Cập nhật thời gian hoạt động cuối cùng khi load
  updateLastActivity();
  
  // Theo dõi các tương tác người dùng
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  const activityHandler = () => {
    updateLastActivity();
  };
  
  events.forEach(event => {
    document.addEventListener(event, activityHandler, { passive: true });
  });
  
  // Hàm dọn dẹp khi không còn cần nữa
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, activityHandler);
    });
  };
};