import { LogOut } from "lucide-react";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/start/AuthContext";
import io from "socket.io-client";

export const DropdownMenuLogout = () => {
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    const socket = io(process.env.REACT_APP_API_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      // console.log("Socket.IO connected for logout");
      if (auth.user && auth.user.id) {
        socket.emit("user_logout", auth.user.id);
        socket.disconnect();
      }
      auth.logoutUser();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error during logout:", error);
      auth.logoutUser();
    });
  };

  return (
    <div className="absolute right-4 -top-2 bg-white border border-gray-200 rounded-lg shadow-lg z-500">
      <button
        className="flex items-center w-full px-8 py-1 text-gray-700 hover:bg-gray-100"
        onClick={handleLogout}
      >
        <LogOut size={16} className="mr-2 text-red-500" />
        <span>Logout</span>
      </button>
    </div>
  );
};