import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchUsersExceptId } from '../../stores/redux/actions/userActions';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';
import { AuthContext } from '../../contexts/start/AuthContext';
import UserDetailModal from '../../components/modals/detail/UserDetailModal';
import { HeaderPages } from '../../components/header';
import {
  Users,
  MessageSquare,
  User,
  Plus,
  Briefcase,
  Bell,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const ActionPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);
  const { businesses } = useSelector((state) => state.business);
  const [userStatus, setUserStatus] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { user: currentUser, socket } = useContext(AuthContext);

  // Hàm format trạng thái người dùng giống Messenger
  const getStatusText = (userId) => {
    const status = userStatus[userId];
    if (!status) return 'Không hoạt động';

    if (status === "Đang hoạt động") return 'Đang hoạt động';
    return 'Không hoạt động';
  };

  // Filter users based on search term
  useEffect(() => {
    if (!users) return;

    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    if (currentUser && socket) {
      socket.on("update_user_status", (onlineUsers) => {
        const statusObj = {};
        users.forEach((user) => {
          statusObj[user._id] = onlineUsers.includes(user._id) ? "Đang hoạt động" : "Không hoạt động";
        });
        setUserStatus(statusObj);
      });

      return () => {
        socket.off("update_user_status");
      };
    }
  }, [currentUser, socket, users]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUsersExceptId(currentUser.id));
    }
    dispatch(fetchBusinesses());
  }, [dispatch, currentUser]);

  // Xử lý nhấn "Nhắn tin"
  const handleMessageClick = (user) => {
    navigate('/message', { state: { selectedUser: user } });
  };

  // Xử lý nhấn "Chi tiết"
  const handleDetailClick = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    // Đợi animation kết thúc trước khi xóa dữ liệu
    setTimeout(() => setSelectedUser(null), 300);
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('DD/MM/YYYY');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderPages title="Quản lý thành viên" />

      <div className="container mx-auto px-4 py-6">
        {/* Search and Add Member */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Tìm kiếm thành viên theo tên, email..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <button className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-colors gap-1.5">
            <Plus size={18} />
            <span>Thêm thành viên</span>
          </button>
        </div>

        {/* Member Cards */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <Users size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Danh sách thành viên</h2>
            <div className="ml-auto text-sm text-gray-500">
              Hiển thị {filteredUsers.length} thành viên
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="flex space-x-4 mt-4">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((member) => (
                <div
                  key={member._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="relative">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full mr-4 bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-semibold border-2 border-indigo-50">
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div
                          className={`absolute bottom-0 right-4 w-4 h-4 rounded-full border-2 border-white ${
                            userStatus[member._id] === "Đang hoạt động" ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-sm text-indigo-600 font-medium mb-1">{member.email || 'Email không có sẵn'}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <div className={`w-2 h-2 ${userStatus[member._id] === "Đang hoạt động" ? 'bg-green-500' : 'bg-gray-300'} rounded-full mr-1.5`}></div>
                          {getStatusText(member._id)}
                        </div>
                        <div className="flex mt-4 gap-2">
                          <button
                            onClick={() => handleMessageClick(member)}
                            className="flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <MessageSquare size={14} className="mr-1.5" />
                            Nhắn tin
                          </button>
                          <button
                            className="flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            onClick={() => handleDetailClick(member)}
                          >
                            <User size={14} className="mr-1.5" />
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-10 text-center border border-gray-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy thành viên</h3>
              <p className="text-gray-500 text-sm mb-4">Không có thành viên nào phù hợp với từ khóa "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>

        {/* Project Activity */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <Briefcase size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Hoạt động của dự án</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MST
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên doanh nghiệp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiến độ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày cập nhật
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.slice(0, 5).map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 font-mono">{project.mst}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              project.completedTasks >= 10 ? 'bg-green-500' : project.completedTasks >= 5 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min((project.completedTasks / project.totalTasks) * 100 || 0, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 inline-block">
                          {Math.min(Math.round((project.completedTasks / project.totalTasks) * 100) || 0, 100)}% hoàn thành
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.completedTasks === project.totalTasks
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : project.completedTasks > 0
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {project.completedTasks === project.totalTasks
                            ? <CheckCircle size={12} className="mr-1" />
                            : project.completedTasks > 0
                              ? <Clock size={12} className="mr-1" />
                              : <AlertTriangle size={12} className="mr-1" />
                          }
                          {project.completedTasks === project.totalTasks
                            ? 'Hoàn thành'
                            : project.completedTasks > 0
                              ? 'Đang thực hiện'
                              : 'Chưa bắt đầu'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(project.updatedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors">
                            <Eye size={14} className="mr-1" />
                            <span>Xem</span>
                          </button>
                          <button className="inline-flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-1 rounded-md transition-colors">
                            <Edit size={14} className="mr-1" />
                            <span>Sửa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {businesses.length > 5 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                  Xem tất cả dự án
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Bell size={20} className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="divide-y divide-gray-100">
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                      MM
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">Mark Magnum</span> hoàn thành công việc
                      <span className="font-medium text-indigo-600"> "Tạo wireframes cho ứng dụng di động"</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1 text-gray-400" />
                      2 giờ trước
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-medium">
                      JD
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">John Doe</span> đã bắt đầu dự án
                      <span className="font-medium text-indigo-600"> "Hệ thống quản lý ABC Corp"</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1 text-gray-400" />
                      Hôm qua
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                      SA
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">Sarah Adams</span> đã thêm tính năng mới vào
                      <span className="font-medium text-indigo-600"> "Hệ thống phân tích dữ liệu"</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1 text-gray-400" />
                      3 ngày trước
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                Xem tất cả hoạt động
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={handleCloseModal}
          userStatus={userStatus}
        />
      )}
    </div>
  );
};

export default ActionPages;