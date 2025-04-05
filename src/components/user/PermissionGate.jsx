import React, { useContext } from 'react';
import { AuthContext } from '../contexts/start/AuthContext';

// Component để kiểm soát hiển thị dựa trên quyền
const PermissionGate = ({ requiredRole, fallback = null, children }) => {
  const { user } = useContext(AuthContext);
  
  // Kiểm tra nếu người dùng có vai trò phù hợp
  const hasPermission = () => {
    if (!user || !user.role) return false;
    
    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }
    
    return true; // Người dùng thông thường
  };
  
  // Hiển thị nội dung nếu có quyền, ngược lại hiển thị fallback
  return hasPermission() ? children : fallback;
};

export default PermissionGate;