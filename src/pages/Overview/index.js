import React, { useEffect, useState, useContext } from "react";
import { HeaderPages } from "../../components/header";
import Modal from "../../components/modals";
import EditTaskModal from "../../components/modals/EditTask";
import MoreDetailsModal from "../../components/modals/MoreTask";
import { TodayTasks } from "./todayTask";
import { Tasks } from "../../components/Tasks";
import {
  ClipboardCheck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinesses } from "../../stores/redux/actions/businessActions";
import { fetchTasks } from "../../stores/redux/actions/taskActions";
import { fetchServices } from "../../stores/redux/actions/serviceAction";
import { fetchUsers, fetchUsersExceptId } from "../../stores/redux/actions/userActions";
import io from "socket.io-client";

const socket = io("http://192.168.2.209:8080");

export const OverviewPages = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const [activeFilter, setActiveFilter] = useState("Assigned");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userStatus, setUserStatus] = useState({});
  const { currentUser } = useSelector((state) => state.users);
  const userID = users.find(user => user.email === currentUser.email)?._id;

  useEffect(() => {
    if (currentUser && currentUser.id) {
      socket.emit("user_online", currentUser.id);

      socket.on("update_user_status", (onlineUsers) => {
        const statusObj = {};
        users.forEach(user => {
          statusObj[user._id] = onlineUsers.includes(user._id) ? "Đang hoạt động" : "Không hoạt động";
        });
        setUserStatus(statusObj);
      });
    }

    return () => {
      socket.off("user_online");
      socket.off("update_user_status");
    };
  }, [currentUser, users]);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchTasks());
    dispatch(fetchServices());

    if (currentUser && currentUser.id) {
      dispatch(fetchUsersExceptId(currentUser.id));
    } else {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (activeFilter === "Assigned") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === activeFilter));
    }
  }, [activeFilter, tasks]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const taskCounts = {
    total: tasks.length,
    done: tasks.filter((task) => task.status === "Done").length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    rejected: tasks.filter((task) => task.status === "Rejected").length,
  };

  const renderOnlineStatusDot = (userId) => {
    if (userStatus[userId] === "Đang hoạt động") {
      return (
        <div className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></div>
      );
    }
    return (
      <div className="inline-block w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPages title="Tổng quan" />

      {/* Main Content */}
      <div className="container mx-auto px-2 py-2 max-w-full">
        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          <div
            className={`rounded-md border shadow-sm overflow-hidden transition-all ${activeFilter === "Assigned"
              ? "border-blue-500 ring-1 ring-blue-500 bg-white"
              : "border-gray-200 bg-white hover:border-blue-200"
              }`}
            onClick={() => handleFilterClick("Assigned")}
          >
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Tất cả công việc
                  </h3>
                  <p className="text-xl font-bold mt-0.5 text-blue-600">
                    {taskCounts.total}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div
              className={`h-1 w-full ${activeFilter === "Assigned" ? "bg-blue-500" : "bg-transparent"
                }`}
            ></div>
          </div>

          <div
            className={`rounded-md border shadow-sm overflow-hidden transition-all ${activeFilter === "Done"
              ? "border-green-500 ring-1 ring-green-500 bg-white"
              : "border-gray-200 bg-white hover:border-green-200"
              }`}
            onClick={() => handleFilterClick("Done")}
          >
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Hoàn thành
                  </h3>
                  <p className="text-xl font-bold mt-0.5 text-green-600">
                    {taskCounts.done}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            <div
              className={`h-1 w-full ${activeFilter === "Done" ? "bg-green-500" : "bg-transparent"
                }`}
            ></div>
          </div>

          <div
            className={`rounded-md border shadow-sm overflow-hidden transition-all ${activeFilter === "Pending"
              ? "border-amber-500 ring-1 ring-amber-500 bg-white"
              : "border-gray-200 bg-white hover:border-amber-200"
              }`}
            onClick={() => handleFilterClick("Pending")}
          >
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Đang thực hiện
                  </h3>
                  <p className="text-xl font-bold mt-0.5 text-amber-600">
                    {taskCounts.pending}
                  </p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
            <div
              className={`h-1 w-full ${activeFilter === "Pending" ? "bg-amber-500" : "bg-transparent"
                }`}
            ></div>
          </div>

          <div
            className={`rounded-md border shadow-sm overflow-hidden transition-all ${activeFilter === "Rejected"
              ? "border-red-500 ring-1 ring-red-500 bg-white"
              : "border-gray-200 bg-white hover:border-red-200"
              }`}
            onClick={() => handleFilterClick("Rejected")}
          >
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Từ chối</h3>
                  <p className="text-xl font-bold mt-0.5 text-red-600">
                    {taskCounts.rejected}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </div>
            <div
              className={`h-1 w-full ${activeFilter === "Rejected" ? "bg-red-500" : "bg-transparent"
                }`}
            ></div>
          </div>
        </div>

        {/* Active Users Section (New) */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Thành viên</h3>
          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              user._id === userID ? null :
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

        {/* Content based on active filter */}
        {activeFilter === "Assigned" ? (
          <TodayTasks userStatus={userStatus} renderOnlineStatusDot={renderOnlineStatusDot} />
        ) : (
          <Tasks
            filteredTasks={filteredTasks}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedIds={selectedIds}
            handleCheckboxChange={handleCheckboxChange}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            openModalCreateTask={openModalCreateTask}
            setOpenModalCreateTask={setOpenModalCreateTask}
            loading={loading}
            userStatus={userStatus}
            renderOnlineStatusDot={renderOnlineStatusDot}
          />
        )}
      </div>
    </div>
  );
};