import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/start/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị các route con (login, register)
  return <Outlet />;
};

export default PublicRoute;