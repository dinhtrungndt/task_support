import React, { useContext, useState } from 'react'
import { BellDot, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '../Calendar'
import { AuthContext } from '../../contexts/start/AuthContext';

export const HeaderPages = () => {
    const auth = useContext(AuthContext);

    return (
        <div className='flex justify-between w-full'>
            <div>
                <p className='text-base font-bold'>{auth?.user?.name}</p>
                <p className='text-xs'>Let's finish your task today!</p>
            </div>
            <div className='flex gap-4 items-center'>
                <BellDot size={22} className='cursor-pointer hover:text-indigo-600' />
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
