import React, { createContext, useState, useEffect } from "react";
import { getIdUser, refreshToken, logout } from "../../services/user";
import { secureStorage } from "../../utils/secureDataUtils";
import {
  resetActivityTimestamp,
  clearActivityData,
} from "../../utils/sessionUtils";

export const AuthContext = createContext();

// Hàm an toàn để giải mã JWT token
const safelyDecodeToken = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token decode error");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);

  // Kiểm tra và cài đặt phiên đăng nhập khi khởi động
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = secureStorage.getItem("tz");
        const storedUser = secureStorage.getItem("ts");

        if (token && storedUser) {
          try {
            const decodedToken = safelyDecodeToken(token);

            if (decodedToken && decodedToken.exp) {
              const expiryTime = new Date(decodedToken.exp * 1000);
              setTokenExpiryTime(expiryTime);

              // Kiểm tra nếu token sắp hết hạn (còn dưới 5 phút) hoặc đã hết hạn
              const timeUntilExpiry =
                expiryTime.getTime() - new Date().getTime();
              if (timeUntilExpiry < 300000) {
                // Dưới 5 phút hoặc đã hết hạn
                try {
                  const newToken = await refreshToken();
                  if (newToken) {
                    // Nếu refresh thành công, cập nhật token expiry time
                    const newDecodedToken = safelyDecodeToken(newToken);
                    if (newDecodedToken && newDecodedToken.exp) {
                      setTokenExpiryTime(new Date(newDecodedToken.exp * 1000));
                    }
                  }
                } catch (refreshError) {
                  // Ẩn chi tiết lỗi để bảo vệ thông tin nhạy cảm
                  console.warn("Token refresh failed during initialization");
                }
              }
            }

            // Luôn đặt user state nếu có dữ liệu stored user
            setUser(storedUser);

            // Khởi tạo lại timestamp hoạt động
            resetActivityTimestamp();
          } catch (tokenError) {
            console.error("Token validation error");
            // Vẫn giữ người dùng đăng nhập nếu chỉ là lỗi validate token
            setUser(storedUser);

            // Khởi tạo lại timestamp hoạt động
            resetActivityTimestamp();
          }
        }
      } catch (error) {
        console.error("Auth initialization error");
        // Chỉ đăng xuất nếu có lỗi nghiêm trọng
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Thiết lập timer để refresh token trước khi hết hạn
  useEffect(() => {
    if (tokenExpiryTime && user) {
      const timeUntilExpiry = tokenExpiryTime.getTime() - new Date().getTime();

      // Refresh token khi còn 5 phút trước khi hết hạn
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);

      // Tránh refresh quá sớm hoặc quá muộn
      const refreshTimer = setTimeout(async () => {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            const decodedToken = safelyDecodeToken(newToken);
            if (decodedToken && decodedToken.exp) {
              setTokenExpiryTime(new Date(decodedToken.exp * 1000));
            }
          }
        } catch (error) {
          // Ẩn chi tiết lỗi để tránh rò rỉ thông tin
          console.error("Token refresh error");
        }
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    }
  }, [tokenExpiryTime, user]);

  // Hàm đăng xuất
  const handleLogout = () => {
    // Đảm bảo xóa dữ liệu theo dõi hoạt động
    clearActivityData();
    // Gọi hàm logout từ service
    logout();
    setUser(null);
    setTokenExpiryTime(null);
  };

  // Hàm đăng nhập
  const loginUser = (userData) => {
    setUser(userData);

    // Get token from secureStorage
    const token = secureStorage.getItem("tz");
    if (token) {
      const decodedToken = safelyDecodeToken(token);
      if (decodedToken && decodedToken.exp) {
        setTokenExpiryTime(new Date(decodedToken.exp * 1000));
      }
    }

    // Đặt lại timestamp hoạt động khi đăng nhập
    resetActivityTimestamp();
  };

  // Kiểm tra xem người dùng có quyền admin hay không
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  // Cung cấp context
  const contextValue = {
    user,
    loading,
    loginUser,
    logoutUser: handleLogout,
    isAdmin,
    refreshSession: refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
