import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Clock,
  Edit,
  Shield,
  Calendar,
  Server,
  FileText,
  Tag,
  MapPin,
  LinkIcon,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { HeaderPages } from "../../components/header";
import axiosClient from "../../api/axiosClient";
import moment from "moment";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const [userTasks, setUserTasks] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskViewMode, setTaskViewMode] = useState("list"); // "list" or "card"
  const [serviceViewMode, setServiceViewMode] = useState("list"); // "list" or "card"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const tasksResponse = await axiosClient.get(`/tasks/user/${currentUser?.id}`);
        setUserTasks(tasksResponse.data || []);

        const servicesResponse = await axiosClient.get(`/services/user/${currentUser?.id}`);
        setUserServices(servicesResponse.data || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchUserData();
    }
  }, [currentUser?.id]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "done":
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "rejected":
      case "inactive":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "done":
      case "active":
        return <CheckCircle size={12} className="mr-1" />;
      case "pending":
        return <div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div>;
      case "rejected":
      case "inactive":
        return <XCircle size={12} className="mr-1" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></div>;
    }
  };

  const getServiceTypeBadge = (type) => {
    switch (type) {
      case "Data":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Cloud":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "Network":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const currentTime = moment();
    const postTime = moment(dateString);
    const diffInSeconds = currentTime.diff(postTime, "seconds");

    if (diffInSeconds < 1) {
      return "Vừa đăng";
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 24 * 3600) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else if (diffInSeconds < 30 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (24 * 3600))} ngày trước`;
    } else if (diffInSeconds < 12 * 30 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (30 * 24 * 3600))} tháng trước`;
    } else {
      return `${Math.floor(diffInSeconds / (365 * 24 * 3600))} năm trước`;
    }
  };

  const formatCurrency = (price) => {
    if (price === undefined || price === null) return "N/A";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

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
                      <p className="text-sm font-medium text-gray-800">{formatDate(currentUser?.createdAt)}</p>
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
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại kết nối
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doanh nghiệp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã dữ liệu
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại dữ liệu
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày lắp đặt
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userTasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <LinkIcon size={14} className="text-gray-400 mr-1.5" />
                              <span className="text-sm font-medium text-gray-800">{task.connectionType}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {task.companyId && typeof task.companyId === 'object' ? (
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                                  <Building size={12} />
                                </div>
                                <span className="text-sm text-gray-800">{task.companyId.name || 'N/A'}</span>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Tag size={14} className="text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-700 font-mono">{task.codeData || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Tag size={14} className="text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-700">{task.typeData || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-700">{formatDate(task.installDate)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                              {getStatusIcon(task.status)}
                              {task.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tasks - Card View */}
              {!isLoading && activeTab === "tasks" && userTasks.length > 0 && taskViewMode === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                  {userTasks.map((task) => (
                    <div key={task._id} className="border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Header with status */}
                      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center">
                          <LinkIcon size={14} className="text-indigo-600 mr-1.5" />
                          <span className="text-sm font-medium text-gray-800">{task.connectionType}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                      </div>

                      {/* Body content */}
                      <div className="px-4 py-3">
                        {/* Company info */}
                        {task.companyId && typeof task.companyId === 'object' && (
                          <div className="mb-3">
                            <div className="flex items-center mb-1">
                              <Building size={14} className="text-gray-500 mr-1.5" />
                              <span className="text-sm font-medium text-gray-800">{task.companyId.name || 'N/A'}</span>
                            </div>
                            {task.companyId.address && (
                              <div className="flex items-center text-xs text-gray-500 pl-5">
                                <MapPin size={10} className="mr-1" />
                                <span className="truncate">{task.companyId.address}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Data details */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Mã dữ liệu</p>
                            <div className="flex items-center">
                              <Tag size={12} className="text-gray-500 mr-1" />
                              <span className="text-sm text-gray-800 font-medium font-mono">{task.codeData || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Loại dữ liệu</p>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                              <span className="text-sm text-gray-800">{task.typeData || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Người lắp đặt</p>
                            <div className="flex items-center">
                              <User size={12} className="text-gray-500 mr-1" />
                              <span className="text-sm text-gray-800">{task.installer || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Ngày lắp đặt</p>
                            <div className="flex items-center">
                              <Calendar size={12} className="text-gray-500 mr-1" />
                              <span className="text-sm text-gray-800">{formatDate(task.installDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {task.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
                            <p className="text-sm text-gray-700">{task.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        <div className="flex justify-between items-center">
                          <span>Được tạo {formatRelativeTime(task.createdAt)}</span>
                          <span>Cập nhật {formatRelativeTime(task.updatedAt || task.lastModified)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Services - List View */}
              {!isLoading && activeTab === "services" && userServices.length > 0 && serviceViewMode === "list" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên dịch vụ
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loại dịch vụ
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doanh nghiệp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá dịch vụ
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời hạn
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userServices.map((service) => (
                        <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                                <Shield size={12} />
                              </div>
                              <span className="text-sm font-medium text-gray-800">{service.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getServiceTypeBadge(service.type)}`}>
                              <Tag size={12} className="mr-1" />
                              {service.type || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {service.companyId && typeof service.companyId === 'object' ? (
                              <div className="flex items-center">
                                <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-1.5">
                                  <Building size={10} />
                                </div>
                                <span className="text-sm text-gray-800">{service.companyId.name || 'N/A'}</span>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DollarSign size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-800">{formatCurrency(service.price)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock size={14} className="text-gray-400 mr-1.5" />
                              <span className="text-sm text-gray-700">{service.duration || 0} tháng</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(service.status)}`}>
                              {getStatusIcon(service.status)}
                              {service.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Services - Card View */}
              {!isLoading && activeTab === "services" && userServices.length > 0 && serviceViewMode === "card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                  {userServices.map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Header with status */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                            <Shield size={12} />
                          </div>
                          <span className="font-medium text-gray-800">{service.name}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(service.status)}`}>
                          {getStatusIcon(service.status)}
                          {service.status}
                        </span>
                      </div>

                      {/* Service type and company */}
                      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-gray-50">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getServiceTypeBadge(service.type)}`}>
                          <Tag size={12} className="mr-1" />
                          {service.type || "N/A"}
                        </span>

                        {service.companyId && typeof service.companyId === 'object' && (
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-1">
                              <Building size={10} />
                            </div>
                            <span className="text-xs text-gray-700">{service.companyId.name || 'N/A'}</span>
                          </div>
                        )}
                      </div>

                      {/* Body content */}
                      <div className="px-4 py-3">
                        {/* Description */}
                        {service.description && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                            <p className="text-sm text-gray-700">{service.description}</p>
                          </div>
                        )}

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Tính năng</p>
                            <div className="flex flex-wrap gap-1.5">
                              {service.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center"
                                >
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1"></div>
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price and duration */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Giá dịch vụ</p>
                            <div className="flex items-center">
                              <DollarSign size={14} className="text-indigo-500 mr-1" />
                              <span className="text-sm font-medium text-gray-800">{formatCurrency(service.price)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Thời hạn</p>
                            <div className="flex items-center">
                              <Clock size={14} className="text-indigo-500 mr-1" />
                              <span className="text-sm font-medium text-gray-800">{service.duration || 0} tháng</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        <div className="flex justify-between items-center">
                          <span>Được tạo {formatRelativeTime(service.createdAt)}</span>
                          <span>Cập nhật {formatRelativeTime(service.lastModified || service.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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