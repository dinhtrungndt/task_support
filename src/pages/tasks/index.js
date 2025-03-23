import React, { useState, useEffect, useRef } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, MoreVertical, Edit, MoreHorizontal } from 'lucide-react';
import { TaskData } from '../../stores/data/task.task';
import { CreateTask } from '../../components/modals/CreateTask';

// Component Dropdown Menu
const DropdownMenu = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-4 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"
    >
      <ul className="py-1">
        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center">
          <Edit size={14} className="mr-2" />
          <span>Edit</span>
        </li>
        <li className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center">
          <MoreHorizontal size={14} className="mr-2" />
          <span>More</span>
        </li>
      </ul>
    </div>
  );
};

export const TaskPages = () => {
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(TaskData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const handleEditTask = (taskId) => {
    console.log('Edit task:', taskId);
    setActiveDropdown(null);
    // Thêm logic xử lý khi nhấn Edit
  };

  const handleMoreOptions = (taskId) => {
    console.log('More options for task:', taskId);
    setActiveDropdown(null);
    // Thêm logic xử lý khi nhấn More
  };

  return (
    <div>
      {/* Header */}
      <HeaderPages title="Tasks" />
      <div className="container mx-auto p-4 pb-0">
        {/* Search and Filter Buttons */}
        <div className="flex justify-between mt-4">
          <div className="flex w-1/3 border border-gray-400 rounded-lg p-2 text-xs">
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
              className={`px-3 rounded-full text-xs ${activeFilter === 'Done' ? 'bg-blue-600' : 'bg-blue-500'} text-white hover:bg-blue-600`}
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
            <button 
              className={`px-3 rounded-full text-xs ${activeFilter === 'all' ? 'bg-gray-600' : 'bg-gray-500'} text-white hover:bg-gray-600`}
              onClick={() => handleFilterClick('all')}
            >
              All
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
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task, index) => (
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
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="p-4 text-center text-gray-500">
                          Không tìm thấy dữ liệu phù hợp
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
    </div>
  );
};