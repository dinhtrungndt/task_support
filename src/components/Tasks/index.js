import React from 'react';
import { MoreVertical, AlertTriangle } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import { CreateTask } from '../../components/modals/CreateTask';

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
  businesses,
  handleDeleteSelected,
  loading
}) => {

  if (openModalCreateTask) {
    return <CreateTask closeModal={() => setOpenModalCreateTask(false)} businesses={businesses} />;
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

  // Function to safely access installation history
  const getInstallationData = (task, property, defaultValue = 'N/A') => {
    if (property.includes('.')) {
      const [firstKey, ...restKeys] = property.split('.');
      try {
        let value = task;
        if (task.installationHistory && task.installationHistory[0]) {
          value = task.installationHistory[0];
        }
        return restKeys.reduce((obj, key) => 
          obj && obj[key] !== undefined ? obj[key] : defaultValue, 
          value[firstKey]
        );
      } catch (error) {
        console.error(`Error accessing property ${property}:`, error);
        return defaultValue;
      }
    }
    if (!task || !task.installationHistory || !task.installationHistory[0]) {
      return defaultValue;
    }
    if (task.installationHistory[0].hasOwnProperty(property)) {
      return task.installationHistory[0][property] || defaultValue;
    }
    return task[property] || defaultValue;
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
              <th className="p-3 border-b">MST</th>
              <th className="p-3 border-b">Tên công ty</th>
              <th className="p-3 border-b">Địa chỉ</th>
              <th className="p-3 border-b">Loại kết nối</th>
              <th className="p-3 border-b">Người lắp đặt</th>
              <th className="p-3 border-b">Mã dữ liệu</th>
              <th className="p-3 border-b">Loại dữ liệu</th>
              <th className="p-3 border-b">Ngày lắp</th>
              <th className="p-3 border-b">Người cài</th>
              <th className="p-3 border-b">Trạng thái</th>
              <th className="p-3 border-b text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <tr key={task.id || index} className="hover:bg-gray-50 text-xs">
                  <td className="p-3 border-b">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(task.id)}
                      onChange={() => handleCheckboxChange(task.id)}
                    />
                  </td>
                  <td className="p-3 border-b font-medium text-gray-900">{task.mst || 'N/A'}</td>
                  <td className="p-3 border-b">{task.name || 'N/A'}</td>
                  <td className="p-3 border-b text-gray-500">{task.address || 'N/A'}</td>
                  <td className="p-3 border-b">{task.connectionType || 'N/A'}</td>
                  <td className="p-3 border-b">{task.PInstaller || 'N/A'}</td>
                  <td className="p-3 border-b">{task.codeData || 'N/A'}</td>
                  <td className="p-3 border-b">{getInstallationData(task, 'typeData')}</td>
                  <td className="p-3 border-b">{getInstallationData(task, 'AtSetting')}</td>
                  <td className="p-3 border-b">{getInstallationData(task, 'installer')}</td>
                  <td className="p-3 border-b">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClassName(getInstallationData(task, 'status'))}`}>
                      {getInstallationData(task, 'status')}
                    </span>
                  </td>
                  <td className="p-3 border-b text-right relative">
                    <div>
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => toggleDropdown(index)}
                      >
                        <MoreVertical className="text-gray-500" size={16} />
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