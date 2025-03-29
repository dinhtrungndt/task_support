import React, { useEffect, useState } from 'react';
import { HeaderPages } from '../../components/header';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { TodayTasks } from './todayTask';
import { Tasks } from '../../components/Tasks';
import { ClipboardCheck, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBusinesses } from '../../stores/redux/actions/businessActions';
import { fetchTasks } from '../../stores/redux/actions/taskActions';

export const OverviewPages = () => {
  const dispatch = useDispatch();
  const { businesses } = useSelector(state => state.business);
  const { tasks, loading } = useSelector(state => state.tasks);
  const [activeFilter, setActiveFilter] = useState('Assigned');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);

  useEffect(() => {
    // Fetch both businesses and tasks data
    dispatch(fetchBusinesses());
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (activeFilter === 'Assigned') {
      setFilteredTasks(tasks);  
    } else {
      setFilteredTasks(
        tasks.filter((task) => task.status === activeFilter)
      );
    }
  }, [activeFilter, tasks]);
  
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
      setSelectedIds(filteredTasks.map(task => task._id));
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
    setEditModalOpen(false);
  };

  // Count tasks by status
  const taskCounts = {
    total: tasks.length,
    done: tasks.filter(task => task.status === 'Done').length,
    pending: tasks.filter(task => task.status === 'Pending').length,
    rejected: tasks.filter(task => task.status === 'Rejected').length,
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderPages title="Tổng quan" />
      
      {/* Main Content */}
      <div className="container mx-auto p-4 pb-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            className={`rounded-lg border shadow-sm overflow-hidden transition-all ${
              activeFilter === 'Assigned' 
                ? 'border-blue-500 ring-1 ring-blue-500 bg-white' 
                : 'border-gray-200 bg-white hover:border-blue-200'
            }`}
            onClick={() => handleFilterClick('Assigned')}
          >
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium text-gray-800">Tất cả công việc</h3>
                  <p className="text-2xl font-bold mt-1 text-blue-600">{taskCounts.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className={`h-1 w-full ${activeFilter === 'Assigned' ? 'bg-blue-500' : 'bg-transparent'}`}></div>
          </div>
          
          <div 
            className={`rounded-lg border shadow-sm overflow-hidden transition-all ${
              activeFilter === 'Done' 
                ? 'border-green-500 ring-1 ring-green-500 bg-white' 
                : 'border-gray-200 bg-white hover:border-green-200'
            }`}
            onClick={() => handleFilterClick('Done')}
          >
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium text-gray-800">Hoàn thành</h3>
                  <p className="text-2xl font-bold mt-1 text-green-600">{taskCounts.done}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className={`h-1 w-full ${activeFilter === 'Done' ? 'bg-green-500' : 'bg-transparent'}`}></div>
          </div>
          
          <div 
            className={`rounded-lg border shadow-sm overflow-hidden transition-all ${
              activeFilter === 'Pending' 
                ? 'border-amber-500 ring-1 ring-amber-500 bg-white' 
                : 'border-gray-200 bg-white hover:border-amber-200'
            }`}
            onClick={() => handleFilterClick('Pending')}
          >
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium text-gray-800">Đang thực hiện</h3>
                  <p className="text-2xl font-bold mt-1 text-amber-600">{taskCounts.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
            <div className={`h-1 w-full ${activeFilter === 'Pending' ? 'bg-amber-500' : 'bg-transparent'}`}></div>
          </div>
          
          <div 
            className={`rounded-lg border shadow-sm overflow-hidden transition-all ${
              activeFilter === 'Rejected' 
                ? 'border-red-500 ring-1 ring-red-500 bg-white' 
                : 'border-gray-200 bg-white hover:border-red-200'
            }`}
            onClick={() => handleFilterClick('Rejected')}
          >
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium text-gray-800">Từ chối</h3>
                  <p className="text-2xl font-bold mt-1 text-red-600">{taskCounts.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className={`h-1 w-full ${activeFilter === 'Rejected' ? 'bg-red-500' : 'bg-transparent'}`}></div>
          </div>
        </div>

        {/* Search and Filters */}
        {activeFilter !== 'Assigned' && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">
                  {activeFilter === 'Done' ? 'Công việc hoàn thành' : 
                   activeFilter === 'Pending' ? 'Công việc đang thực hiện' : 
                   activeFilter === 'Rejected' ? 'Công việc bị từ chối' : 'Tất cả công việc'}
                </h2>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                  {filteredTasks.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-60">
                  <input 
                    type="text"
                    placeholder="Tìm kiếm công việc..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Content based on active filter */}
        {activeFilter === 'Assigned' ? (
          <TodayTasks />
        ) : (
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
            loading={loading}
          />
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