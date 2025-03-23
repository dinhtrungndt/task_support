import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SidebarComponents } from "../components/sidebar";
import { OverviewPages } from "../pages/Overview";
import { TaskPages } from "../pages/tasks";
import { MessagesPage } from "../pages/messages";
import { BusinessPages } from "../pages/Business";
import { UserPages } from "../pages/Users";
import { SettingPages } from "../pages/Settings";

export const Routers = () => {
  return (
    <Router>
      <div className="flex">
        <SidebarComponents />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<OverviewPages />} />
            <Route path="/task" element={<TaskPages />} />
            <Route path="/message" element={<MessagesPage />} />
            <Route path="/business" element={<BusinessPages />} />
            <Route path="/users" element={<UserPages />} />
            <Route path="/settings" element={<SettingPages />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};
