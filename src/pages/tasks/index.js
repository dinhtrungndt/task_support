import React, { useState, useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, Plus, Filter, Download, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { Tasks } from '../../components/Tasks';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';

export const TaskPages = () => {
  const dispatch = useDispatch();
  const { businesses, loading } = useSelector(state => state.business);
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
      results = results.filter(task => 
        task.installationHistory && 
        task.installationHistory[0] && 
        task.installationHistory[0].status === statusMap[activeFilter]
      );
    }
    
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase().trim();
      results = results.filter(task => {
        // Guard against missing properties
        if (!task.installationHistory || !task.installationHistory[0]) return false;
        
        return (
          (task.name || '').toLowerCase().includes(searchTermLower) ||
          (task.mst || '').toLowerCase().includes(searchTermLower) ||
          (task.address || '').toLowerCase().includes(searchTermLower) ||
          (task.connectionType || '').toLowerCase().includes(searchTermLower) ||
          (task.PInstaller || '').toLowerCase().includes(searchTermLower) ||
          (task.codeData || '').toLowerCase().includes(searchTermLower) ||
          (task.installationHistory[0].type || '').toLowerCase().includes(searchTermLower) ||
          (task.installationHistory[0].date || '').toLowerCase().includes(searchTermLower) ||
          (task.installationHistory[0].installer || '').toLowerCase().includes(searchTermLower) ||
          (task.installationHistory[0].status || '').toLowerCase().includes(searchTermLower)
        );
      });
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

  // Get counts for each status
  const getCounts = () => {
    if (!businesses || !Array.isArray(businesses)) return { all: 0, done: 0, pending: 0, rejected: 0 };
    
    const counts = {
      all: 0,
      done: 0,
      pending: 0,
      rejected: 0
    };
    
    businesses.forEach(business => {
      if (business.installationHistory && business.installationHistory.length > 0) {
        counts.all++;
        const status = business.installationHistory[0].status;
        if (status === 'Done') counts.done++;
        else if (status === 'Pending') counts.pending++;
        else if (status === 'Rejected') counts.rejected++;
      }
    });
    
    return counts;
  };
  
  const counts = getCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPages title="Quản lý công việc" />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-6xl">
        {/* Top Controls */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Search Bar */}
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button 
                className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                onClick={() => setOpenModalCreateTask(true)}
              >
                <Plus size={14} className="mr-1" />
                Thêm công việc
              </button>
              
              {selectedIds.length > 0 && (
                <button
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                  onClick={handleDeleteSelected}
                >
                  <XCircle size={14} className="mr-1" />
                  Xóa ({selectedIds.length})
                </button>
              )}
              
              <button 
                className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                <Filter size={14} className="mr-1" />
                Lọc
              </button>
              
              <button 
                className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                <Download size={14} className="mr-1" />
                Xuất
              </button>
            </div>
          </div>
        </div>
        
        {/* Status Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <div 
            className={`bg-white p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
              activeFilter === 'All' ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => handleFilterClick('All')}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Tất cả công việc</span>
                <span className="text-lg sm:text-xl font-semibold mt-0.5">{counts.all}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Calendar size={16} />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
              activeFilter === 'Done' ? 'border-green-500 shadow-sm' : 'border-gray-200 hover:border-green-200'
            }`}
            onClick={() => handleFilterClick('Done')}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Hoàn thành</span>
                <span className="text-lg sm:text-xl font-semibold mt-0.5 text-green-600">{counts.done}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle size={16} />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
              activeFilter === 'Pending' ? 'border-amber-500 shadow-sm' : 'border-gray-200 hover:border-amber-200'
            }`}
            onClick={() => handleFilterClick('Pending')}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Đang xử lý</span>
                <span className="text-lg sm:text-xl font-semibold mt-0.5 text-amber-600">{counts.pending}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock size={16} />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
              activeFilter === 'Rejected' ? 'border-red-500 shadow-sm' : 'border-gray-200 hover:border-red-200'
            }`}
            onClick={() => handleFilterClick('Rejected')}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Từ chối</span>
                <span className="text-lg sm:text-xl font-semibold mt-0.5 text-red-600">{counts.rejected}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <XCircle size={16} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Line */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs sm:text-sm text-gray-600">
            {filteredTasks.length > 0 
              ? <span className="font-medium">Tổng <span className="text-blue-600 font-semibold">{filteredTasks.length}</span> công việc</span>
              : "Không tìm thấy công việc nào"}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {activeFilter !== 'All' && 
              `Hiển thị: ${activeFilter === 'Done' ? 'Hoàn thành' : activeFilter === 'Pending' ? 'Đang xử lý' : 'Từ chối'}`
            }
          </p>
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
          loading={loading}
        />
      </div>

      {/* Edit Task Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Chỉnh sửa thông tin công việc"
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