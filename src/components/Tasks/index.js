import React from 'react';
import { MoreVertical } from 'lucide-react';
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
  businesses
}) => {

  if (openModalCreateTask) {
    return <CreateTask closeModal={() => setOpenModalCreateTask(false)} businesses={businesses}/>;
  }

  const getStatusClassName = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-600 px-4";
      case "Pending":
        return "bg-orange-100 text-orange-600 px-2";
      case "Rejected":
        return "bg-pink-100 text-pink-600 px-2";
      default:
        return "bg-gray-100 text-gray-600 px-2";
    }
  };

  return (
    <>
      {/* Text and create task*/}
      <div className="flex items-center mt-4">
        <p className="text-xs font-bold">
          {filteredTasks.length > 0
            ? `All Tasks (${filteredTasks.length})`
            : "No tasks found"}
        </p>
        <button
          className="bg-blue-500 text-white ml-8 px-6 py-1 rounded-md text-xs hover:bg-blue-600"
          onClick={() => setOpenModalCreateTask((prev) => !prev)}
        >
          {openModalCreateTask ? "Close" : "Thêm"}
        </button>
      </div>
      {/* Task List */}
      <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
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
                      <span className={` py-0.5 rounded-full text-xs ${getStatusClassName(task.status)}`}>
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
  );
};