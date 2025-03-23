import React, { useState } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, MoreVertical } from 'lucide-react';
import { TaskData } from '../../stores/data/task.task';
import { CreateTask } from '../../components/modals/CreateTask';

export const TaskPages = () => {
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);

  return (
    <div>
      {/* Header */}
      <HeaderPages title="Tasks" />
      <div className="container mx-auto p-4 pb-0">
        {/* Search and Filter Buttons */}
        <div className="flex justify-between mt-4">
          <div className="flex w-1/3 border border-gray-400 rounded-lg p-2 text-xs">
            <input type="text" placeholder="Search Task" className="w-full bg-transparent focus:outline-none" />
            <Search className="mr-2 ml-2" color='#9ca3af' size={18} />
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-3 rounded-full text-xs hover:bg-blue-600">Approved</button>
            <button className="bg-green-500 text-white px-3 rounded-full text-xs hover:bg-green-600">Pending</button>
            <button className="bg-red-500 text-white px-3 rounded-full text-xs hover:bg-red-600">Rejected</button>
          </div>
        </div>
        {openModalCreateTask ? (
          <CreateTask closeModal={() => setOpenModalCreateTask(false)} />
        ) : (
          <>
        {/* Text and create task*/}
        <div className="flex items-center mt-4">
          <p className="text-sm font-bold">All Tasks</p>
          <button
            className="bg-blue-500 text-white px-6 py-1 rounded-md text-sm hover:bg-blue-600 ml-6"
            onClick={() => setOpenModalCreateTask((prev) => !prev)}
          >
            {openModalCreateTask ? "Close" : "Create Task"}
          </button>
        </div>

            {/* Task List */}
            <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0">
                    <tr className='text-xs'>
                      <th className="p-3 w-10">
                        <input type="checkbox" />
                      </th>
                      <th className="p-3">MST</th>
                      <th className="p-3">Tên công ty</th>
                      <th className="p-3">Địa chỉ</th>
                      <th className="p-3">Loại kết nối</th>
                      <th className="p-3">Người lắp đặt</th>
                      <th className="p-3">Mã dữ liệu</th>
                      <th className="p-3">Loại dữ liệu</th>
                      <th className="p-3">Ngày lắp</th>
                      <th className="p-3">Người tạo</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {TaskData.map((task, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50 text-xs">
                        <td className="p-3">
                          <input type="checkbox" />
                        </td>
                        <td className="p-3">{task.mst}</td>
                        <td className="p-3">{task.name}</td>
                        <td className="p-3">{task.address}</td>
                        <td className="p-3">{task.connectionType}</td>
                        <td className="p-3">{task.PInstaller}</td>
                        <td className="p-3">{task.codeData}</td>
                        <td className="p-3">{task.typeData}</td>
                        <td className="p-3">{task.AtSetting}</td>
                        <td className="p-3">{task.userId.name}</td>
                        <td className="p-3">{task.status}</td>
                        <td className="p-3 text-right">
                          <MoreVertical className="cursor-pointer" size={18} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        {/* Submit for Approvel */}
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Submit for Approval</button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};