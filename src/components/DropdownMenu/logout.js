import React, { useContext } from "react";
import { AuthContext } from "../../contexts/start/AuthContext";

export const DropdownMenuLogout = () => {
  const { logoutUser, socket } = useContext(AuthContext);

  const handleLogout = () => {
    if (socket) {
      socket.emit("user_logout", socket.id);
      socket.disconnect();
    }
    logoutUser();
  };

  return (
    <div className="absolute right-4 -top-2 bg-white border border-gray-200 rounded-lg shadow-lg z-500">
      <button
        className="flex items-center w-full px-8 py-1 text-gray-700 hover:bg-gray-100"
        onClick={handleLogout}
      >
        <span>Logout</span>
      </button>
    </div>
  );
};