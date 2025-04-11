import React from 'react'

export const SecuritySetting = ({darkMode, securitySettings, handleSecurityChange}) => {
    return (
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
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
    )
}
