// HeaderPages.jsx
import React, { useContext, useState, useRef, useEffect } from 'react'
import { BellDot, ChevronLeft, X } from 'lucide-react'
import { Calendar } from '../Calendar'
import { AuthContext } from '../../contexts/start/AuthContext';

export const HeaderPages = () => {
    const auth = useContext(AuthContext);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationRef = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
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
    
    return (
        <div className='flex justify-between w-full py-4 px-6 bg-white rounded-lg shadow-sm'>
            <div className='flex flex-col'>
                <p className='text-lg font-bold text-gray-800 mb-1'>{auth?.user?.name || 'User Name'}</p>
                <p className='text-sm text-gray-500 font-medium'>Let's finish your task today!</p>
            </div>
            <div className='flex gap-5 items-center'>
                <div className="relative">
                    <div className="relative">
                        <BellDot 
                            size={24} 
                            className='cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors duration-200' 
                            onClick={toggleNotifications} 
                        />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                            3
                        </span>
                    </div>
                    
                    {isNotificationsOpen && (
                        <div 
                            ref={notificationRef}
                            className="absolute right-0 top-10 w-72 bg-white shadow-lg rounded-lg p-4 mt-2 z-50 border border-gray-100 transition-all duration-300 ease-in-out"
                        >
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="font-semibold text-gray-800">Notifications</p>
                                <button onClick={toggleNotifications} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="mt-3 max-h-60 overflow-y-auto">
                                <ul className="space-y-3">
                                    <li className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">New task assigned to you</p>
                                                <p className="text-xs text-gray-500 mt-0.5">10 minutes ago</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-2"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Meeting scheduled at 3 PM</p>
                                                <p className="text-xs text-gray-500 mt-0.5">1 hour ago</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 mt-1.5 bg-yellow-500 rounded-full mr-2"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">Your report is due tomorrow</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Yesterday</p>
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
                
                <div className="h-6 w-px bg-gray-200"></div>
                
                <div className="relative group">
                    <img
                        src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                        alt="User avatar"
                        className="w-10 h-10 rounded-lg cursor-pointer ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="ml-1">
                    <Calendar />
                </div>
            </div>
        </div>
    )
}
