import React from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  Briefcase,
  Info
} from 'lucide-react';

export const NotificationsSetting = ({ notificationSettings, handleNotificationChange }) => {
  const notificationOptions = [
    {
      key: 'emailNotifications',
      title: "Thông báo Email",
      description: "Nhận cập nhật hàng ngày và thông báo quan trọng qua email",
      icon: <Mail size={20} />
    },
    {
      key: 'pushNotifications',
      title: "Thông báo đẩy",
      description: "Nhận các thông báo trên thiết bị của bạn cho những cập nhật quan trọng",
      icon: <Bell size={20} />
    },
    {
      key: 'taskReminders',
      title: "Nhắc nhở công việc",
      description: "Nhận thông báo về công việc sắp đến hạn hoặc quá hạn",
      icon: <Calendar size={20} />
    },
    {
      key: 'teamUpdates',
      title: "Cập nhật từ đội nhóm",
      description: "Nhận thông báo khi thành viên trong nhóm thực hiện thay đổi",
      icon: <Users size={20} />
    },
    {
      key: 'projectChanges',
      title: "Thay đổi dự án",
      description: "Nhận thông báo về cập nhật dự án và các mốc quan trọng",
      icon: <Briefcase size={20} />
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Tùy chỉnh thông báo
      </h2>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Tùy chỉnh cách bạn nhận thông báo. Bạn có thể bật/tắt các loại thông báo khác nhau dưới đây.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notificationOptions.map(({ key, title, description, icon }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mr-4">
                {icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">{title}</h3>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationSettings[key]}
                  onChange={() => handleNotificationChange(key)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
          <MessageSquare size={16} className="mr-2 text-indigo-600" />
          Tùy chọn thông báo bổ sung
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Chọn tần suất nhận thông báo tóm tắt
        </p>
        <select className="block w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200 appearance-none">
          <option value="daily">Hàng ngày</option>
          <option value="weekly">Hàng tuần</option>
          <option value="biweekly">Hai tuần một lần</option>
          <option value="monthly">Hàng tháng</option>
          <option value="never">Không bao giờ</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSetting;