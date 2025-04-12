import React, { createContext, useState, useEffect } from "react";
import { getIdUser, refreshToken, logout } from "../../services/user";
import { secureStorage } from "../../utils/secureDataUtils";
import {
  resetActivityTimestamp,
  clearActivityData,
} from "../../utils/sessionUtils";
import { setCurrentUser } from "../../stores/redux/actions/userActions";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState(null);

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
                try {
                  const newToken = await refreshToken();
                  if (newToken) {
                    const newDecodedToken = safelyDecodeToken(newToken);
                    if (newDecodedToken && newDecodedToken.exp) {
                      setTokenExpiryTime(new Date(newDecodedToken.exp * 1000));
                    }
                  }
                } catch (refreshError) {
                  console.warn("Token refresh failed during initialization");
                }
              }
            }

            setUser(storedUser);
            dispatch(setCurrentUser(storedUser));

            resetActivityTimestamp();
          } catch (tokenError) {
            console.error("Token validation error");
            setUser(storedUser);
            dispatch(setCurrentUser(storedUser));

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
    dispatch(setCurrentUser(userData));

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

  const updateUserInfo = (updatedUserData) => {
    setUser(updatedUserData);

    dispatch(setCurrentUser(updatedUserData));

    const storedUser = secureStorage.getItem("ts");
    if (storedUser) {
      secureStorage.setItem("ts", { ...storedUser, ...updatedUserData });
    }
  };

  const contextValue = {
    user,
    loading,
    loginUser,
    logoutUser: handleLogout,
    isAdmin,
    refreshSession: refreshToken,
    updateUserInfo
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
