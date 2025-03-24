import React, { useContext, useState } from 'react';
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
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Save Changes
            </button>
          </div>

          {/* Settings Navigation */}
          <div className="flex mb-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-64 mr-6">
              <ul className="divide-y divide-gray-200">
                <li 
                  className={`px-4 py-3 cursor-pointer ${activeTab === 'profile' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-800">Profile Settings</span>
                  </div>
                </li>
                <li 
                  className={`px-4 py-3 cursor-pointer ${activeTab === 'notifications' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-800">Notifications</span>
                  </div>
                </li>
                <li 
                  className={`px-4 py-3 cursor-pointer ${activeTab === 'security' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-800">Security</span>
                  </div>
                </li>
                <li 
                  className={`px-4 py-3 cursor-pointer ${activeTab === 'appearance' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-800">Appearance</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Profile Settings</h2>
                    
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <img 
                          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Luân" 
                          alt="Profile Avatar" 
                          className="w-20 h-20 rounded-full"
                        />
                      </div>
                      <div>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm mr-2">
                          Change Photo
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={profileSettings.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={profileSettings.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={profileSettings.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={profileSettings.role}
                          onChange={(e) => handleProfileChange('role', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                          <p className="text-xs text-gray-500">Receive daily updates and important announcements via email</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onClick={() => handleNotificationChange('emailNotifications')}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Push Notifications</h3>
                          <p className="text-xs text-gray-500">Receive alerts on your device for critical updates</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onClick={() => handleNotificationChange('pushNotifications')}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Task Reminders</h3>
                          <p className="text-xs text-gray-500">Get reminded about upcoming and overdue tasks</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.taskReminders ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onClick={() => handleNotificationChange('taskReminders')}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.taskReminders ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Team Updates</h3>
                          <p className="text-xs text-gray-500">Receive notifications when team members make changes</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.teamUpdates ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onClick={() => handleNotificationChange('teamUpdates')}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.teamUpdates ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Project Changes</h3>
                          <p className="text-xs text-gray-500">Get notified about project updates and milestones</p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.projectChanges ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onClick={() => handleNotificationChange('projectChanges')}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.projectChanges ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h3>
                            <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <div className="flex items-center">
                            <button 
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
                              onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                            >
                              <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} 
                              />
                            </button>
                          </div>
                        </div>

                        {securitySettings.twoFactorAuth && (
                          <div className="bg-blue-50 p-4 rounded-md">
                            <p className="text-sm text-blue-800 mb-2">Two-factor authentication is enabled</p>
                            <p className="text-xs text-blue-700">Your account is protected with an additional layer of security</p>
                            <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">
                              Configure settings
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Session Timeout</h3>
                        <p className="text-xs text-gray-500 mb-3">Automatically log out after a period of inactivity</p>
                        
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Password</h3>
                        <p className="text-xs text-gray-500 mb-3">Last changed 2 months ago</p>
                        
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
                          Change Password
                        </button>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Connected Devices</h3>
                        <p className="text-xs text-gray-500 mb-3">Manage devices that are currently signed in to your account</p>
                        
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                          View all devices
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Appearance</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">Theme</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className={`border rounded-md p-4 cursor-pointer ${!darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            onClick={() => setDarkMode(false)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-800">Light Mode</span>
                              {!darkMode && (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                              )}
                            </div>
                            <div className="bg-white border border-gray-200 rounded p-2">
                              <div className="h-2 w-8 bg-gray-800 rounded mb-1"></div>
                              <div className="h-1 w-6 bg-gray-300 rounded mb-1"></div>
                              <div className="h-1 w-4 bg-gray-300 rounded"></div>
                            </div>
                          </div>

                          <div 
                            className={`border rounded-md p-4 cursor-pointer ${darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                            onClick={() => setDarkMode(true)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-800">Dark Mode</span>
                              {darkMode && (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                              )}
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded p-2">
                              <div className="h-2 w-8 bg-white rounded mb-1"></div>
                              <div className="h-1 w-6 bg-gray-600 rounded mb-1"></div>
                              <div className="h-1 w-4 bg-gray-600 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">Density</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" id="compact" name="density" className="mr-2" />
                            <label htmlFor="compact" className="text-sm text-gray-700">Compact</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="comfortable" name="density" className="mr-2" defaultChecked />
                            <label htmlFor="comfortable" className="text-sm text-gray-700">Comfortable</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="spacious" name="density" className="mr-2" />
                            <label htmlFor="spacious" className="text-sm text-gray-700">Spacious</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">Language</h3>
                        
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="en">English</option>
                          <option value="vi">Vietnamese</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};