import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/start/AuthContext';
import { toast } from 'react-toastify';
import { AppearanceSetting } from './appearance/appearance';
import { SecuritySetting } from './security/security';
import { NotificationsSetting } from './notifications/notifications';
import { ProfileSetting } from './Profile/Profile';

export const SettingPages = () => {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    teamUpdates: true,
    projectChanges: true
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30"
  });
  const [timeZone, setTimeZone] = useState([]);
  const [profileSettings, setProfileSettings] = useState({
    name: auth?.user?.name,
    email: auth?.user?.email,
    phone: "+84 123 456 789",
    role: "Project Manager",
    department: "Product Development",
    timeZone: "GMT+7"
  });

  useEffect(() => {
    const fetchTimeZone = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/refs/heads/master/timezones.json');
        const data = await response.json();
        setTimeZone(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố");
      }
    };
    fetchTimeZone();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleProfileChange = (field, value) => {
    setProfileSettings({
      ...profileSettings,
      [field]: value
    });
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings({
      ...securitySettings,
      [field]: value
    });
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-0 flex items-center`}>
              <svg className="w-8 h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Save Changes
            </button>
          </div>

          {/* Settings Navigation and Content - Responsive Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings Navigation */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden w-full md:w-72 border transition-all duration-300 mb-6 md:mb-0`}>
              <ul className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'profile'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'profile' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className={`text-sm font-medium ${activeTab === 'profile'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Profile Settings</span>
                  </div>
                </li>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'notifications'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'notifications' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className={`text-sm font-medium ${activeTab === 'notifications'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Notifications</span>
                  </div>
                </li>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'security'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('security')}
                >
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'security' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span className={`text-sm font-medium ${activeTab === 'security'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Security</span>
                  </div>
                </li>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'appearance'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <div className="flex items-center">
                    <svg className={`w-5 h-5 mr-3 ${activeTab === 'appearance' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    <span className={`text-sm font-medium ${activeTab === 'appearance'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Appearance</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg overflow-hidden border transition-all duration-300`}>
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                <ProfileSetting
                  darkMode={darkMode}
                  profileSettings={profileSettings}
                  handleProfileChange={handleProfileChange}
                  timeZone={timeZone}
                  />
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <NotificationsSetting
                    darkMode={darkMode}
                    notificationSettings={notificationSettings}
                    handleNotificationChange={handleNotificationChange}
                  />
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <SecuritySetting
                    darkMode={darkMode}
                    securitySettings={securitySettings}
                    handleSecurityChange={handleSecurityChange}
                  />
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <AppearanceSetting
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};