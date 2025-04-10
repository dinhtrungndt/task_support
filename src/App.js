import React, { useEffect, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider, AuthContext } from "./contexts/start/AuthContext";
import {
  setupActivityTracking,
  isSessionExpired,
  clearActivityData,
} from "./utils/sessionUtils";
import "react-toastify/dist/ReactToastify.css";
import { Routers } from "./routers";
import { errorToast } from "./ui/CustomToast";

const AppContent = () => {
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const cleanup = setupActivityTracking();

    const sessionCheckInterval = setInterval(() => {
      const token = localStorage.getItem("tz");

      if (token && isSessionExpired()) {
        clearInterval(sessionCheckInterval);

        clearActivityData();

        logoutUser();

        errorToast(
          "Phiên làm việc đã hết hạn do không hoạt động. Vui lòng đăng nhập lại."
        );
      }
    }, 60000);

    return () => {
      cleanup();
      clearInterval(sessionCheckInterval);
    };
  }, [logoutUser]);

  return <Routers />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
