import React from 'react'
import { HeaderPages } from '../../components/header'

export const OverviewPages = () => {
  return (
    <div className='Main'>
      {/* header */}
      <HeaderPages  title="Overview"/>
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
