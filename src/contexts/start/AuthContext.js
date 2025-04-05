import React, { createContext, useState, useEffect } from 'react';
import { getIdUser, refreshToken, logout } from '../../services/user';

export const AuthContext = createContext();

// Hàm an toàn để giải mã JWT token
const safelyDecodeToken = (token) => {
  try {
    if (!token) return null;
    
    // Lấy phần payload (phần thứ 2) của JWT token
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Chuyển base64url thành base64 chuẩn bằng cách thay thế các ký tự
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Thêm padding nếu cần
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    
    // Giải mã base64 và chuyển thành đối tượng JSON
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
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
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Giải mã token để kiểm tra thời gian hết hạn
          try {
            const decodedToken = safelyDecodeToken(token);
            
            // Lấy thời gian hết hạn từ token (thường là trường exp)
            if (decodedToken && decodedToken.exp) {
              const expiryTime = new Date(decodedToken.exp * 1000);
              setTokenExpiryTime(expiryTime);
              
              // Nếu token đã hết hạn, thử refresh
              if (expiryTime <= new Date()) {
                const newToken = await refreshToken();
                if (!newToken) {
                  throw new Error('Session expired');
                }
              }
            }
            
            // Nếu token hợp lệ, lấy thông tin người dùng
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (tokenError) {
            console.error('Token validation error:', tokenError);
            // Nếu không thể giải mã token, đăng xuất
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Thiết lập timer để refresh token trước khi hết hạn
  useEffect(() => {
    if (tokenExpiryTime) {
      const timeUntilExpiry = tokenExpiryTime.getTime() - new Date().getTime();
      
      // Refresh trước khi hết hạn 5 phút
      const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
      
      // Nếu thời gian refresh hợp lệ (> 0), thiết lập timer
      if (refreshTime > 0) {
        const refreshTimer = setTimeout(async () => {
          try {
            await refreshToken();
          } catch (error) {
            console.error('Token refresh error:', error);
          }
        }, refreshTime);
        
        return () => clearTimeout(refreshTimer);
      } else {
        // Nếu token gần hết hạn hoặc đã hết hạn, refresh ngay
        refreshToken().catch(error => {
          console.error('Immediate token refresh error:', error);
        });
      }
    }
  }, [tokenExpiryTime]);

  // Hàm đăng nhập
  const loginUser = (userData) => {
    setUser(userData);
    
    // Lấy token từ localStorage và cài đặt thời gian hết hạn
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = safelyDecodeToken(token);
      if (decodedToken && decodedToken.exp) {
        setTokenExpiryTime(new Date(decodedToken.exp * 1000));
      }
    }
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    logout();
    setUser(null);
    setTokenExpiryTime(null);
  };

  // Kiểm tra xem người dùng có quyền admin hay không
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Cung cấp context
  const contextValue = {
    user,
    loading,
    loginUser,
    logoutUser: handleLogout,
    isAdmin,
    refreshSession: refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;