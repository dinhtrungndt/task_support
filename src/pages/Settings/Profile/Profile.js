import React from 'react'

export const ProfileSetting = ({darkMode, profileSettings, handleProfileChange, timeZone}) => {
  return (
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
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
          value={profileSettings.timeZone}
          onChange={(e) => handleProfileChange('timeZone', e.target.text)}
        >
          {timeZone.map((zone) => (
            <option key={zone.text} value={zone.text}>
              {zone.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
  )
}
