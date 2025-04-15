import React, { useEffect, useState, useContext, useMemo } from "react";
import { HeaderPages } from "../../components/header";
import { TodayTasks } from "./todayTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "../../stores/redux/actions/businessActions";
import { fetchTasks } from "../../stores/redux/actions/taskActions";
import { fetchServices } from "../../stores/redux/actions/serviceAction";
import { fetchUsers, fetchUsersExceptId } from "../../stores/redux/actions/userActions";
import { AuthContext } from "../../contexts/start/AuthContext";
import { Users, UserPlus, Bell, Search, Calendar, Activity, Briefcase, Settings } from "lucide-react";

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

  const getActiveUsersCount = () => {
    return Object.values(userStatus).filter(status => status === "Đang hoạt động").length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPages title="Tổng quan" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 max-w-full">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Thành viên đang hoạt động</p>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-800">{getActiveUsersCount()}</h3>
                <span className="ml-2 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {Math.round((getActiveUsersCount() / filteredUsers.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-4">
              <UserPlus size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tổng số thành viên</p>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-800">{filteredUsers.length}</h3>
                <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  Đội ngũ
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mr-4">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Thông báo mới</p>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-800">12</h3>
                <span className="ml-2 text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Chưa đọc
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex items-center transition-shadow hover:shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
              <Search size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dự án đang tìm kiếm</p>
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-800">8</h3>
                <span className="ml-2 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Mới
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg shadow-sm p-4 text-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-2">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-700">Lịch công việc hôm nay</h3>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5">4 cuộc họp</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white border border-blue-100 p-2 rounded-md shadow-sm">
                <div>
                  <p className="text-sm font-medium text-gray-800">Họp báo cáo tuần</p>
                  <p className="text-xs text-gray-500">09:00 - 10:30</p>
                </div>
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?background=EFF6FF&color=3B82F6" alt="User" className="w-full h-full" />
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?background=EFF6FF&color=3B82F6" alt="User" className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white border border-blue-100 p-2 rounded-md shadow-sm">
                <div>
                  <p className="text-sm font-medium text-gray-800">Cập nhật dự án</p>
                  <p className="text-xs text-gray-500">13:00 - 14:00</p>
                </div>
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?background=EFF6FF&color=3B82F6" alt="User" className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-lg shadow-sm p-4 text-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-2">
                  <Activity size={18} className="text-purple-600" />
                </div>
                <h3 className="font-medium text-purple-700">Hoạt động gần đây</h3>
              </div>
              <span className="bg-purple-100 text-purple-700 text-xs rounded-full px-2 py-0.5">12 cập nhật</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center bg-white border border-purple-100 p-2 rounded-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <Briefcase size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Dự án ABC đã hoàn thành</p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-center bg-white border border-purple-100 p-2 rounded-md shadow-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <UserPlus size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Nguyễn Văn A đã tham gia nhóm</p>
                  <p className="text-xs text-gray-500">5 giờ trước</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg shadow-sm p-4 text-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-2">
                  <Settings size={18} className="text-amber-600" />
                </div>
                <h3 className="font-medium text-amber-700">Cài đặt nhanh</h3>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs rounded-full px-2 py-0.5">Tùy chỉnh</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-white border border-amber-100 hover:bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center transition-colors shadow-sm">
                <Bell size={16} className="mb-1 text-amber-600" />
                <span className="text-xs text-gray-700">Thông báo</span>
              </button>
              <button className="bg-white border border-amber-100 hover:bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center transition-colors shadow-sm">
                <Users size={16} className="mb-1 text-amber-600" />
                <span className="text-xs text-gray-700">Đội nhóm</span>
              </button>
              <button className="bg-white border border-amber-100 hover:bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center transition-colors shadow-sm">
                <Briefcase size={16} className="mb-1 text-amber-600" />
                <span className="text-xs text-gray-700">Dự án</span>
              </button>
              <button className="bg-white border border-amber-100 hover:bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center transition-colors shadow-sm">
                <Calendar size={16} className="mb-1 text-amber-600" />
                <span className="text-xs text-gray-700">Lịch</span>
              </button>
            </div>
          </div>
        </div>
        {/* Tasks Section with Improved Styling */}
        <TodayTasks userStatus={userStatus}/>
        {/* Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              © 2025 Hệ thống quản lý công việc
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Hỗ trợ</a>
              <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Hướng dẫn</a>
              <a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};