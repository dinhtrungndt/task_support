import React from 'react';
import { MoreVertical, AlertTriangle, User, MoreHorizontal, Calendar, MapPin, Link as LinkIcon, CreditCard, Tag, Clock, FileText } from 'lucide-react';
import CreateTask from '../modals/CreateTask';
import DropdownMenu from '../DropdownMenu';
import moment from 'moment';

export const Tasks = ({
  filteredTasks,
  searchTerm,
  setSearchTerm,
  selectedIds,
  selectAll,
  handleSelectAll,
  handleCheckboxChange,
  activeDropdown,
  toggleDropdown,
  handleEditTask,
  handleMoreOptions,
  openModalCreateTask,
  setOpenModalCreateTask,
  setActiveDropdown,
  handleDeleteSelected,
  loading
}) => {

  if (openModalCreateTask) {
    return <CreateTask closeModal={() => setOpenModalCreateTask(false)} />;
  }

  const getStatusClassName = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>;
      case "Pending":
        return <div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div>;
      case "Rejected":
        return <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></div>;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const currentTime = moment();
    const postTime = moment(dateString);
    const diffInSeconds = currentTime.diff(postTime, 'seconds');

    if (diffInSeconds < 1) {
      return 'Vừa đăng';
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 24 * 3600) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else if (diffInSeconds < 30 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (24 * 3600))} ngày trước`;
    } else if (diffInSeconds < 12 * 30 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (30 * 24 * 3600))} tháng trước`;
    } else if (diffInSeconds < 12 * 365 * 24 * 3600) {
      return `${Math.floor(diffInSeconds / (12 * 30 * 24 * 3600))} năm trước`;
    } else {
      return postTime.format('DD/MM/YYYY');
    }
  };

  // Format user display name
  const formatUserName = (user) => {
    if (!user) return 'N/A';
    if (typeof user === 'object') {
      return user.name || user.email || 'N/A';
    }
    return user;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wider border-b border-gray-200">
              <th className="sticky top-0 bg-gray-50 z-10 p-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                    onChange={handleSelectAll}
                    checked={selectAll && filteredTasks.length > 0}
                  />
                </div>
              </th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MST</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công ty</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại kết nối</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người lắp đặt</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã dữ liệu</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại dữ liệu</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày lắp</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhập</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người tạo</th>
              <th className="sticky top-0 bg-gray-50 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={13} className="p-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-indigo-600 mb-3"></div>
                    <p className="font-medium">Đang tải dữ liệu...</p>
                    <p className="text-xs text-gray-400 mt-1">Vui lòng đợi trong giây lát</p>
                  </div>
                </td>
              </tr>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <tr
                  key={task._id || index}
                  className={`text-sm hover:bg-indigo-50 transition-colors ${selectedIds.includes(task._id) ? 'bg-indigo-50' : ''}`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                      checked={selectedIds.includes(task._id)}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-900">
                    {task.companyId && typeof task.companyId === 'object' ? (
                      <div className="flex items-center">
                        <CreditCard size={14} className="text-gray-400 mr-1.5" />
                        <span>{task.companyId.mst || 'N/A'}</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="p-3 font-medium">
                    {task.companyId && typeof task.companyId === 'object' ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 mr-2">
                          <FileText size={12} />
                        </div>
                        <span className="text-gray-800">{task.companyId.name || 'N/A'}</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="p-3">
                    {task.companyId && typeof task.companyId === 'object' ? (
                      <div className="flex items-center text-gray-500 max-w-xs truncate">
                        <MapPin size={14} className="text-gray-400 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{task.companyId.address || 'N/A'}</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <LinkIcon size={14} className="text-gray-400 mr-1.5" />
                      <span className="text-gray-700">{task.connectionType || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-1.5">
                        <User size={12} />
                      </div>
                      <span className="text-gray-700">{task.installer || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <Tag size={14} className="text-gray-400 mr-1.5" />
                      <span className="text-gray-700 font-mono">{task.codeData || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <Tag size={14} className="text-gray-400 mr-1.5" />
                      <span className="text-gray-700">{task.typeData || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-1.5" />
                      <span className="text-gray-700">{formatDate(task.installDate)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-1.5" />
                      <span className="text-gray-700">{formatDate(task.updatedAt)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClassName(task.status || 'Pending')}`}>
                      {getStatusIcon(task.status)}
                      {task.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <User size={12} />
                        </div>
                      </div>
                      <div className="ml-2">
                        <div className="text-xs font-medium text-gray-900 truncate max-w-[100px]">
                          {formatUserName(task.userAdd)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right relative">
                    <div>
                      <button
                        className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                        onClick={() => toggleDropdown(index)}
                      >
                        <MoreHorizontal className="text-gray-500" size={16} />
                      </button>
                      <DropdownMenu
                        isOpen={activeDropdown === index}
                        onEdit={() => handleEditTask(task)}
                        onMore={() => handleMoreOptions(task)}
                        onClose={() => setActiveDropdown(null)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="px-3 py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                      <AlertTriangle size={32} />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">Không tìm thấy kết quả nào</p>
                    <p className="text-gray-400 text-sm max-w-md mb-4">
                      Không tìm thấy công việc nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các từ khóa khác.
                    </p>
                    {searchTerm && (
                      <button
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors flex items-center"
                        onClick={() => setSearchTerm("")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
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

      {/* Footer with pagination (placeholder) */}
      {filteredTasks.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Trước
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredTasks.length > 10 ? 10 : filteredTasks.length}</span> trong <span className="font-medium">{filteredTasks.length}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Trang trước</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Trang sau</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;