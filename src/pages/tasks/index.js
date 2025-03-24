import React, { useState, useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, MoreVertical } from 'lucide-react';
import { TaskData } from '../../stores/data/task.task';
import { CreateTask } from '../../components/modals/CreateTask';
import DropdownMenu from '../../components/DropdownMenu';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { Tasks } from '../../components/Tasks';

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
        <Tasks
          filteredTasks={filteredTasks}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedIds={selectedIds}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          handleCheckboxChange={handleCheckboxChange}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          handleEditTask={handleEditTask}
          handleMoreOptions={handleMoreOptions}
          openModalCreateTask={openModalCreateTask}
          setOpenModalCreateTask={setOpenModalCreateTask}
        />
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