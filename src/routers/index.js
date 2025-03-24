import React, { useContext } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SidebarComponents } from "../components/sidebar";
import { OverviewPages } from "../pages/Overview";
import { TaskPages } from "../pages/tasks";
import { MessagesPage } from "../pages/messages";
import { BusinessPages } from "../pages/Business";
import { UserPages } from "../pages/Users";
import { SettingPages } from "../pages/Settings";
import { AuthContext, AuthProvider } from "../contexts/start/AuthContext";
import Login from "../pages/login";
import Register from "../pages/register";
import PrivateRoute from "../components/user/PrivateRoute";
import { ToastContainer } from "react-toastify";
import PublicRoute from "../components/user/PublicRoute";

export const Routers = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex">
      {user && <SidebarComponents />}
      <div className="flex-1 p-4 pb-0">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<OverviewPages />} />
          </Route>
          {/* <Route path="/login"element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} /> */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/task" element={<TaskPages />} />
          <Route path="/message" element={<MessagesPage />} />
          <Route path="/business" element={<BusinessPages />} />
          <Route path="/users" element={<UserPages />} />
          <Route path="/settings" element={<SettingPages />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
