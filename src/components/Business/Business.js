import React from 'react';
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import moment from 'moment';

export const BusinessList = ({
  filteredBusinesses,
  loading,
  searchTerm,
  activeDropdown,
  selectedBusinessIds,
  toggleDropdown,
  handleCheckboxChange,
  handleSelectAllChange,
  handleEditBusiness,
  handleMoreOptions,
  setSearchTerm,
  setActiveDropdown
}) => {

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

  console.log('filteredBusinesses', filteredBusinesses);

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
                    onChange={handleSelectAllChange}
                    checked={selectedBusinessIds.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MST</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công ty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoàn thành</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đang làm</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Từ chối</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại dữ liệu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng BH</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BH còn</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BH hết hạn</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại BH</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhật</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
                    <p>Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business, index) => (
                <tr key={business._id || index} className="hover:bg-gray-50 text-xs">
                  <td className="p-3 border-b">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedBusinessIds.includes(business._id)}
                      onChange={() => handleCheckboxChange(business._id)}
                    />
                  </td>
                  <td className="p-3 border-b font-medium text-gray-900">{business.mst}</td>
                  <td className="p-3 border-b">{business.name}</td>
                  <td className="p-3 border-b text-gray-500">{business.address}</td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                      {business.totalTasks || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {business.completedTasks || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      {business.pendingTasks || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {business.rejectedTasks || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    {business.typeData && business.typeData.length > 0
                      ? business.typeData.join(', ')
                      : <span className="text-gray-400">-</span>
                    }
                  </td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {business.totalServices || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {business.activeServices || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <span className="inline-flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {business.inactionServices || 0}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    {business.serviceTypes && business.serviceTypes.length > 0
                      ? business.serviceTypes.join(', ')
                      : <span className="text-gray-400">-</span>
                    }
                  </td>
                  <td className="p-3 border-b">
                    {business.updatedAt ? formatDate(business.updatedAt) : 'Chưa cập nhật'}
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
                        onEdit={() => handleEditBusiness(business)}
                        onMore={() => handleMoreOptions(business)}
                        onClose={() => setActiveDropdown(null)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-500 mb-1">Không tìm thấy doanh nghiệp nào</p>
                    {searchTerm && (
                      <button
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
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

export default BusinessList;