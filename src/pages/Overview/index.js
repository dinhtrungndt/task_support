import React, { useEffect, useState, useContext, useMemo } from "react";
import { HeaderPages } from "../../components/header";
import { TodayTasks } from "./todayTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "../../stores/redux/actions/businessActions";
import { fetchTasks } from "../../stores/redux/actions/taskActions";
import { fetchServices } from "../../stores/redux/actions/serviceAction";
import { fetchUsers, fetchUsersExceptId } from "../../stores/redux/actions/userActions";
import { AuthContext } from "../../contexts/start/AuthContext";

export const OverviewPages = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const [userStatus, setUserStatus] = useState({});
  const { user: currentUser, socket } = useContext(AuthContext);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => user._id !== currentUser?.id);
  }, [users, currentUser]);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("user_online", currentUser.id);

      socket.on("update_user_status", (onlineUsers) => {
        const statusObj = {};
        users.forEach((user) => {
          statusObj[user._id] = onlineUsers.includes(user._id) ? "Đang hoạt động" : "Không hoạt động";
        });
        setUserStatus(statusObj);
      });

      return () => {
        socket.off("user_online");
        socket.off("update_user_status");
      };
    }
  }, [currentUser, socket, users]);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchTasks());
    dispatch(fetchServices());
    if (currentUser?.id) {
      dispatch(fetchUsersExceptId(currentUser.id));
    } else {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUsersExceptId(currentUser.id));
    }
  }, [dispatch, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPages title="Tổng quan" />

      {/* Main Content */}
      <div className="container mx-auto px-2 py-2 max-w-full">
        {/* Thành viên */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Thành viên</h3>
          <div className="flex flex-wrap gap-2">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center bg-white p-2 rounded-lg shadow-sm"
              >
                <div className="relative">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {userStatus[user._id] === "Đang hoạt động" && (
                    <div className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
          <TodayTasks userStatus={userStatus}/>
      </div>
    </div>
  );
};