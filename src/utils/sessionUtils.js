import { secureStorage } from "./secureDataUtils";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000;
const ACTIVITY_TIMESTAMP_KEY = "lastActivityTime";

/**
 * Cập nhật timestamp hoạt động cuối cùng
 */
export const updateLastActivity = () => {
  try {
    const now = Date.now();
    secureStorage.setItem(ACTIVITY_TIMESTAMP_KEY, now);
  } catch (error) {
    // console.error("Error updating last activity timestamp");
  }
};

/**
 * Kiểm tra xem phiên làm việc có hết hạn do không hoạt động không
 * @returns {boolean} True nếu phiên đã hết hạn, false nếu còn hạn
 */
export const isSessionExpired = () => {
  try {
    const lastActivity = secureStorage.getItem(ACTIVITY_TIMESTAMP_KEY);

    if (!lastActivity) {
      // Nếu không có timestamp, coi như phiên đã hết hạn
      return true;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;

    return timeSinceLastActivity > INACTIVITY_TIMEOUT;
  } catch (error) {
    // console.error("Error checking session expiry");
    // Nếu có lỗi, coi như phiên đã hết hạn để an toàn
    return true;
  }
};

/**
 * Thiết lập theo dõi hoạt động người dùng
 * @returns {Function} Hàm dọn dẹp để gỡ bỏ các event listener
 */
export const setupActivityTracking = () => {
  // Cập nhật hoạt động ban đầu
  updateLastActivity();

  // Thời gian tối thiểu giữa các lần cập nhật (1 phút)
  const UPDATE_THROTTLE = 60000;
  let lastUpdateTime = Date.now();

  // Hàm xử lý sự kiện người dùng (với throttle)
  const handleUserActivity = () => {
    const now = Date.now();
    if (now - lastUpdateTime >= UPDATE_THROTTLE) {
      lastUpdateTime = now;
      updateLastActivity();
    }
  };

  // Danh sách các sự kiện cần theo dõi
  const events = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
    "keydown",
  ];

  // Đăng ký các trình xử lý sự kiện
  events.forEach((event) => {
    document.addEventListener(event, handleUserActivity, { passive: true });
  });

  // Cập nhật khi tab được kích hoạt
  window.addEventListener("focus", () => {
    // Khi người dùng quay lại tab, kiểm tra ngay lập tức
    if (isSessionExpired()) {
      // Nếu đã hết hạn, để App.js xử lý đăng xuất
    } else {
      // Nếu chưa hết hạn, cập nhật timestamp
      updateLastActivity();
    }
  });

  // Trả về hàm dọn dẹp
  return () => {
    events.forEach((event) => {
      document.removeEventListener(event, handleUserActivity);
    });
    window.removeEventListener("focus", updateLastActivity);
  };
};

/**
 * Đặt lại bộ đếm thời gian khi người dùng đăng nhập
 */
export const resetActivityTimestamp = () => {
  updateLastActivity();
};

/**
 * Xóa dữ liệu theo dõi hoạt động khi đăng xuất
 */
export const clearActivityData = () => {
  secureStorage.removeItem(ACTIVITY_TIMESTAMP_KEY);
};
