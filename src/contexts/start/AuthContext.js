import React, { createContext, useState, useEffect } from 'react';
import { getIdUser, refreshToken, logout } from '../../services/user';
import { secureStorage } from '../../utils/secureDataUtils';

export const AuthContext = createContext();

// Hàm an toàn để giải mã JWT token
const safelyDecodeToken = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    
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
        // Use secureStorage instead of localStorage
        const token = secureStorage.getItem('token');
        const storedUser = secureStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const decodedToken = safelyDecodeToken(token);
            
            if (decodedToken && decodedToken.exp) {
              const expiryTime = new Date(decodedToken.exp * 1000);
              setTokenExpiryTime(expiryTime);
              
              if (expiryTime <= new Date()) {
                const newToken = await refreshToken();
                if (!newToken) {
                  throw new Error('Session expired');
                }
              }
            }
            
            // No need to parse again since secureStorage.getItem already handles it
            setUser(storedUser);
          } catch (tokenError) {
            console.error('Token validation error:', tokenError);
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
      
      const refreshTime = timeUntilExpiry - (5 * 60 * 1000);
      
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
        refreshToken().catch(error => {
          console.error('Immediate token refresh error:', error);
        });
      }
    }
  }, [tokenExpiryTime]);

  // Hàm đăng nhập
  const loginUser = (userData) => {
    setUser(userData);
    
    // Get token from secureStorage
    const token = secureStorage.getItem('token');
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