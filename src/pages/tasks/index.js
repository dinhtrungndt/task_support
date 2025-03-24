import React, { useState, useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, MoreVertical } from 'lucide-react';
import { TaskData } from '../../stores/data/task.task';
import { CreateTask } from '../../components/modals/CreateTask';
import DropdownMenu from '../../components/DropdownMenu';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';

export const TaskPages = () => {
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(TaskData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Tìm kiếm và lọc dữ liệu
  useEffect(() => {
    filterTasks();
  }, [searchTerm, activeFilter]);

  const filterTasks = () => {
    let results = TaskData;

    // Lọc theo trạng thái nếu không phải 'all'
    if (activeFilter !== 'all') {
      const statusMap = {
        Done: 'Done',
        Pending: 'Pending',
        rejected: 'Rejected'
      };
      results = results.filter(task => task.status === statusMap[activeFilter]);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(task =>
        task.mst.toLowerCase().includes(term) ||
        task.name.toLowerCase().includes(term) ||
        task.address.toLowerCase().includes(term) ||
        task.connectionType.toLowerCase().includes(term) ||
        task.PInstaller.toLowerCase().includes(term) ||
        task.codeData.toLowerCase().includes(term) ||
        task.typeData.toLowerCase().includes(term) ||
        (task.userId.name && task.userId.name.toLowerCase().includes(term))
      );
    }

    setFilteredTasks(results);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  return (
    <div>
      {/* Header */}
      <HeaderPages title="Tasks" />
      <div className="container mx-auto p-4 pb-0">
        {/* Search and Filter Buttons */}
        <div className="flex justify-between mt-4">
          <div className="flex w-1/3 border border-gray-400 rounded-lg p-2 text-xs py-1">
            <input
              type="text"
              placeholder="Search Task"
              className="w-full bg-transparent focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="mr-2 ml-2" color='#9ca3af' size={18} />
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-6 rounded-full text-xs ${activeFilter === 'all' ? 'bg-gray-600' : 'bg-gray-500'} text-white hover:bg-gray-600`}
              onClick={() => handleFilterClick('all')}
            >
              All
            </button>
            <button
              className={`px-4 rounded-full text-xs ${activeFilter === 'Done' ? 'bg-blue-600' : 'bg-blue-500'} text-white hover:bg-blue-600`}
              onClick={() => handleFilterClick('Done')}
            >
              Done
            </button>
            <button
              className={`px-3 rounded-full text-xs ${activeFilter === 'Pending' ? 'bg-green-600' : 'bg-green-500'} text-white hover:bg-green-600`}
              onClick={() => handleFilterClick('Pending')}
            >
              Pending
            </button>
            <button
              className={`px-3 rounded-full text-xs ${activeFilter === 'rejected' ? 'bg-red-600' : 'bg-red-500'} text-white hover:bg-red-600`}
              onClick={() => handleFilterClick('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
        {openModalCreateTask ? (
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
            <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden ">
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
      </div>

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
  );
};