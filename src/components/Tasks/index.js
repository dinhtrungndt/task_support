import React from 'react';
import { MoreVertical, AlertTriangle, User, MoreHorizontal } from 'lucide-react';
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
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wider">
            <tr>
              <th className="p-3 border-b">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={selectAll && filteredTasks.length > 0}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MST</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công ty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại kết nối</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người lắp đặt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã dữ liệu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại dữ liệu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày lắp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhập</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người tạo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                    <p>Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <tr key={task._id || index} className="hover:bg-gray-50 text-xs">
                  <td className="p-3 border-b">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(task._id)}
                      onChange={() => handleCheckboxChange(task._id)}
                    />
                  </td>
                  <td className="p-3 border-b font-medium text-gray-900">{task.companyId && typeof task.companyId === 'object' ? task.companyId.mst : 'N/A'}</td>
                  <td className="p-3 border-b">{task.companyId && typeof task.companyId === 'object'? task.companyId.name: 'N/A'}</td>
                  <td className="p-3 border-b text-gray-500">{task.companyId && typeof task.companyId === 'object'? task.companyId.address: 'N/A'}</td>
                  <td className="p-3 border-b">{task.connectionType || 'N/A'}</td>
                  <td className="p-3 border-b">{task.installer || 'N/A'}</td>
                  <td className="p-3 border-b">{task.codeData || 'N/A'}</td>
                  <td className="p-3 border-b">{task.typeData || 'N/A'}</td>
                  <td className="p-3 border-b">{formatDate(task.installDate)}</td>
                  <td className="p-3 border-b">{formatDate(task.updatedAt)}</td>
                  <td className="p-3 border-b">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClassName(task.status || 'Pending')}`}>
                      {task.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-1.5">
                        <User size={12} />
                      </div>
                      <span className="truncate max-w-[100px]">
                        {formatUserName(task.userAdd)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 border-b text-right relative">
                    <div>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
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
                <td colSpan={12} className="px-3 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                      <AlertTriangle size={28} />
                    </div>
                    <p className="text-gray-500 mb-1">Không tìm thấy kết quả nào</p>
                    <p className="text-gray-400 text-xs mb-3">Hãy thay đổi tiêu chí tìm kiếm hoặc thử lại</p>
                    {searchTerm && (
                      <button
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
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
  );
};

export default Tasks;