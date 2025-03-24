import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

  return token && user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
