import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { SidebarComponents } from "../components/sidebar";
import { OverviewPages } from "../pages/Overview";
import { TaskPages } from "../pages/tasks";
import { MessagesPage } from "../pages/messages";
import { BusinessPages } from "../pages/Business";
import { ActionPages } from "../pages/Actions";
import { SettingPages } from "../pages/Settings";
import { AuthContext } from "../contexts/start/AuthContext";
import Login from "../pages/login";
import Register from "../pages/register";
import PrivateRoute from "../components/user/PrivateRoute";
import { ToastContainer } from "react-toastify";
import PublicRoute from "../components/user/PublicRoute";
import ServicePages from "../pages/Services";
import SearchResultsPage from "../pages/search/SearchResults";
import NotFound from "../utils/NotFound";
import ProfilePageUser from "../pages/Profile";

export const Routers = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="flex">
        {user && <SidebarComponents />}
        <div className="flex-1 p-4 pb-0">
          <Routes>
            {/* Public routes - Chỉ truy cập khi chưa đăng nhập */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes - Bắt buộc đăng nhập để truy cập */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<OverviewPages />} />
              <Route path="/task" element={<TaskPages />} />
              <Route path="/message" element={<MessagesPage />} />
              <Route path="/service" element={<ServicePages />} />
              <Route path="/business" element={<BusinessPages />} />
              <Route path="/users" element={<ProfilePageUser />} />
              <Route path="/settings" element={<SettingPages />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/actions" element={<ActionPages />} />
            </Route>

            {/* Route 404 - Trang không tìm thấy */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};