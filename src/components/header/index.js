import React from 'react'
import { BellDot } from 'lucide-react'

export const HeaderPages = () => {
    return (
        <div className='flex justify-between w-full'>
            <div>
                <p className='text-base font-bold'>Nguyễn Đình Trưng</p>
                <p className='text-xs'>Let's finish your task today!</p>
            </div>
            <div className='flex gap-4 items-center'>
                <BellDot size={24} className='cursor-pointer hover:text-indigo-600' />
                <img
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                    alt=""
                    className="w-10 h-10 rounded-md cursor-pointer"
                />
                <img src={require('../../assets/image/Calender.png')} alt="" className='w-64 h-w-64 border-2 border-gray-300 rounded-md' />
            </div>
        </div>
    )
}
