import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/start/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị các route con
  return <Outlet />;
};

export default PrivateRoute;