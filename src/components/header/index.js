import React, { useContext, useState, useRef, useEffect } from "react";
import {
  BellDot,
  ChevronLeft,
  X,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Menu,
  Search,
  LogOut,
  Settings,
  User,
  HelpCircle
} from "lucide-react";
import { Calendar } from "../Calendar";
import InlineSearch from "../search/InlineSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../contexts/start/AuthContext";

export const HeaderPages = ({ title }) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [greeting, setGreeting] = useState("");
  const { currentUser } = useSelector((state) => state.users);
    const { logoutUser, socket } = useContext(AuthContext);

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hours = new Date().getHours();
      let greetingText = "";

      if (hours >= 5 && hours < 12) {
        greetingText = "sáng";
      } else if (hours >= 12 && hours < 18) {
        greetingText = "chiều";
      } else {
        greetingText = "tối";
      }

      setGreeting(greetingText);
    };

    getTimeBasedGreeting();

    const intervalId = setInterval(getTimeBasedGreeting, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    if (socket) {
      socket.emit("user_logout", socket.id);
      socket.disconnect();
    }
    logoutUser();
  };

  return (
    <div className="flex justify-between w-full p-3 bg-gradient-to-r from-indigo-50 to-white rounded-lg shadow-md border border-indigo-100 sticky top-0 z-40 mb-4">
      {/* Left section */}
      <div className="flex items-center">
        <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md mr-3 hidden md:flex">
          <LayoutDashboard size={20} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-gray-800 mr-1">
              {title || "Tổng quan"}
            </h1>
            {title === "Tổng quan" && (
              <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                Dashboard
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Chào buổi <span className="text-indigo-600 font-medium">{greeting}</span>, {currentUser?.name || "User Name"}!
          </p>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <Menu size={20} />
        </button>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute right-4 top-16 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100 w-64 animate-fade-in"
          >
            <div className="space-y-3">
              <div className="relative w-full">
                <InlineSearch />
              </div>

              <div className="p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <BellDot size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Thông báo
                  </span>
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">
                    3
                  </span>
                </div>
              </div>

              <div className="p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <CalendarIcon size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Lịch
                  </span>
                </div>
              </div>

              <div className="p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate("/profile")}>
                <div className="flex items-center space-x-3">
                  <User size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Hồ sơ cá nhân
                  </span>
                </div>
              </div>

              <div className="p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate("/settings")}>
                <div className="flex items-center space-x-3">
                  <Settings size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Cài đặt
                  </span>
                </div>
              </div>

              <div className="border-t my-2"></div>

              <div className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={handleLogout}>
                <div className="flex items-center space-x-3">
                  <LogOut size={18} className="text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    Đăng xuất
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right section */}
      <div className="hidden md:flex items-center space-x-3">
        {/* Search Component */}
        <div className="relative w-64">
          <InlineSearch />
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-lg hover:bg-indigo-50 transition-colors relative"
            aria-label="Notifications"
          >
            <BellDot
              size={20}
              className="text-gray-600"
            />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
              3
            </span>
          </button>

          {isNotificationsOpen && (
            <div
              ref={notificationRef}
              className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100 animate-fade-in"
            >
              <div className="flex justify-between items-center border-b p-3">
                <p className="font-semibold text-gray-800 flex items-center">
                  <BellDot size={16} className="text-indigo-600 mr-2" />
                  Thông báo
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">3 mới</span>
                  <button
                    onClick={toggleNotifications}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto">
                <div className="p-1">
                  <div className="p-2 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-start">
                      <span className="mt-1 flex-shrink-0">
                        <span className="w-2 h-2 bg-blue-500 rounded-full inline-block mr-2"></span>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Bạn có nhiệm vụ mới được giao
                        </p>
                        <p className="text-xs text-gray-500 mt-1">10 phút trước</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-start">
                      <span className="mt-1 flex-shrink-0">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Cuộc họp được lên lịch lúc 15:00
                        </p>
                        <p className="text-xs text-gray-500 mt-1">1 giờ trước</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-start">
                      <span className="mt-1 flex-shrink-0">
                        <span className="w-2 h-2 bg-amber-500 rounded-full inline-block mr-2"></span>
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Báo cáo của bạn sẽ đến hạn vào ngày mai
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Hôm qua</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t bg-gray-50 flex items-center justify-between">
                <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                  Đánh dấu tất cả đã đọc
                </button>
                <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calendar icon */}
        <button className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
          <CalendarIcon size={20} className="text-gray-600" />
        </button>

        {/* Help icon */}
        <button className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
          <HelpCircle size={20} className="text-gray-600" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* User avatar with dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-indigo-50 transition-colors"
            onClick={toggleProfileMenu}
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(currentUser?.name || 'User')}`}
                alt="User avatar"
                className="w-8 h-8 rounded-full ring-2 ring-indigo-100"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div
              ref={profileMenuRef}
              className="absolute right-0 top-12 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 w-56 z-50 animate-fade-in"
            >
              <div className="p-3 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser?.avatar || `https://ui-avatars.com/api/?background=EBF4FF&color=4F46E5&bold=true&name=${encodeURIComponent(currentUser?.name || 'User')}`}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{currentUser?.name || "User Name"}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>

              <div className="p-1">
                <button className="w-full text-left p-2 flex items-center space-x-3 hover:bg-indigo-50 rounded-md transition-colors" onClick={() => navigate("/profile")}>
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Hồ sơ cá nhân</span>
                </button>

                <button className="w-full text-left p-2 flex items-center space-x-3 hover:bg-indigo-50 rounded-md transition-colors" onClick={() => navigate("/settings")}>
                  <Settings size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Cài đặt</span>
                </button>

                <div className="border-t my-1"></div>

                <button className="w-full text-left p-2 flex items-center space-x-3 hover:bg-red-50 rounded-md transition-colors" onClick={handleLogout}>
                  <LogOut size={16} className="text-red-500" />
                  <span className="text-sm text-red-500">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};