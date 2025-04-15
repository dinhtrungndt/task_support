import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Key,
  Lock,
  Smartphone,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import moment from 'moment';

export const SecuritySetting = ({ securitySettings, handleSecurityChange }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Cài đặt bảo mật
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Two-Factor Authentication Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-800">Xác thực hai lớp</h3>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securitySettings.twoFactorAuth}
                  onChange={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">
              Bảo vệ tài khoản của bạn bằng lớp xác thực thứ hai. Khi bật, bạn sẽ được yêu cầu nhập mã từ ứng dụng xác thực của bạn mỗi khi đăng nhập.
            </p>

            {securitySettings.twoFactorAuth ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-medium">
                      Xác thực hai lớp đã được bật
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Tài khoản của bạn đang được bảo vệ với một lớp bảo mật bổ sung
                    </p>
                    <button className="mt-2 text-xs font-medium text-green-700 hover:text-green-900 underline">
                      Cấu hình thiết bị
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button className="inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                <Smartphone size={16} className="mr-2" />
                <span>Thiết lập ngay</span>
              </button>
            )}
          </div>
        </div>

        {/* Session Timeout Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center">
            <Clock className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">Thời gian phiên làm việc</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">
              Tự động đăng xuất sau một khoảng thời gian không hoạt động. Điều này giúp bảo vệ tài khoản của bạn khi bạn quên đăng xuất.
            </p>
            <select
              className="block w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200 appearance-none"
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
            >
              <option value="never">Không bao giờ</option>
              <option value="15">Sau 15 phút</option>
              <option value="30">Sau 30 phút</option>
              <option value="60">Sau 1 giờ</option>
              <option value="120">Sau 2 giờ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <Key className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-800">Mật khẩu và đăng nhập</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-800 font-medium">Mật khẩu</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Clock size={12} className="mr-1 text-amber-500" />
                  {securitySettings.lastPasswordChange
                    ? `Thay đổi lần cuối ${moment(securitySettings.lastPasswordChange).fromNow()}`
                    : "Chưa cập nhật"}
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors">
              Đổi mật khẩu
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <LogOut className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <p className="text-sm text-gray-800 font-medium">Phiên đăng nhập</p>
                <p className="text-xs text-gray-500 mt-1">
                  Đăng xuất khỏi tất cả các thiết bị khác
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Security Log */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center">
          <ShieldAlert className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-800">Nhật ký bảo mật</h3>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-3">
            Theo dõi lịch sử hoạt động đăng nhập và các sự kiện bảo mật quan trọng trên tài khoản của bạn.
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-start p-2 rounded-md hover:bg-gray-50">
              <div className="p-1 bg-green-100 rounded-full text-green-600 mr-3">
                <ShieldCheck size={14} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">Đăng nhập thành công</p>
                <p className="text-xs text-gray-500">Từ 192.168.1.1 • Hà Nội, Việt Nam • 10:30 AM hôm nay</p>
              </div>
            </div>

            <div className="flex items-start p-2 rounded-md hover:bg-gray-50">
              <div className="p-1 bg-amber-100 rounded-full text-amber-600 mr-3">
                <AlertTriangle size={14} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">Thay đổi mật khẩu</p>
                <p className="text-xs text-gray-500">Từ 192.168.1.1 • Hà Nội, Việt Nam • 1 tuần trước</p>
              </div>
            </div>
          </div>

          <button className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center">
            <ShieldCheck size={14} className="mr-1.5" />
            <span>Xem toàn bộ nhật ký bảo mật</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySetting;