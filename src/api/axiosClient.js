import axios from "axios";
import { refreshToken } from "../services/user";
import { secureStorage } from "../utils/secureDataUtils";

// Biến để theo dõi trạng thái đang refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosClient = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://10.5.50.245:8080/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor - Thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem("token");
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

    if (error.message && error.message.includes("Network Error")) {
      console.error("Có thể đang gặp lỗi CORS:", error);
      return Promise.reject(error);
    }

    // Xử lý khi token hết hạn (401 Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request này vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          // Cập nhật token trong secure storage
          secureStorage.setItem("token", newToken);

          // Cập nhật Authorization header cho request hiện tại
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Xử lý các request đang chờ trong hàng đợi
          processQueue(null, newToken);

          // Thực hiện lại request ban đầu
          return axiosClient(originalRequest);
        } else {
          // Nếu không nhận được token mới, xử lý đăng xuất
          processQueue(new Error("Failed to refresh token"));

          // Đảm bảo điều hướng đến trang đăng nhập chỉ xảy ra một lần
          if (window.location.pathname !== "/login") {
            secureStorage.removeItem("token");
            window.location.href = "/login";
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError);

        // Không in chi tiết lỗi để tránh rò rỉ thông tin
        console.error("Failed to refresh token");

        // Kiểm tra xem đã ở trang login chưa để tránh chuyển hướng lặp lại
        if (window.location.pathname !== "/login") {
          secureStorage.removeItem("token");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
