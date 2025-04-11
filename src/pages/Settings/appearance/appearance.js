import React from 'react'

export const AppearanceSetting = ({darkMode, setDarkMode}) => {
    return (
        <>
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
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
        </>
    )
}
