import { BellDot } from 'lucide-react'
import React from 'react'

export const OverviewPages = () => {
  return (
    <div className='Main'>
      {/* header */}
      <div className='flex justify-between w-full'>
        <div>
        <p className='text-base font-bold'>Nguyễn Đình Trưng</p>
        <p className='text-xs'>Let's finish your task today!</p>
        </div>
        <div className='flex gap-4 items-center'>
          <BellDot size={24} className='cursor-pointer hover:text-indigo-600'/>
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md cursor-pointer"
          />
        <img src={require('../../assets/image/Calender.png')} alt="" className='w-64 h-w-64 border-2 border-gray-300 rounded-md'/>
        </div>
      </div>
      {/* <hr className='my-4'/> */}
      {/* body */}
      <div>
        <div className='flex gap-4 pb-2'>
        <p className='text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'>Approved</p>
        <p className='text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'>Pending</p>
        <p className='text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'>Completed</p>
        <p className='text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'>Assigned Task's</p>
        </div>
      </div>
      <div className='bg-white rounded-md shadow-md p-4'>
      <p className='text-xl font-bold pt-2'>Today's Task</p>
      </div>
    </div>
  )
}
