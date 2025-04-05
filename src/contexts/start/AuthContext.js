// contexts/start/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getIdUser, refreshToken, logout } from '../../services/user';

export const AuthContext = createContext();

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
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            
            // Lấy thời gian hết hạn từ token (thường là trường exp)
            if (decodedToken.exp) {
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
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.exp) {
          setTokenExpiryTime(new Date(decodedToken.exp * 1000));
        }
      } catch (error) {
        console.error('Token decode error:', error);
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