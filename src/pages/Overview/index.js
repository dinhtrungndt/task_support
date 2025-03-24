import React, { useEffect, useState } from 'react'
import { HeaderPages } from '../../components/header'
import { TaskData } from '../../stores/data/task.task';
import { MoreVertical } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { CreateTask } from '../../components/modals/CreateTask';
import { TodayTasks } from './todayTask';

export const OverviewPages = () => {
  const [activeFilter, setActiveFilter] = useState('Assigned');
  const [filteredTasks, setFilteredTasks] = useState(TaskData);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);

  useEffect(() => {
    filterTasks();
  }, [activeFilter]);

  const filterTasks = () => {
    let results = TaskData;

    if (activeFilter !== 'Assigned') {
      const statusMap = {
        Done: 'Done',
        Pending: 'Pending',
        rejected: 'Rejected',
        Assigned: 'Assigned'
      };

      if (statusMap[activeFilter]) {
        results = results.filter(task => task.status === statusMap[activeFilter]);
      }
    }

    setFilteredTasks(results);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleMoreOptions = (task) => {
    setSelectedTask(task);
    setMoreModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map(task => task.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleSaveTask = (updatedTask) => {
    console.log('Saving updated task:', updatedTask);
    // Thực hiện logic cập nhật task
    // Ví dụ:
    // const updatedTasks = filteredTasks.map(task => 
    //   task.mst === updatedTask.mst ? updatedTask : task
    // );
    // setFilteredTasks(updatedTasks);

    setEditModalOpen(false);
  };

  return (
    <div className='Main'>
      {/* header */}
      <HeaderPages title="Overview" />
      {/* <hr className='my-4'/> */}
      {/* body */}
      <div>
      <div className='flex gap-4 pb-2'> <p 
        className={`${activeFilter === 'Assigned' ? 'text-xs font-bold text-teal-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`}
           onClick={() => handleFilterClick('Assigned')}>Assigned Task's</p>
        <p 
        className={`${activeFilter === 'Done' ? 'text-xs font-bold text-indigo-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`} 
           onClick={() => handleFilterClick('Done')}>Done</p>
        <p 
        className={`${activeFilter === 'Pending' ? 'text-xs font-bold text-green-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`}
           onClick={() => handleFilterClick('Pending')}>Pending</p>
        <p 
        className={`${activeFilter === 'rejected' ? 'text-xs font-bold text-red-600 hover:text-indigo-600 cursor-pointer' : 'text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer'}`}
           onClick={() => handleFilterClick('rejected')}>rejected</p>
      </div>
      </div>
      { activeFilter === 'Assigned' ? (
      <div>
        <TodayTasks />
      </div>
    ) : activeFilter === 'all' ? (
      <div className='bg-white rounded-md shadow-md p-4'>
        <p className='text-xl font-bold pt-2'>Today's Action</p>
      </div>
      ) :  openModalCreateTask ? (
        <CreateTask closeModal={() => setOpenModalCreateTask(false)} />
      ) : (
        <>
          {/* Text and create task*/}
          <div className="flex items-center mt-4">
          <p className="text-sm font-bold">
            {filteredTasks.length > 0
              ? `All Tasks (${filteredTasks.length})`
              : "No tasks found"}
          </p>
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
                    <th scope="col" className="px-3 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
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
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50 text-xs">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={selectedIds.includes(task._id)}
                              onChange={() => handleCheckboxChange(task._id)}
                            />
                          </div>
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
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${task.status === 'Done' ? 'bg-blue-500 px-4 py-0' :
                            task.status === 'Pending' ? 'bg-green-500 py-0' : 'bg-red-500 py-0'
                            }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="p-3 text-right relative">
                          <div>
                            <MoreVertical
                              className="cursor-pointer"
                              size={18}
                              onClick={() => toggleDropdown(index)}
                            />
                            <DropdownMenu
                              isOpen={activeDropdown === index}
                              onClose={() => setActiveDropdown(null)}
                              onEdit={() => handleEditTask(task)}
                              onMore={() => handleMoreOptions(task)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-3 py-8 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <p className="text-gray-500">Không tìm thấy kết quả nào</p>
                          {searchTerm && (
                            <button
                              className="mt-2 text-blue-600 hover:text-blue-800"
                              onClick={() => setSearchTerm("")}
                            >
                              Xóa tìm kiếm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
        
      )}

      {/* Edit Task Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Chỉnh sửa thông tin"
      >
        <EditTaskModal
          task={selectedTask}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveTask}
        />
      </Modal>

      {/* More Details Modal */}
      <Modal
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        title="Chi tiết công việc"
      >
        <MoreDetailsModal task={selectedTask} />
      </Modal>
    </div>
  )
}
