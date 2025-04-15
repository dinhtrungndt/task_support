import axios from "axios";
import { refreshToken } from "../services/user";
import { secureStorage } from "../utils/secureDataUtils";
import { toast } from "react-toastify";
import { clearActivityData } from "../utils/sessionUtils";

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
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: "http://192.168.1.22:8080/", // City
  // baseURL: "http://192.168.2.209:8080/", // Home
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor - Thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem("tz");
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
      // console.error("Có thể đang gặp lỗi CORS:", error);
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'SESSION_EXPIRED'
    ) {
      toast.error("Tài khoản đang đăng nhập ở thiết bị khác", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Clear all auth data
      secureStorage.removeItem("tz");
      secureStorage.removeItem("rtk");
      secureStorage.removeItem("ts");
      clearActivityData();

      // Redirect to login
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
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
          secureStorage.setItem("tz", newToken);

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
            secureStorage.removeItem("tz");
            window.location.href = "/login";
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError);

        // Không in chi tiết lỗi để tránh rò rỉ thông tin
        // console.error("Failed to refresh token");

        // Kiểm tra xem đã ở trang login chưa để tránh chuyển hướng lặp lại
        if (window.location.pathname !== "/login") {
          secureStorage.removeItem("tz");
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
