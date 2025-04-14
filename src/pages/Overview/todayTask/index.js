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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../../../stores/redux/actions/taskActions";
import { fetchUsers } from "../../../stores/redux/actions/userActions";

export const TodayTasks = () => {
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
  }, [dispatch,tasks]);

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

  // Thống kê dự án
  const projectStats = {
    weeklyActivity: 80,
    totalTasksDone: tasks.filter((task) => task.status === "Done").length,
    projectsWorked: tasks.length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Left column */}
      <div className="space-y-3">
        {/* Today's Tasks Card */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
          <div className="p-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">
              Công việc hôm nay
            </h2>
          </div>

          <div className="p-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task, index) => (
                  <div
                    key={task._id || index}
                    className="flex items-center p-2 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`rounded-full w-5 h-5 flex items-center justify-center mr-2 ${task.status === "Done"
                        ? "bg-blue-600"
                        : task.status === "Pending"
                          ? "bg-amber-500"
                          : "bg-red-500"
                        } text-white flex-shrink-0`}
                    >
                      <CheckSquare size={12} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {task.companyId.name || "Không có tên"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {task.connectionType || ""}
                      </p>
                    </div>

                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs flex items-center ${getStatusClassName(
                        task.status
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <div className="mx-auto w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                  <FileText size={16} />
                </div>
                <p className="text-gray-500 text-xs">
                  Không có công việc nào cho hôm nay
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Project Summary Card */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">
              Tổng quan dự án
            </h2>

            <div className="flex space-x-1">
              <button className="flex items-center px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-colors">
                <FileText size={12} className="mr-1" />
                Dự án
                <ChevronDown size={12} className="ml-1" />
              </button>

              <button className="flex items-center px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 transition-colors">
                <CheckCircle size={12} className="mr-1" />
                Trạng thái
                <ChevronDown size={12} className="ml-1" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-auto">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : tasks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tên công ty
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Người lắp đặt
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ngày lắp
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Người cài
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr
                      key={task._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                            <FileText size={12} />
                          </div>
                          <span className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                            {task.companyId.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 mr-1.5">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.installer || "N/A"
                              )}&background=random&size=20`}
                              alt={task.installer || "N/A"}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {task.installer || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar size={12} className="mr-1 text-gray-400" />
                          {task.installDate
                            ? new Date(task.installDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 mr-1.5">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task?.userAdd?.name || "N/A"
                              )}&background=random&size=20`}
                              alt={task?.userAdd?.name || "N/A"}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {task?.userAdd?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(
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
              <div className="py-6 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <FileText size={20} />
                </div>
                <p className="text-gray-500 text-xs">
                  Không có dữ liệu để hiển thị
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-3">
        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Weekly Activity Card */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold text-gray-800">
                Hoạt động hàng tuần
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={14} />
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-xl font-bold text-gray-800">
                    {projectStats.weeklyActivity}%
                  </span>
                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    +12%
                  </span>
                </div>
                <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${projectStats.weeklyActivity}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  So sánh với tuần trước
                </p>
              </div>

              <div className="ml-3 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>

          {/* Total Tasks Done Card */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold text-gray-800">
                Công việc hoàn thành
              </h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={14} />
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-1">
                <span className="text-xl font-bold text-gray-800">
                  {projectStats.totalTasksDone}
                </span>
                <div className="mt-1.5 grid grid-cols-5 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full ${i < 3 ? "bg-green-500" : "bg-gray-200"
                        }`}
                    ></div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">Trong tháng này</p>
              </div>

              <div className="ml-3 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Worked Card */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-semibold text-gray-800">
              Dự án đã tham gia
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={14} />
            </button>
          </div>

          <div className="flex items-center mb-2">
            <div className="flex-1">
              <span className="text-xl font-bold text-gray-800">
                {projectStats.projectsWorked}
              </span>
              <div className="mt-1.5 flex items-center">
                <span className="text-green-600 text-xs font-medium">
                  +{Math.min(5, projectStats.projectsWorked)} dự án
                </span>
                <span className="mx-1.5 text-gray-400">|</span>
                <span className="text-gray-500 text-xs">Tháng này</span>
              </div>
            </div>

            <div className="ml-3 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <FileText size={20} />
            </div>
          </div>

          {/* Project chart */}
          <div className="h-16 mt-1.5">
            <div className="flex h-full items-end space-x-1">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = 20 + Math.floor(Math.random() * 60);
                return (
                  <div key={i} className="flex-1 group relative">
                    <div
                      className={`w-full rounded-t-sm ${i === 5 ? "bg-blue-500" : "bg-blue-200"
                        }`}
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

        {/* Team Members Card */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-semibold text-gray-800">
              Thành viên nhóm
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
              Xem tất cả
            </button>
          </div>

          <div className="flex flex-wrap -m-0.5">
            {users
              .filter((user) => user.role === "user")
              .slice(0, 10)
              .map((user, index) => (
                <div key={user._id} className="p-0.5">
                  <div className="group relative">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white hover:border-blue-500 transition-all">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${encodeURIComponent(
                          user.name
                        )}&size=32`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            <div className="p-0.5">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer text-blue-600 hover:bg-blue-200 transition-colors">
                <span className="text-sm font-medium">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
