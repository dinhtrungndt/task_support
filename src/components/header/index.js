// HeaderPages.jsx
import React, { useContext, useState, useRef, useEffect } from 'react'
import { BellDot, ChevronLeft, X, Search, Calendar as CalendarIcon, LayoutDashboard, Menu } from 'lucide-react'
import { Calendar } from '../Calendar'
import { AuthContext } from '../../contexts/start/AuthContext';

export const HeaderPages = () => {
    const auth = useContext(AuthContext);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const notificationRef = useRef(null);
    const mobileMenuRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleNotifications = () => {
        setIsNotificationsOpen(prevState => !prevState);
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prevState => !prevState);
    }
    
    return (
        <div className='flex justify-between w-full py-5 px-6 bg-gradient-to-r from-indigo-50 to-white rounded-lg shadow-md border border-indigo-100'>
            {/* Left section */}
            <div className='flex items-center'>
                <div className='bg-indigo-600 text-white p-2 rounded-lg shadow-md mr-4 hidden md:flex'>
                    <LayoutDashboard size={20} />
                </div>
                <div className='flex flex-col'>
                    <p className='text-xl font-bold text-gray-800 mb-1'>{auth?.user?.name || 'User Name'}</p>
                    <p className='text-sm text-indigo-600 font-medium'>Let's finish your task today!</p>
                </div>
            </div>
            
            {/* Mobile menu button */}
            <div className='md:hidden'>
                <button 
                    onClick={toggleMobileMenu}
                    className='text-gray-600 hover:text-indigo-600 transition-colors duration-200'
                >
                    <Menu size={24} />
                </button>
                
                {isMobileMenuOpen && (
                    <div 
                        ref={mobileMenuRef}
                        className='absolute right-4 top-16 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100 w-64'
                    >
                        <div className='space-y-3'>
                            <div className='relative'>
                                <input 
                                    type='text' 
                                    placeholder='Search...' 
                                    className='w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                />
                                <Search size={16} className='absolute left-3 top-2.5 text-gray-400' />
                            </div>
                            <div className='p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer'>
                                <div className='flex items-center space-x-3'>
                                    <BellDot size={18} className='text-indigo-600' />
                                    <span className='text-sm font-medium text-gray-700'>Notifications</span>
                                </div>
                            </div>
                            <div className='p-2 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer'>
                                <div className='flex items-center space-x-3'>
                                    <CalendarIcon size={18} className='text-indigo-600' />
                                    <span className='text-sm font-medium text-gray-700'>Calendar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Right section */}
            <div className='hidden md:flex items-center space-x-6'>
                {/* Search bar */}
                <div className='relative'>
                    <input 
                        type='text' 
                        placeholder='Search...' 
                        className='pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    />
                    <Search size={16} className='absolute left-3 top-2.5 text-gray-400' />
                </div>
                
                {/* Notification bell */}
                <div className="relative">
                    <div className="relative">
                        <BellDot 
                            size={24} 
                            className='cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors duration-200' 
                            onClick={toggleNotifications} 
                        />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold animate-pulse">
                            3
                        </span>
                    </div>
                    
                    {isNotificationsOpen && (
                        <div 
                            ref={notificationRef}
                            className="absolute right-0 top-10 w-80 bg-white shadow-xl rounded-lg p-4 mt-2 z-50 border border-gray-100 transition-all duration-300 ease-in-out"
                        >
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="font-semibold text-gray-800 flex items-center">
                                    <BellDot size={16} className="text-indigo-600 mr-2" />
                                    Notifications
                                </p>
                                <button onClick={toggleNotifications} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="mt-3 max-h-72 overflow-y-auto custom-scrollbar">
                                <ul className="space-y-3">
                                    <li className="p-2.5 hover:bg-indigo-50 rounded-md transition-colors">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2.5"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">New task assigned to you</p>
                                                <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="p-2.5 hover:bg-indigo-50 rounded-md transition-colors">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-2.5"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Meeting scheduled at 3 PM</p>
                                                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="p-2.5 hover:bg-indigo-50 rounded-md transition-colors">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 mt-1.5 bg-yellow-500 rounded-full mr-2.5"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Your report is due tomorrow</p>
                                                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-3 pt-2 border-t text-center">
                                <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors" onClick={toggleNotifications}>
                                    Clear All Notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="h-8 w-px bg-gray-200"></div>
                
                {/* User avatar */}
                <div className="relative group">
                    <img
                        src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                        alt="User avatar"
                        className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all duration-200 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                
                {/* Calendar component */}
                <div className="ml-1">
                    <Calendar />
                </div>
            </div>
        </div>
    )
}
