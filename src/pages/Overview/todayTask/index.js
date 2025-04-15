import React, { useContext, useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  MoreVertical,
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Layers,
  Settings,
  RefreshCw
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../../../stores/redux/actions/taskActions";
import { fetchUsers } from "../../../stores/redux/actions/userActions";

export const TodayTasks = ({ userStatus }) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [todayTasks, setTodayTasks] = useState([]);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!tasks.length) {
      dispatch(fetchTasks());
    }

    const latestTasks = [...tasks]
      .filter((task) => task.status === "Pending")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setTodayTasks(latestTasks);
  }, [dispatch, tasks]);

  const getStatusClassName = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <CheckCircle size={12} className="mr-1" />;
      case "Pending":
        return <Clock size={12} className="mr-1" />;
      case "Rejected":
        return <AlertTriangle size={12} className="mr-1" />;
      default:
        return null;
    }
  };

  const getActiveUsers = () => {
    return Object.values(userStatus).filter(status => status === "Đang hoạt động").length;
  };

  // Thống kê dự án
  const projectStats = {
    weeklyActivity: 80,
    totalTasksDone: tasks.filter((task) => task.status === "Done").length,
    projectsWorked: tasks.length,
    activeUsers: getActiveUsers()
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left column - Today's Tasks & Team Members */}
      <div className="space-y-4">
        {/* Today's Tasks Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Clock size={16} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                Công việc hôm nay
              </h2>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <RefreshCw size={14} className="text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-blue-50 transition-all hover:border-blue-200 cursor-pointer"
                  >
                    <div
                      className={`rounded-full w-6 h-6 flex items-center justify-center mr-3 ${
                        task.status === "Done"
                          ? "bg-green-600"
                          : task.status === "Pending"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      } text-white flex-shrink-0`}
                    >
                      <CheckSquare size={12} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-gray-800">
                        {task.companyId.name || "Không có tên"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {task.connectionType || ""}
                      </p>
                    </div>

                    <span
                      className={`ml-2 px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${getStatusClassName(
                        task.status
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>
                ))}

                <button className="w-full mt-2 py-2 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center">
                  <span>Xem tất cả công việc</span>
                  <ChevronDown size={14} className="ml-1" />
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FileText size={20} />
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  Không có công việc nào cho hôm nay
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Bạn có thể tạo công việc mới
                </p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Tạo công việc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Team Members Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Users size={16} className="text-indigo-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                Thành viên nhóm
              </h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center">
              <span>Xem tất cả</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {users
              .filter((user) => user.role === "user")
              .slice(0, 5)
              .map((user) => (
                <div key={user._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative mr-3">
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
                          user.name
                        )}`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                    {userStatus[user._id] === "Đang hoạt động" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role || "Nhân viên"}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${userStatus[user._id] === "Đang hoạt động" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {userStatus[user._id] === "Đang hoạt động" ? "Online" : "Offline"}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-blue-600">{getActiveUsers()}</span> người đang hoạt động
            </div>
            <div className="text-xs text-gray-500">
              Tổng cộng: <span className="font-medium text-gray-700">{users.length}</span> thành viên
            </div>
          </div>
        </div>
      </div>

      {/* Middle column - Project Summary */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-shadow hover:shadow-md">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Layers size={16} className="text-purple-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                Tổng quan dự án
              </h2>
            </div>

            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-colors">
                <FileText size={12} className="mr-1.5" />
                <span>Dự án</span>
                <ChevronDown size={14} className="ml-1.5" />
              </button>

              <button className="flex items-center px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-colors">
                <Settings size={12} className="mr-1.5" />
                <span>Bộ lọc</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : tasks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tên công ty
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Người lắp đặt
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ngày lắp
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Người cài
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr
                      key={task._id || index}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <FileText size={14} />
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {task.companyId.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 mr-2 border border-white">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.installer || "N/A"
                              )}&background=random&size=24`}
                              alt={task.installer || "N/A"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {task.installer || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {task.installDate
                            ? new Date(task.installDate).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 mr-2 border border-white">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task?.userAdd?.name || "N/A"
                              )}&background=random&size=24`}
                              alt={task?.userAdd?.name || "N/A"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {task?.userAdd?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClassName(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}
                          {task.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <FileText size={24} />
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  Không có dữ liệu để hiển thị
                </p>
                <p className="text-gray-500 text-xs mt-1 mb-4">
                  Hãy tạo dự án mới để bắt đầu
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Tạo dự án mới
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Hoàn thành: {tasks.filter(t => t.status === "Done").length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Đang chờ: {tasks.filter(t => t.status === "Pending").length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Từ chối: {tasks.filter(t => t.status === "Rejected").length}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Tổng số dự án: <span className="font-medium text-gray-700">{tasks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Weekly Activity Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <TrendingUp size={16} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Hoạt động hàng tuần
                </h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-xl font-bold text-gray-800">
                    {projectStats.weeklyActivity}%
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                    <TrendingUp size={10} className="mr-1" /> +12%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${projectStats.weeklyActivity}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  So sánh với tuần trước
                </p>
              </div>
            </div>
          </div>

          {/* Total Tasks Done Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Công việc hoàn thành
                </h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <span className="text-xl font-bold text-gray-800">
                  {projectStats.totalTasksDone}
                </span>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full ${i < 3 ? "bg-green-500" : "bg-gray-200"}`}
                    ></div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Trong tháng này</p>
              </div>
            </div>
          </div>

          {/* Projects Worked Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Layers size={16} className="text-purple-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Dự án đã tham gia
                </h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="flex items-center mb-2">
              <div className="flex-1">
                <span className="text-xl font-bold text-gray-800">
                  {projectStats.projectsWorked}
                </span>
                <div className="mt-2 flex items-center">
                  <span className="text-green-600 text-xs font-medium flex items-center">
                    <TrendingUp size={10} className="mr-1" /> +{Math.min(5, projectStats.projectsWorked)} dự án
                  </span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-gray-500 text-xs">Tháng này</span>
                </div>
              </div>
            </div>

            {/* Project chart */}
            <div className="h-16 mt-2">
              <div className="flex h-full items-end space-x-1">
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = 20 + Math.floor(Math.random() * 60);
                  return (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className={`w-full rounded-t-sm ${i === 5 ? "bg-purple-500" : "bg-purple-200"}`}
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>T1</span>
              <span>T12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};