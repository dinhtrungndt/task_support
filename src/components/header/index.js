import React, { useContext, useState } from 'react'
import { BellDot, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '../Calendar'
import { AuthContext } from '../../contexts/start/AuthContext';

export const HeaderPages = () => {
    const auth = useContext(AuthContext);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const toggleNotifications = () => {
        setIsNotificationsOpen(prevState => !prevState);
    }

    return (
        <div className='flex justify-between w-full'>
            <div>
                <p className='text-base font-bold'>{auth?.user?.name}</p>
                <p className='text-xs'>Let's finish your task today!</p>
            </div>
            <div className='flex gap-4 items-center'>
                <BellDot 
                    size={22} 
                    className='cursor-pointer hover:text-indigo-600' 
                    onClick={toggleNotifications} 
                />

                {isNotificationsOpen && (
                    <div className="absolute right-0 top-16 w-64 bg-white shadow-md rounded-lg p-4 mt-2 z-50">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm">Notifications</p>
                            <button onClick={toggleNotifications} className="text-xs text-gray-500 hover:text-gray-700">
                                <ChevronLeft size={16} />
                            </button>
                        </div>
                        <div className="mt-2">
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>New task assigned to you</li>
                                <li>Meeting scheduled at 3 PM</li>
                                <li>Your report is due tomorrow</li>
                            </ul>
                        </div>
                        <div className="mt-4 text-xs text-center">
                            <button className="text-blue-600 hover:text-blue-800" onClick={toggleNotifications}>
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                <img
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                    alt=""
                    className="w-8 h-8 rounded-md cursor-pointer"
                />
                <Calendar />
            </div>
        </div>
    )
}
