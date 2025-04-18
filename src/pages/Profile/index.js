import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Briefcase,
  Building,
  Clock,
  Edit,
  Shield,
  Calendar,
  Server,
  AlertTriangle
} from "lucide-react";
import { HeaderPages } from "../../components/header";
import { fetchTasksByUser } from "../../stores/redux/actions/taskActions";
import { fetchServicesByUser } from "../../stores/redux/actions/serviceAction";
import { ListViewTask } from "./tasks/listView";
import { formatDateDetail } from "../../utils/formatDate";
import { CardViewTask } from "./tasks/cardView";
import { ListViewService } from "./services/listView";
import { CardViewService } from "./services/cardView";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { currentUser } = useSelector((state) => state.users);
  const { tasks: allTasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { services: allServices, loading: servicesLoading } = useSelector((state) => state.services);

  // Local state
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskViewMode, setTaskViewMode] = useState("list");
  const [serviceViewMode, setServiceViewMode] = useState("list");

  // Filter tasks and services for the current user
  const userTasks = allTasks.filter(task => task.userAdd === currentUser?.id);
  const userServices = allServices.filter(service => service.userCreated === currentUser?.id);

  // Loading state based on Redux loading status
  const isLoading = tasksLoading || servicesLoading;

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchTasksByUser(currentUser.id));
      dispatch(fetchServicesByUser(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <HeaderPages title="Hồ sơ cá nhân" />
      {/* Content Area */}
      <div className="container max-w-full mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Upper Section */}
              <div className="p-6 pb-4 flex flex-col items-center">
                <div className="relative mb-5">
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <img
                      src={currentUser?.avatar || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(currentUser?.name || 'User')}`}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => navigate("/settings")}>
                    <Edit size={16} className="text-indigo-600" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 text-center">{currentUser?.name}</h2>
                <p className="text-indigo-600 font-medium mt-1">{currentUser?.jobTitle || "Chưa cập nhật chức vụ"}</p>
                <p className="text-sm text-gray-500 mt-1">{currentUser?.department || "Chưa cập nhật phòng ban"}</p>

                <div className="mt-3 flex items-center">
                  <Shield size={14} className="text-indigo-600 mr-1" />
                  <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                    {currentUser?.role === 'admin' ? 'Admin' : 'Người dùng'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex border-t border-b border-gray-100">
                <div className="flex-1 py-3 text-center">
                  <div className="text-lg font-semibold text-gray-800">{userTasks.length}</div>
                  <div className="text-xs text-gray-500">Nhiệm vụ</div>
                </div>
                <div className="flex-1 py-3 text-center border-l border-gray-100">
                  <div className="text-lg font-semibold text-gray-800">{userServices.length}</div>
                  <div className="text-xs text-gray-500">Dịch vụ</div>
                </div>
                <div className="flex-1 py-3 text-center border-l border-gray-100">
                  <div className="text-lg font-semibold text-gray-800">
                    {userTasks.filter(task => task.status === "Done").length}
                  </div>
                  <div className="text-xs text-gray-500">Hoàn thành</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                      <Mail size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800">{currentUser?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                      <Phone size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <p className="text-sm font-medium text-gray-800">{currentUser?.phone || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                      <Building size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phòng ban</p>
                      <p className="text-sm font-medium text-gray-800">{currentUser?.department || "Chưa cập nhật"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                      <Clock size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Múi giờ</p>
                      <p className="text-sm font-medium text-gray-800">{currentUser?.timeZone || "GMT+7"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                      <Calendar size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ngày tham gia</p>
                      <p className="text-sm font-medium text-gray-800">{formatDateDetail(currentUser?.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Edit size={14} className="mr-2" />
                    Chỉnh sửa hồ sơ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks and Services */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-2 flex">
              <button
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "tasks"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("tasks")}
              >
                <div className="flex items-center justify-center">
                  <Briefcase size={16} className="mr-2" />
                  Nhiệm vụ
                  {userTasks.length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === "tasks" ? "bg-white text-indigo-600" : "bg-indigo-100 text-indigo-600"}`}>
                      {userTasks.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "services"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("services")}
              >
                <div className="flex items-center justify-center">
                  <Server size={16} className="mr-2" />
                  Dịch vụ
                  {userServices.length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === "services" ? "bg-white text-indigo-600" : "bg-indigo-100 text-indigo-600"}`}>
                      {userServices.length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* View Toggle and Title */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  {activeTab === "tasks" ? (
                    <>
                      <Briefcase size={18} className="text-indigo-600 mr-2" />
                      Nhiệm vụ của tôi
                    </>
                  ) : (
                    <>
                      <Server size={18} className="text-indigo-600 mr-2" />
                      Dịch vụ của tôi
                    </>
                  )}
                </h3>
                <div className="flex space-x-2">
                  {activeTab === "tasks" && (
                    <>
                      <button
                        className={`p-1.5 rounded-md ${taskViewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setTaskViewMode("list")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        className={`p-1.5 rounded-md ${taskViewMode === "card" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setTaskViewMode("card")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </button>
                    </>
                  )}
                  {activeTab === "services" && (
                    <>
                      <button
                        className={`p-1.5 rounded-md ${serviceViewMode === "list" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setServiceViewMode("list")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        className={`p-1.5 rounded-md ${serviceViewMode === "card" ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                        onClick={() => setServiceViewMode("card")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center py-16">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (
                (activeTab === "tasks" && userTasks.length === 0) ||
                (activeTab === "services" && userServices.length === 0)
              ) && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {activeTab === "tasks" ? "Chưa có nhiệm vụ nào" : "Chưa có dịch vụ nào"}
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {activeTab === "tasks"
                      ? "Bạn chưa có nhiệm vụ nào được giao. Nhiệm vụ sẽ xuất hiện ở đây khi bạn được giao hoặc tạo mới."
                      : "Bạn chưa có dịch vụ nào. Dịch vụ sẽ xuất hiện ở đây khi bạn được giao hoặc tạo mới."
                    }
                  </p>
                </div>
              )}

              {/* Tasks - List View */}
              {!isLoading && activeTab === "tasks" && userTasks.length > 0 && taskViewMode === "list" && (
                <ListViewTask userTasks={userTasks} />
              )}

              {/* Tasks - Card View */}
              {!isLoading && activeTab === "tasks" && userTasks.length > 0 && taskViewMode === "card" && (
               <CardViewTask userTasks={userTasks} />
              )}

              {/* Services - List View */}
              {!isLoading && activeTab === "services" && userServices.length > 0 && serviceViewMode === "list" && (
               <ListViewService userServices={userServices} />
              )}

              {/* Services - Card View */}
              {!isLoading && activeTab === "services" && userServices.length > 0 && serviceViewMode === "card" && (
                <CardViewService userServices={userServices} />
              )}

              {/* Pagination */}
              {!isLoading && ((activeTab === "tasks" && userTasks.length > 8) || (activeTab === "services" && userServices.length > 8)) && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{activeTab === "tasks" ? (userTasks.length > 8 ? 8 : userTasks.length) : (userServices.length > 8 ? 8 : userServices.length)}</span> trong <span className="font-medium">{activeTab === "tasks" ? userTasks.length : userServices.length}</span> {activeTab === "tasks" ? "nhiệm vụ" : "dịch vụ"}
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Trang trước</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Trang sau</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;