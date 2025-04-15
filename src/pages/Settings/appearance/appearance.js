import React from 'react';
import {
  Palette,
  Moon,
  Sun,
  Layout,
  Monitor,
  Smartphone,
  Laptop,
  Globe
} from 'lucide-react';

export const AppearanceSetting = ({ darkMode, setDarkMode }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Giao diện
      </h2>

      <div className="space-y-8">
        {/* Theme Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center">
            <Palette size={16} className="mr-2 text-indigo-600" />
            Chế độ giao diện
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Mode Card */}
            <div
              className={`border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                !darkMode
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
              onClick={() => setDarkMode(false)}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <Sun size={18} className={`mr-2 ${!darkMode ? 'text-indigo-600' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${!darkMode ? 'text-indigo-700' : 'text-gray-700'}`}>
                    Chế độ sáng
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full ${!darkMode ? 'bg-indigo-600' : 'bg-gray-200'} flex items-center justify-center`}>
                  {!darkMode && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="h-2 w-10 bg-gray-800 rounded mb-3"></div>
                  <div className="h-1 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-1 w-4/5 bg-gray-200 rounded mb-3"></div>
                  <div className="flex space-x-1 mb-3">
                    <div className="h-4 w-4 rounded-full bg-indigo-500"></div>
                    <div className="h-4 w-12 rounded bg-gray-300"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    <div className="h-5 w-12 bg-indigo-500 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Mode Card */}
            <div
              className={`border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                darkMode
                  ? 'border-indigo-500 bg-gray-800 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setDarkMode(true)}
            >
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center`}>
                <div className="flex items-center">
                  <Moon size={18} className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Chế độ tối
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full ${darkMode ? 'bg-indigo-500' : 'bg-gray-200'} flex items-center justify-center`}>
                  {darkMode && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
              <div className="p-4" style={{ background: darkMode ? '#1F2937' : 'white' }}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-900'} border ${darkMode ? 'border-gray-700' : 'border-gray-800'} rounded-lg p-4 shadow-sm`}>
                  <div className="h-2 w-10 bg-gray-200 rounded mb-3"></div>
                  <div className="h-1 w-full bg-gray-700 rounded mb-2"></div>
                  <div className="h-1 w-4/5 bg-gray-700 rounded mb-3"></div>
                  <div className="flex space-x-1 mb-3">
                    <div className="h-4 w-4 rounded-full bg-indigo-400"></div>
                    <div className="h-4 w-12 rounded bg-gray-600"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-gray-600 rounded"></div>
                    <div className="h-5 w-12 bg-indigo-400 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Density */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center">
            <Layout className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">Mật độ hiển thị</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-4">
              Điều chỉnh khoảng cách giữa các phần tử để tối ưu hóa không gian hiển thị trên giao diện.
            </p>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="density"
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
                  defaultChecked={true}
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Tiêu chuẩn</span>
                  <p className="text-xs text-gray-500">Khoảng cách cân bằng, phù hợp với hầu hết trường hợp sử dụng</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="density"
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Tổng quan</span>
                  <p className="text-xs text-gray-500">Khoảng cách rộng hơn, dễ đọc hơn</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="density"
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Gọn gàng</span>
                  <p className="text-xs text-gray-500">Khoảng cách nhỏ nhất, hiển thị nhiều thông tin</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-800">Kích thước chữ</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-4">
              Điều chỉnh kích thước chữ để phù hợp với nhu cầu đọc của bạn.
            </p>

            <div className="space-y-1">
              <p className="text-xs text-gray-500">Kích thước chữ</p>
              <input
                type="range"
                min="1"
                max="5"
                defaultValue="3"
                step="1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Nhỏ</span>
                <span>Vừa</span>
                <span>Lớn</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-700 font-medium mb-1">Xem trước:</p>
              <p className="text-base">Đây là văn bản kích thước thông thường</p>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center">
            <Globe className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">Ngôn ngữ</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-4">
              Chọn ngôn ngữ hiển thị cho giao diện người dùng.
            </p>

            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200 appearance-none">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="zh">中文</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Device Preview */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center">
            <Monitor className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-800">Xem trước thiết bị</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-4">
              Xem trước giao diện trên các loại thiết bị khác nhau.
            </p>

            <div className="flex justify-around pb-1 border-b border-gray-200 mb-4">
              <button className="p-2 text-indigo-600 border-b-2 border-indigo-600 flex flex-col items-center">
                <Monitor size={20} className="mb-1" />
                <span className="text-xs font-medium">Desktop</span>
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600 flex flex-col items-center">
                <Laptop size={20} className="mb-1" />
                <span className="text-xs font-medium">Laptop</span>
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600 flex flex-col items-center">
                <Smartphone size={20} className="mb-1" />
                <span className="text-xs font-medium">Mobile</span>
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex justify-center">
              <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="h-8 bg-indigo-600 flex items-center px-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-1.5"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-1.5"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3 mb-3"></div>

                  <div className="flex justify-end">
                    <div className="h-6 w-16 bg-indigo-100 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSetting;