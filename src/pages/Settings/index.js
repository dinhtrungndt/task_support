import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/start/AuthContext';
import { toast } from 'react-toastify';
import { AppearanceSetting } from './appearance/appearance';
import { SecuritySetting } from './security/security';
import { NotificationsSetting } from './notifications/notifications';
import { ProfileSetting } from './Profile/Profile';
import addressData from '../../assets/json/timezones.json';
import {
  Cog,
  Save,
  UserCircle,
  Bell,
  ShieldCheck,
  Palette,
  Loader,
  Check
} from 'lucide-react';
import { HeaderPages } from '../../components/header';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  updateProfile,
  updateNotifications,
  updateSecurity,
  // Sử dụng các action mới chỉ cập nhật state
  updateProfileState,
  updateNotificationsState,
  updateSecurityState
} from '../../stores/redux/actions/profileAction';

export const SettingPages = () => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [isSaving, setIsSaving] = useState(false);
  const [timeZone, setTimeZone] = useState([]);
  const [originalSettings, setOriginalSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const defaultSettings = {
    profileSettings: {
      name: auth?.user?.name || '',
      email: auth?.user?.email || '',
      phone: '',
      jobTitle: '',
      department: '',
      timeZone: 'GMT+7',
      avatar: null
    },
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      teamUpdates: true,
      projectChanges: true
    },
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      lastPasswordChange: null
    },
    loading: true
  };

  const reduxState = useSelector(state => state.profiles);
  const {
    profileSettings = defaultSettings.profileSettings,
    notificationSettings = defaultSettings.notificationSettings,
    securitySettings = defaultSettings.securitySettings,
    loading: isLoading = defaultSettings.loading
  } = reduxState || defaultSettings;

  useEffect(() => {
    dispatch(fetchProfile());
    setTimeZone(addressData);
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Store original settings to track changes
  useEffect(() => {
    if (profileSettings && notificationSettings && securitySettings) {
      setOriginalSettings({
        profile: { ...profileSettings },
        notifications: { ...notificationSettings },
        security: { ...securitySettings }
      });
    }
  }, [profileSettings, notificationSettings, securitySettings]);

  // Check for changes in settings
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

  // Chỉ cập nhật state, không gọi API
  const handleNotificationChange = (setting) => {
    dispatch(updateNotificationsState({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    }));
  };

  // Chỉ cập nhật state, không gọi API
  const handleProfileChange = (field, value) => {
    dispatch(updateProfileState({
      ...profileSettings,
      [field]: value
    }));
  };

  // Chỉ cập nhật state, không gọi API
  const handleSecurityChange = (field, value) => {
    dispatch(updateSecurityState({
      ...securitySettings,
      [field]: value
    }));
  };

  // Chỉ khi nhấn nút "Lưu thay đổi" mới gọi API
  const saveAllChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      // Update profile settings
      await dispatch(updateProfile(profileSettings));

      // Update notification settings
      await dispatch(updateNotifications(notificationSettings));

      // Update security settings
      await dispatch(updateSecurity(securitySettings));

      // Update original settings to match current settings
      setOriginalSettings({
        profile: { ...profileSettings },
        notifications: { ...notificationSettings },
        security: { ...securitySettings }
      });

      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast.success('Tất cả thay đổi đã được lưu thành công!');
    } catch (error) {
      toast.error('Không thể lưu thay đổi. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderPages title="Cài đặt" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-lg font-medium text-gray-800">Đang tải thông tin cài đặt...</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Thông tin người dùng', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'notifications', label: 'Thông báo', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', label: 'Bảo mật', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'appearance', label: 'Giao diện', icon: <Palette className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderPages title="Cài đặt" />

      <div className="flex-1 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Cog className="w-6 h-6 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Cài đặt tài khoản</h1>
            </div>

            <button
              onClick={saveAllChanges}
              disabled={!hasChanges || isSaving}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all
                ${(!hasChanges || isSaving)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
                } ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              {isSaving ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  <span>Đang lưu...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check size={16} className="mr-2" />
                  <span>Đã lưu thành công</span>
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Settings Navigation - Sidebar for desktop, Tabs for mobile */}
            <div className="w-full lg:w-64 flex-shrink-0">
              {/* Desktop Navigation */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {tabs.map(tab => (
                    <li
                      key={tab.id}
                      className={`
                        cursor-pointer transition-colors
                        ${activeTab === tab.id
                          ? 'bg-indigo-50 border-l-4 border-indigo-600'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'}
                      `}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <div className="flex items-center px-4 py-3">
                        <div className={`mr-3 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {tab.icon}
                        </div>
                        <span className={`text-sm font-medium ${activeTab === tab.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {tab.label}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4">
                <div className="flex overflow-x-auto no-scrollbar">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`
                        flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <div className="mr-1.5">
                        {tab.icon}
                      </div>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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

export default SettingPages;