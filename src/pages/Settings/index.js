import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/start/AuthContext';
import { toast } from 'react-toastify';
import { AppearanceSetting } from './appearance/appearance';
import { SecuritySetting } from './security/security';
import { NotificationsSetting } from './notifications/notifications';
import { ProfileSetting } from './Profile/Profile';
import addressData from '../../assets/json/timezones.json';
import axiosClient from '../../api/axiosClient';
import { Cog, Save, UserCircle, Bell, ShieldCheck, Palette, Loader } from 'lucide-react';

export const SettingPages = () => {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [isSaving, setIsSaving] = useState(false);
  const [timeZone, setTimeZone] = useState([]);
  const [originalSettings, setOriginalSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profileSettings, setProfileSettings] = useState({
    name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: '',
    jobTitle: '',
    department: '',
    timeZone: 'GMT+7',
    avatar: null
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    teamUpdates: true,
    projectChanges: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    lastPasswordChange: null
  });

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!auth?.user?.id) return;

      setIsLoading(true);
      try {
        const response = await axiosClient.get('/profile');

        if (response.data && response.data.status === 200 && response.data.user) {
          const userData = response.data.user;

          const newProfileSettings = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            jobTitle: userData.jobTitle || '',
            department: userData.department || '',
            timeZone: userData.timeZone || 'GMT+7',
            avatar: userData.avatar || null
          };

          setProfileSettings(newProfileSettings);

          if (userData.notifications) {
            setNotificationSettings({
              emailNotifications: userData.notifications.emailNotifications ?? true,
              pushNotifications: userData.notifications.pushNotifications ?? true,
              taskReminders: userData.notifications.taskReminders ?? true,
              teamUpdates: userData.notifications.teamUpdates ?? true,
              projectChanges: userData.notifications.projectChanges ?? true
            });
          }

          if (userData.security) {
            setSecuritySettings({
              twoFactorAuth: userData.security.twoFactorAuth ?? false,
              sessionTimeout: userData.security.sessionTimeout || '30',
              lastPasswordChange: userData.updatedAt || null
            });
          }

          setOriginalSettings({
            profile: newProfileSettings,
            notifications: { ...notificationSettings },
            security: { ...securitySettings }
          });
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast.error('Không thể tải thông tin cài đặt. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
    setTimeZone(addressData);
  }, [auth?.user?.id]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    if (Object.keys(originalSettings).length === 0) return;

    const profileChanged = Object.keys(profileSettings).some(key =>
      originalSettings.profile?.[key] !== profileSettings[key]
    );

    const notificationChanged = Object.keys(notificationSettings).some(key =>
      originalSettings.notifications?.[key] !== notificationSettings[key]
    );

    const securityChanged = Object.keys(securitySettings).some(key =>
      originalSettings.security?.[key] !== securitySettings[key]
    );

    setHasChanges(profileChanged || notificationChanged || securityChanged);
  }, [profileSettings, notificationSettings, securitySettings, originalSettings]);

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

  const saveAllChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      const profileResponse = await axiosClient.put('/profile', profileSettings);

      const notificationResponse = await axiosClient.put('/profile', {
        notifications: notificationSettings
      });

      const securityResponse = await axiosClient.put('/profile', {
        security: securitySettings
      });

      setOriginalSettings({
        profile: { ...profileSettings },
        notifications: { ...notificationSettings },
        security: { ...securitySettings }
      });

      setHasChanges(false);
      toast.success('Tất cả thay đổi đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Không thể lưu thay đổi. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex h-screen items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className="flex flex-col items-center">
          <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-lg font-medium">Đang tải thông tin cài đặt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-0 flex items-center`}>
              <Cog className="w-8 h-8 mr-3 text-blue-500" />
              Cài đặt
            </h1>
            <button
              onClick={saveAllChanges}
              disabled={!hasChanges || isSaving}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl
                ${(!hasChanges || isSaving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Lưu thay đổi
                </>
              )}
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
                    <UserCircle className={`w-5 h-5 mr-3 ${activeTab === 'profile' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${activeTab === 'profile'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Thông tin người dùng</span>
                  </div>
                </li>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'notifications'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <div className="flex items-center">
                    <Bell className={`w-5 h-5 mr-3 ${activeTab === 'notifications' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${activeTab === 'notifications'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Thông báo</span>
                  </div>
                </li>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'security'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('security')}
                >
                  <div className="flex items-center">
                    <ShieldCheck className={`w-5 h-5 mr-3 ${activeTab === 'security' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${activeTab === 'security'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Bảo mật</span>
                  </div>
                </li>
                <li
                  className={`px-4 py-4 cursor-pointer transition-all duration-200 ${activeTab === 'appearance'
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`
                    : `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <div className="flex items-center">
                    <Palette className={`w-5 h-5 mr-3 ${activeTab === 'appearance' ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${activeTab === 'appearance'
                      ? 'text-blue-600'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Giao diện</span>
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
}