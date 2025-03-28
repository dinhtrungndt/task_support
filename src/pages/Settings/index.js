import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/start/AuthContext';

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
  const [profileSettings, setProfileSettings] = useState({
    name: auth?.user?.name,
    email: auth?.user?.email,
    phone: "+84 123 456 789",
    role: "Project Manager",
    department: "Product Development",
    timeZone: "Asia/Ho_Chi_Minh"
  });
  
  // Áp dụng chế độ tối nếu được chọn
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
                  <div className="p-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      Profile Settings
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center mb-8 pb-6 border-b border-dashed border-gray-200">
                      <div className="mr-6 mb-4 md:mb-0 relative group">
                        <img 
                          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Luân" 
                          alt="Profile Avatar" 
                          className="w-24 h-24 rounded-full ring-4 ring-blue-100 shadow-md transition duration-300 group-hover:ring-blue-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
                          {profileSettings.name || 'Your Name'}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
                          {profileSettings.role} at {profileSettings.department}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-blue-50 hover:bg-blue-100 text-blue-600'} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-sm`}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Change Photo
                          </button>
                          <button className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} text-sm font-medium transition-colors`}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Full Name</label>
                        <input 
                          type="text" 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                          value={profileSettings.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email Address</label>
                        <input 
                          type="email" 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                          value={profileSettings.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Phone Number</label>
                        <input 
                          type="tel" 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                          value={profileSettings.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          placeholder="+84 XXX XXX XXX"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Job Role</label>
                        <input 
                          type="text" 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                          value={profileSettings.role}
                          onChange={(e) => handleProfileChange('role', e.target.value)}
                          placeholder="Your position in the company"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Department</label>
                        <select 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-no-repeat bg-right`}
                          style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                          value={profileSettings.department}
                          onChange={(e) => handleProfileChange('department', e.target.value)}
                        >
                          <option value="Product Development">Product Development</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Customer Support">Customer Support</option>
                          <option value="HR">Human Resources</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Time Zone</label>
                        <select 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-no-repeat bg-right`}
                          style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                          value={profileSettings.timeZone}
                          onChange={(e) => handleProfileChange('timeZone', e.target.value)}
                        >
                          <option value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</option>
                          <option value="Asia/Singapore">Singapore (GMT+8)</option>
                          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                          <option value="America/New_York">New York (GMT-4)</option>
                          <option value="Europe/London">London (GMT+1)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      Notification Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      {Object.entries({
                        emailNotifications: {
                          title: "Email Notifications",
                          description: "Receive daily updates and important announcements via email"
                        },
                        pushNotifications: {
                          title: "Push Notifications",
                          description: "Receive alerts on your device for critical updates"
                        },
                        taskReminders: {
                          title: "Task Reminders",
                          description: "Get reminded about upcoming and overdue tasks"
                        },
                        teamUpdates: {
                          title: "Team Updates",
                          description: "Receive notifications when team members make changes"
                        },
                        projectChanges: {
                          title: "Project Changes",
                          description: "Get notified about project updates and milestones"
                        }
                      }).map(([key, {title, description}]) => (
                        <div key={key} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200`}>
                          <div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>{title}</h3>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${notificationSettings[key] ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                              onClick={() => handleNotificationChange(key)}
                              role="switch"
                              aria-checked={notificationSettings[key]}
                            >
                              <span 
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'}`} 
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      Security Settings
                    </h2>
                    
                    <div className="space-y-8">
                      <div>
                        <div className={`flex items-center justify-between mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div>
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>Two-Factor Authentication</h3>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add an extra layer of security to your account</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${securitySettings.twoFactorAuth ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                              onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                              role="switch"
                              aria-checked={securitySettings.twoFactorAuth}
                            >
                              <span 
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out ${securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} 
                              />
                            </button>
                          </div>
                        </div>
                        {securitySettings.twoFactorAuth && (
                          <div className={`${darkMode ? 'bg-blue-900 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800'} p-4 rounded-lg border-l-4 border-blue-500 mt-3 mb-6`}>
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${darkMode ? 'text-blue-200' : 'text-blue-800'} mb-2`}>Two-factor authentication is enabled</p>
                                <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Your account is protected with an additional layer of security</p>
                                <button className={`mt-2 text-xs font-medium ${darkMode ? 'text-blue-300 hover:text-blue-100' : 'text-blue-600 hover:text-blue-800'}`}>
                                  Configure settings
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Session Timeout</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>Automatically log out after a period of inactivity</p>
                        
                        <select 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-no-repeat bg-right`}
                          style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                        >
                          <option value="never">Never</option>
                          <option value="15">After 15 minutes</option>
                          <option value="30">After 30 minutes</option>
                          <option value="60">After 1 hour</option>
                          <option value="120">After 2 hours</option>
                        </select>
                      </div>
                      <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Password</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 flex items-center`}>
                          <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                          </svg>
                          Last changed 2 months ago
                        </p>
                        
                        <button className={`${darkMode 
                          ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                          : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                        } px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm flex items-center`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                          </svg>
                          Change Password
                        </button>
                      </div>
                      <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Connected Devices</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 flex`}>
                          Manage devices that are currently signed in to your account
                        </p>
                        
                        <button className={`text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center transition-colors`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          View all devices
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="p-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      Appearance
                    </h2>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Theme</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className={`border rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 ${!darkMode 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200'}`}
                            onClick={() => setDarkMode(false)}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Light Mode</span>
                              {!darkMode && (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                              )}
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col space-y-2 shadow-sm">
                              <div className="h-2 w-8 bg-gray-800 rounded"></div>
                              <div className="h-1 w-full bg-gray-200 rounded"></div>
                              <div className="flex space-x-1">
                                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                <div className="h-4 w-8 rounded bg-gray-300"></div>
                              </div>
                              <div className="h-1 w-10 bg-gray-300 rounded"></div>
                              <div className="h-1 w-7 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                          <div 
                            className={`border rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-105 ${darkMode 
                              ? 'border-blue-500 bg-gray-900 shadow-md' 
                              : 'border-gray-200 hover:bg-gray-100'}`}
                            onClick={() => setDarkMode(true)}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Dark Mode</span>
                              {darkMode && (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                              )}
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex flex-col space-y-2 shadow-sm">
                              <div className="h-2 w-8 bg-white rounded"></div>
                              <div className="h-1 w-full bg-gray-700 rounded"></div>
                              <div className="flex space-x-1">
                                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                <div className="h-4 w-8 rounded bg-gray-600"></div>
                              </div>
                              <div className="h-1 w-10 bg-gray-600 rounded"></div>
                              <div className="h-1 w-7 bg-gray-600 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Density</h3>
                        
                        <div className="space-y-3">
                          {['compact', 'comfortable', 'spacious'].map((density, index) => (
                            <div key={density} className="flex items-center">
                              <input 
                                type="radio" 
                                id={density} 
                                name="density" 
                                className={`${darkMode ? 'text-blue-500 border-gray-700 focus:ring-blue-600' : 'text-blue-600 border-gray-300 focus:ring-blue-500'} h-4 w-4 focus:ring-2 focus:ring-offset-2`} 
                                defaultChecked={index === 1}
                              />
                              <label 
                                htmlFor={density} 
                                className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}
                              >
                                {density}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-3`}>Language</h3>
                        
                        <select 
                          className={`w-full px-4 py-3 rounded-lg ${darkMode 
                            ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-no-repeat bg-right`}
                          style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                        >
                          <option value="en">English</option>
                          <option value="vi">Vietnamese</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};