import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/start/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children ? children : <Outlet />;
};

export default ProtectedRoute;