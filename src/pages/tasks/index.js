import React, { useState, useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { Tasks } from '../../components/Tasks';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';

export const TaskPages = () => {
  const dispatch = useDispatch();
  const { businesses } = useSelector(state => state.business);

  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  useEffect(() => {
    filterTasks();
  }, [searchTerm, activeFilter, businesses]);

  const filterTasks = () => {
    let results = businesses;

    if (activeFilter !== 'All') {
      const statusMap = {
        Done: 'Done',
        Pending: 'Pending',
        Rejected: 'Rejected'
      };
      results = results.filter(task => task.installationHistory[0].status === statusMap[activeFilter]);
    }

    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase().trim();
      results = results.filter(task =>
        task.name.toLowerCase().includes(searchTermLower) ||
        task.mst.toLowerCase().includes(searchTermLower) ||
        task.address.toLowerCase().includes(searchTermLower) ||
        task.connectionType.toLowerCase().includes(searchTermLower) ||
        task.PInstaller.toLowerCase().includes(searchTermLower) ||
        task.codeData.toLowerCase().includes(searchTermLower) ||
        task.installationHistory[0].type.toLowerCase().includes(searchTermLower) ||
        task.installationHistory[0].date.toLowerCase().includes(searchTermLower) ||
        task.installationHistory[0].installer.toLowerCase().includes(searchTermLower) ||
        task.installationHistory[0].status.toLowerCase().includes(searchTermLower)
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

  const handleDeleteSelected = () => {
    const tasksToDelete = selectedIds;
    const remainingTasks = filteredTasks.filter(task => !tasksToDelete.includes(task.id));
    setFilteredTasks(remainingTasks);
    setSelectedIds([]);
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
              className={`px-4 py-1 rounded-full text-xs ${activeFilter === 'All'
                ? 'bg-teal-100 text-teal-600 border border-teal-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
                } hover:bg-teal-50`}
              onClick={() => handleFilterClick('All')}
            >
              All
            </button>
            <button
              className={`px-4 py-1 rounded-full text-xs ${activeFilter === 'Done'
                ? 'bg-green-100 text-green-600 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
                } hover:bg-green-50`}
              onClick={() => handleFilterClick('Done')}
            >
              Done
            </button>
            <button
              className={`px-4 py-1 rounded-full text-xs ${activeFilter === 'Pending'
                ? 'bg-pink-100 text-pink-600 border border-pink-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
                } hover:bg-pink-50`}
              onClick={() => handleFilterClick('Pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-1 rounded-full text-xs ${activeFilter === 'Rejected'
                ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
                } hover:bg-yellow-50`}
              onClick={() => handleFilterClick('Rejected')}
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
          setActiveDropdown={setActiveDropdown}
          businesses={businesses}
          handleDeleteSelected={handleDeleteSelected}
        />
      </div>

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