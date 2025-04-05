
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/start/AuthContext';
import { setupActivityTracking, isSessionExpired } from './utils/sessionUtils';
import { logout } from './services/user';
import 'react-toastify/dist/ReactToastify.css';
import { Routers } from './routers';
import { errorToast } from './ui/CustomToast';

export default function App() {
  useEffect(() => {
    const cleanup = setupActivityTracking();
    
    const sessionCheckInterval = setInterval(() => {
      const hasToken = localStorage.getItem('token');
      
      if (hasToken && isSessionExpired()) {
        // Phiên đã hết hạn do không hoạt động
        clearInterval(sessionCheckInterval);
        logout();
        errorToast('Phiên làm việc đã hết hạn do không hoạt động. Vui lòng đăng nhập lại.');
        window.location.href = '/login';
      }
    }, 60000); // Kiểm tra mỗi phút
    
    return () => {
      cleanup();
      clearInterval(sessionCheckInterval);
    };
  }, []);

  return <Routers />;
}