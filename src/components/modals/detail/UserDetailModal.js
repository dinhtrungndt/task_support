import React, { useState } from 'react';
import {
  UserCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Award,
  Clock,
  Link2,
  MessageSquare,
  X,
  ChevronRight,
  Briefcase,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import moment from 'moment';
import 'moment/locale/vi';

const UserDetailModal = ({ user, onClose, userStatus }) => {
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  const getFormattedStatus = () => {
    if (!userStatus || !userStatus[user._id]) return 'Không hoạt động';

    const { isOnline, lastActive } = userStatus[user._id];

    if (isOnline) return 'Đang hoạt động';
    if (!lastActive) return 'Không hoạt động';

    const diffMinutes = moment().diff(moment(lastActive), 'minutes');
    if (diffMinutes < 1) return 'Vừa mới hoạt động';
    if (diffMinutes < 60) return `Hoạt động ${diffMinutes} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hoạt động ${diffHours} giờ trước`;
    return `Hoạt động ${moment(lastActive).fromNow()}`;
  };

  // Get random activity stats for the demo
  const getRandomStats = () => {
    return {
      tasksCompleted: Math.floor(Math.random() * 50) + 10,
      projectsJoined: Math.floor(Math.random() * 10) + 1,
      messagesCount: Math.floor(Math.random() * 300) + 50,
      lastLogin: moment().subtract(Math.floor(Math.random() * 24), 'hours').format('DD/MM/YYYY HH:mm'),
      joinDate: moment().subtract(Math.floor(Math.random() * 12) + 1, 'months').format('DD/MM/YYYY'),
    };
  };

  const stats = getRandomStats();
  const isOnline = userStatus && userStatus[user._id]?.isOnline;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with gradient & profile pic */}
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-48 bg-gradient-to-r from-indigo-600 to-blue-500"></div>

          <div className="absolute -bottom-20 left-8 rounded-full border-4 border-white shadow-md">
            <div className="relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=128&bold=true&name=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-40 h-40 rounded-full object-cover"
              />
              <div className={`absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </div>

        <div className="mt-20 px-8 pb-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-indigo-600 font-medium flex items-center">
                <Mail size={16} className="mr-1" />
                {user.email}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getFormattedStatus()}
              </p>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center">
                <MessageSquare size={16} className="mr-1.5" />
                Nhắn tin
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition-colors flex items-center">
                <Link2 size={16} className="mr-1.5" />
                Chia sẻ
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-gray-200 mt-8">
            <button
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('profile')}
            >
              Thông tin
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'activity' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('activity')}
            >
              Hoạt động
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'projects' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('projects')}
            >
              Dự án
            </button>
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserCircle size={20} className="mr-2 text-indigo-600" />
                    Thông tin cá nhân
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-800">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                        <p className="text-gray-800">{user.phone || "Chưa cập nhật"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                        <p className="text-gray-800">{user.address || "Chưa cập nhật"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Vai trò</p>
                        <p className="text-gray-800 capitalize">{user.role || "Thành viên"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tham gia</p>
                        <p className="text-gray-800">{stats.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Award size={20} className="mr-2 text-indigo-600" />
                      Chỉ số hoạt động
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-indigo-600 mb-1">Công việc đã hoàn thành</p>
                        <p className="text-2xl font-bold text-indigo-700">{stats.tasksCompleted}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-600 mb-1">Dự án tham gia</p>
                        <p className="text-2xl font-bold text-blue-700">{stats.projectsJoined}</p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-purple-600 mb-1">Tin nhắn</p>
                        <p className="text-2xl font-bold text-purple-700">{stats.messagesCount}</p>
                      </div>

                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-emerald-600 mb-1">Trạng thái</p>
                        <p className="text-md font-bold text-emerald-700 flex items-center">
                          {isOnline ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span>
                              Online
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                              Offline
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-6 text-white shadow-md">
                    <h3 className="text-lg font-semibold mb-3">Thông tin phiên làm việc</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-indigo-100">Đăng nhập gần nhất</p>
                        <p className="font-medium">{stats.lastLogin}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-indigo-100">Thiết bị</p>
                        <p className="font-medium">Windows / Chrome</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-indigo-100">Địa điểm</p>
                        <p className="font-medium">Việt Nam</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-8">
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock size={20} className="mr-2 text-indigo-600" />
                    Hoạt động gần đây
                  </h3>

                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute h-full w-0.5 bg-gray-200 left-2.5 top-3"></div>

                    <div className="space-y-6">
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-green-500 border-2 border-white"></div>
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900">Hoàn thành công việc</p>
                            <span className="text-sm text-gray-500">Hôm nay, 10:30</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">Đã hoàn thành nhiệm vụ "Cập nhật báo cáo cuối tháng" với doanh nghiệp ABC Company.</p>
                          <div className="mt-2 flex items-center">
                            <CheckCircle size={14} className="text-green-600 mr-1" />
                            <span className="text-xs text-green-600">Đúng hạn</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900">Tham gia cuộc họp</p>
                            <span className="text-sm text-gray-500">Hôm qua, 14:00</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">Đã tham gia cuộc họp "Lên kế hoạch marketing Q2" với nhóm thiết kế và marketing.</p>
                        </div>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-purple-500 border-2 border-white"></div>
                        <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900">Gửi tin nhắn</p>
                            <span className="text-sm text-gray-500">2 ngày trước</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">Đã gửi 15 tin nhắn trong nhóm "Dự án XYZ".</p>
                        </div>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-amber-500 border-2 border-white"></div>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-900">Cập nhật tiến độ</p>
                            <span className="text-sm text-gray-500">1 tuần trước</span>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">Đã cập nhật trạng thái công việc "Phân tích dữ liệu khách hàng" lên 75%.</p>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-amber-500 h-2.5 rounded-full" style={{width: "75%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button className="px-4 py-2 text-indigo-600 font-medium bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                    Xem thêm hoạt động
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                  <div className="border-b border-gray-100 bg-gray-50 py-4 px-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Briefcase size={20} className="mr-2 text-indigo-600" />
                      Các dự án đang tham gia
                    </h3>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Website công ty ABC</h4>
                          <p className="text-sm text-gray-600 mt-1">Thiết kế và phát triển website công ty với WordPress</p>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                              Đang tiến hành
                            </span>
                            <span className="text-sm text-gray-500">Deadline: 25/06/2023</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex -space-x-2 mb-2">
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=JD" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=AB" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=CD" className="w-8 h-8 rounded-full border-2 border-white" />
                          </div>
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Tiến độ</span>
                              <span className="font-medium">75%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{width: "75%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Ứng dụng quản lý nội bộ</h4>
                          <p className="text-sm text-gray-600 mt-1">Phát triển ứng dụng quản lý nhân sự và tài sản</p>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                              Đang phát triển
                            </span>
                            <span className="text-sm text-gray-500">Deadline: 30/07/2023</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex -space-x-2 mb-2">
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=JD" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=AB" className="w-8 h-8 rounded-full border-2 border-white" />
                          </div>
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Tiến độ</span>
                              <span className="font-medium">40%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{width: "40%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Nghiên cứu thị trường</h4>
                          <p className="text-sm text-gray-600 mt-1">Phân tích thị trường và đối thủ cạnh tranh</p>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mr-2">
                              Đang chờ phản hồi
                            </span>
                            <span className="text-sm text-gray-500">Deadline: 15/06/2023</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex -space-x-2 mb-2">
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=JD" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=AB" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://ui-avatars.com/api/?background=4F46E5&color=ffffff&size=32&bold=true&name=CD" className="w-8 h-8 rounded-full border-2 border-white" />
                          </div>
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Tiến độ</span>
                              <span className="font-medium">90%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{width: "90%"}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Tham gia dự án mới</h3>
                      <p className="text-blue-100 text-sm max-w-md">Hãy tham gia các dự án mới và thể hiện khả năng của bạn. Chúng tôi luôn chào đón sự hỗ trợ của bạn.</p>
                    </div>
                    <button className="bg-white text-indigo-600 hover:bg-blue-50 px-4 py-2 rounded-lg shadow font-medium flex items-center transition-colors">
                      Xem dự án
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;