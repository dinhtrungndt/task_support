import React, { useState, useEffect } from 'react';
import { HeaderPages } from '../../components/header';
import { Search, Plus, Filter, Download, Calendar, CheckCircle, XCircle, Clock, ChevronUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/modals';
import EditTaskModal from '../../components/modals/EditTask';
import MoreDetailsModal from '../../components/modals/MoreTask';
import { Tasks } from '../../components/Tasks';
import { fetchTasks, deleteTasks, updateTask } from '../../stores/redux/actions/taskActions';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

export const TaskPages = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector(state => state.tasks);
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    filterTasks();
  }, [searchTerm, activeFilter, tasks]);

  // Display error notifications
  useEffect(() => {
    if (error) {
      toast.error("Lỗi khi tải dữ liệu: " + error);
    }
  }, [error]);

  // Handle scroll top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filterTasks = () => {
    let results = tasks || [];
    
    // Apply status filter
    if (activeFilter !== 'All') {
      results = results.filter(task => 
        task.status === activeFilter
      );
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchTermLower = searchTerm.toLowerCase().trim();
      results = results.filter(task => {
        // Guard against missing properties
        if (!task) return false;
        
        return (
          (task.companyName || '').toLowerCase().includes(searchTermLower) ||
          (task.mst || '').toLowerCase().includes(searchTermLower) ||
          (task.address || '').toLowerCase().includes(searchTermLower) ||
          (task.connectionType || '').toLowerCase().includes(searchTermLower) ||
          (task.installer || '').toLowerCase().includes(searchTermLower) ||
          (task.codeData || '').toLowerCase().includes(searchTermLower) ||
          (task.typeData || '').toLowerCase().includes(searchTermLower)
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

  const handleSaveTask = async (updatedTask) => {
    try {
      // Update task in backend through Redux action
      await dispatch(updateTask(updatedTask));
      
      setEditModalOpen(false);
      toast.success("Cập nhật công việc thành công");
    } catch (error) {
      toast.error("Lỗi khi cập nhật công việc: " + (error.message || "Đã xảy ra lỗi"));
    }
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

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    const confirmMessage = selectedIds.length === 1 
      ? "Bạn có chắc chắn muốn xóa công việc này?" 
      : `Bạn có chắc chắn muốn xóa ${selectedIds.length} công việc?`;
    
    const confirmation = window.confirm(confirmMessage);
    
    if (confirmation) {
      try {
        setIsDeleting(true);
        
        // Call API through Redux action
        await dispatch(deleteTasks(selectedIds));
        
        setSelectedIds([]);
        setSelectAll(false);
        toast.success(`Đã xóa ${selectedIds.length} công việc thành công`);
      } catch (error) {
        toast.error("Lỗi khi xóa công việc: " + (error.message || "Đã xảy ra lỗi"));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    let dataToExport = filteredTasks;
    
    if (selectedIds.length > 0) {
      dataToExport = filteredTasks.filter(task => 
        selectedIds.includes(task._id)
      );
    }
    
    // Prepare data for Excel
    const exportData = dataToExport.map((task) => {
      return {
        'MST': task.mst || '',
        'Tên công ty': task.companyName || '',
        'Địa chỉ': task.address || '',
        'Loại kết nối': task.connectionType || '',
        'Người lắp đặt': task.installer || '',
        'Mã dữ liệu': task.codeData || '',
        'Loại dữ liệu': task.typeData || '',
        'Ngày lắp đặt': task.installDate ? new Date(task.installDate).toLocaleDateString() : '',
        'Trạng thái': task.status || 'Pending',
        'Ghi chú': task.notes || '',
        'Ngày cập nhật': task.lastModified ? new Date(task.lastModified).toLocaleDateString() : ''
      };
    });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Công việc');
    
    // Generate file name with current date
    const date = new Date();
    const fileName = `danh_sach_cong_viec_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.xlsx`;
    
    // Export file
    XLSX.writeFile(workbook, fileName);
    
    toast.success(`Đã xuất ${exportData.length} công việc ra file Excel`);
  };

  // Get counts for each status
  const getCounts = () => {
    if (!tasks || !Array.isArray(tasks)) return { all: 0, done: 0, pending: 0, rejected: 0 };
    
    const counts = {
      all: tasks.length,
      done: tasks.filter(task => task.status === 'Done').length,
      pending: tasks.filter(task => task.status === 'Pending').length,
      rejected: tasks.filter(task => task.status === 'Rejected').length
    };
    
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
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="mr-1" />
                      Xóa ({selectedIds.length})
                    </>
                  )}
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
                onClick={handleExportToExcel}
              >
                <Download size={14} className="mr-1" />
                Xuất{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
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

       {/* Scroll to top button */}
       {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all z-50"
            aria-label="Lên đầu trang"
          >
            <ChevronUp size={20} />
          </button>
        )}
    </div>
  );
};

export default TaskPages;